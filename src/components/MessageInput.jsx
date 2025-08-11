import { useState, useRef } from 'react';

export default function MessageInput({ onSend, disabled, awaitingConfirmation, onQuickConfirm }) {
    const [text, setText] = useState('');
    const [selectedImages, setSelectedImages] = useState([]);
    const fileInputRef = useRef();

    const handleImageSelect = (e) => {
        const files = Array.from(e.target.files);
        const imageFiles = files.filter(file => file.type.startsWith('image/'));

        const newImages = imageFiles.map(file => ({
            file,
            preview: URL.createObjectURL(file)
        }));

        setSelectedImages(prev => [...prev, ...newImages]);
    };

    const removeImage = (index) => {
        setSelectedImages(prev => {
            const newImages = [...prev];
            URL.revokeObjectURL(newImages[index].preview);
            newImages.splice(index, 1);
            return newImages;
        });
    };

    const handleSend = () => {
        if (!text.trim() && selectedImages.length === 0) return;

        onSend(text, selectedImages);
        setText('');
        setSelectedImages([]);

        // Clear file input
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <div className="bg-white border-t p-4">
            {/* Botón de confirmación rápida cuando se espera confirmación */}
            {awaitingConfirmation && (
                <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                            <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.664-.833-2.464 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z" />
                            </svg>
                            <span className="text-yellow-800 font-medium">Se requiere confirmación</span>
                        </div>
                        <button
                            onClick={onQuickConfirm}
                            disabled={disabled}
                            className="bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-1"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            <span>Confirmar</span>
                        </button>
                    </div>
                    <p className="text-yellow-700 text-sm mt-1">
                        Puedes confirmar directamente con el botón o escribir tu respuesta
                    </p>
                </div>
            )}

            {/* Image previews */}
            {selectedImages.length > 0 && (
                <div className="mb-3 flex flex-wrap gap-2">
                    {selectedImages.map((img, idx) => (
                        <div key={idx} className="relative">
                            <img
                                src={img.preview}
                                alt="Preview"
                                className="w-16 h-16 object-cover rounded-lg border"
                            />
                            <button
                                onClick={() => removeImage(idx)}
                                className="absolute -top-1 -right-1 bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-700"
                            >
                                ×
                            </button>
                        </div>
                    ))}
                </div>
            )}

            <div className="flex items-end space-x-3">
                <div className="flex-1">
                    <textarea
                        className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
                        rows="3"
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Describe la incidencia técnica..."
                        disabled={disabled}
                    />

                    {/* Ayuda de formato */}
                    <div className="mt-1 text-xs text-gray-500">
                        Formatos: **negrita**, *cursiva*, `código`
                    </div>
                </div>

                <div className="flex flex-col space-y-2">
                    <button
                        onClick={() => fileInputRef.current?.click()}
                        disabled={disabled}
                        className="p-2 text-gray-500 hover:text-red-600 disabled:text-gray-300 transition-colors"
                        title="Adjuntar imagen"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                    </button>

                    <button
                        onClick={handleSend}
                        disabled={disabled || (!text.trim() && selectedImages.length === 0)}
                        className="bg-red-600 hover:bg-red-700 disabled:bg-red-300 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                    >
                        Enviar
                    </button>
                </div>
            </div>

            <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageSelect}
                className="hidden"
            />
        </div>
    );
}