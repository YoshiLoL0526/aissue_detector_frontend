import { useEffect, useRef } from 'react';

// Función para procesar texto con formato
const formatMessage = (text) => {
    if (!text) return text;

    // Procesar negritas (**texto**)
    let formatted = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

    // Procesar cursiva (*texto*)
    formatted = formatted.replace(/\*(.*?)\*/g, '<em>$1</em>');

    // Procesar código (`texto`)
    formatted = formatted.replace(/`(.*?)`/g, '<code class="bg-gray-100 px-1 py-0.5 rounded text-sm font-mono">$1</code>');

    return formatted;
};

export default function MessageList({ messages, loading }) {
    const messagesEndRef = useRef(null);

    // Auto-scroll al final cuando lleguen nuevos mensajes
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, loading]);

    return (
        <div className="flex-1 overflow-auto p-6 space-y-4">
            {messages.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.from === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-xs lg:max-w-md px-4 py-3 rounded-lg ${msg.from === 'user'
                            ? 'bg-red-600 text-white'
                            : 'bg-white text-gray-800 shadow-sm border'
                        }`}>
                        {msg.text && (
                            <div
                                className="whitespace-pre-wrap"
                                dangerouslySetInnerHTML={{ __html: formatMessage(msg.text) }}
                            />
                        )}

                        {msg.images && msg.images.length > 0 && (
                            <div className="mt-2 space-y-2">
                                {msg.images.map((img, imgIdx) => (
                                    <img
                                        key={imgIdx}
                                        src={img.url}
                                        alt="Imagen adjunta"
                                        className="max-w-full h-auto rounded-md"
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            ))}

            {loading && (
                <div className="flex justify-start">
                    <div className="bg-white text-gray-800 shadow-sm border px-4 py-3 rounded-lg">
                        <div className="flex items-center space-x-2">
                            <svg className="animate-spin h-4 w-4 text-red-600" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                            </svg>
                            <span>Procesando...</span>
                        </div>
                    </div>
                </div>
            )}

            {/* Elemento invisible para hacer scroll */}
            <div ref={messagesEndRef} />
        </div>
    );
}