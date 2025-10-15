import { useState } from "react";
import { useGlobalContext } from "../../Contexts/GlobalContext"
import axios from "axios";
import API_BASE_URL from "../../config";
import { Button } from "react-bootstrap";
import { ModalMozos } from "./ModalMozos";
import { ListaMozos } from "./ListaMozos";
import { ListaMozosHistorial } from "./ListaMozosHistorial";

const default_modal = {
    show: false,
    operation: "",
    data: null,
}

export const Mozos = ({

}) => {
    const { mozos, mozos_historial, setMozos_historial } = useGlobalContext();
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
    const ModificarMozo = (item) => {
        abrirModal('Modificar', item);
    }
    const EliminarMozo = (item) => {
        abrirModal('Eliminar', item);
    }
    const subirOrdenMozo = async (item) => {
        try {
            await axios.post(`${API_BASE_URL}/api/mozos/subir/${item.id}`);
        } catch (error) {
            console.error('subirOrdenMozo:', error);
        }
    }
    const bajarOrdenMozo = async (item) => {
        try {
            await axios.post(`${API_BASE_URL}/api/mozos/bajar/${item.id}`)
        } catch (error) {
            console.error(error);
        }
    }
    const procesar = async (fi, ff) => {
        try {
            const response = await axios.get(`${API_BASE_URL}/api/mozos/historial/${fi}/${ff}`);
            setMozos_historial(response.data)
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
                    + Agregar Mozo
                </Button>
            </div>
            <ModalMozos
                show={datosModal.show}
                handleClose={cerrarModal}
                operation={datosModal.operation}
                initialData={datosModal.data}
            />
            <ListaMozos
                lista={mozos}
                modificar={ModificarMozo}
                eliminar={EliminarMozo}
                subir={subirOrdenMozo}
                bajar={bajarOrdenMozo}
            />
            <ListaMozosHistorial
                lista={mozos_historial}
                procesar={procesar}
            />
        </div>
    )
}