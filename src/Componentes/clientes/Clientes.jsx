import { useState } from "react"
import { Button } from "react-bootstrap"
import { ModalClientes } from "./ModalClientes";

const default_modal = {
    show: false,
    operation: "",
    data: null,
}

export const Clientes = ({

}) => {
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
        </div>
    )
}