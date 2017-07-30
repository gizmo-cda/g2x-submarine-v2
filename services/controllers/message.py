import struct


class Message:

    def __init__(self, buffer=bytes([0, 0, 0, 0, 0])):
        b1 = buffer[0]
        b2 = buffer[1:]

        self.controller_index = (b1 & 0xC0) >> 6        # 2 bits
        self.input_type = (b1 & 0x30) >> 4              # 2 bits
        self.input_index = b1 & 0x0F                    # 4 bits
        self.input_value = struct.unpack("f", b2)[0]    # 4 bytes (32 bits)
        pass

    def __bytes__(self):
        b1 = (self.controller_index & 0x03) << 6 | (self.input_type & 0x03) << 4 | (self.input_index & 0x0F)
        b2 = struct.pack("f", self.input_value)

        return bytes([b1]) + b2

    def __str__(self):
        return "[controller={0}, type={1}, index={2}, value={3}]".format(
            self.controller_index,
            self.input_type,
            self.input_index,
            self.input_value
        )


if __name__ == "__main__":
    m = Message(bytes([0x63, 0x00, 0x00, 0x80, 0x40]))
    print(str(m))
    print(bytes(m).hex())
