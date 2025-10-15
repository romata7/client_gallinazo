import { useState } from "react";
import { useGlobalContext } from "../../Contexts/GlobalContext"
import axios from "axios";
import API_BASE_URL from "../../config";
import { ModalMesas } from "./ModalMesas";
import { ListaMesas } from "./ListaMesas";
import { ListaMesasHistorial } from "./ListaMesasHistorial";
import { Button } from "react-bootstrap";

const default_modal = {
    show: false,
    operation: "",
    data: null,
}

export const Mesas = ({

}) => {
    const { mesas, mesas_historial, setMesas_historial } = useGlobalContext();
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
    const modificarMesa = (item) => {
        abrirModal('Modificar', item);
    }
    const eliminarMesa = (item) => {
        abrirModal('Eliminar', item);
    }
    const subirOrdenMesa = async (item) => {
        try {
            await axios.post(`${API_BASE_URL}/api/mesas/subir/${item.id}`);
        } catch (error) {
            console.error('subirOrdenMesa:', error);
        }
    }
    const bajarOrdenMesa = async (item) => {
        try {
            await axios.post(`${API_BASE_URL}/api/mesas/bajar/${item.id}`);
        } catch (error) {
            console.error('bajarOrdenMesa:', error);
        }
    }
    const procesar = async (fi, ff) => {
        try {
            const response = await axios.get(`${API_BASE_URL}/api/mesas/historial/${fi}/${ff}`);
            setDatosModal(response.data);
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
                    + Agregar Mesa
                </Button>
            </div>
            <ModalMesas
                show={datosModal.show}
                handleClose={cerrarModal}
                operation={datosModal.operation}
                initialData={datosModal.data}
            />
            <ListaMesas
                lista={mesas}
                modificar={modificarMesa}
                eliminar={eliminarMesa}
                subir={subirOrdenMesa}
                bajar={bajarOrdenMesa}
            />
            <ListaMesasHistorial
                lista={mesas_historial}
                procesar={procesar}
            />
        </div>
    )
}