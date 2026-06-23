import React from 'react';

// Recibimos las props. Si por alguna razón no se desestructura bien, 
// extraemos 'table' de forma ultra segura.
const TableCard = (props) => {
  // Capturamos la mesa ya sea que venga como { table } o dentro de props directo
  const table = props.table || props;

  // 🛡️ Si la mesa sigue sin existir o no tiene datos, evitamos que rompa la pantalla
  if (!table || !table.status) {
    return (
      <div style={{ padding: '20px', backgroundColor: '#ccc', borderRadius: '12px', color: '#666' }}>
        Cargando mesa...
      </div>
    );
  }

  const isOcupada = table.status === 'Ocupada';
  const backgroundColor = isOcupada ? '#ff4d4d' : '#00cc66'; // 🔴 Rojo / 🟢 Verde

  return (
    <div style={{
      backgroundColor: backgroundColor,
      padding: '24px 20px',
      borderRadius: '16px',
      color: 'white',
      textAlign: 'center',
      boxShadow: '0 4px 10px rgba(0,0,0,0.15)',
      transition: 'transform 0.2s ease, background-color 0.3s ease',
    }}>
      <div style={{ fontSize: '24px', marginBottom: '8px' }}>🍽️</div>
      <h3 style={{ margin: '0 0 5px 0', fontSize: '22px', fontWeight: 'bold' }}>
        Mesa {table.number}
      </h3>
      <p style={{ margin: '0 0 10px 0', fontSize: '16px', fontWeight: '500', opacity: 0.9 }}>
        {table.status}
      </p>
      <p style={{ margin: 0, fontSize: '14px', opacity: 0.8 }}>
        👥 {isOcupada ? `${table.people || 0} personas` : '0 personas'}
      </p>
    </div>
  );
};

export default TableCard;