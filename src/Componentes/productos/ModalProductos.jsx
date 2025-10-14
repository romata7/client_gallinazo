import { useEffect } from "react"
import { useState } from "react"
import { Button, FloatingLabel, Form, Modal } from "react-bootstrap"

import axios from "axios";
import API_BASE_URL from "../../config";

const default_data = {
    producto: "",
    costo: "",
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

const regexPattens = {
    costo: /^[0-9]{0,11}$/,
}

const errorsMessage = {
    costo: "Solo Números",
}

const procesar = {
    Registrar: async (data) => await axios.post(`${API_BASE_URL}/api/productos`, data),
    Modificar: async (data) => await axios.put(`${API_BASE_URL}/api/productos/${data.id}`, data),
    Eliminar: async (data) => await axios.delete(`${API_BASE_URL}/api/productos/${data.id}`),
}

export const ModalProductos = ({
    show,
    handleClose,
    initialData,
    operation,
}) => {
    const [data, setData] = useState(initialData ? initialData : default_data);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (regexPattens[name]) {
            if (regexPattens[name].test(value)) {
                setData(prev => ({ ...prev, [name]: value }));
                setErrors(prev => ({ ...prev, [name]: "" }));
            } else {
                setData(prev => ({ ...prev, [name]: value }));
            }
        } else {
            setData(prev => ({ ...prev, [name]: value }));
        }
    }

    const handleSubmit = async () => {
        setLoading(true);
        try {
            await procesar[operation](data);
        } catch (error) {
            console.error(error);
        } finally {
            handleClose();
            setLoading(false);
        }
    }

    useEffect(() => {
        if (show) {
            setData(initialData || default_data);
            setErrors({});
        }
    }, [show, initialData]);

    return (
        <Modal show={show} onHide={handleClose} size="sm" centered>
            <Modal.Header closeButton>
                <Modal.Title>{icon[operation]} {operation} Producto</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <fieldset disabled={operation === 'Eliminar'}
                    className="d-flex flex-column gap-2"
                >
                    <FloatingLabel controlId="producto" label="Nombre">
                        <Form.Control
                            type="text"
                            name="producto"
                            placeholder=""
                            value={data.producto}
                            onChange={handleChange}
                            autoFocus
                        />
                    </FloatingLabel>
                    <FloatingLabel controlId="costo" label="Costo">
                        <Form.Control
                            type="text"
                            name="costo"
                            placeholder=""
                            value={data.costo}
                            onChange={handleChange}
                            isInvalid={!!errors.costo}
                            maxLength={11}
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors.costo}
                        </Form.Control.Feedback>
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
                    disabled={!loading && operation !== "Eliminar" && data.name === ""}
                >
                    {icon[operation]} {operation}
                </Button>
            </Modal.Footer>
        </Modal>
    )
}