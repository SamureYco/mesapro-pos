import React from 'react';
import { useTables } from '../../store/TableContext.jsx';

const KitchenView = () => {
  const { tables, deliverOrder } = useTables() || { tables: [], deliverOrder: () => {} };

  // 🔍 Filtro inteligente: Solo pedidos en estado 'pendiente'
  const activeOrders = tables.filter(table => table.status === 'Ocupada' && table.kitchenStatus === 'pendiente');

  return (
    <div className="p-2">
      <h2 className="text-3xl font-bold text-slate-800">👨‍🍳 Monitor de Cocina</h2>
      <p className="text-gray-500 mt-2 mb-6">Pedidos activos listos para preparación en brasas.</p>

      {activeOrders.length === 0 ? (
        <div className="text-center py-12 text-gray-400 text-lg border-2 border-dashed border-gray-200 rounded-xl bg-white">
          ¡Todo al día! No hay pedidos pendientes por ahora. 🍗🔥
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {activeOrders.map((table) => (
            <div key={table.id} className="bg-white rounded-xl shadow-sm border-t-4 border-red-500 flex flex-col justify-between overflow-hidden">
              <div className="bg-red-50 p-4 flex justify-between items-center border-b border-dashed border-red-100">
                <span className="bg-red-500 text-white px-3 py-1 rounded-full font-bold text-sm">Mesa {table.number}</span>
                <span className="font-medium text-slate-700">👤 {table.customer || 'Cliente'}</span>
              </div>

              <div className="p-4 flex-1">
                <p className="text-xs text-gray-400 mb-3">👥 Personas: <span className="font-semibold text-slate-600">{table.people}</span></p>
                <ul className="space-y-2">
                  {table.orders.map((item, idx) => (
                    <li key={idx} className="flex items-center text-slate-700 text-base">
                      <span className="font-bold text-red-500 mr-3 min-w-[24px]">{item.qty}x</span>
                      <span className="font-medium">{item.name}</span>
                    </li>
                  ))}
                </ul>
                {table.observations && (
                  <div className="mt-4 p-2 bg-amber-50 text-amber-800 rounded-lg text-sm border-l-4 border-amber-400">
                    <strong>Obs:</strong> {table.observations}
                  </div>
                )}
              </div>

              <button 
                onClick={() => deliverOrder(table.id)} 
                className="w-full py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-bold transition-colors"
              >
                Listo / Despachar ✓
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default KitchenView;