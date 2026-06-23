import React, { useState } from "react";
import { useTables } from "../../store/TableContext.jsx"; // 🟢 1. Importamos el hook global

export default function OrderModal({ table, onClose, onSave }) {
  // 🟢 2. Traemos "products" en tiempo real desde el contexto global en vez del archivo estático
  const { products } = useTables(); 

  const [customer, setCustomer] = useState(table.customer || "");
  const [people, setPeople] = useState(table.people || 1);
  const [observations, setObservations] = useState(table.observations || "");
  
  // 🔄 Inicializamos las cantidades usando "products" del contexto
  const [quantities, setQuantities] = useState(() => {
    const initialQty = {};
    products.forEach(p => {
      const existingItem = table.orders?.find(item => item.name === p.name);
      initialQty[p.id] = existingItem ? existingItem.qty : 0;
    });
    return initialQty;
  });

  const handleQtyChange = (id, delta) => {
    setQuantities(prev => ({
      ...prev,
      [id]: Math.max(0, prev[id] + delta)
    }));
  };

  // 🧮 Calculamos el total usando "products" del contexto
  const calculateTotal = () => {
    return products.reduce((sum, p) => sum + (quantities[p.id] * (p.price || 0)), 0);
  };

  const handleGuardar = () => {
    // Filtramos usando "products" del contexto
    const finalOrders = products
      .filter(p => quantities[p.id] > 0)
      .map(p => ({
        name: p.name,
        qty: quantities[p.id],
        price: p.price
      }));

    if (finalOrders.length === 0) {
      alert("Por favor, añade al menos un producto al pedido.");
      return;
    }

    onSave(table.id, {
      customer,
      people,
      observations,
      orders: finalOrders,
      total: calculateTotal()
    });
    
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full max-h-[90vh] flex flex-col overflow-hidden">
        
        <div className="p-4 border-b flex justify-between items-center bg-slate-50">
          <h3 className="text-xl font-bold text-slate-800">Mesa {table.number}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl font-bold">X</button>
        </div>

        <div className="p-6 overflow-y-auto space-y-4 flex-1">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Cliente:</label>
            <input 
              type="text" 
              value={customer} 
              onChange={(e) => setCustomer(e.target.value)}
              placeholder="Nombre del cliente" 
              className="w-full border rounded-lg p-2.5 focus:ring-2 focus:ring-orange-400 outline-none text-slate-800"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Personas:</label>
            <div className="flex items-center gap-4">
              <button onClick={() => setPeople(p => Math.max(1, p - 1))} className="border px-3 py-1 rounded bg-gray-50 font-bold text-lg">-</button>
              <span className="font-semibold text-lg">{people}</span>
              <button onClick={() => setPeople(p => p + 1)} className="border px-3 py-1 rounded bg-gray-50 font-bold text-lg">+</button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Observaciones:</label>
            <textarea 
              value={observations} 
              onChange={(e) => setObservations(e.target.value)}
              placeholder="Sin ensalada, papas bien fritas..." 
              className="w-full border rounded-lg p-2 h-16 resize-none focus:ring-2 focus:ring-orange-400 outline-none text-slate-700"
            />
          </div>

          <hr className="my-2" />

          {/* 🍗 LISTA DINÁMICA DE LA CARTA MODIFICADA */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider">Menú Disponible</h4>
            
            {products.map((product) => (
              <div key={product.id} className="flex justify-between items-center py-2 border-b border-slate-50">
                <div>
                  <p className="font-semibold text-slate-800 text-base">
                    {product.category === 'pollos' ? '🍗' : '🥤'} {product.name}
                  </p>
                  <p className="text-xs text-gray-400 font-medium">S/. {product.price.toFixed(2)}</p>
                </div>
                
                <div className="flex items-center gap-3">
                  <button 
                    onClick={() => handleQtyChange(product.id, -1)}
                    className="w-8 h-8 rounded-full border flex items-center justify-center bg-slate-50 hover:bg-slate-100 font-bold text-gray-600 transition"
                  >
                    -
                  </button>
                  <span className={`w-6 text-center font-bold text-base ${quantities[product.id] > 0 ? "text-orange-500" : "text-gray-400"}`}>
                    {quantities[product.id]}
                  </span>
                  <button 
                    onClick={() => handleQtyChange(product.id, 1)}
                    className="w-8 h-8 rounded-full border flex items-center justify-center bg-slate-50 hover:bg-slate-100 font-bold text-gray-600 transition"
                  >
                    +
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="p-4 border-t bg-slate-50">
          <div className="flex justify-between items-center mb-4 px-2">
            <span className="text-gray-500 font-bold tracking-wide">TOTAL</span>
            <span className="text-xl font-black text-slate-800">S/. {calculateTotal().toFixed(2)}</span>
          </div>
          <button 
            onClick={handleGuardar}
            className="w-full py-3.5 bg-red-500 hover:bg-red-600 text-white font-bold rounded-xl transition shadow-md tracking-wide"
          >
            Guardar Pedido
          </button>
        </div>

      </div>
    </div>
  );
}