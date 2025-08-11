import CryptoJS from 'crypto-js';

const AUTH_KEY = 'incidence_auth_token';
const PASSWORD_HASH = import.meta.env.VITE_APP_PASSWORD_HASH;

export const validatePassword = (password) => {
    const hash = CryptoJS.SHA256(password).toString();
    return hash === PASSWORD_HASH;
};

export const saveAuthToken = () => {
    const token = CryptoJS.SHA256(Date.now().toString()).toString();
    sessionStorage.setItem(AUTH_KEY, token);

    // Opcional: establecer expiración
    const expiry = Date.now() + (24 * 60 * 60 * 1000); // 24 horas
    sessionStorage.setItem(AUTH_KEY + '_expiry', expiry.toString());
};

export const isAuthenticated = () => {
    const token = sessionStorage.getItem(AUTH_KEY);
    const expiry = sessionStorage.getItem(AUTH_KEY + '_expiry');

    if (!token || !expiry) return false;

    return Date.now() < parseInt(expiry);
};

export const clearAuthToken = () => {
    sessionStorage.removeItem(AUTH_KEY);
    sessionStorage.removeItem(AUTH_KEY + '_expiry');
};