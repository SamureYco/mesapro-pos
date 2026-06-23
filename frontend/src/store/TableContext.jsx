import React, { createContext, useContext, useState } from 'react';
import { MENU_PRODUCTS as initialProducts } from '../services/products';

const TableContext = createContext();

export const TableProvider = ({ children }) => {
  const initialTables = Array.from({ length: 20 }, (_, index) => ({
    id: index + 1,
    number: String(index + 1).padStart(2, '0'),
    status: 'Libre', 
    customer: '',
    people: 0,
    observations: '',
    orders: [],
    total: 0,
    kitchenStatus: 'libre'
  }));

  const [tables, setTables] = useState(initialTables);
  const [salesHistory, setSalesHistory] = useState([]);
  const [user, setUser] = useState(null);
  const [products, setProducts] = useState(initialProducts);
  const [businessConfig, setBusinessConfig] = useState({
    name: "Pollería El Rey",
    ruc: "20123456789",
    address: "Av. Principal 123 - Chiclayo",
    phone: "987654321",
    igvPercent: 18
  });

  // 📦 NUEVO ESTADO GLOBAL: Inventario base de la pollería
  const [inventory, setInventory] = useState([
    { id: 'inv_1', name: 'Pollos Frescos enteros', currentStock: 45, minStock: 15, unit: 'Unds' },
    { id: 'inv_2', name: 'Papa Canchán / Única (Cortada)', currentStock: 8, minStock: 3, unit: 'Sacos' },
    { id: 'inv_3', name: 'Carbón vegetal de algarrobo', currentStock: 12, minStock: 4, unit: 'Sacos' },
    { id: 'inv_4', name: 'Aceite vegetal para freidora', currentStock: 5, minStock: 2, unit: 'Bidones (20L)' },
    { id: 'inv_5', name: 'Gaseosa Inca Kola 1.5L', currentStock: 48, minStock: 12, unit: 'Unds' },
    { id: 'inv_6', name: 'Gaseosa Coca Cola 1.5L', currentStock: 36, minStock: 12, unit: 'Unds' },
  ]);

  // 🔄 NUEVA FUNCIÓN: Sumar stock al recibir mercadería del proveedor
  const restockItem = (id, amount) => {
    setInventory(prev => prev.map(item => 
      item.id === id ? { ...item, currentStock: item.currentStock + amount } : item
    ));
  };

  const updateBusinessConfig = (newConfig) => setBusinessConfig(newConfig);
  const addProduct = (newProd) => setProducts(prev => [...prev, { ...newProd, id: 'prod_' + Date.now() }]);
  const updateProduct = (updatedProd) => setProducts(prev => prev.map(p => p.id === updatedProd.id ? updatedProd : p));
  const deleteProduct = (id) => setProducts(prev => prev.filter(p => p.id !== id));

  const login = (username, password) => {
    if (username === "mozo" && password === "1234") {
      setUser({ name: "Mozo Juan", role: "mozo" });
      return true;
    } else if (username === "admin" && password === "admin123") {
      setUser({ name: "Samuel Reyes", role: "admin" });
      return true;
    }
    return false;
  };

  const logout = () => setUser(null);

  const saveOrder = (tableId, orderData) => {
    setTables((prevTables) =>
      prevTables.map((table) =>
        table.id === tableId ? { ...table, ...orderData, status: 'Ocupada', kitchenStatus: 'pendiente' } : table
      )
    );
  };

  const deliverOrder = (tableId) => {
    setTables((prevTables) =>
      prevTables.map((table) => table.id === tableId ? { ...table, kitchenStatus: 'listo' } : table)
    );
  };

  const payAndFreeTable = (tableId) => {
    const tableToPay = tables.find(t => t.id === tableId);
    if (tableToPay && tableToPay.orders.length > 0) {
      const newSale = {
        id: Date.now(),
        tableNumber: tableToPay.number,
        customer: tableToPay.customer || 'Cliente General',
        orders: tableToPay.orders,
        total: tableToPay.total,
        date: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setSalesHistory(prevHistory => [...prevHistory, newSale]);
    }

    setTables((prevTables) =>
      prevTables.map((table) =>
        table.id === tableId
          ? { ...table, status: 'Libre', customer: '', people: 0, observations: '', orders: [], total: 0, kitchenStatus: 'libre' }
          : table
      )
    );
  };

  return (
    <TableContext.Provider value={{ 
      tables, salesHistory, user, products, businessConfig,
      inventory, // 👈 Exportamos el inventario
      restockItem, // 👈 Exportamos la función de recarga
      saveOrder, deliverOrder, payAndFreeTable, login, logout,
      addProduct, updateProduct, deleteProduct, updateBusinessConfig
    }}>
      {children}
    </TableContext.Provider>
  );
};

export const useTables = () => useContext(TableContext);