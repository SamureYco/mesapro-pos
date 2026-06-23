import React, { useState } from "react";
import { useTables } from "../../store/TableContext.jsx";

export default function CashierView() {
  const { tables, payAndFreeTable, businessConfig } = useTables();
  const [selectedTable, setSelectedTable] = useState(null);

  const [docType, setDocType] = useState("BOLETA");
  const [customerDoc, setCustomerDoc] = useState("");
  const [businessName, setBusinessName] = useState("");

  const activeTables = tables.filter((t) => t.status === "Ocupada");

  const handleTableSelect = (table) => {
    setSelectedTable(table);
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
    <div className="p-4 sm:p-6 space-y-8 pb-20">
      {/* SECCIÓN REGULAR */}
      <div className="print:hidden">
        <h2 className="text-3xl font-bold text-slate-800">💰 Caja y Facturación</h2>
        <p className="text-gray-500 mt-2">
          Procesa los pagos, genera boletas con DNI o facturas corporativas.
        </p>
      </div>

      {/* DISEÑO ADAPTATIVO (Flex-col para móvil, xl:flex-row para escritorio) */}
      <div className="flex flex-col xl:flex-row gap-8 items-start">
        
        {/* LISTA DE MESAS */}
        <div className="w-full xl:w-2/3 space-y-4 print:hidden">
          <h3 className="text-lg font-bold text-slate-700">Mesas con Consumo Activo</h3>
          
          {activeTables.length === 0 ? (
            <div className="bg-white p-8 rounded-2xl border text-center text-gray-400 font-medium">
              🕊️ No hay mesas ocupadas en este momento.
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
                </div>
              ))}
            </div>
          )}
        </div>

        {/* PANEL DE EMISIÓN */}
        <div className="w-full xl:w-1/3">
          {selectedTable ? (
            <div className="space-y-4">
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4 print:hidden">
                <h4 className="font-bold text-slate-700 text-sm">Opción de Comprobante</h4>
                <div className="grid grid-cols-2 gap-2 bg-slate-100 p-1 rounded-xl">
                  <button 
                    type="button"
                    onClick={() => { setDocType("BOLETA"); setCustomerDoc(""); }}
                    className={`py-2 text-xs font-bold rounded-lg ${docType === "BOLETA" ? "bg-white shadow-sm" : "text-gray-500"}`}
                  >📄 Boleta</button>
                  <button 
                    type="button"
                    onClick={() => { setDocType("FACTURA"); setCustomerDoc(""); }}
                    className={`py-2 text-xs font-bold rounded-lg ${docType === "FACTURA" ? "bg-white shadow-sm" : "text-gray-500"}`}
                  >🏢 Factura</button>
                </div>

                <div className="space-y-3">
                  {docType === "BOLETA" ? (
                    <div>
                      <label className="block text-xs font-bold text-gray-500 mb-1">DNI del Cliente (Opcional):</label>
                      <input type="text" maxLength={8} value={customerDoc} onChange={(e) => setCustomerDoc(e.target.value.replace(/\D/g, ""))} className="w-full border text-xs rounded-xl p-2.5" />
                    </div>
                  ) : (
                    <>
                      <div>
                        <label className="block text-xs font-bold text-gray-500 mb-1">RUC:</label>
                        <input type="text" maxLength={11} value={customerDoc} onChange={(e) => setCustomerDoc(e.target.value.replace(/\D/g, ""))} className="w-full border text-xs rounded-xl p-2.5" />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-500 mb-1">Razón Social:</label>
                        <input type="text" value={businessName} onChange={(e) => setBusinessName(e.target.value)} className="w-full border text-xs rounded-xl p-2.5" />
                      </div>
                    </>
                  )}
                </div>

                <div className="flex gap-2">
                  <button onClick={handlePrint} className="flex-1 py-2.5 bg-slate-800 text-white font-bold rounded-xl text-xs">🖨️ Imprimir</button>
                  <button onClick={() => handleCobrar(selectedTable.id)} className="flex-1 py-2.5 bg-emerald-600 text-white font-bold rounded-xl text-xs">💵 Cobrar</button>
                </div>
              </div>

              {/* TICKET DE VENTA (Clase print-target aplicada aquí) */}
              <div className="print-target bg-white border border-slate-300 p-6 rounded-2xl font-mono text-xs text-slate-800 w-full max-w-[340px] mx-auto">
                <div className="text-center pb-4 border-b border-dashed border-slate-400">
                  <h4 className="text-base font-black uppercase">{businessConfig.name}</h4>
                  <p>RUC: {businessConfig.ruc}</p>
                </div>
                <div className="py-3 border-b border-dashed border-slate-400 space-y-1">
                  <p className="flex justify-between font-bold"><span>{docType}:</span> <span>{docType === "BOLETA" ? `BB-01-${selectedTable.id}` : `FF-01-${selectedTable.id}`}</span></p>
                  <p>CLIENTE: {docType === "BOLETA" ? (selectedTable.customer || "GENERAL") : (businessName || "CORPORATIVO")}</p>
                  <p>{docType === "BOLETA" ? "DNI:" : "RUC:"} {customerDoc || "----------"}</p>
                </div>
                <div className="py-3 border-b border-dashed border-slate-400 space-y-2">
                  {selectedTable.orders.map((item, i) => (
                    <div key={i} className="flex justify-between">
                      <span>{item.name} x{item.qty}</span>
                      <span>S/. {(item.price * item.qty).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
                <div className="py-3 text-right font-black text-sm">
                  TOTAL A PAGAR: S/. {selectedTable.total.toFixed(2)}
                </div>
              </div>
            </div>
          ) : (
            <div className="p-6 border-2 border-dashed rounded-2xl text-center text-gray-400 print:hidden">
              Selecciona una mesa para emitir comprobante.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}