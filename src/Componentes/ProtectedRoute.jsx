import React, { useState } from "react";
import { Navigate } from "react-router-dom";

function ProtectedRoute({
  component: Component,
  password,
  enteredPassword,
  setEnteredPassword,
}) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const handlePasswordChange = (e) => {
    setEnteredPassword(e.target.value);
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    if (enteredPassword === password) {
      setIsAuthenticated(true);
      setEnteredPassword("");
    }
  };
  if (isAuthenticated) {
    return <Component />;
  }
  return (
    <div
      className="row"
      style={{
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <div className="col-auto">
        <form onSubmit={handleSubmit}>
          <div className="card" style={{ width: "fit-content" }}>
            <div className="card-body">
              <h3 className="card-title">Acceso Restringido</h3>
              <div className="form-floating">
                <input
                  type="password"
                  className="form-control"
                  value={enteredPassword}
                  onChange={handlePasswordChange}
                  required
                  placeholder=""
                  autoFocus
                />
                <label htmlFor="">Contraseña:</label>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ProtectedRoute;
