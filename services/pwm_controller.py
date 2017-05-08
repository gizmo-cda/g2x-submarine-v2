import Adafruit_PCA9685


class Device:
    def __init__(self, parent, name, channel, on, off):
        self.parent = parent
        self.name = name
        self.channel = channel
        self._on = on
        self._off = off
        self.initial_on = on
        self.initial_off = off

    @property
    def on(self):
        return self._on

    @on.setter
    def on(self, value):
        value = max(0, min(value, 4095))

        if self._on != value:
            self._on = value
            self.parent.set_pwm(self.channel, self.on, self.off)

    @property
    def off(self):
        return self._off

    @off.setter
    def off(self, value):
        value = max(0, min(value, 4095))

        if self._off != value:
            self._off = value
            self.parent.set_pwm(self.channel, self.on, self.off)

    @property
    def duty_cycle(self):
        on_duration = abs(self.off - self.on)

        return round(100.0 * on_duration / 4096, 2)

    @property
    def on_duration(self):
        one_cycle = 1.0 / self.parent.frequency
        on_percent = abs(self.off - self.on) / 4096.0

        return round(1000000 * one_cycle * on_percent, 2)

    @property
    def off_duration(self):
        one_cycle = 1.0 / self.parent.frequency
        off_percent = 1.0 - (abs(self.off - self.on) / 4096.0)

        return round(1000000 * one_cycle * off_percent, 2)

    def reset(self):
        self.on = self.initial_on
        self.off = self.initial_off


class PWMController:
    def __init__(self):
        self.pwm = Adafruit_PCA9685.PCA9685()
        self._frequency = 60
        self.pwm.set_pwm_freq(self._frequency)
        self.devices = []
        self.current_device_index = 0

    @property
    def frequency(self):
        return self._frequency

    @frequency.setter
    def frequency(self, freq):
        freq = max(40, min(freq, 1000))

        if self._frequency != freq:
            self._frequency = freq
            self.pwm.set_pwm_freq(self._frequency)

    @property
    def current_device(self):
        if 0 <= self.current_device_index < len(self.devices):
            return self.devices[self.current_device_index]
        else:
            return None

    @property
    def device_count(self):
        return len(self.devices)

    def add_device(self, name, channel, on, off):
        device = Device(self, name, channel, on, off)

        self.current_device_index = len(self.devices)
        self.devices.append(device)
        self.pwm.set_pwm(device.channel, device.on, device.off)

        return device

    def previous_device(self):
        if self.device_count > 0:
            self.current_device_index = (self.current_device_index - 1) % len(self.devices)

        return True

    def next_device(self):
        if self.device_count > 0:
            self.current_device_index = (self.current_device_index + 1) % len(self.devices)

        return True

    # on/off are in ticks (based on freq)
    def set_pwm(self, channel, on, off):
        # [0,15] comes from Adafruit docs
        channel = max(0, min(channel, 15))

        # [0,4095] comes from Adafruit docs
        on = max(0, min(on, 4095))
        off = max(0, min(off, 4095))

        self.pwm.set_pwm(channel, on, off)
