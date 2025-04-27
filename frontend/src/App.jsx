import React from 'react';
import { AnimationProvider, useAnimation } from './context/AnimationContext';
import PromptInput from './components/PromptInput';
import AnimationPlayer from './components/AnimationPlayer';

// Main App Content
const AppContent = () => {
  const { generateAnimation, isLoading, error, videoUrl } = useAnimation();

  const handleSubmit = (prompt, parameters) => {
    generateAnimation(prompt, parameters);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-blue-600 text-white shadow-md">
        <div className="container mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold">Manim Scene Generator</h1>
          <p className="text-sm opacity-80">Generate mathematical animations with AI</p>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 gap-8">
          <section>
            <PromptInput onSubmit={handleSubmit} isProcessing={isLoading} />
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4">Animation Preview</h2>
            <AnimationPlayer videoUrl={videoUrl} isLoading={isLoading} error={error} />
          </section>
        </div>
      </main>

      <footer className="bg-gray-800 text-white py-4 mt-12">
        <div className="container mx-auto px-4">
          <p className="text-center text-sm">
            &copy; {new Date().getFullYear()} Manim Scene Generator | Powered by Manim and OpenAI
          </p>
        </div>
      </footer>
    </div>
  );
};

// App wrapper with provider
const App = () => {
  return (
    <AnimationProvider>
      <AppContent />
    </AnimationProvider>
  );
};

export default App;