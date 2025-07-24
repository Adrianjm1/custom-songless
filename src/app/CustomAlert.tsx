import React from "react"

interface AlertProps {
  message: string
  onClose: () => void
}

export const CustomAlert: React.FC<AlertProps> = ({ message, onClose }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-40">
      <div className="bg-white text-gray-900 rounded-lg shadow-lg p-8 flex flex-col items-center animate-fade-in">
        <span className="text-4xl mb-2">🎉</span>
        <h2 className="text-2xl font-bold mb-2">¡Felicitaciones!</h2>
        <p className="mb-4 text-center">{message}</p>
        <button className="bg-green-600 text-white px-6 py-2 rounded font-semibold hover:bg-green-700 transition" onClick={onClose}>
          Seguir jugando
        </button>
      </div>
      <style>{`
        .animate-fade-in {
          animation: fadeIn 0.3s;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  )
}
