import {
  FiHome,
  FiGrid,
  FiCoffee,
  FiDollarSign,
  FiPackage,
  FiShoppingBag,
  FiBarChart2,
  FiSettings,
  FiLogOut
} from "react-icons/fi";
import { useTables } from "../../store/TableContext.jsx";

// 📋 Configuración unificada del menú con sus iconos y los roles permitidos
const menuConfig = [
  { name: "Dashboard", icon: <FiHome />, roles: ["admin"] },
  { name: "Mesas", icon: <FiGrid />, roles: ["admin", "mozo"] },      // Mozo tiene acceso
  { name: "Cocina", icon: <FiCoffee />, roles: ["admin", "mozo"] },   // Mozo tiene acceso
  { name: "Caja", icon: <FiDollarSign />, roles: ["admin"] },         // Oculto para mozo
  { name: "Inventario", icon: <FiPackage />, roles: ["admin"] },      // Oculto para mozo
  { name: "Productos", icon: <FiShoppingBag />, roles: ["admin"] },   // Oculto para mozo
  { name: "Reportes", icon: <FiBarChart2 />, roles: ["admin"] },      // Oculto para mozo
  { name: "Configuración", icon: <FiSettings />, roles: ["admin"] },  // Oculto para mozo
];

export default function Sidebar({ activeView, setActiveView }) {
  // Extraemos el usuario activo y la función logout del contexto
  const { user, logout } = useTables();

  // 🔍 Filtramos las opciones: Solo se muestran las que contengan el rol del usuario conectado
  const allowedMenu = menuConfig.filter(item => item.roles.includes(user?.role));

  return (
    <aside className="w-64 bg-slate-900 text-white flex flex-col h-screen justify-between">
      
      {/* SECCIÓN SUPERIOR: Logo y Menú */}
      <div>
        <div className="p-6 text-center border-b border-slate-700">
          <h2 className="text-2xl font-bold text-orange-400">
            MesaPro
          </h2>
          <p className="text-sm text-slate-400">
            Restaurant POS
          </p>
        </div>

        <nav className="flex-1 mt-5 space-y-1">
          {allowedMenu.map((item) => {
            const viewKey = item.name.toLowerCase();
            const isActive = activeView === viewKey;

            return (
              <button
                key={item.name}
                onClick={() => setActiveView(viewKey)}
                className={`w-full flex items-center gap-4 px-6 py-4 transition ${
                  isActive 
                    ? "bg-slate-700 text-orange-400 border-l-4 border-orange-400 font-semibold" 
                    : "hover:bg-slate-800 text-slate-300"
                }`}
              >
                <span className="text-xl">{item.icon}</span>
                <span>{item.name}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* SECCIÓN INFERIOR: Perfil del usuario y Salida */}
      <div className="p-4 border-t border-slate-800 bg-slate-950">
        <div className="flex flex-col mb-3">
          <span className="text-[11px] text-slate-500 uppercase tracking-wider font-bold">Sesión iniciada</span>
          <span className="text-sm font-semibold text-orange-400 truncate">👤 {user?.name || "Usuario"}</span>
        </div>
        
        <button 
          onClick={logout}
          className="w-full flex items-center justify-center gap-2 py-2.5 bg-slate-800 hover:bg-red-900 text-slate-300 hover:text-white rounded-xl text-xs font-bold transition-all shadow-inner"
        >
          <FiLogOut className="text-sm" /> Cerrar Sesión
        </button>
      </div>

    </aside>
  );
}