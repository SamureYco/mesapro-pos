import React, { useState } from 'react';
import { useTables } from '../../store/TableContext.jsx';

export default function ProductsView() {
  const { products, addProduct, updateProduct, deleteProduct } = useTables();
  
  // Estados para el pequeño formulario (Agregar / Editar)
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('pollos');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !price) return;

    const productData = { name, price: parseFloat(price), category };

    if (isEditing) {
      updateProduct({ ...productData, id: currentId });
      setIsEditing(false);
      setCurrentId(null);
    } else {
      addProduct(productData);
    }

    // Resetear formulario
    setName('');
    setPrice('');
    setCategory('pollos');
  };

  const handleEditClick = (product) => {
    setIsEditing(true);
    setCurrentId(product.id);
    setName(product.name);
    setPrice(product.price);
    setCategory(product.category);
  };

  return (
    <div className="p-2 space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-slate-800">🛍️ Carta de Productos</h2>
        <p className="text-gray-500 mt-2">Agrega nuevos platos o actualiza los precios vigentes de la pollería.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* FORMULARIO */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 h-fit">
          <h3 className="text-xl font-bold text-slate-700 mb-4">
            {isEditing ? "📝 Editar Producto" : "➕ Agregar Producto"}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-slate-600 mb-1">Nombre del ítem:</label>
              <input 
                type="text" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="ej: 1/8 de Pollo a la Brasa"
                className="w-full border rounded-xl p-3 text-slate-800 outline-none focus:ring-2 focus:ring-orange-400"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-600 mb-1">Precio (S/.):</label>
                <input 
                  type="number" 
                  step="0.10"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="0.00"
                  className="w-full border rounded-xl p-3 text-slate-800 outline-none focus:ring-2 focus:ring-orange-400"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-600 mb-1">Categoría:</label>
                <select 
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full border rounded-xl p-3 text-slate-800 outline-none focus:ring-2 focus:ring-orange-400 bg-white"
                >
                  <option value="pollos">🍗 Pollos</option>
                  <option value="bebidas">🥤 Bebidas</option>
                </select>
              </div>
            </div>

            <div className="pt-2 flex gap-2">
              <button 
                type="submit"
                className="flex-1 py-3 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl transition"
              >
                {isEditing ? "Guardar Cambios" : "Añadir a la Carta"}
              </button>
              {isEditing && (
                <button 
                  type="button"
                  onClick={() => {
                    setIsEditing(false);
                    setName(''); setPrice('');
                  }}
                  className="px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-600 font-bold rounded-xl transition"
                >
                  Cancelar
                </button>
              )}
            </div>
          </form>
        </div>

        {/* LISTA DE PRODUCTOS ACTUALES */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-5 border-b bg-slate-50">
            <h3 className="text-lg font-bold text-slate-700">Ítems Activos en el Menú</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-100 text-gray-500 uppercase text-xs font-semibold">
                <tr>
                  <th className="px-6 py-3.5">Categoría</th>
                  <th className="px-6 py-3.5">Producto</th>
                  <th className="px-6 py-3.5 text-right">Precio</th>
                  <th className="px-6 py-3.5 text-center">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {products.map((product) => (
                  <tr key={product.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-6 py-4">
                      <span className={`text-xs px-2.5 py-1 rounded-full font-bold ${product.category === 'pollos' ? 'bg-amber-100 text-amber-800' : 'bg-blue-100 text-blue-800'}`}>
                        {product.category === 'pollos' ? '🍗 Pollo' : '🥤 Bebida'}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-bold text-slate-800">{product.name}</td>
                    <td className="px-6 py-4 text-right font-semibold text-slate-700">S/. {product.price.toFixed(2)}</td>
                    <td className="px-6 py-4 text-center space-x-3">
                      <button 
                        onClick={() => handleEditClick(product)}
                        className="text-orange-500 hover:text-orange-700 font-bold text-xs"
                      >
                        Editar
                      </button>
                      <button 
                        onClick={() => deleteProduct(product.id)}
                        className="text-red-500 hover:text-red-700 font-bold text-xs"
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}