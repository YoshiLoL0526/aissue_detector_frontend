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
                        <div className="flex items-center space-x-1">
                            <div className="flex space-x-1">
                                <div className="w-2 h-2 bg-red-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                                <div className="w-2 h-2 bg-red-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                                <div className="w-2 h-2 bg-red-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Elemento invisible para hacer scroll */}
            <div ref={messagesEndRef} />
        </div>
    );
}