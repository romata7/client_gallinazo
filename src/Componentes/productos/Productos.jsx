import { useCallback, useState } from "react";
import axios from "axios";
import { Button } from "react-bootstrap";
import { ModalProductos } from "./ModalProductos";
import { useGlobalContext } from "../../Contexts/GlobalContext";
import API_BASE_URL from "../../config";
import { ListaProductos } from "./ListaProductos";
import { ListaProductosHistorial } from "./ListaProductosHistoria";

const estadoInicialModal = {
  show: false,
  operation: '',
  initialData: null,
};

const operacionesAPI = {
  Registrar: (data) => axios.post(`${API_BASE_URL}/api/productos`, data),
  Modificar: (data) => axios.put(`${API_BASE_URL}/api/productos/${data.id}`, data),
  Eliminar: (data) => axios.delete(`${API_BASE_URL}/api/productos/${data.id}`),
};

function Productos() {
  const { productos, productos_historial, setProductos_historial } = useGlobalContext();

  const [estadoModal, setEstadoModal] = useState(estadoInicialModal);

  const abrirModal = useCallback((operation, initialData = null) => {
    setEstadoModal({
      show: true,
      operation,
      initialData,
    });
  }, []);

  const cerrarModal = useCallback(() => {
    setEstadoModal(estadoInicialModal);
  });

  const manejarDataDeModal = useCallback(async (modalData) => {
    try {
      const operacion = operacionesAPI[estadoModal.operation];
      if (operacion) {
        await operacion(modalData)
        cerrarModal();
      }
    } catch (error) {
      console.error(error);
    }
  }, [estadoModal.operation, cerrarModal]);

  const accionesProductos = {
    registrar: () => abrirModal('Registrar'),
    modificar: (item) => abrirModal('Modificar', item),
    eliminar: (item) => abrirModal('Eliminar', item),
    subir: async (item) => {
      try {
        await axios.post(`${API_BASE_URL}/api/productos/subir`, { item });
      } catch (error) {
        console.error("Error al subir producto:", error);
      }
    },
    bajar: async (item) => {
      try {
        await axios.post(`${API_BASE_URL}/api/productos/bajar`, { item });
      } catch (error) {
        console.error("Error al bajar producto:", error);
      }
    },
  };

  const procesar = async (fi, ff) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/productos/xfechas`, {
        params: { fi, ff }
      });
      setProductos_historial(response.data);
    } catch (error) {
      console.error(error);
    }
  }
  return (
    <div className="d-flex flex-column gap-2">
      {/* Botón Agregar */}
      <div className="d-flex justify-content-center align-items-center">
        <Button
          size="sm"
          variant="success"
          className="d-flex align-items-center gap-1"
          onClick={accionesProductos.registrar}
        >
          + Agregar Producto
        </Button>
      </div>

      {/* Lista de productos */}
      <ListaProductos
        lista={productos}
        subir={accionesProductos.subir}
        bajar={accionesProductos.bajar}
        modificar={accionesProductos.modificar}
        eliminar={accionesProductos.eliminar}
      />

      {/* Lista de productos historial */}
      <ListaProductosHistorial
        lista={productos_historial}
        procesar={procesar}
      />

      <ModalProductos
        show={estadoModal.show}
        operation={estadoModal.operation}
        initialData={estadoModal.initialData}
        handleClose={cerrarModal}
        handleData={manejarDataDeModal}
      />
    </div >
  );
}

export default Productos;