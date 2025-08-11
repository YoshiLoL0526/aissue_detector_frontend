import { useState, useEffect } from 'react';
import { getStoredSession, clearStoredSession } from './utils/sessionStorage';
import { isAuthenticated, saveAuthToken, clearAuthToken } from './utils/authSecure';
import MainMenu from './components/MainMenu';
import ChatInterface from './components/ChatInterface';
import LoginForm from './components/LoginForm';

export default function App() {
  const [currentSession, setCurrentSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    // Check authentication and existing session on mount
    const authStatus = isAuthenticated();
    setAuthenticated(authStatus);

    if (authStatus) {
      const storedSession = getStoredSession();
      if (storedSession) {
        setCurrentSession(storedSession);
      }
    }

    setLoading(false);
  }, []);

  const handleLogin = () => {
    saveAuthToken();
    setAuthenticated(true);
  };

  const handleLogout = () => {
    clearAuthToken();
    clearStoredSession();
    setAuthenticated(false);
    setCurrentSession(null);
  };

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

  if (!authenticated) {
    return <LoginForm onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Botón de logout en la esquina superior derecha */}
      <div className="fixed top-4 right-4 z-50">
        <button
          onClick={handleLogout}
          className="bg-gray-600 hover:bg-gray-700 text-white px-3 py-2 rounded-lg text-sm transition-colors flex items-center space-x-2"
          title="Cerrar sesión"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          <span>Salir</span>
        </button>
      </div>

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