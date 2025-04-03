
// src/App.tsx
import Chat from './components/Chat'; // Add missing import

function App() {
  return (
    <div className="App">
      <header className="intro-banner">
        <p>
          Take control of your privacy and use Private-Prompt.com to anonymize your AI messages!
        </p>
      </header>
      
      <Chat /> 
    </div>
  );
}

export default App; // Ensure default export exists
