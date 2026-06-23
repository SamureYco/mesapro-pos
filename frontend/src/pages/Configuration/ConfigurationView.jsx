import React, { useState } from 'react';
import { useTables } from '../../store/TableContext.jsx';

export default function ConfigurationView() {
  const { businessConfig, updateBusinessConfig } = useTables();

  const [name, setName] = useState(businessConfig.name);
  const [ruc, setRuc] = useState(businessConfig.ruc);
  const [address, setAddress] = useState(businessConfig.address);
  const [phone, setPhone] = useState(businessConfig.phone);
  const [igvPercent, setIgvPercent] = useState(businessConfig.igvPercent);
  const [successMessage, setSuccessMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    updateBusinessConfig({ name, ruc, address, phone, igvPercent: parseFloat(igvPercent) });
    setSuccessMessage('✅ ¡Configuración del sistema guardada con éxito!');
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  return (
    // 🟢 Añadimos "pb-12" para dar un margen interno inferior correcto y un alto controlado limpio
    <div className="p-2 space-y-6 pb-12 balance-container">
      <div>
        <h2 className="text-3xl font-bold text-slate-800">⚙️ Configuración del Sistema</h2>
        <p className="text-gray-500 mt-2">Personaliza los datos fiscales, comprobantes e impuestos de tu pollería.</p>
      </div>

      {successMessage && (
        <div className="bg-emerald-50 text-emerald-700 p-4 rounded-xl text-sm font-bold border border-emerald-200 shadow-sm max-w-2xl">
          {successMessage}
        </div>
      )}

      {/* Tarjeta de Formulario */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 max-w-2xl overflow-hidden">
        <div className="p-5 border-b bg-slate-50">
          <h3 className="text-lg font-bold text-slate-700">Datos de la Empresa</h3>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-slate-600 mb-1">Nombre Comercial:</label>
              <input 
                type="text" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full border border-slate-200 rounded-xl p-3 text-slate-800 outline-none focus:ring-2 focus:ring-orange-400 bg-white"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-600 mb-1">RUC / Identificación Fiscal:</label>
              <input 
                type="text" 
                value={ruc}
                onChange={(e) => setRuc(e.target.value)}
                className="w-full border border-slate-200 rounded-xl p-3 text-slate-800 outline-none focus:ring-2 focus:ring-orange-400 bg-white"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-slate-600 mb-1">Teléfono:</label>
              <input 
                type="text" 
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full border border-slate-200 rounded-xl p-3 text-slate-800 outline-none focus:ring-2 focus:ring-orange-400 bg-white"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-600 mb-1">Impuesto IGV (%):</label>
              <input 
                type="number" 
                value={igvPercent}
                onChange={(e) => setIgvPercent(e.target.value)}
                className="w-full border border-slate-200 rounded-xl p-3 text-slate-800 outline-none focus:ring-2 focus:ring-orange-400 bg-white"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-600 mb-1">Dirección del Local:</label>
            <input 
              type="text" 
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full border border-slate-200 rounded-xl p-3 text-slate-800 outline-none focus:ring-2 focus:ring-orange-400 bg-white"
              required
            />
          </div>

          <div className="pt-4 border-t border-slate-100 flex justify-end">
            <button 
              type="submit"
              className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl transition shadow-md"
            >
              Guardar Configuración
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}