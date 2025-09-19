// MyContext.js
import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import API_BASE_URL from "../config";

// Crea el contexto
const MyContext = createContext();

// Crea un proveedor de contexto
export const MyProvider = ({ children }) => {
  const [reg_mesas, setReg_mesas] = useState([]);
  const [reg_clientes, setReg_clientes] = useState([]);
  const [reg_mozos, setReg_mozos] = useState([]);
  const [reg_tipos_pago, setReg_tipos_pago] = useState([]);
  const [reg_productos, setReg_productos] = useState([]);
  const [comandas, setComandas] = useState([]);

  const [prints, setPrints] = useState(null)  

  const [last_id_comanda, setLast_id_comanda] = useState(0);

  function get_resumen(list) {
    const totals = {
      "1/8": 0,
      "1/4": 0,
      "1/2": 0,
      "Pollo Entero": 0,
    };

    // Calcular los totales según los items
    list.forEach((item) => {
      if (item.producto === "1/8 Pollo") {
        totals["1/8"] += item.cant;
      } else if (item.producto === "1/4 Pollo") {
        totals["1/4"] += item.cant;
      } else if (item.producto === "1/2 Pollo") {
        totals["1/2"] += item.cant;
      } else if (item.producto === "Pollo Entero") {
        totals["Pollo Entero"] += item.cant;
      }
    });

    // Crear el resumen de resaltados
    const resumen = [];
    if (totals["1/8"] > 0) resumen.push(`${totals["1/8"]}/8`);
    if (totals["1/4"] > 0) resumen.push(`${totals["1/4"]}/4`);
    if (totals["1/2"] > 0) resumen.push(`${totals["1/2"]}/2`);
    if (totals["Pollo Entero"] > 0) resumen.push(`${totals["Pollo Entero"]}`);

    return resumen.join(" ");
  }

  // Función para obtener el último ID de la comanda
  const fetchLastIdComanda = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/comandas/last_id`);
      setLast_id_comanda(Number(response.data.last_id) + 1); // Actualiza el estado con el nuevo ID
    } catch (error) {
      console.error("Error fetching last id comanda:", error);
    }
  };

  // Llama a esta función cuando necesites actualizar el último ID
  const updateLastIdComanda = () => {
    fetchLastIdComanda();
  };
  //cargar sugerencias
  useEffect(() => {
    // Cargar datos (mesas, clientes, mozos, tipos de pago, productos)
    const fetchData = async () => {
      const [mesas, clientes, mozos, tiposPago, productos, comandas_result] =
        await Promise.all([
          axios.get(`${API_BASE_URL}/api/mesas`),
          axios.get(`${API_BASE_URL}/api/clientes`),
          axios.get(`${API_BASE_URL}/api/mozos`),
          axios.get(`${API_BASE_URL}/api/tipo_pagos`),
          axios.get(`${API_BASE_URL}/api/productos`),
          axios.get(`${API_BASE_URL}/api/comandas/activas`),
        ]);

      setReg_mesas(mesas.data.map((m) => m.mesa));
      setReg_clientes(clientes.data.map((c) => c.cliente));
      setReg_mozos(mozos.data.map((m) => m.mozo));
      setReg_tipos_pago(tiposPago.data.map((tp) => tp.tipo_pago));
      setComandas(comandas_result.data);
      setReg_productos(
        productos.data.map(({ id_reg_producto, producto, costo }) => ({
          id_reg_producto,
          producto,
          costo: parseFloat(costo),
        }))
      );
    };
    fetchData();
  }, []);

  const fetchPrints = async (fi, ff) => {    
    try {
      const response = await axios.get(`${API_BASE_URL}/api/prints/${fi}/${ff}`);
      setPrints(response.data)
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <MyContext.Provider
      value={{
        reg_mesas,
        reg_clientes,
        reg_mozos,
        reg_tipos_pago,
        reg_productos,
        get_resumen,
        comandas,
        last_id_comanda,
        updateLastIdComanda,
        fetchPrints,
        prints,                
      }}
    >
      {children}
    </MyContext.Provider>
  );
};

// Crea un hook para usar el contexto
export const useMyContext = () => useContext(MyContext);

