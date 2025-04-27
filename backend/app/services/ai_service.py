import os
from langchain.chat_models import ChatOpenAI
from langchain.chains import LLMChain
from langchain.prompts import PromptTemplate
from typing import Dict, Any, Optional
import json

class AIService:
    """Service for generating Manim code using OpenAI"""
    
    def __init__(self):
        self.api_key = os.getenv("OPENAI_API_KEY")
        if not self.api_key:
            raise ValueError("OPENAI_API_KEY environment variable is not set")
        
        self.llm = ChatOpenAI(
            temperature=0.2,
            model_name="gpt-4",
            openai_api_key=self.api_key
        )
        
        self.scene_prompt_template = PromptTemplate(
            input_variables=["prompt", "parameters"],
            template="""
            You are an expert in Manim, the mathematical animation library created by 3Blue1Brown.
            You will receive a prompt describing a mathematical concept or animation.
            Your task is to generate a complete, working Manim code to visualize this concept.
            
            User Prompt: {prompt}
            Additional Parameters: {parameters}
            
            Requirements:
            1. Your code should be a complete Python file that can be executed directly with Manim.
            2. Use the ManimCE (Community Edition) syntax.
            3. Include necessary imports.
            4. Use the Scene class and define all necessary methods.
            5. Include detailed comments explaining the mathematical concepts and code logic.
            6. Ensure the animation demonstrates the concept clearly and effectively.
            7. The animation should be visually appealing and professional.
            
            Output only the Python code with no additional explanations or markdown.
            """
        )
        
        self.debug_prompt_template = PromptTemplate(
            input_variables=["code", "error_message"],
            template="""
            You are an expert debugger for Manim, the mathematical animation library.
            You have been given Manim code that is producing an error.
            
            Original Code:
            ```python
            {code}
            ```
            
            Error Message:
            ```
            {error_message}
            ```
            
            Please fix the code to resolve this error.
            Return only the fixed code without explanations or markdown.
            """
        )
    
    async def generate_scene_code(self, prompt: str, parameters: Optional[Dict[str, Any]] = None) -> str:
        """
        Generate Manim scene code based on a user prompt and parameters.
        
        Args:
            prompt: User prompt describing the desired mathematical animation
            parameters: Optional parameters to customize the animation
        
        Returns:
            Generated Manim code as a string
        """
        if parameters is None:
            parameters = {}
        
        parameters_str = json.dumps(parameters)
        
        chain = LLMChain(llm=self.llm, prompt=self.scene_prompt_template)
        result = await chain.arun(prompt=prompt, parameters=parameters_str)
        
        # Clean up the response to ensure it's valid Python code
        result = result.strip()
        if result.startswith("```python"):
            result = result[len("```python"):].strip()
        if result.endswith("```"):
            result = result[:-3].strip()
        
        return result
    
    async def debug_code(self, code: str, error_message: str) -> str:
        """
        Debug Manim code that produced an error.
        
        Args:
            code: The original Manim code
            error_message: The error message produced by running the code
        
        Returns:
            Fixed Manim code as a string
        """
        chain = LLMChain(llm=self.llm, prompt=self.debug_prompt_template)
        result = await chain.arun(code=code, error_message=error_message)
        
        # Clean up the response to ensure it's valid Python code
        result = result.strip()
        if result.startswith("```python"):
            result = result[len("```python"):].strip()
        if result.endswith("```"):
            result = result[:-3].strip()
        
        return result