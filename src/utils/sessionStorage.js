const SESSION_KEY = 'incidence_chat_session';

export const saveSession = (sessionData) => {
    localStorage.setItem(SESSION_KEY, JSON.stringify(sessionData));
};

export const getStoredSession = () => {
    const stored = localStorage.getItem(SESSION_KEY);
    return stored ? JSON.parse(stored) : null;
};

export const updateSession = (sessionData) => {
    saveSession(sessionData);
};

export const clearStoredSession = () => {
    localStorage.removeItem(SESSION_KEY);
};