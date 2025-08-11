import axios from 'axios';

const API_KEY = import.meta.env.VITE_API_KEY;
const BASE_URL = import.meta.env.VITE_API_URL || '';

const axiosInstance = axios.create({
    baseURL: BASE_URL,
    headers: { 'x-api-key': API_KEY },
});

export const startChat = () => axiosInstance.post('/api/chat/start');

export const sendMessage = (sessionId, message) =>
    axiosInstance.post(`/api/chat/${sessionId}/message`, { message });

export const sendMessageWithFiles = (sessionId, formData) =>
    axiosInstance.post(`/api/chat/${sessionId}/message-with-files`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });

export const getStatus = (sessionId) =>
    axiosInstance.get(`/api/chat/${sessionId}/status`);

export const completeChat = (sessionId) =>
    axiosInstance.post(`/api/chat/${sessionId}/complete`);

export const deleteChat = (sessionId) =>
    axiosInstance.delete(`/api/chat/${sessionId}`);