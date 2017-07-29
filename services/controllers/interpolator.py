class Interpolator:

    def __init__(self):
        self.data = []

    def addIndexValue(self, index, value):
        self.data.append((index, value))

    def valueAtIndex(self, target_index):
        if target_index < self.data[0][0]:
            return None
        elif self.data[-1][0] < target_index:
            return None
        else:
            start = None
            end = None

            for (index, value) in self.data:
                if index == target_index:
                    return value
                else:
                    if index <= target_index:
                        start = (index, value)
                    elif target_index < index:
                        end = (index, value)
                        break

            index_delta = end[0] - start[0]
            percent = (target_index - start[0]) / index_delta
            value_delta = end[1] - start[1]

            return start[1] + value_delta * percent

    def to_array(self):
        result = []

        for (index, value) in self.data:
            result.append(index)
            result.append(value)

        return result

    def from_array(self, array):
        self.data = []
        for i in range(0, len(array), 2):
            self.addIndexValue(array[i], array[i + 1])


if __name__ == "__main__":
    pass
