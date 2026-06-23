import React from "react";
import Dashboard from "./pages/Dashboard/Dashboard";
import LoginView from "./pages/Login/LoginView";
import { TableProvider, useTables } from "./store/TableContext";
import "./App.css";

// 🛡️ Componente de control para verificar accesos
function MainAppContent() {
  const { user } = useTables();

  // Si no hay un usuario logueado en el contexto, forzar la vista de Login
  if (!user) {
    return <LoginView />;
  }

  // Si ya inició sesión, puede entrar al Dashboard corporativo de la pollería
  return <Dashboard />;
}

export default function App() {
  return (
    // Envolvemos toda la aplicación en nuestro proveedor global
    <TableProvider>
      <MainAppContent />
    </TableProvider>
  );
}