import React, { useState } from "react";
import Sidebar from "../../components/layout/Sidebar";
import Header from "../../components/layout/Header";
import TablesGrid from "../../components/tables/TablesGrid";
import KitchenView from "../Kitchen/KitchenView"; // Importamos la cocina
import CashierView from "../Cashier/CashierView";
import ProductsView from "../Products/ProductsView";
import ReportsView from "../Reports/ReportsView";
import ConfigurationView from "../Configuration/ConfigurationView";
import InventoryView from "../Inventory/InventoryView";

export default function Dashboard() {
  // 🧭 Controlamos la vista activa ('mesas' o 'cocina')
  const [activeView, setActiveView] = useState("mesas");

  // 🔀 Renderizado condicional respetando tus títulos
const renderView = () => {
    switch (activeView) {
      case "cocina":
        return <KitchenView />;
      case "caja":               // 🟢 Agregamos el caso para la caja
        return <CashierView />;
      case "productos":       
        return <ProductsView />;
      case "reportes":        
        return <ReportsView />
      case "configuración":   
        return <ConfigurationView />;
      case "inventario":
        return <InventoryView />;
      case "mesas":
      default:
        return (
          <>
            <h2 className="text-3xl font-bold text-slate-800">Estado de las Mesas</h2>
            <p className="text-gray-500 mt-2">Selecciona una mesa para comenzar un pedido.</p>
            <div className="mt-6"><TablesGrid /></div>
          </>
        );
    }
  };

  return (
    <div className="flex h-screen bg-slate-100">
      {/* 🟢 Le pasamos el estado y la función al Sidebar */}
      <Sidebar activeView={activeView} setActiveView={setActiveView} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />

        <main className="flex-1 p-8 overflow-auto bg-slate-100 min-h-screen">
          {renderView()}
        </main>
      </div>
    </div>
  );
}