import os
import subprocess
import tempfile
import shutil
from typing import Dict, Any, Optional, Tuple
import asyncio
import logging

logger = logging.getLogger(__name__)

class ManimService:
    """Service for rendering Manim animations"""
    
    def __init__(self, output_dir: str = "./outputs"):
        self.output_dir = output_dir
        os.makedirs(output_dir, exist_ok=True)
    
    async def render_scene(self, scene_code: str, animation_id: str, quality: str = "medium") -> Tuple[bool, Optional[str], Optional[str]]:
        """
        Render a Manim scene from code.
        
        Args:
            scene_code: String containing Manim Python code
            animation_id: Unique identifier for the animation
            quality: Quality setting for Manim rendering ('low', 'medium', 'high')
        
        Returns:
            Tuple containing:
            - Success status (bool)
            - Path to rendered video if successful (str or None)
            - Error message if failed (str or None)
        """
        # Create output directory for this animation
        animation_dir = os.path.join(self.output_dir, animation_id)
        os.makedirs(animation_dir, exist_ok=True)
        
        # Create a temporary Python file with the scene code
        with tempfile.NamedTemporaryFile(suffix=".py", delete=False, mode="w") as tmp_file:
            tmp_file_path = tmp_file.name
            tmp_file.write(scene_code)
        
        try:
            # Determine quality flag
            quality_flag = "-ql"  # Low quality (fastest)
            if quality == "medium":
                quality_flag = "-qm"
            elif quality == "high":
                quality_flag = "-qh"
            
            # Run Manim command
            cmd = [
                "manim", 
                quality_flag, 
                "-o", animation_dir,
                tmp_file_path
            ]
            
            logger.info(f"Running Manim command: {' '.join(cmd)}")
            
            # Execute Manim as a subprocess
            process = await asyncio.create_subprocess_exec(
                *cmd,
                stdout=asyncio.subprocess.PIPE,
                stderr=asyncio.subprocess.PIPE
            )
            
            stdout, stderr = await process.communicate()
            
            # Check if the process was successful
            if process.returncode != 0:
                error_message = stderr.decode('utf-8')
                logger.error(f"Manim rendering failed: {error_message}")
                return False, None, error_message
            
            # Find the rendered video file
            for file in os.listdir(animation_dir):
                if file.endswith('.mp4'):
                    video_path = os.path.join(animation_dir, file)
                    # Standardize output name
                    standard_path = os.path.join(animation_dir, "animation.mp4")
                    shutil.copy(video_path, standard_path)
                    return True, standard_path, None
            
            # If no video is found
            return False, None, "No video file was produced"
            
        except Exception as e:
            logger.exception("Error during Manim rendering")
            return False, None, str(e)
        finally:
            # Clean up the temporary file
            if os.path.exists(tmp_file_path):
                os.unlink(tmp_file_path)
    
    def extract_scene_class_name(self, scene_code: str) -> Optional[str]:
        """
        Extract the name of the Scene class from the code.
        
        Args:
            scene_code: String containing Manim Python code
        
        Returns:
            Name of the scene class or None if not found
        """
        lines = scene_code.split('\n')
        for line in lines:
            if "class " in line and "(Scene)" in line:
                class_name = line.split("class ")[1].split("(")[0].strip()
                return class_name
        return None