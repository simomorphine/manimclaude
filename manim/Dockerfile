FROM python:3.10-slim

WORKDIR /manim

# Install system dependencies for Manim
RUN apt-get update && apt-get install -y \
    build-essential \
    libcairo2-dev \
    libpango1.0-dev \
    ffmpeg \
    texlive-full \
    && rm -rf /var/lib/apt/lists/*

# Install Manim and its dependencies
RUN pip install --no-cache-dir manim==0.17.3 moviepy==1.0.3

# Copy template files
COPY templates/ /manim/templates/

# Set up media directory
RUN mkdir -p /manim/media

# Default command
CMD ["python", "-c", "import time; print('Manim renderer service ready'); time.sleep(infinity)"]