CONST_FLOAT_LEFT = "left"
CONST_FLOAT_RIGHT = "right"

CONST_COLORS = {
    "BLACK"      : (  0,   0,   0),
    "WHITE"      : (255, 255, 255),
    "RED"        : (255,   0,   0),
    "LIME"       : (  0, 255,   0),
    "BLUE"       : (  0,   0, 255),
    "YELLOW"     : (255, 255,   0),
    "CYAN"       : (  0, 255, 255),
    "MAGNETA"    : (255,   0, 255),
    "SILVER"     : (192, 192, 192),
    "GRAY"       : (128, 128, 128),
    "MARRON"     : (128,   0,   0),
    "OLIVE"      : (128, 128,   0),
    "GREEN"      : (  0, 128,   0),
    "PURPLE"     : (128,   0, 128),
    "TEAL"       : (  0, 128, 128),
    "NAVY"       : (  0,   0, 128),
    "TRANSPARENT": ( -1,  -1,  -1)
}

class Dimention:
    def __init__(self, value, float_pos = CONST_FLOAT_LEFT):
        if not float_pos in [CONST_FLOAT_LEFT, CONST_FLOAT_RIGHT]:
            raise Exception("Wrong float pos")
        self.value = value
        self.float_pos = float_pos

class Pixel(Dimention):
    def explicit(self, other):
        if self.float_pos == CONST_FLOAT_LEFT:
            return self.value
        elif self.float_pos == CONST_FLOAT_RIGHT:
            return other - self.value

    def __repr__(self):
        return f"{self.float_pos} {self.value}px"

class Percentage(Dimention):
    def explicit(self, other):
        if self.float_pos == CONST_FLOAT_LEFT:
            return self.value / 100 * other
        elif self.float_pos == CONST_FLOAT_RIGHT:
            return other - other * self.value / 100

    def __repr__(self):
        return f"{self.float_pos} {self.value}%"

class Convert:
    def convert(value, float_pos = CONST_FLOAT_LEFT):
        if type(value) in [int, float]:
            return Pixel(value, float_pos)
        elif value[-1] == "%":
            return Percentage(float(value[:-1]), float_pos)
        return Pixel(float(value), float_pos)

    def convert_float(value):
        if type(value) in [int, float]:
            return Pixel(value)
        value = value.split(" ")
        if len(value) == 1:
            return Convert.convert(value[0])
        else:
            return Convert.convert(value[1], value[0])

class RectPosition:
    def __init__(self, x, y, width, height):
        self.x = Convert.convert_float(x)
        self.y = Convert.convert_float(y)
        self.width = Convert.convert_float(width)
        self.height = Convert.convert_float(height)

    def explicit(self, translation = [0, 0, 0, 0]):
        return [self.x.explicit(translation[2]) + translation[0],
                self.y.explicit(translation[3]) + translation[1],
                self.width.explicit(translation[2]),
                self.height.explicit(translation[3])]

    def get_block_width(self, translation = [0, 0, 0, 0]):
        return self.x.explicit(translation[2]) + self.width.explicit(translation[2])

    def get_block_height(self, translation = [0, 0, 0, 0]):
        return self.y.explicit(translation[3]) + self.height.explicit(translation[3])

    def __repr__(self):
        return f"RectPos({self.x}, {self.y}, {self.width}, {self.height})"

class PointPosition:
    def __init__(self, points):
        self.points = []
        for point in points:
            self.points.append(Convert.convert_float(point))

    def explicit(self, translation = [0, 0, 0, 0]):
        explicit_points = []
        for i in range(len(self.points)):
            if i % 2 == 0:
                explicit_points.append(self.points[i].explicit(translation[2]) + translation[0])
            else:
                explicit_points.append(self.points[i].explicit(translation[3]) + translation[1])
        return explicit_points

    def get_block_width(self, translation = [0, 0, 0, 0]):
        result = 0
        for i in range(0, len(self.points), 2):
            explicit_point = self.points[i].explicit(translation[2])
            if explicit_point > result:
                result = explicit_point
        return result

    def get_block_height(self, translation = [0, 0, 0, 0]):
        result = 0
        for i in range(1, len(self.points), 2):
            explicit_point = self.points[i].explicit(translation[3])
            if explicit_point > result:
                result = explicit_point
        return result

    def __repr__(self):
        result = "PointPos("
        for point in self.points:
            result = result + f"{point}, "
        return result[:-2] + ")"

class Color:
    def __init__(self, color_keyword):
        if not color_keyword.upper() in CONST_COLORS:
            raise Exception("Wrong color keyword")
        self.color = CONST_COLORS[color_keyword.upper()]

class Widget:
    def __init__(self, color):
        self.positions = None
        self.color = Color(color)

    def traverse(self, traverse_obj, translation = [0, 0, 0, 0]):
        getattr(traverse_obj, traverse_obj.traverse_name + type(self).__name__)(self.positions.explicit(translation), self.color.color)

class Rect(Widget):
    def __init__(self, x, y, width, height, color):
        super().__init__(color)
        self.positions = RectPosition(x, y, width, height)

class Line(Widget):
    def __init__(self, points, color):
        super().__init__(color)
        self.positions = PointPosition(points)

class Ellipse(Rect):
    pass

class ContentRect(Rect):
    def traverse(self, traverse_obj, translation=[0, 0, 0, 0]):
        getattr(traverse_obj, traverse_obj.traverse_name + type(self).__name__)(self.positions.explicit(translation), self.color.color, self)

class Img(ContentRect):
    def __init__(self, x, y, width, height, src_img):
        super().__init__(x, y, width, height, "black")
        self.src_img = src_img
        self.img = None

class Txt(ContentRect):
    def __init__(self, x, y, width, height, color, text_str):
        super().__init__(x, y, width, height, color)
        self.text_str = text_str
        self.text = None

class LayoutBase(Rect):
    def __init__(self, x, y, width, height, color, widgets):
        super().__init__(x, y, width, height, color)
        self.widgets = widgets

class CoordinatorLayout(LayoutBase):
    def traverse(self, traverse_obj, translation=[0, 0, 0, 0]):
        super().traverse(traverse_obj, translation=translation)
        for widget in self.widgets:
            widget.traverse(traverse_obj, self.positions.explicit(translation))

class ConsoleDraw:
    def __init__(self):
        self.traverse_name = "draw"

    def drawRect(self, positions, color):
        print("Rect", positions, color)

    def drawLine(self, positions, color):
        print("Line", positions, color)

    def drawEllipse(self, positions, color):
        print("Ellipse", positions, color)

    def drawImg(self, positions, _, widget):
        if not widget.img:
            widget.img = widget.src_img
        print("Img", positions, widget.src_img)

    def drawTxt(self, positions, color, widget):
        if not widget.text:
            widget.text = widget.text_str
        print("Txt", positions, color, widget.text_str)

    def drawCoordinatorLayout(self, positions, color):
        print("Rect(Coord)", positions, color)

d = ConsoleDraw()

p = PointPosition([10, 3, 7, "9%", "right 10", 20, 98, "11%"])
print(p.explicit([12, 13, 58, 45]))
print(p.get_block_width([12, 13, 58, 45]))
print(p.get_block_height([12, 13, 58, 45]))