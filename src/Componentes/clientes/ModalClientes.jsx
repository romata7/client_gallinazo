import axios from "axios"
import { useEffect, useState } from "react"
import { Button, FloatingLabel, Form, Modal } from "react-bootstrap"
import API_BASE_URL from "../../config"

const default_data = {
    nombre: "",
    dirección: "",
    celular: "",
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
    Registrar: async (data) => await axios.post(`${API_BASE_URL}/api/clientes`, data),
    Modificar: async (data) => await axios.put(`${API_BASE_URL}/api/clientes/${data.id}`, data),
    Eliminar: async (data) => await axios.delete(`${API_BASE_URL}/api/clientes/${data.id}`),
}

export const ModalClientes = ({
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
            handleClose();
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        if (show) {
            setData(initialData || default_data);
        }
    }, [show, initialData])
    return (
        <Modal show={show} onHide={handleClose} size="sm" centered>
            <Modal.Header closeButton>
                <Modal.Title>{icon[operation]} {operation} Cliente</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <fieldset disabled={operation === 'Eliminar'}
                    className="d-flex flex-column gap-2"

                >
                    <FloatingLabel controlId="nombre" label='Nombre'>
                        <Form.Control
                            type="text"
                            name="nombre"
                            placeholder=""
                            value={data.nombre}
                            onChange={handleChange}
                        />
                    </FloatingLabel>
                    <FloatingLabel controlId="dirección" label="Dirección">
                        <Form.Control
                            type="text"
                            name="dirección"
                            placeholder=""
                            value={data.dirección}
                            onChange={handleChange}
                        />
                    </FloatingLabel>
                    <FloatingLabel controlId="celular" label="Celular">
                        <Form.Control
                            type="text"
                            name="celular"
                            placeholder=""
                            value={data.celular}
                            onChange={handleChange}
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

                {operation === 'Eliminar'
                    ? <Button
                        size="sm"
                        variant={`${variant[operation]}`}
                        onClick={handleSubmit}
                        disabled={loading}
                    >
                        {loading ? "Procesando..." : `${icon[operation]} ${operation}`}
                    </Button>
                    : data.nombre !== "" && (
                        <Button
                            size="sm"
                            variant={`${variant[operation]}`}
                            onClick={handleSubmit}
                            disabled={loading}
                        >
                            {loading ? "Procesando..." : `${icon[operation]} {operation}`}
                        </Button>
                    )
                }
            </Modal.Footer>
        </Modal>
    )
}