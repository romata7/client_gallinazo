import axios from "axios"
import API_BASE_URL from "../../config"
import { useEffect, useState } from "react"
import { Button, FloatingLabel, Form, Modal } from "react-bootstrap"

const default_data = {
    dni: "",
    mozo: "",
    direccion: "",
    telefono: "",
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
    dni: /^[0-9]{0,8}$/,
    mozo: /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]{0,100}$/,
    telefono: /^[0-9\s\+]{0,13}$/,
}

const errorsMessage = {
    dni: "Solo números",
    mozo: "Sin números, ni caracteres especiales",
    telefono: "Sin letras",
}

const procesar = {
    Registrar: async (data) => await axios.post(`${API_BASE_URL}/api/mozos`, data),
    Modificar: async (data) => await axios.put(`${API_BASE_URL}/api/mozos/${data.id}`, data),
    Eliminar: async (data) => await axios.delete(`${API_BASE_URL}/api/mozos/${data.id}`),
}

export const ModalMozos = ({
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
                setErrors(prev => ({ ...prev, [name]: errorsMessage[name] }));
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
            console.error('handleSubmit:', error);
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
        <Modal
            show={show}
            onHide={handleClose}
            size="sm"
            centered
        >
            <Modal.Header closeButton>
                <Modal.Title>{icon[operation]} {operation} Mozo</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <fieldset disabled={operation === "Eliminar"}
                    className="d-flex flex-column gap-2"
                >
                    <FloatingLabel controlId="dni" label="D.N.I">
                        <Form.Control
                            type="text"
                            name="dni"
                            placeholder=""
                            value={data.dni}
                            onChange={handleChange}
                            isInvalid={!!errors.dni}
                            maxLength={8}
                            autoFocus
                        />
                        <Form.Text className="ms-2">
                            {data.dni.length} dígitos, <b>máx: 8</b>
                        </Form.Text>
                        <Form.Control.Feedback type="invalid">
                            {errorsMessage.dni}
                        </Form.Control.Feedback>
                    </FloatingLabel>
                    <FloatingLabel controlId="mozo" label="Nombre">
                        <Form.Control
                            type="text"
                            name="mozo"
                            placeholder=""
                            value={data.mozo}
                            onChange={handleChange}
                            isInvalid={!!errors.mozo}
                            maxLength={100}
                        />
                        <Form.Control.Feedback type="invalid">
                            {errorsMessage.mozo}
                        </Form.Control.Feedback>
                    </FloatingLabel>
                    <FloatingLabel controlId="direccion" label="Dirección">
                        <Form.Control
                            type="text"
                            name="direccion"
                            placeholder=""
                            value={data.direccion}
                            onChange={handleChange}
                        />
                    </FloatingLabel>
                    <FloatingLabel controlId="telefono" label="Teléfono">
                        <Form.Control
                            type="text"
                            name="telefono"
                            placeholder=""
                            value={data.telefono}
                            onChange={handleChange}
                            isInvalid={!!errors.telefono}
                            maxLength={13}
                        />
                        <Form.Text className="ms-2">
                            {data.telefono.length} dígitos, <b>máx: 13</b>
                        </Form.Text>
                        <Form.Control.Feedback type="invalid">
                            {errorsMessage.telefono}
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
                    disabled={!loading && operation !== "Eliminar" && data.mozo === ""}

                >
                    {icon[operation]} {operation}
                </Button>
            </Modal.Footer>
        </Modal>
    )
}