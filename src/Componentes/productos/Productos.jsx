import { useCallback, useState } from "react";
import axios from "axios";
import { Button } from "react-bootstrap";
import { ModalProductos } from "./ModalProductos";
import { useGlobalContext } from "../../Contexts/GlobalContext";
import {
  format,
  parseISO
} from 'date-fns';
import { Fechas } from "../commons/Fechas";
import { List } from "../commons/List";
import API_BASE_URL from "../../config";
import { Historial } from "../commons/Historial";

const DEFAULT_PRODUCT_DATA = {
  producto: "",
  costo: ""
}

const color = {
  "AGREGADO": 'text-success',
  "MODIFICADO": 'text-warning',
  "ELIMINADO": 'text-danger',
  "SUBE": 'text-primary',
  "BAJA": 'text-danger',
}

const text = {
  "AGREGADO": 'AGREGADO',
  "MODIFICADO": 'MODIFICADO',
  "ELIMINADO": 'ELIMINADO',
  "SUBE": '↑',
  "BAJA": '↓',
}

const estadoInicialModal = {
  show: false,
  operation: '',
  component: '',
  initialData: DEFAULT_PRODUCT_DATA,
}

function Productos() {
  const { productos, productos_historial, setProductos_historial, subirProducto, bajarProducto } = useGlobalContext();

  const [estadoModal, setEstadoModal] = useState(estadoInicialModal);

  const abrirModal = useCallback((operation, component, initialData = DEFAULT_PRODUCT_DATA) => {
    setEstadoModal(prev => ({
      ...prev,
      show: true,
      operation: operation,
      component: component,
      initialData,
    }))
  }, [])

  const cerrarModal = useCallback(() => {
    setEstadoModal(estadoInicialModal);
  });

  const manejarDataDeModal = useCallback(async (modalData) => {
    try {
      let id;
      switch (estadoModal.operation) {
        case "Registrar":
          await axios.post(`${API_BASE_URL}/api/productos`, modalData);
          break;
        case "Modificar":
          id = modalData.id;
          await axios.put(`${API_BASE_URL}/api/productos/${id}`, modalData);
          break;
        case "Eliminar":
          id = modalData.id;
          await axios.delete(`${API_BASE_URL}/api/productos/${id}`);
          break;
        default:
          break;
      }
      cerrarModal();
    } catch (error) {
      console.error(error);
    }
  }, [estadoModal.operation, cerrarModal]);

  const procesar = async (fi, ff) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/productos/xfechas`, {
        params: {
          fi: fi,
          ff: ff
        }
      });
      setProductos_historial(response.data);
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div>

      {/* Botón Agregar */}
      <div className="d-flex justify-content-center align-items-center my-3">
        <Button
          size="sm"
          variant="success"
          className="d-flex align-items-center gap-1"
          onClick={() => abrirModal("Registrar", 'Productos')}
        >
          <span>+</span> Agregar Producto
        </Button>
      </div>

      {/* Importando List */}
      <List
        list={productos}
        subir={subirProducto}
        bajar={bajarProducto}
        abrirModal={abrirModal}
      />

      {/* Importando Historial */}
      <Historial
        list={productos_historial}
      />

      {/* Historial de Cambios - Estilo Log Mejorado */}
      <div className="d-flex justify-content-between align-items-center mb-2">
        <h6 className="text-muted mb-0">
          HISTORIAL  {productos_historial.length}
        </h6>
      </div>
      <Fechas procesar={procesar} />
      {productos_historial.length > 0 && (
        <div>
          <div className="bg-light rounded p-3 small font-monospace">
            {productos_historial.map((producto_h) => (
              <div key={producto_h.id} className="d-flex align-items-start py-1 border-bottom border-light">
                <span className="text-muted me-2">
                  [{format(parseISO(producto_h.fecha), 'dd/MM HH:mm')}]
                </span>

                <span className="me-2">
                  <strong>#{producto_h.id_producto}</strong>
                </span>

                <span className={`me-2 ${color[producto_h.operacion]}`}>
                  {text[producto_h.operacion]}
                </span>

                <span className="me-2 flex-grow-1">
                  {producto_h.producto}
                </span>

                <span className="text-success me-2">
                  S/{parseFloat(producto_h.costo).toFixed(2)}
                </span>

                {producto_h.orden && (
                  <span className="text-muted">
                    orden:{producto_h.orden}
                  </span>
                )}
              </div>
            ))}

            {productos_historial.length === 0 && (
              <div className="text-center py-2 text-muted">
                No hay registros para el período seleccionado
              </div>
            )}
          </div>
        </div>
      )}

      <ModalProductos
        show={estadoModal.show}
        operation={estadoModal.operation}
        initialData={estadoModal.initialData}
        handleClose={cerrarModal}
        handleSubmit={manejarDataDeModal}
      />
    </div>
  );
}

export default Productos;