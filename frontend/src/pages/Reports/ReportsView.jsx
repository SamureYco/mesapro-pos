import React from 'react';
import { useTables } from '../../store/TableContext.jsx';

export default function ReportsView() {
  const { salesHistory } = useTables();

  // 1. Calcular métricas clave
  const totalRevenue = salesHistory.reduce((sum, sale) => sum + sale.total, 0);
  const totalOrders = salesHistory.length;
  const averageTicket = totalOrders > 0 ? totalRevenue / totalOrders : 0;

  // 2. Calcular los productos más vendidos (Top Productos)
  const productCounts = {};
  salesHistory.forEach(sale => {
    sale.orders.forEach(item => {
      if (productCounts[item.name]) {
        productCounts[item.name] += item.qty;
      } else {
        productCounts[item.name] = item.qty;
      }
    });
  });

  // Convertir a arreglo y ordenar de mayor a menor
  const topProducts = Object.entries(productCounts)
    .map(([name, qty]) => ({ name, qty }))
    .sort((a, b) => b.qty - a.qty)
    .slice(0, 5); // Tomamos los 5 mejores

  return (
    <div className="p-2 space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-slate-800">📊 Reportes y Estadísticas</h2>
        <p className="text-gray-500 mt-2">Análisis de rendimiento, platos más vendidos y balance del día.</p>
      </div>

      {/* TARJETAS DE MÉTRICAS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col">
          <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Ingresos Totales</span>
          <span className="text-3xl font-black text-slate-800 mt-2">S/. {totalRevenue.toFixed(2)}</span>
          <span className="text-xs text-emerald-600 font-medium mt-1">📈 Caja del turno actual</span>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col">
          <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Órdenes Atendidas</span>
          <span className="text-3xl font-black text-slate-800 mt-2">{totalOrders} mesas</span>
          <span className="text-xs text-blue-600 font-medium mt-1">🍽️ Clientes facturados</span>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col">
          <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Ticket Promedio</span>
          <span className="text-3xl font-black text-slate-800 mt-2">S/. {averageTicket.toFixed(2)}</span>
          <span className="text-xs text-orange-600 font-medium mt-1">💵 Consumo medio por mesa</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* RANKING: LOS MÁS VENDIDOS */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <h3 className="text-lg font-bold text-slate-700 mb-4">🍗 Top 5 Productos más Vendidos</h3>
          
          {topProducts.length === 0 ? (
            <p className="text-sm text-gray-400 py-4 text-center border-2 border-dashed rounded-xl">
              No hay suficientes ventas registradas para generar el ranking.
            </p>
          ) : (
            <div className="space-y-4">
              {topProducts.map((prod, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-3 w-full">
                    <span className="w-6 h-6 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center font-bold text-xs">
                      {index + 1}
                    </span>
                    <div className="w-full">
                      <div className="flex justify-between text-sm font-semibold text-slate-700">
                        <span>{prod.name}</span>
                        <span>{prod.qty} unds.</span>
                      </div>
                      {/* Barra de progreso simulada */}
                      <div className="w-full bg-slate-100 h-2 rounded-full mt-1 overflow-hidden">
                        <div 
                          className="bg-orange-500 h-full rounded-full" 
                          style={{ width: `${Math.min(100, (prod.qty / topProducts[0].qty) * 100)}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ÚLTIMOS MOVIMIENTOS */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <h3 className="text-lg font-bold text-slate-700 mb-4">🕒 Últimas Transacciones</h3>
          {salesHistory.length === 0 ? (
            <p className="text-sm text-gray-400 py-4 text-center border-2 border-dashed rounded-xl">
              Esperando cobros en caja...
            </p>
          ) : (
            <div className="divide-y divide-slate-100 max-h-60 overflow-y-auto pr-1">
              {[...salesHistory].reverse().map((sale) => (
                <div key={sale.id} className="flex justify-between items-center py-3 text-sm">
                  <div>
                    <p className="font-bold text-slate-800">Mesa {sale.tableNumber}</p>
                    <p className="text-xs text-gray-400">{sale.date} • {sale.customer}</p>
                  </div>
                  <span className="font-bold text-emerald-600">S/. {sale.total.toFixed(2)}</span>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}