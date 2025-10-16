import { useState } from "react";
import { useGlobalContext } from "../../Contexts/GlobalContext"
import { Button } from "react-bootstrap";
import { ModalGasto } from "./ModalGastos";
import { ListaGastos } from "./ListaGastos";
import { ListaGastosHistorial } from "./ListaGastosHistorial";
import API_BASE_URL from "../../config";

const default_modal = {
    show: false,
    operation: "",
    data: null,
}

export const Gastos = ({

}) => {
    const { gastos, gastos_historial, setGastos_historial } = useGlobalContext();
    const [datosModal, setDatosModal] = useState(default_modal);

    const abrirModal = (operation, data = null) => {
        setDatosModal({
            show: true,
            operation,
            data,
        })
    }

    const cerrarModal = () => {
        setDatosModal(default_modal);
    }
    const modificarGasto = (item) => {
        abrirModal('Modificar', item);
    }
    const eliminarGasto = (item) => {
        abrirModal('Elminar', item);
    }
    const procesar = async (fi, ff) => {
        try {
            const response = await axios.get(`${API_BASE_URL}/api/gastos/historial/${fi}/${ff}`)
            setGastos_historial(response.data)
        } catch (error) {
            console.error('procesar:', error);
        }
    }
    return (
        <div>
            <div className="d-flex justify-content-center mb-2">
                <Button size="sm" variant="success" onClick={() => abrirModal('Registrar')}>
                    + Agregar Gasto
                </Button>
            </div>
            <ModalGasto
                show={datosModal.show}
                handleClose={cerrarModal}
                operation={datosModal.operation}
                initialData={datosModal.data}
            />
            <ListaGastos
                lista={gastos}
                modificar={modificarGasto}
                eliminar={eliminarGasto}
            />
            <ListaGastosHistorial
                lista={gastos_historial}
                procesar={procesar}
            />
        </div>
    )
}