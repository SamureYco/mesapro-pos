import React, { useState } from "react";
import { useTables } from "../../store/TableContext.jsx";

export default function CashierView() {
  const { tables, payAndFreeTable, businessConfig } = useTables();
  const [selectedTable, setSelectedTable] = useState(null);

  // 📝 NUEVOS ESTADOS: Para el tipo de comprobante y datos del cliente
  const [docType, setDocType] = useState("BOLETA"); // BOLETA o FACTURA
  const [customerDoc, setCustomerDoc] = useState(""); // DNI o RUC
  const [businessName, setBusinessName] = useState(""); // Razón Social (para Factura)

  // Filtrar solo las mesas ocupadas
  const activeTables = tables.filter((t) => t.status === "Ocupada");

  const handleTableSelect = (table) => {
    setSelectedTable(table);
    // Resetear o precargar datos al cambiar de mesa
    setDocType("BOLETA");
    setCustomerDoc("");
    setBusinessName("");
  };

  const handleCobrar = (tableId) => {
    payAndFreeTable(tableId);
    setSelectedTable(null);
    setCustomerDoc("");
    setBusinessName("");
    alert("💰 ¡Cobro registrado y mesa liberada con éxito!");
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="p-2 space-y-8 pb-12">
      {/* SECCIÓN REGULAR (Se oculta al imprimir) */}
      <div className="print:hidden">
        <h2 className="text-3xl font-bold text-slate-800">💰 Caja y Facturación</h2>
        <p className="text-gray-500 mt-2">
          Procesa los pagos del turno, genera boletas con DNI o facturas corporativas.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* LISTA DE MESAS POR COBRAR (Oculto en impresión) */}
        <div className="lg:col-span-2 space-y-4 print:hidden">
          <h3 className="text-lg font-bold text-slate-700">Mesas con Consumo Activo</h3>
          
          {activeTables.length === 0 ? (
            <div className="bg-white p-8 rounded-2xl border text-center text-gray-400 font-medium">
              🕊️ No hay mesas ocupadas o pendientes de cobro en este momento.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {activeTables.map((table) => (
                <div 
                  key={table.id}
                  onClick={() => handleTableSelect(table)}
                  className={`p-5 rounded-2xl border-2 transition-all cursor-pointer bg-white shadow-sm ${
                    selectedTable?.id === table.id 
                      ? "border-orange-500 ring-2 ring-orange-100" 
                      : "border-slate-200 hover:border-slate-300"
                  }`}
                >
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-black text-xl text-slate-800">Mesa {table.number}</span>
                    <span className="bg-orange-100 text-orange-700 font-bold text-xs px-2.5 py-1 rounded-full">
                      S/. {table.total.toFixed(2)}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 font-medium">Mozo asignado: Atendiendo pedido</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* PANEL DE EMISIÓN DE COMPROBANTES */}
        <div className="lg:col-span-1">
          {selectedTable ? (
            <div className="space-y-4">
              
              {/* SELECTOR DE COMPROBANTE Y DATOS (Oculto en impresión) */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4 print:hidden">
                <h4 className="font-bold text-slate-700 text-sm">Opción de Comprobante</h4>
                
                {/* Switch de Boleta / Factura */}
                <div className="grid grid-cols-2 gap-2 bg-slate-100 p-1 rounded-xl">
                  <button 
                    type="button"
                    onClick={() => { setDocType("BOLETA"); setCustomerDoc(""); }}
                    className={`py-2 text-xs font-bold rounded-lg transition-all ${docType === "BOLETA" ? "bg-white text-slate-800 shadow-sm" : "text-gray-500 hover:text-slate-700"}`}
                  >
                    📄 Boleta
                  </button>
                  <button 
                    type="button"
                    onClick={() => { setDocType("FACTURA"); setCustomerDoc(""); }}
                    className={`py-2 text-xs font-bold rounded-lg transition-all ${docType === "FACTURA" ? "bg-white text-slate-800 shadow-sm" : "text-gray-500 hover:text-slate-700"}`}
                  >
                    🏢 Factura
                  </button>
                </div>

                {/* Campos Dinámicos según la elección */}
                <div className="space-y-3">
                  {docType === "BOLETA" ? (
                    <div>
                      <label className="block text-xs font-bold text-gray-500 mb-1">DNI del Cliente (Opcional):</label>
                      <input 
                        type="text" 
                        maxLength={8}
                        placeholder="Escribe DNI (8 dígitos)"
                        value={customerDoc}
                        onChange={(e) => setCustomerDoc(e.target.value.replace(/\D/g, ""))}
                        className="w-full border text-xs rounded-xl p-2.5 outline-none focus:ring-1 focus:ring-orange-400"
                      />
                    </div>
                  ) : (
                    <>
                      <div>
                        <label className="block text-xs font-bold text-gray-500 mb-1">RUC de la Empresa:</label>
                        <input 
                          type="text" 
                          maxLength={11}
                          placeholder="Escribe RUC (11 dígitos)"
                          value={customerDoc}
                          onChange={(e) => setCustomerDoc(e.target.value.replace(/\D/g, ""))}
                          className="w-full border text-xs rounded-xl p-2.5 outline-none focus:ring-1 focus:ring-orange-400"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-500 mb-1">Razón Social:</label>
                        <input 
                          type="text" 
                          placeholder="Nombre de la empresa"
                          value={businessName}
                          onChange={(e) => setBusinessName(e.target.value)}
                          className="w-full border text-xs rounded-xl p-2.5 outline-none focus:ring-1 focus:ring-orange-400"
                        />
                      </div>
                    </>
                  )}
                </div>

                {/* Botones de acción rápidos */}
                <div className="flex gap-2 pt-2">
                  <button
                    onClick={handlePrint}
                    className="flex-1 py-2.5 bg-slate-800 hover:bg-slate-900 text-white font-bold rounded-xl text-xs transition flex items-center justify-center gap-1"
                  >
                    🖨️ Imprimir
                  </button>
                  <button
                    onClick={() => handleCobrar(selectedTable.id)}
                    className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs transition"
                  >
                    💵 Cobrar
                  </button>
                </div>
              </div>

              {/* TICKET DE VENTA (Optimizado para impresión física) */}
              <div className="bg-white border border-slate-300 shadow-md p-6 rounded-2xl font-mono text-xs text-slate-800 max-w-[340px] mx-auto print:border-none print:shadow-none print:p-0 print:max-w-full">
                
                {/* CABECERA */}
                <div className="text-center space-y-1 border-b border-dashed border-slate-400 pb-4">
                  <h4 className="text-base font-black uppercase tracking-wide">{businessConfig.name}</h4>
                  <p>RUC: {businessConfig.ruc}</p>
                  <p className="text-[10px] text-gray-500">{businessConfig.address}</p>
                  <p>Telf: {businessConfig.phone}</p>
                </div>

                {/* METADATOS COMPROBANTE DINÁMICO */}
                <div className="py-3 border-b border-dashed border-slate-400 space-y-1">
                  <p className="flex justify-between font-bold text-[13px]">
                    <span>{docType === "BOLETA" ? "BOLETA DE VENTA" : "FACTURA ELECTRÓNICA"}:</span>
                    <span>{docType === "BOLETA" ? `BB-01-${selectedTable.id}` : `FF-01-${selectedTable.id}`}</span>
                  </p>
                  <p>FECHA: {new Date().toLocaleDateString()} • {new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                  <p>MESA: {selectedTable.number}</p>
                  <p>CAJERO: Samuel Reyes</p>
                  
                  {/* Renderizar según los datos rellenados */}
                  {docType === "BOLETA" ? (
                    <>
                      <p className="uppercase">CLIENTE: {selectedTable.customer || "CLIENTE GENERAL"}</p>
                      {customerDoc && <p>DNI: {customerDoc}</p>}
                    </>
                  ) : (
                    <>
                      <p className="uppercase truncate">EMPRESA: {businessName || "CLIENTE CORPORATIVO"}</p>
                      <p>RUC: {customerDoc || "----------"}</p>
                    </>
                  )}
                </div>

                {/* DETALLE DE LOS PRODUCTOS */}
                <div className="py-3 border-b border-dashed border-slate-400 space-y-2">
                  <div className="flex justify-between font-bold text-[11px]">
                    <span className="w-1/2">PRODUCTO</span>
                    <span className="w-1/6 text-center">CANT</span>
                    <span className="w-1/3 text-right">TOTAL</span>
                  </div>
                  
                  {selectedTable.orders.map((item, index) => (
                    <div key={index} className="flex justify-between text-slate-700">
                      <span className="w-1/2 uppercase truncate">{item.name}</span>
                      <span className="w-1/6 text-center">{item.qty}</span>
                      <span className="w-1/3 text-right">S/. {(item.price * item.qty).toFixed(2)}</span>
                    </div>
                  ))}
                </div>

                {/* TOTALES E IMPUESTOS LEGALES PERUANOS */}
                <div className="py-3 space-y-1 text-right">
                  {(() => {
                    const subtotal = selectedTable.total / (1 + businessConfig.igvPercent / 100);
                    const igvCalculated = selectedTable.total - subtotal;
                    return (
                      <>
                        <p className="flex justify-between text-gray-500">
                          <span>OP. GRAVADA (SUBTOTAL):</span>
                          <span>S/. {subtotal.toFixed(2)}</span>
                        </p>
                        <p className="flex justify-between text-gray-500">
                          <span>IGV ({businessConfig.igvPercent}%):</span>
                          <span>S/. {igvCalculated.toFixed(2)}</span>
                        </p>
                        <p className="flex justify-between text-sm font-black border-t border-double border-slate-600 pt-2 text-slate-900">
                          <span>TOTAL A PAGAR:</span>
                          <span>S/. {selectedTable.total.toFixed(2)}</span>
                        </p>
                      </>
                    );
                  })()}
                </div>

                {/* PIE DE TICKET */}
                <div className="text-center pt-4 border-t border-dashed border-slate-400 space-y-1 text-[10px] text-gray-400">
                  <p className="font-bold text-slate-600">¡GRACIAS POR TU VISITA!</p>
                  <p>Representación impresa de comprobante electrónico.</p>
                </div>

              </div>

            </div>
          ) : (
            <div className="bg-slate-50 border border-dashed p-6 rounded-2xl text-center text-gray-400 text-sm h-48 flex items-center justify-center print:hidden">
              👈 Selecciona una mesa ocupada para emitir su comprobante.
            </div>
          )}
        </div>

      </div>
    </div>
  );
}