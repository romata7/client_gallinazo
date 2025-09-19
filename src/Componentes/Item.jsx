import React, { useEffect, useState } from "react";
import { useMyContext } from "../Contexts/MyContext";
import { Button } from "react-bootstrap";
import { Dash, Plus, Trash } from "react-bootstrap-icons";

function Item({ i, onChange, onDelete }) {
  const baseKey = "Item";
  const [ix, setIx] = useState({ ...i, cant: i.cant || 1 }); // Asegura que cant tenga un valor inicial
  const { reg_productos } = useMyContext();

  const aumentarCantidad = () => {
    setIx((prev) => ({ ...prev, cant: prev.cant + 1 }));
  };
  const disminuirCantidad = () => {
    setIx((prev) => ({ ...prev, cant: Math.max(prev.cant - 1, 1) }));
  };
  const cambiarProducto = (e) => {
    const productoSeleccionado = e.target.value;
    const producto = reg_productos.find(
      (p) => p.producto === productoSeleccionado
    );

    setIx((prev) => ({
      ...prev,
      producto: productoSeleccionado,
      costo: producto ? producto.costo : 0,
    }));
  };
  const cambiarNota = (e) => {
    setIx((prev) => ({ ...prev, notas_producto: e.target.value }));
  };
  useEffect(() => {
    onChange(ix);
  }, [ix]);

  return (
    <div>
      <div className="card mb-2">
        <div className="card-body">
          <div className="row mb-1">
            <div style={{ display: "flex", alignItems: "center" }}>
              <div
                className="d-flex gap-1 justify-content-center align-items-center"
              >
                <Button
                  size="sm"
                  variant="outline-danger"
                  onClick={disminuirCantidad}
                >
                  <Dash />
                </Button>
                <span
                  className="fw-bold fs-3 mx-1"
                >
                  {ix.cant || 1}
                </span>
                <Button
                  variant="outline-primary"
                  size="sm"
                  onClick={aumentarCantidad}
                >
                  <Plus />
                </Button>
              </div>
              <div className="input-group mx-2">
                <select
                  className="form-select"
                  value={ix.producto || ""}
                  onChange={cambiarProducto}
                >
                  <option value="" disabled>
                    Selecciona un producto
                  </option>
                  {reg_productos.map((p) => (
                    <option
                      key={`${baseKey}_${p.id_reg_producto}`}
                      value={p.producto}
                    >
                      {p.producto}
                    </option>
                  ))}
                </select>
                <span className="input-group-text">S/ {ix.costo}</span>
                <span className="input-group-text">
                  S/ {(ix.costo * ix.cant).toFixed(2)}
                </span>
              </div>
              <Button
                variant="outline-danger"
                size="sm"
                onClick={() => onDelete(ix.id_reg_item)}
              >
                <Trash />
              </Button>
            </div>
          </div>
          <div className="row">
            <div className="d-flex">
              <input
                type="text"
                className="form-control"
                value={ix.notas_producto || ""}
                onChange={cambiarNota}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Item;
