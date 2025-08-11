export default function IncidenceConfirmation({ extractedInfo, onEndSession }) {
    const formatFieldName = (field) => {
        const fieldNames = {
            title: 'Título',
            description: 'Descripción',
            category: 'Categoría',
            severity: 'Severidad',
            type: 'Tipo',
            equip: 'Equipo'
        };
        return fieldNames[field] || field;
    };

    const getSeverityColor = (severity) => {
        const colors = {
            'Leve': 'text-green-600 bg-green-50 border-green-200',
            'Grave': 'text-yellow-600 bg-yellow-50 border-yellow-200',
            'Muy grave': 'text-red-600 bg-red-50 border-red-200',
            'Seguro pendiente': 'text-purple-600 bg-purple-50 border-purple-200'
        };
        return colors[severity] || 'text-gray-600 bg-gray-50 border-gray-200';
    };

    const getCategoryIcon = (category) => {
        const icons = {
            'Fontanería': '🔧',
            'Electricidad': '⚡',
            'Ascensor': '🔼',
            'Limpieza': '🧽',
            'Pintura': '🎨',
            'Cerrajería': '🔑',
            'Humedades': '💧',
            'Climatización': '❄️'
        };
        return icons[category] || '🔧';
    };

    return (
        <div className="min-h-[calc(100vh-80px)] bg-gray-50 py-8 px-4">
            <div className="max-w-3xl mx-auto">
                {/* Header de confirmación */}
                <div className="text-center mb-8">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                        <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-3">¡Incidencia Registrada Exitosamente!</h1>
                    <p className="text-xl text-gray-600">La información ha sido procesada y enviada al equipo técnico</p>
                </div>

                {/* Card principal con la información */}
                <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8">
                    {/* Header de la card */}
                    <div className="bg-red-600 px-6 py-4">
                        <h2 className="text-xl font-semibold text-white flex items-center">
                            <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            Detalles de la Incidencia
                        </h2>
                    </div>

                    {/* Contenido de la card */}
                    <div className="p-6 space-y-6">
                        {Object.entries(extractedInfo).map(([field, value]) => (
                            value && (
                                <div key={field} className="border-b border-gray-100 pb-4 last:border-b-0">
                                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                                        <div className="flex items-center">
                                            <span className="font-semibold text-gray-700 text-lg flex items-center">
                                                {field === 'category' && <span className="mr-2 text-xl">{getCategoryIcon(value)}</span>}
                                                {formatFieldName(field)}
                                            </span>
                                        </div>
                                        <div className="flex-1 sm:max-w-md">
                                            {field === 'severity' ? (
                                                <span className={`inline-block px-4 py-2 rounded-full text-sm font-semibold border ${getSeverityColor(value)}`}>
                                                    {value}
                                                </span>
                                            ) : field === 'description' ? (
                                                <p className="text-gray-900 leading-relaxed bg-gray-50 p-3 rounded-lg">
                                                    {value}
                                                </p>
                                            ) : (
                                                <span className="text-gray-900 font-medium bg-gray-50 px-3 py-2 rounded-lg inline-block">
                                                    {value}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )
                        ))}
                    </div>
                </div>

                {/* Información adicional */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
                    <div className="flex items-start space-x-3">
                        <svg className="w-6 h-6 text-blue-600 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <div>
                            <h3 className="text-lg font-semibold text-blue-900 mb-2">¿Qué sigue ahora?</h3>
                            <ul className="text-blue-800 space-y-2">
                                <li className="flex items-center">
                                    <span className="w-2 h-2 bg-blue-600 rounded-full mr-3"></span>
                                    Un técnico especializado será asignado automáticamente
                                </li>
                                <li className="flex items-center">
                                    <span className="w-2 h-2 bg-blue-600 rounded-full mr-3"></span>
                                    Recibirás una notificación con los detalles del técnico
                                </li>
                                <li className="flex items-center">
                                    <span className="w-2 h-2 bg-blue-600 rounded-full mr-3"></span>
                                    El técnico se pondrá en contacto contigo en las próximas horas
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Botones de acción */}
                <div className="text-center space-y-4">
                    <button
                        onClick={onEndSession}
                        className="bg-red-600 hover:bg-red-700 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-colors shadow-lg hover:shadow-xl transform hover:scale-105"
                    >
                        Finalizar Sesión
                    </button>

                    <p className="text-gray-500 text-sm">
                        Gracias por utilizar nuestro sistema de reporte de incidencias
                    </p>
                </div>
            </div>
        </div>
    );
}