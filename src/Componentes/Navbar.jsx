import React from "react";
import { Link } from "react-router-dom";
import { useGlobalContext } from "../Contexts/GlobalContext";

function Navbar() {
  const { shopFullName } = useGlobalContext();
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark d-print-none mb-2">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/">
          {shopFullName}
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav">
            <li className="nav-item">
              <Link className="nav-link" to="/inicio">
                Inicio
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/comandas/activas">
                Comandas Activas
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/comandas/">
                Todas Las Comandas
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/productos/">
                Productos
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/mesas/">
                Mesas
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/mozos/">
                Mozos
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/clientes/">
                Clientes
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/tipos_pago/">
                Tipos de Pago
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/resumen/">
                Resumen
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/gastos/">
                Gastos
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
