import React, { useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Navbar from "./Componentes/Navbar";
import AgregarComanda from "./Componentes/AgregarComanda";
import Todas_las_comandas from "./Componentes/Todas_las_comandas";
import ComandasActivas from "./Componentes/ComandasActivas";
import Productos from "./Componentes/Productos";
import Mesas from "./Componentes/Mesas";
import Mozos from "./Componentes/Mozos";
import Clientes from "./Componentes/Clientes";
import Tipos_pago from "./Componentes/Tipos_pago";
import Resumen from "./Componentes/Resumen";
import Gastos from "./Componentes/Gastos";
import ProtectedRoute from "./Componentes/ProtectedRoute";
import DetallesCliente from "./Componentes/DetallesCliente";
import { useGlobalContext } from "./Contexts/GlobalContext";

function App() {
  const { password } = useGlobalContext();
  const [enteredPassword, setEnteredPassword] = useState("");
  return (
    <div>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/comandas/activas" element={<ComandasActivas />} />
          <Route path="/comandas/agregar" element={<AgregarComanda />} />
          <Route path="/Inicio" element={<AgregarComanda />} />
          <Route path="/comandas" element={<Todas_las_comandas />} />
          <Route path="/detallescliente" element={<DetallesCliente />} />

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
                component={Tipos_pago}
                password={password}
                enteredPassword={enteredPassword}
                setEnteredPassword={setEnteredPassword}
              />
            }
          />
          <Route
            path="/resumen"
            element={
              <ProtectedRoute
                component={Resumen}
                password={password}
                enteredPassword={enteredPassword}
                setEnteredPassword={setEnteredPassword}
              />
            }
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
          <Route path="/*" element={<AgregarComanda />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
