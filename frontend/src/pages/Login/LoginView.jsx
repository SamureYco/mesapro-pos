import React, { useState } from 'react';
import { useTables } from '../../store/TableContext.jsx';

export default function LoginView() {
  const { login } = useTables();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Ejecutamos la validación del contexto
    const success = login(username, password);
    if (!success) {
      setError('❌ Usuario o contraseña incorrectos');
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full space-y-6">
        
        {/* Encabezado */}
        <div className="text-center">
          <h2 className="text-3xl font-black text-orange-500">MesaPro</h2>
          <p className="text-slate-400 text-sm mt-1">Ingresa al sistema de la pollería</p>
        </div>

        {/* Alerta de error si falla */}
        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm font-medium text-center border border-red-100">
            {error}
          </div>
        )}

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Usuario:</label>
            <input 
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="ej: mozo o admin"
              className="w-full border border-slate-200 rounded-xl p-3 outline-none focus:ring-2 focus:ring-orange-400 text-slate-800 transition-all"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Contraseña:</label>
            <input 
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full border border-slate-200 rounded-xl p-3 outline-none focus:ring-2 focus:ring-orange-400 text-slate-800 transition-all"
              required
            />
          </div>

          <button 
            type="submit"
            className="w-full py-3.5 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl transition shadow-md"
          >
            Ingresar al Sistema
          </button>
        </form>

      </div>
    </div>
  );
}