import React, { useState } from 'react';
import { useTables } from '../../store/TableContext.jsx';
import OrderModal from './OrderModal';
import TableCard from './TableCard';

const TablesGrid = () => {
  // Usamos un fallback por si el contexto falla en retornar el objeto
  const context = useTables() || {};
  const tables = context.tables || [];
  const saveOrder = context.saveOrder || (() => {});

  const [selectedTable, setSelectedTable] = useState(null);

  // 🛡️ Si el array de mesas está vacío, mostramos un estado de carga amigable en lugar de romper la app
  if (tables.length === 0) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <h2 style={{ color: '#666' }}>Cargando las mesas del sistema...</h2>
        <p style={{ color: '#999' }}>Verifica si el TableProvider está envolviendo tu aplicación en App.jsx</p>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px' }}>
      <h1 style={{ color: '#111', fontSize: '28px', fontWeight: 'bold', marginBottom: '5px' }}>
        Estado de las Mesas
      </h1>
      <p style={{ color: '#666', marginBottom: '20px' }}>
        Selecciona una mesa para comenzar un pedido.
      </p>

      {/* Grid Dinámico de 20 mesas */}
      <div style={gridStyle}>
        {tables.map((table) => (
          <div 
            key={table.id} 
            onClick={() => setSelectedTable(table)} 
            style={{ cursor: 'pointer' }}
          >
            <TableCard table={table} />
          </div>
        ))}
      </div>

      {/* Renderizado condicional del Modal */}
      {selectedTable && (
        <OrderModal 
          table={selectedTable} 
          onClose={() => setSelectedTable(null)} 
          onSave={saveOrder}
        />
      )}
    </div>
  );
};

const gridStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
  gap: '20px',
};

export default TablesGrid;