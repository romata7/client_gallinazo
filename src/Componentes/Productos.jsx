import React, { useCallback, useEffect, useState } from "react";
import axios from "axios";
import API_BASE_URL from "../config";
import { Modal, Button, FloatingLabel, Form, ListGroup, Badge, Row, Col, Card } from "react-bootstrap";
import moment from "moment";
import { ArrowDown, ArrowUp, Pencil, Plus, Trash } from "react-bootstrap-icons";
import { ModalProductos } from "./productos/ModalProductos";

const DEFAULT_PRODUCT_DATA = {
  producto: "",
  costo: ""
}

function Productos() {
  const [productos, setProductos] = useState([]);
  const [productos_historial, setProductos_historial] = useState([]);

  const [modalState, setModalState] = useState({
    show: false,
    operation: 'Registrar',
    initialData: DEFAULT_PRODUCT_DATA
  });

  const fetchProductos = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/productos/`);
      setProductos(response.data.productos);
      setProductos_historial(response.data.productos_historial);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchProductos();
  }, []);

  const subirOrden = async (p) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/api/productos/subir`, { producto: p })
      console.log(response)
    } catch (error) {
      console.error(error);
    }
    console.log('subir', p)
  }
  const bajarOrden = (p) => {
    console.log('bajar', p)
  }

  const handelOpenModal = useCallback((
    operation,
    productData = DEFAULT_PRODUCT_DATA
  ) => {
    setModalState({
      show: true,
      operation,
      initialData: productData
    })
  }, []);

  const handelCloseModal = useCallback(() => {
    setModalState(prev => ({
      ...prev,
      show: false
    }));
  }, [])

  const handleModalData = useCallback(async (modalData) => {
    try {
      let response;
      let id
      switch (modalState.operation) {
        case "Registrar":
          response = await axios.post(`${API_BASE_URL}/api/productos`, modalData)
          break;
        case "Modificar":
          id = modalData.id;
          response = await axios.put(`${API_BASE_URL}/api/productos/${id}`, modalData)
          break;
        case "Eliminar":
          id = modalData.id;
          response = await axios.delete(`${API_BASE_URL}/api/productos/${id}`, modalData)
          break;

        default:
          break;
      }
      if (response.data) {
        setProductos(response.data.productos || productos);
        setProductos_historial(response.data.productos_historial || productos_historial);
      }
      handelCloseModal();
    } catch (error) {
      console.error(error);
    }
  })

  return (
    <div>
      <div className="d-flex justify-content-center align-items-center my-2">
        <Button
          onClick={() => handelOpenModal("Registrar")}
          size="sm"
          variant="success"
          className="d-flex align-items-center gap-1"
        >
          <span>+</span> Agregar Producto
        </Button>
      </div>
      {productos.length > 0 && (
        <div className="mt-4">
          <h6 className="text-muted mb-2">PRODUCTOS ACTIVOS</h6>
          <div className="bg-light rounded p-3 small font-monospace">
            {productos.map((item) => (
              <div key={item.id} className="d-flex align-items-center justify-content-between py-1">
                {/* Flechas a la izquierda */}
                <div className="d-flex gap-1 me-2">
                  <Button size="sm" variant="outline-primary" onClick={() => subirOrden(item)} className="px-1 py-0" title="Subir orden">
                    ↑
                  </Button>
                  <Button size="sm" variant="outline-secondary" onClick={() => bajarOrden(item)} className="px-1 py-0" title="Bajar orden">
                    ↓
                  </Button>
                </div>

                {/* Información del producto */}
                <div className="d-flex align-items-center gap-3 flex-grow-1">
                  <span className="text-primary">#{item.id}</span>
                  <span>{item.producto}</span>
                  <span className="text-success">S/ {parseFloat(item.costo).toFixed(2)}</span>
                </div>

                {/* Botones de acción */}
                <div className="d-flex gap-1">
                  <Button size="sm" variant="outline-warning" onClick={() => handelOpenModal("Modificar", item)} className="px-1 py-0" title="Modificar">
                    ✎
                  </Button>
                  <Button size="sm" variant="outline-danger" onClick={() => handelOpenModal("Eliminar", item)} className="px-1 py-0" title="Eliminar">
                    ×
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      {productos_historial.length > 0 && (
        <div className="mt-4">
          <h6 className="text-muted mb-2">HISTORIAL DE CAMBIOS</h6>
          <div className="bg-light rounded p-3 small">
            {productos_historial.map((producto_h) => (
              <div key={producto_h.id} className="font-monospace">
                <span className="text-muted small">
                  [{new Date(producto_h.fecha).toLocaleString()}]
                </span>
                <span>
                  {" "} ID: <b>#{producto_h.id_producto}</b>
                </span>
                <span
                  className={producto_h.operacion === "AGREGADO"
                    ? 'text-success'
                    : producto_h.operacion === "MODIFICADO"
                      ? 'text-warning'
                      : 'text-danger'
                  }
                >
                  {" "}{producto_h.operacion}
                </span>
                <span> - {producto_h.producto} </span>
                <span className="text-primary"> - S/{producto_h.costo}</span>
                {producto_h.orden && (
                  <span className="text-muted"> - Orden:{producto_h.orden}</span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      <ModalProductos
        show={modalState.show}
        operation={modalState.operation}
        initialData={modalState.initialData}
        handleClose={handelCloseModal}
        handleSubmit={handleModalData}
      />
    </div>
  );
}

export default Productos;