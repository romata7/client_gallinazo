import axios from "axios"
import API_BASE_URL from "../../config"
import { Button, FloatingLabel, Form, Modal } from "react-bootstrap"
import { useEffect, useState } from "react"

const default_data = {
    tipopago: "",
}

const variant = {
    Registrar: "success",
    Modificar: "warning",
    Eliminar: "danger",
}

const icon = {
    Registrar: `✔`,
    Modificar: `✎`,
    Eliminar: `✘`,
}

const procesar = {
    Registrar: async (data) => await axios.post(`${API_BASE_URL}/api/tipopagos`, data),
    Modificar: async (data) => await axios.put(`${API_BASE_URL}/api/tipopagos/${data.id}`, data),
    Eliminar: async (data) => await axios.delete(`${API_BASE_URL}/api/tipopagos/${data.id}`),
}

export const ModalTipopagos = ({
    show,
    handleClose,
    initialData,
    operation,
}) => {
    const [data, setData] = useState(initialData ? initialData : default_data);
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setData(prev => ({ ...prev, [name]: value }));
    }

    const handleSubmit = async () => {
        setLoading(true);
        try {
            await procesar[operation](data);
        } catch (error) {
            console.error('handleSubmit:', error);
        } finally {
            handleClose();
            setLoading(false);
        }
    }

    useEffect(() => {
        if (show) {
            setData(initialData || default_data);
        }
    }, [show, initialData]);

    return (
        <Modal show={show} onHide={handleClose} size="sm" centered>
            <Modal.Header closeButton>
                <Modal.Title>{icon[operation]} {operation} Tipo de Pago</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <fieldset disabled={operation === "Eliminar"}
                    className="d-flex flex-column gap-2"
                >
                    <FloatingLabel controlId="tipopago" label="Tipo de pago">
                        <Form.Control
                            type="text"
                            name="tipopago"
                            placeholder=""
                            value={data.tipopago}
                            onChange={handleChange}
                            autoFocus
                        />
                    </FloatingLabel>
                </fieldset>
            </Modal.Body>
            <Modal.Footer>
                <Button
                    size="sm"
                    variant="secondary"
                    onClick={handleClose}
                >
                    Cancelar
                </Button>

                <Button
                    size="sm"
                    variant={variant[operation]}
                    onClick={handleSubmit}
                    disabled={!loading && operation !== "Eliminar" && data.cliente === ""}
                >
                    {icon[operation]} {operation}
                </Button>
            </Modal.Footer>
        </Modal>
    )
}