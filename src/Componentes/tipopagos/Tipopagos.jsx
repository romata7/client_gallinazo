import { useState } from "react";
import { useGlobalContext } from "../../Contexts/GlobalContext"
import axios from "axios";
import API_BASE_URL from "../../config";
import { ModalTipopagos } from "./ModalTipopagos";
import { ListaTipopagos } from "./ListaTipopagos";
import { ListaTipopagosHistorial } from "./ListaTipopagosHistorial";
import { Button } from "react-bootstrap";

const default_modal = {
    show: false,
    operation: "",
    data: null,
}

export const Tipopagos = ({

}) => {
    const { tipopagos, tipopagos_historial, setTipopagos_historial } = useGlobalContext();
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
    const modificarTipopago = (item) => {
        abrirModal('Modificar', item);
    }
    const eliminarTipopago = (item) => {
        abrirModal('Eliminar', item);
    }
    const subirOrdenTipopago = async (item) => {
        try {
            await axios.post(`${API_BASE_URL}/api/tipopagos/subir/${item.id}`);
        } catch (error) {
            console.error('subirOrdenTipopago:', error);
        }
    }
    const bajarOrdenTipopago = async (item) => {
        try {
            await axios.post(`${API_BASE_URL}/api/tipopagos/bajar/${item.id}`);
        } catch (error) {
            console.error('bajarOrdenTipopago:', error);
        }
    }

    const procesar = async (fi, ff) => {
        try {
            const response = await axios.get(`${API_BASE_URL}/api/tipopagos/historial/${fi}/${ff}`);
            setTipopagos_historial(response.data);
        } catch (error) {
            console.error('procesar:', error);
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
                    + Agregar Tipo de pago
                </Button>
            </div>
            <ModalTipopagos
                show={datosModal.show}
                handleClose={cerrarModal}
                operation={datosModal.operation}
                initialData={datosModal.data}
            />
            <ListaTipopagos
                lista={tipopagos}
                modificar={modificarTipopago}
                eliminar={eliminarTipopago}
                subir={subirOrdenTipopago}
                bajar={bajarOrdenTipopago}
            />
            <ListaTipopagosHistorial
                lista={tipopagos_historial}
                procesar={procesar}
            />
        </div>
    )
}