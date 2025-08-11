import { useState, useEffect } from 'react';
import { getStoredSession, clearStoredSession } from './utils/sessionStorage';
import MainMenu from './components/MainMenu';
import ChatInterface from './components/ChatInterface';

export default function App() {
  const [currentSession, setCurrentSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing session on mount
    const storedSession = getStoredSession();
    if (storedSession) {
      setCurrentSession(storedSession);
    }
    setLoading(false);
  }, []);

  const handleNewSession = (sessionData) => {
    setCurrentSession(sessionData);
  };

  const handleEndSession = () => {
    clearStoredSession();
    setCurrentSession(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-red-600 text-lg">Cargando...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {currentSession ? (
        <ChatInterface
          sessionData={currentSession}
          onEndSession={handleEndSession}
        />
      ) : (
        <MainMenu onNewSession={handleNewSession} />
      )}
    </div>
  );
}