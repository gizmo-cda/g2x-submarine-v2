import math


class Vector2D:

    def __init__(self, x=0.0, y=0.0):
        self.x = x
        self.y = y

    @property
    def length(self):
        return math.sqrt(self.x * self.x + self.y * self.y)

    @property
    def unit(self):
        length = self.length
        if length == 0:
            return Vector2D()
        else:
            return Vector2D(self.x / length, self.y / length)

    @property
    def angle(self):
        unit = self.unit
        angle = math.atan2(-unit.y, unit.x) * 180.0 / math.pi

        if angle < 0.0:
            return angle + 360.0
        else:
            return angle

    def __str__(self):
        return "Vector({},{}), angle={}".format(self.x, self.y, self.angle)


if __name__ == "__main__":
    pass
