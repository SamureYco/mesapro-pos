import { FiBell } from "react-icons/fi";

export default function Header() {
  return (
    <header className="h-16 bg-white border-b flex items-center justify-between px-6 shadow-sm">
      <h1 className="text-2xl font-bold text-orange-500">
        🍗 MesaPro POS
      </h1>

      <div className="flex items-center gap-4">
        <button className="text-2xl hover:text-orange-500 transition">
          <FiBell />
        </button>

        <div className="text-right">
          <p className="font-semibold">Samuel Reyes</p>
          <p className="text-sm text-gray-500">Administrador</p>
        </div>
      </div>
    </header>
  );
}