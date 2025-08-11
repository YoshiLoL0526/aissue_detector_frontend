import { useState } from 'react';
import { sendMessage, sendMessageWithFiles } from '../services/api';
import { updateSession } from '../utils/sessionStorage';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import IncidenceConfirmation from './IncidenceConfirmation';

export default function ChatInterface({ sessionData, onEndSession }) {
    const [messages, setMessages] = useState(sessionData.messages || []);
    const [loading, setLoading] = useState(false);
    const [isComplete, setIsComplete] = useState(false);
    const [extractedInfo, setExtractedInfo] = useState(null);
    const [awaitingConfirmation, setAwaitingConfirmation] = useState(false);

    const handleSend = async (text, images = []) => {
        if (!text.trim() && images.length === 0) return;

        const userMsg = {
            from: 'user',
            text,
            images: images.map(img => ({ url: img.preview, file: img.file }))
        };

        const newMessages = [...messages, userMsg];
        setMessages(newMessages);
        setLoading(true);

        try {
            let response;

            if (images.length > 0) {
                const formData = new FormData();
                formData.append('message', text);
                images.forEach(img => {
                    formData.append('files', img.file);
                });

                response = await sendMessageWithFiles(sessionData.session_id, formData);
            } else {
                response = await sendMessage(sessionData.session_id, text);
            }

            const botMsg = { from: 'bot', text: response.data.message };
            const updatedMessages = [...newMessages, botMsg];

            setMessages(updatedMessages);
            setIsComplete(response.data.is_complete);
            setAwaitingConfirmation(response.data.awaiting_confirmation || false);

            if (response.data.extracted_info) {
                setExtractedInfo(response.data.extracted_info);
            }

            // Update session in localStorage
            updateSession({
                ...sessionData,
                messages: updatedMessages,
                status: response.data.status,
                is_complete: response.data.is_complete,
                extracted_info: response.data.extracted_info
            });

        } catch (error) {
            console.error('Error sending message:', error);
            const errorMsg = { from: 'bot', text: 'Error al enviar el mensaje. Inténtalo de nuevo.' };
            setMessages([...newMessages, errorMsg]);
        } finally {
            setLoading(false);
        }
    };

    const handleQuickConfirm = async () => {
        await handleSend('No tengo más información que agregar.');
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white shadow-sm border-b">
                <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <div>
                            <h1 className="text-xl font-semibold text-gray-900">Reportar Incidencia</h1>
                            <p className="text-sm text-gray-500">ID: {sessionData.session_id}</p>
                        </div>
                    </div>

                    <button
                        onClick={onEndSession}
                        className="text-gray-400 hover:text-red-600 transition-colors"
                        title="Salir"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
            </div>

            {/* Content */}
            {isComplete && extractedInfo ? (
                <IncidenceConfirmation
                    extractedInfo={extractedInfo}
                    onEndSession={onEndSession}
                />
            ) : (
                <div className="max-w-4xl mx-auto h-[calc(100vh-80px)] flex flex-col">
                    <MessageList messages={messages} loading={loading} />
                    <MessageInput
                        onSend={handleSend}
                        disabled={loading}
                        awaitingConfirmation={awaitingConfirmation}
                        onQuickConfirm={handleQuickConfirm}
                    />
                </div>
            )}
        </div>
    );
}