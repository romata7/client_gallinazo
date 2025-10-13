import { useState } from "react";
import { useGlobalContext } from "../../Contexts/GlobalContext"
import axios from "axios";
import API_BASE_URL from "../../config";
import { Button } from "react-bootstrap";
import { ModalProductos } from "./ModalProductos";
import { ListaProductos } from "./ListaProductos";
import { ListaProductosHistorial } from "./ListaProductosHistoria";

const default_modal = {
  show: false,
  operation: "",
  data: null,
}

export const Productos = ({

}) => {
  const { productos, productos_historial, setProductos_historial } = useGlobalContext();
  const [datosModal, setDatosModal] = useState(default_modal);

  const abrirModal = (operation, data = null) => {
    setDatosModal({
      show: true,
      operation,
      data,
    });
  }

  const cerrarModal = () => {
    setDatosModal(default_modal);
  }
  const modificarProducto = (item) => {
    abrirModal('Modificar', item);
  }
  const eliminarProducto = (item) => {
    abrirModal('Eliminar', item);
  }
  const subirOrdenProducto = async (item) => {
    try {
      await axios.post(`${API_BASE_URL}/api/productos/subir/${item.id}`);
    } catch (error) {
      console.error(error);
    }
  }
  const bajarOrdenProducto = async (item) => {
    try {
      await axios.post(`${API_BASE_URL}/api/productos/bajar/${item.id}`);
    } catch (error) {
      console.error(error);
    }
  }
  const procesar = async (fi, ff) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/productos/historial/${fi}/${ff}`);
      setProductos_historial(response.data);
    } catch (error) {
      console.error(error);
    }
  }
  return (
    <div>
      <div className="d-flex justify-content-center mb-2">
        <Button
          size="sm"
          variant="success"
          onClick={() => abrirModal('Registrar')}
        >
          + Agregar Producto
        </Button>
      </div>
      <ModalProductos
        show={datosModal.show}
        handleClose={cerrarModal}
        operation={datosModal.operation}
        initialData={datosModal.data}
      />
      <ListaProductos
        lista={productos}
        modificar={modificarProducto}
        eliminar={eliminarProducto}
        subir={subirOrdenProducto}
        bajar={bajarOrdenProducto}
      />
      <ListaProductosHistorial
        lista={productos_historial}
        procesar={procesar}
      />
    </div>
  );
}