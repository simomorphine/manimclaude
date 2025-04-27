from manim import *

class BaseScene(Scene):
    """
    Base Manim scene template with common utilities and configurations.
    
    This base scene provides common setup and utility methods that can be
    used across different mathematical animations.
    """
    
    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        # Default configuration
        self.camera.background_color = "#1e1e2e"  # Dark background for better contrast
        
    def create_title(self, title_text, scale=1.0, color=WHITE):
        """Create a title at the top of the scene."""
        title = Text(title_text, color=color).scale(scale)
        title.to_edge(UP)
        return title
    
    def create_equation(self, tex_string, scale=1.0, color=WHITE):
        """Create a LaTeX equation."""
        eq = MathTex(tex_string, color=color).scale(scale)
        return eq
    
    def highlight_region(self, mobject, color=YELLOW, opacity=0.2):
        """Create a highlighted region around an object."""
        highlight = SurroundingRectangle(mobject, color=color, fill_opacity=opacity)
        return highlight
    
    def focus_on(self, mobject, duration=1.0):
        """Focus the camera on a specific object."""
        self.play(
            self.camera.frame.animate.move_to(mobject),
            run_time=duration
        )
    
    def zoom(self, scale_factor, duration=1.0, target_pos=None):
        """Zoom in or out of the scene."""
        if target_pos is None:
            self.play(
                self.camera.frame.animate.scale(scale_factor),
                run_time=duration
            )
        else:
            self.play(
                self.camera.frame.animate.scale(scale_factor).move_to(target_pos),
                run_time=duration
            )
    
    def create_coordinate_system(self, x_range=[-5, 5], y_range=[-3, 3], x_length=10, y_length=6):
        """Create a standard coordinate system."""
        axes = Axes(
            x_range=x_range,
            y_range=y_range,
            x_length=x_length,
            y_length=y_length,
            axis_config={"include_tip": True, "numbers_to_include": range(x_range[0], x_range[1]+1)}
        )
        return axes
    
    def plot_function(self, axes, func, color=BLUE, x_range=[-5, 5, 0.1]):
        """Plot a function on the given axes."""
        graph = axes.plot(lambda x: func(x), x_range=x_range, color=color)
        return graph
    
    def draw_point(self, axes, coordinates, color=RED, radius=0.1):
        """Draw a point at specific coordinates on the axes."""
        dot = Dot(axes.c2p(*coordinates), color=color, radius=radius)
        return dot
        
# Example usage:
# class MyMathAnimation(BaseScene):
#     def construct(self):
#         title = self.create_title("Derivatives Visualization")
#         self.play(Write(title))
#         
#         axes = self.create_coordinate_system()
#         self.play(Create(axes))
#         
#         func = lambda x: x**2
#         graph = self.plot_function(axes, func)
#         self.play(Create(graph))
#         
#         # More animation...