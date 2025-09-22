import React, { useCallback, useEffect, useState } from "react";
import axios from "axios";
import API_BASE_URL from "../config";
import { Modal, Button, FloatingLabel, Form, ListGroup, Badge } from "react-bootstrap";
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
          id = modalData;
          response = await axios.put(`${API_BASE_URL}/api/productos/${id}`, modalData)
          break;
        case "Eliminar":
          id = modalData;
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
      <div
        className="d-flex justify-content-center align-items-center my-2"
      >
        <Button
          onClick={() => handelOpenModal("Registrar")}
          size="sm"
        >
          <Plus /> Agregar Producto
        </Button>
      </div>
      {productos.length > 0 && (
        <ListGroup>
          {productos.map((item) => (
            <ListGroup.Item key={item.id}
              className="d-flex gap-2"
            >
              <div className="d-flex gap-2">
                <Button
                  size="sm"
                  variant="outline-primary"
                  onClick={() => subirOrden(p)}
                >
                  <ArrowUp />
                </Button>
                <Button
                  size="sm"
                  variant="outline-secondary"
                  onClick={() => bajarOrden(p)}
                >
                  <ArrowDown />
                </Button>
              </div>
              <div className="flex-grow-1">
                <div>
                  <div className="d-flex gap-2">
                    <div>
                      {item.orden}
                    </div>
                    <div className="flex-grow-1">
                      {item.producto}
                    </div>
                    <div>
                      <Badge>
                        S/ {parseFloat(item.costo).toFixed(2)}
                      </Badge>
                    </div>
                  </div>
                </div>

              </div>
              <div className="d-flex gap-2">
                <Button
                  size="sm"
                  variant="warning"
                  onClick={() => handelOpenModal("Modificar", item)}
                >
                  <Pencil />
                </Button>
                <Button
                  size="sm"
                  variant="danger"
                  onClick={() => handelOpenModal("Eliminar", item)}
                >
                  <Trash />
                </Button>
              </div>
            </ListGroup.Item>
          ))}
        </ListGroup>
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