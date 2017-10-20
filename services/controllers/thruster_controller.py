import os
import json
from vector2d import Vector2D
from interpolator import Interpolator
from utils import map_range


# Each game controller axis returns a value in the closed interval [-1, 1]. We
# limit the number of decimal places we use with the PRECISION constant. This is
# done for a few reasons: 1) it makes the numbers more human-friendly (easier to
# read) and 2) it reduces the number of thruster updates.
#
# To elaborate on this last point, I was seeing a lot of very small fluctations
# with the values coming from my PS4 controller. The change in values were so
# small, they effectively would not change the current thruster value. By
# reducing the precision, these very small fluctuations get filtered out,
# resulting in fewer thruster updates. Also, I found that when I let go of a
# joystick, the value would hover around 0.0 but would never actually become
# zero. This means the thrusters would always be active, consuming battery power
# unnecessarily. Again, by limiting the precision, these small fluctuations were
# filtered out resulting in consistent zero values when then joysticks were in
# their resting positions.
#
# Using three digits of precisions was an arbitrary choice that just happened to
# work the first time. If we find that we need more fine control of the
# thrusters, we may need to increase this value.
PRECISION = 3

# Define a series of comstants, one for each thruster
HL = 0  # horizontal left
VL = 1  # vertical left
VC = 2  # vertical center
VR = 3  # vertical right
HR = 4  # horizontal right
LIGHT = 5

# Define a series of constants, one for each game controller axis
JL_H = 0  # left joystick horizontal axis
JL_V = 1  # left joystick vertical axis
JR_H = 2  # right joystick horizontal axis
JR_V = 3  # right joystick vertical axis
AL = 4    # left analog button
AR = 5    # right analog button
UP = 3
DOWN = 1
RESET = 0
# 271,[320],467

# Define constants for the PWM to run a thruster in full reverse, full forward,
# or neutral
FULL_REVERSE = 246
NEUTRAL = 369
FULL_FORWARD = 496
LIGHT_STEP = 0.05

# Use this file to load/store thruster and sensitivity settings
SETTINGS_FILE = 'thruster_settings.json'


class ThrusterController:

    def __init__(self, simulate=False):
        # setup motor controller. The PWM controller can control up to 16
        # different devices. We have to add devices, one for each thruster that
        # we can control. The first parameter is the human-friendly name of the
        # device. That is used for logging to the console and/or a database. The
        # next parameter indicates which PWM connector this device is connected
        # to. This is refered to as the PWM channel. The last two values
        # indicate at what time intervals (ticks) the PWM should turn on and
        # off, respectively. We simply start each device at 0 time and control
        # the duration of the pulses by adjusting the off time. Note that we may
        # be able to shuffle on/off times to even out the current draw from the
        # thrusters, but so far, that hasn't been an issue. It's even possible
        # that the PWM controller may do that for us already.
        if simulate is False:
            from pwm_controller import PWMController

            self.motor_controller = PWMController()
            self.motor_controller.add_device("HL", HL, 0, NEUTRAL)
            self.motor_controller.add_device("VL", VL, 0, NEUTRAL)
            self.motor_controller.add_device("VC", VC, 0, NEUTRAL)
            self.motor_controller.add_device("VR", VR, 0, NEUTRAL)
            self.motor_controller.add_device("HR", HR, 0, NEUTRAL)
            self.motor_controller.add_device("LIGHT", LIGHT, 0, FULL_REVERSE)
        else:
            self.motor_controller = None

        # setup the joysticks. We use a 2D vector to represent the x and y
        # values of the joysticks.
        self.j1 = Vector2D()
        self.j2 = Vector2D()

        # create interpolators
        self.horizontal_left = Interpolator()
        self.vertical_left = Interpolator()
        self.vertical_center = Interpolator()
        self.vertical_right = Interpolator()
        self.horizontal_right = Interpolator()

        # setup interpolators from a file or manually
        if os.path.isfile(SETTINGS_FILE):
            with open(SETTINGS_FILE, 'r') as f:
                self.set_settings(json.load(f), False)
        else:
            # Set the sensitivity to be applied to each thruster. 0 indicates a
            # linear response which is the default when no sensitivity is applied. 1
            # indicates full sensitivity. Values between 0 and 1 can be used to
            # increase and to decrease the overall sensitivity. Increasing sensivity
            # dampens lower values and amplifies larger values giving more precision
            # at lower power levels.
            self.sensitivity = 0.7

            # We use a cubic to apply sensitivity. If you find that full sensitivity
            # (dampening) does not give you fine enough control, you can increase\
            # the degree of the polynomial used for dampening. Note that this must
            # be a positive odd number. Any other values will cause unexpected
            # results.
            self.power = 3

            # setup the various interpolators for each thruster. Each item we add
            # to the interpolator consists of two values: an angle in degrees and a
            # thrust value. An interpolator works by returning a value for any given
            # input value. More specifically in this case, we will give each
            # interpolator an angle and it will return a thrust value for that
            # angle. Since we have only given the interpolator values for very
            # specific angles, it will have to determine values for angles we have
            # not provided. It does this using linear interpolation.
            self.horizontal_left.addIndexValue(0.0, -1.0)
            self.horizontal_left.addIndexValue(90.0, 1.0)
            self.horizontal_left.addIndexValue(180.0, 1.0)
            self.horizontal_left.addIndexValue(270.0, -1.0)
            self.horizontal_left.addIndexValue(360.0, -1.0)

            self.vertical_left.addIndexValue(0.0, 1.0)
            self.vertical_left.addIndexValue(90.0, -1.0)
            self.vertical_left.addIndexValue(180.0, -1.0)
            self.vertical_left.addIndexValue(270.0, 1.0)
            self.vertical_left.addIndexValue(360.0, 1.0)

            self.vertical_center.addIndexValue(0.0, 0.0)
            self.vertical_center.addIndexValue(90.0, 1.0)
            self.vertical_center.addIndexValue(180.0, 0.0)
            self.vertical_center.addIndexValue(270.0, -1.0)
            self.vertical_center.addIndexValue(360.0, 0.0)

            self.vertical_right.addIndexValue(0.0, -1.0)
            self.vertical_right.addIndexValue(90.0, -1.0)
            self.vertical_right.addIndexValue(180.0, 1.0)
            self.vertical_right.addIndexValue(270.0, 1.0)
            self.vertical_right.addIndexValue(360.0, -1.0)

            self.horizontal_right.addIndexValue(0.0, 1.0)
            self.horizontal_right.addIndexValue(90.0, 1.0)
            self.horizontal_right.addIndexValue(180.0, -1.0)
            self.horizontal_right.addIndexValue(270.0, -1.0)
            self.horizontal_right.addIndexValue(360.0, 1.0)

        # setup ascent/descent controllers
        self.ascent = -1.0
        self.descent = -1.0

        # setup light
        self.light = 0.0

    def __del__(self):
        '''
        When an instance of this class gets destroyed, we need to make sure that
        we turn off all motors. Otherwise, we could end up in a situation where
        the vehicle could have thrusters running when we don't have scripts
        running to control it.
        '''
        self.set_motor(HL, 0.0)
        self.set_motor(VL, 0.0)
        self.set_motor(VC, 0.0)
        self.set_motor(VL, 0.0)
        self.set_motor(HR, 0.0)

    def update_axis(self, axis, value):
        '''
        This is the main method of this class. It is responsible for taking an
        controller input value (referred to as an axis value) and then
        converting that into the appropriate thrust values for the appropriate
        thrusters associated with that axis.

        For the two joysticks, we convert the joystick position into an angle.
        We know which thrusters each joystick controls, so we feed the
        calculated angle into the thruster interpolators for that joystick. This
        gives us the new thruster value for each thruster, which we then apply
        to the PWM controller devices for those thrusters.

        Note that the angle of the joystick does not give us all of the
        information that we need. If the joystick is close to the center
        position, then we don't need to apply as much thrust. If it is pushed
        all the way to the edge, then we nee 100% thrust. So, we treat the
        center as 0% and the edge as 100%. The values we get back from the
        interpolators are 100% values, so we simply apply the joystick
        percentage to the interpolator value to find the actual thrust value we
        need to use.

        Things get a bit more complicated for the vertical thrusters because it
        is possible that we will be pitiching or rolling the vehicle while
        simultaneously trying to move the vehicle directly up or down. If we
        pitch or roll the vehicle only, then the process is exactly as we
        described above. However, if are pithing and/or rolling AND moveing the
        vehicle vertically, we need to combine the two operations into one set
        of thruster values. We have to first determine the values for pitch and
        roll, then we increase or decrease all thruster values equally in the up
        or down direction. However it is possible that we will not be able to
        increase/decrease all thrusters by the same amount since we are already
        applying thrust for pitch and roll. This means we need to make sure our
        values do not go outside the closed intervale [-1,1]. This means that as
        we pitch or roll harder, the vehical will flattern out as we apply
        vertical thrust.
        '''

        # We need to keep track of which thrusters need updating. We use the
        # following flags for that purpose
        update_horizontal_thrusters = False
        update_vertical_thrusters = False

        # Round the incoming value to the specified precision to reduce input
        # noise
        value = round(value, PRECISION)

        # Update the appropriate joystick vector based on which controller axis
        # has changed. Note that we make sure the value is different from what
        # we have already to prevent unnecessary updates. Recall that the
        # controller may send values whose differences are smaller than our
        # precision. This means we will get an update from the controller, but
        # we decided to ignore it since it won't result in a significant change
        # to our thrusters.
        if axis == JL_H:
            if self.j1.x != value:
                self.j1.x = value
                update_horizontal_thrusters = True
        elif axis == JL_V:
            if self.j1.y != value:
                self.j1.y = value
                update_horizontal_thrusters = True
        elif axis == JR_H:
            if self.j2.x != value:
                self.j2.x = value
                update_vertical_thrusters = True
        elif axis == JR_V:
            if self.j2.y != value:
                self.j2.y = value
                update_vertical_thrusters = True
        elif axis == AL:
            if self.descent != value:
                self.descent = value
                update_vertical_thrusters = True
        elif axis == AR:
            if self.ascent != value:
                self.ascent = value
                update_vertical_thrusters = True
        else:
            pass
            # print("unknown axis ", event.axis)

        # updating horizontal thrusters is easy: find current angle, convert
        # angle to thruster values, apply values
        if update_horizontal_thrusters:
            left_value = self.horizontal_left.valueAtIndex(self.j1.angle)
            right_value = self.horizontal_right.valueAtIndex(self.j1.angle)
            power = min(1.0, self.j1.length)
            self.set_motor(HL, left_value * power)
            self.set_motor(HR, right_value * power)

        # updating vertical thrusters is trickier. We do the same as above, but
        # then post-process the values if we are applying vertical up/down
        # thrust. As mentioned above, we have to be careful to stay within our
        # [-1,1] interval.
        if update_vertical_thrusters:
            power = min(1.0, self.j2.length)
            back_value = self.vertical_center.valueAtIndex(self.j2.angle) * power
            front_left_value = self.vertical_left.valueAtIndex(self.j2.angle) * power
            front_right_value = self.vertical_right.valueAtIndex(self.j2.angle) * power
            if self.ascent != -1.0:
                percent = (1.0 + self.ascent) / 2.0
                max_thrust = max(back_value, front_left_value, front_right_value)
                max_adjust = (1.0 - max_thrust) * percent
                # back_value += max_adjust
                front_left_value += max_adjust
                front_right_value += max_adjust
            elif self.descent != -1.0:
                percent = (1.0 + self.descent) / 2.0
                min_thrust = min(back_value, front_left_value, front_right_value)
                max_adjust = (min_thrust - -1.0) * percent
                # back_value -= max_adjust
                front_left_value -= max_adjust
                front_right_value -= max_adjust
            self.set_motor(VC, back_value)
            self.set_motor(VL, front_left_value)
            self.set_motor(VR, front_right_value)

    def update_button(self, button, value):
        if button == UP:
            self.light = min(1.0, self.light + LIGHT_STEP)
        elif button == DOWN:
            self.light = max(0.0, self.light - LIGHT_STEP)
        elif button == RESET:
            self.light = 0.0

        light_value = map_range(self.light, 0.0, 1.0, -1.0, 1.0)
        print("button %s, light = %s, light_value = %s" % (button, self.light, light_value))
        self.set_motor(LIGHT, light_value)

    def set_motor(self, motor_number, value):
        if self.motor_controller is not None:
            motor = self.motor_controller.devices[motor_number]
            value = self.apply_sensitivity(value)
            pwm_value = int(map_range(value, -1.0, 1.0, FULL_REVERSE, FULL_FORWARD))

            # print("setting motor {0} to {1}".format(motor_number, pwm_value))
            motor.off = pwm_value

    def apply_sensitivity(self, value):
        return self.sensitivity * value**self.power + (1.0 - self.sensitivity) * value

    def get_settings(self):
        return {
            'version': 1,
            'sensitivity': {
                'strength': self.sensitivity,
                'power': self.power
            },
            'thrusters': [
                self.horizontal_left.to_array(),
                self.vertical_left.to_array(),
                self.vertical_center.to_array(),
                self.vertical_right.to_array(),
                self.horizontal_right.to_array()
            ]
        }

    def set_settings(self, data, save=True):
        if data['version'] == 1:
            # save settings for future loading
            if save:
                if data['name'] == "":
                    filename = SETTINGS_FILE
                else:
                    filename = os.path.join("settings", data['name'] + ".json")

                with open(filename, 'w') as out:
                    out.write(json.dumps(data, indent=2))

            # update current settings
            self.sensitivity = float(data['sensitivity']['strength'])
            self.power = float(data['sensitivity']['power'])
            self.horizontal_left.from_array(data['thrusters'][0])
            self.vertical_left.from_array(data['thrusters'][1])
            self.vertical_center.from_array(data['thrusters'][2])
            self.vertical_right.from_array(data['thrusters'][3])
            self.horizontal_right.from_array(data['thrusters'][4])
        else:
            print("Unsupported data version number '{}'".format(data['version']))


if __name__ == "__main__":
    pass
