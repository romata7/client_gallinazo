import React, { useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Navbar from "./Componentes/Navbar";
import ProtectedRoute from "./Componentes/ProtectedRoute";
import { useGlobalContext } from "./Contexts/GlobalContext";
import { Clientes } from "./Componentes/clientes/Clientes";
import { Productos } from "./Componentes/productos/Productos";
import { Mesas } from "./Componentes/mesas/Mesas";
import { Mozos } from "./Componentes/mozos/Mozos";
import { Tipopagos } from "./Componentes/tipopagos/Tipopagos";
import { Gastos } from "./Componentes/gastos/Gastos";
import { Home } from "./Componentes/home/Home";
import { Comandas } from "./Componentes/comandas/Comandas";

export const App = ({ }) => {
  const { password } = useGlobalContext();
  const [enteredPassword, setEnteredPassword] = useState("");
  return (
    <div>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/comandas/inicio" element={<Comandas />} />
          <Route path="/comandas/activas" element={<Home />} />
          <Route path="/comandas/agregar" element={<Home />} />
          <Route path="/Inicio" element={<Comandas />} />
          <Route path="/comandas" element={<Home />} />
          <Route path="/detallescliente" element={<Home />} />

          {/* Rutas Protegidas */}
          <Route
            path="/productos"
            element={
              <ProtectedRoute
                component={Productos}
                password={password}
                enteredPassword={enteredPassword}
                setEnteredPassword={setEnteredPassword}
              />
            }
          />
          <Route
            path="/mesas"
            element={
              <ProtectedRoute
                component={Mesas}
                password={password}
                enteredPassword={enteredPassword}
                setEnteredPassword={setEnteredPassword}
              />
            }
          />

          <Route
            path="/mozos"
            element={
              <ProtectedRoute
                component={Mozos}
                password={password}
                enteredPassword={enteredPassword}
                setEnteredPassword={setEnteredPassword}
              />
            }
          />
          <Route
            path="/clientes"
            element={
              <ProtectedRoute
                component={Clientes}
                password={password}
                enteredPassword={enteredPassword}
                setEnteredPassword={setEnteredPassword}
              />
            }
          />
          <Route
            path="/tipos_pago"
            element={
              <ProtectedRoute
                component={Tipopagos}
                password={password}
                enteredPassword={enteredPassword}
                setEnteredPassword={setEnteredPassword}
              />
            }
          />
          <Route
            path="/resumen"
            element={<Home />}
          />
          <Route
            path="/gastos"
            element={
              <ProtectedRoute
                component={Gastos}
                password={password}
                enteredPassword={enteredPassword}
                setEnteredPassword={setEnteredPassword}
              />
            }
          />
          <Route path="/*" element={<Home />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}