import { useCallback, useState, useMemo } from "react";
import axios from "axios";
import API_BASE_URL from "../config";
import { Button, Card } from "react-bootstrap";
import { ModalProductos } from "./productos/ModalProductos";
import { useGlobalContext } from "../Contexts/GlobalContext";
import {
  format,
  startOfDay,
  endOfDay,
  startOfMonth,
  endOfMonth,
  isWithinInterval,
  parseISO
} from 'date-fns';

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

// Componente minimalista para filtros
const FiltrosFecha = ({ fechaInicio, fechaFin, onFechasChange }) => {
  const [fi, setFi] = useState(startOfDay(new Date()).toLocaleDateString());
  const [ff, setFf] = useState(startOfDay(new Date()));
  console.log(startOfDay(new Date()), endOfDay(new Date()))
  return (
    <div className="d-flex flex-wrap gap-2 align-items-center mb-3 p-2 bg-light rounded small">
      <span className="text-muted">Filtrar:</span>
      <Button size="sm" variant="outline-dark" onClick={() => {
        onFechasChange(startOfDay(new Date()), endOfDay(new Date()));
      }}>
        Hoy
      </Button>
      <Button size="sm" variant="outline-dark" onClick={() => {
        onFechasChange(startOfMonth(new Date()), endOfMonth(new Date()));
      }}>
        Mes
      </Button>
      <Button size="sm" variant="outline-dark" onClick={() => {
        onFechasChange(null, null);
      }}>
        Todo
      </Button>

      <div className="d-flex gap-1 align-items-center">
        <input
          type="date"
          className="form-control form-control-sm"
          style={{ width: '120px' }}
          value={fechaInicio ? format(fechaInicio, 'yyyy-MM-dd') : ''}
          onChange={(e) => {
            const nuevaFecha = e.target.value ? new Date(e.target.value) : null;
            onFechasChange(nuevaFecha, fechaFin);
          }}
        />
        <span className="text-muted">-</span>
        <input
          type="date"
          className="form-control form-control-sm"
          style={{ width: '120px' }}
          value={fechaFin ? format(fechaFin, 'yyyy-MM-dd') : ''}
          onChange={(e) => {
            const nuevaFecha = e.target.value ? new Date(e.target.value) : null;
            onFechasChange(fechaInicio, nuevaFecha);
          }}
        />
      </div>
    </div>
  );
};

function Productos() {
  const { productos, productos_historial } = useGlobalContext();
  const [fechaInicio, setFechaInicio] = useState(startOfMonth(new Date()));
  const [fechaFin, setFechaFin] = useState(endOfMonth(new Date()));

  const [modalState, setModalState] = useState({
    show: false,
    operation: 'Registrar',
    initialData: DEFAULT_PRODUCT_DATA
  });

  // Filtrar historial por fechas
  const historialFiltrado = useMemo(() => {
    if (!fechaInicio || !fechaFin) {
      return productos_historial; // Mostrar todo si no hay filtros
    }

    return productos_historial.filter(item => {
      const fechaItem = parseISO(item.fecha);
      return isWithinInterval(fechaItem, {
        start: fechaInicio,
        end: fechaFin
      });
    });
  }, [productos_historial, fechaInicio, fechaFin]);

  const handleFechasChange = (inicio, fin) => {
    setFechaInicio(inicio);
    setFechaFin(fin);
  };

  const subirOrden = async (item) => {
    try {
      await axios.post(`${API_BASE_URL}/api/productos/subir`, { item });
    } catch (error) {
      console.error(error);
    }
  };

  const bajarOrden = async (item) => {
    try {
      await axios.post(`${API_BASE_URL}/api/productos/bajar`, { item });
    } catch (error) {
      console.error(error);
    }
  };

  const handelOpenModal = useCallback((operation, productData = DEFAULT_PRODUCT_DATA) => {
    setModalState({
      show: true,
      operation,
      initialData: productData
    });
  }, []);

  const handelCloseModal = useCallback(() => {
    setModalState(prev => ({
      ...prev,
      show: false
    }));
  }, []);

  const handleModalData = useCallback(async (modalData) => {
    try {
      let id;
      switch (modalState.operation) {
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
      handelCloseModal();
    } catch (error) {
      console.error(error);
    }
  }, [modalState.operation, handelCloseModal]);

  return (
    <div>
      {/* Botón Agregar */}
      <div className="d-flex justify-content-center align-items-center my-3">
        <Button
          size="sm"
          variant="success"
          className="d-flex align-items-center gap-1"
          onClick={() => handelOpenModal("Registrar")}
        >
          <span>+</span> Agregar Producto
        </Button>
      </div>

      {/* Productos Activos - Estilo Log */}
      {productos.length > 0 && (
        <div className="mb-4">
          <div className="d-flex justify-content-between align-items-center mb-2">
            <h6 className="text-muted mb-0">PRODUCTOS ACTIVOS ({productos.length})</h6>
          </div>
          <div className="bg-light rounded p-3 small font-monospace">
            {productos.map((item) => (
              <div key={item.id} className="d-flex align-items-center justify-content-between py-1 border-bottom border-light">
                <div className="d-flex gap-1 me-2">
                  <Button
                    size="sm"
                    variant="outline-primary"
                    className="px-1 py-0"
                    title="Subir orden"
                    onClick={() => subirOrden(item)}
                  >
                    ↑
                  </Button>
                  <Button
                    size="sm"
                    variant="outline-secondary"
                    title="Bajar orden"
                    className="px-1 py-0"
                    onClick={() => bajarOrden(item)}
                  >
                    ↓
                  </Button>
                </div>

                <div className="d-flex align-items-center gap-3 flex-grow-1 me-2">
                  <span className="text-primary">#{item.orden}</span>
                  <span>{item.producto}</span>
                  <span className="text-success">S/ {parseFloat(item.costo).toFixed(2)}</span>
                </div>

                <div className="d-flex gap-1">
                  <Button
                    size="sm"
                    variant="outline-warning"
                    className="px-1 py-0"
                    title="Modificar"
                    onClick={() => handelOpenModal("Modificar", item)}
                  >
                    ✎
                  </Button>
                  <Button
                    size="sm"
                    variant="outline-danger"
                    className="px-1 py-0"
                    title="Eliminar"
                    onClick={() => handelOpenModal("Eliminar", item)}
                  >
                    ×
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Historial de Cambios - Estilo Log Mejorado */}
      {productos_historial.length > 0 && (
        <div>
          <div className="d-flex justify-content-between align-items-center mb-2">
            <h6 className="text-muted mb-0">
              HISTORIAL ({historialFiltrado.length} de {productos_historial.length})
            </h6>
          </div>

          {/* Filtros minimalistas */}
          <FiltrosFecha
            fechaInicio={fechaInicio}
            fechaFin={fechaFin}
            onFechasChange={handleFechasChange}
          />

          <div className="bg-light rounded p-3 small font-monospace">
            {historialFiltrado.map((producto_h) => (
              <div key={producto_h.id} className="d-flex align-items-start py-1 border-bottom border-light">
                <span className="text-muted me-3" style={{ minWidth: '140px' }}>
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

            {historialFiltrado.length === 0 && (
              <div className="text-center py-2 text-muted">
                No hay registros para el período seleccionado
              </div>
            )}
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