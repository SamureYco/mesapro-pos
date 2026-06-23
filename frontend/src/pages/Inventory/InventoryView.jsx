import React, { useState } from 'react';
import { useTables } from '../../store/TableContext.jsx';

export default function InventoryView() {
  const { inventory, restockItem } = useTables();
  
  // Estados para controlar qué insumo se está reabasteciendo rápidamente
  const [selectedId, setSelectedId] = useState(null);
  const [addQty, setAddQty] = useState('');

  const handleRestockSubmit = (e, id) => {
    e.preventDefault();
    const qty = parseInt(addQty);
    if (isNaN(qty) || qty <= 0) return;

    restockItem(id, qty);
    setSelectedId(null);
    setAddQty('');
  };

  return (
    <div className="p-2 space-y-8 pb-12">
      <div>
        <h2 className="text-3xl font-bold text-slate-800">📦 Control de Almacén e Inventario</h2>
        <p className="text-gray-500 mt-2">Monitorea los insumos de la pollería y recibe alertas cuando te quedes sin stock.</p>
      </div>

      {/* TABLA PRINCIPAL */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden max-w-4xl">
        <div className="p-5 border-b bg-slate-50 flex justify-between items-center">
          <h3 className="text-lg font-bold text-slate-700">Materia Prima e Insumos</h3>
          <span className="text-xs bg-slate-200 text-slate-700 px-3 py-1 rounded-full font-bold">Actualizado en vivo</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-100 text-gray-500 uppercase text-xs font-semibold">
              <tr>
                <th className="px-6 py-4">Insumo</th>
                <th className="px-6 py-4 text-center">Stock Mínimo</th>
                <th className="px-6 py-4 text-center">Stock Actual</th>
                <th className="px-6 py-4 text-center">Estado</th>
                <th className="px-6 py-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {inventory.map((item) => {
                const isCritical = item.currentStock <= item.minStock;

                return (
                  <tr key={item.id} className={`transition-colors ${isCritical ? 'bg-red-50/60 hover:bg-red-50' : 'hover:bg-slate-50/80'}`}>
                    <td className="px-6 py-4 font-bold text-slate-800">{item.name}</td>
                    <td className="px-6 py-4 text-center text-gray-400 font-medium">{item.minStock} {item.unit}</td>
                    <td className="px-6 py-4 text-center font-black text-slate-800">
                      {item.currentStock} {item.unit}
                    </td>
                    <td className="px-6 py-4 text-center">
                      {isCritical ? (
                        <span className="bg-red-100 text-red-700 text-xs px-2.5 py-1 rounded-full font-extrabold tracking-wide uppercase animate-pulse">
                          ⚠️ Stock Crítico
                        </span>
                      ) : (
                        <span className="bg-emerald-100 text-emerald-800 text-xs px-2.5 py-1 rounded-full font-bold uppercase">
                          Abastecido
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      {selectedId === item.id ? (
                        <form onSubmit={(e) => handleRestockSubmit(e, item.id)} className="flex items-center justify-end gap-2">
                          <input 
                            type="number" 
                            placeholder="+ Qty"
                            value={addQty}
                            onChange={(e) => setAddQty(e.target.value)}
                            className="w-20 border rounded-lg p-1.5 text-xs text-center text-slate-800 outline-none ring-1 ring-orange-400"
                            required
                          />
                          <button type="submit" className="bg-orange-500 text-white px-3 py-1.5 rounded-lg text-xs font-bold">
                            OK
                          </button>
                          <button type="button" onClick={() => setSelectedId(null)} className="text-gray-400 text-xs px-1 font-bold">
                            X
                          </button>
                        </form>
                      ) : (
                        <button 
                          onClick={() => setSelectedId(item.id)}
                          className="bg-slate-900 hover:bg-orange-500 text-white font-bold text-xs px-3 py-2 rounded-xl transition"
                        >
                          📥 Reabastecer
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}