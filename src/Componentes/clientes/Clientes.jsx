import { useState } from "react"
import { Button } from "react-bootstrap"
import { ModalClientes } from "./ModalClientes";
import { ListaClientes } from "./ListaClientes";
import { useGlobalContext } from "../../Contexts/GlobalContext";
import axios from "axios";
import API_BASE_URL from "../../config";
import { ListaClientesHistorial } from "./ListaClientesHistorial";

const default_modal = {
    show: false,
    operation: "",
    data: null,
}

export const Clientes = ({

}) => {
    const { clientes, clientes_historial, setClientes_historial } = useGlobalContext();
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
    const modificarCliente = (item) => {
        abrirModal('Modificar', item);
    }
    const eliminarCliente = (item) => {
        abrirModal('Eliminar', item);
    }

    const subirOrdenCliente = async (item) => {
        try {
            await axios.post(`${API_BASE_URL}/api/clientes/subir/${item.id}`);
        } catch (error) {
            console.error(error.response.data.error);
        }
    }
    const bajarOrdenCliente = async (item) => {
        try {
            await axios.post(`${API_BASE_URL}/api/clientes/bajar/${item.id}`);
        } catch (error) {
            console.error(error);
        }
    }

    const procesar = async (fi, ff) => {
        try {
            const response = await axios.get(`${API_BASE_URL}/api/clientes/historial/${fi}/${ff}`);
            setClientes_historial(response.data);
        } catch (error) {
            console.error(error);
        }
    }
    return (
        <div className="justify-content-center">
            <Button
                size="sm"
                variant="success"
                onClick={() => abrirModal('Registrar')}
            >
                + Agregar Cliente
            </Button>
            <ModalClientes
                show={datosModal.show}
                handleClose={cerrarModal}
                operation={datosModal.operation}
                initialData={datosModal.data}
            />
            <ListaClientes
                lista={clientes}
                modificar={modificarCliente}
                eliminar={eliminarCliente}
                subir={subirOrdenCliente}
                bajar={bajarOrdenCliente}
            />
            <ListaClientesHistorial
                lista={clientes_historial}
                procesar={procesar}
            />
        </div>
    )
}