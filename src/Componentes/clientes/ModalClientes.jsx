import axios from "axios"
import { useEffect, useState } from "react"
import { Button, FloatingLabel, Form, Modal } from "react-bootstrap"
import API_BASE_URL from "../../config"

const default_data = {
    dniruc: "",
    name: "",
    address: "",
    phone: "",
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
    dniruc: /^[0-9]{0,11}$/,
    name: /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]{0,100}$/,
    phone: /^[0-9\s\+]{0,13}$/,
}

const errorsMessage = {
    dniruc: "Solo números",
    name: "Sin números, ni caracteres especiales",
    phone: "Sin letras",
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
    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (regexPattens[name]) {
            if (regexPattens[name].test(value)) {
                setData(prev => ({ ...prev, [name]: value }));
                // Retiramos los errores
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
            setErrors({});
        }
    }, [show, initialData]);

    return (
        <Modal show={show} onHide={handleClose} size="sm" centered>
            <Modal.Header closeButton>
                <Modal.Title>{icon[operation]} {operation} Cliente</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <fieldset disabled={operation === 'Eliminar'}
                    className="d-flex flex-column gap-2"
                >
                    <FloatingLabel controlId="dniruc" label="D.N.I/R.U.C">
                        <Form.Control
                            type="text"
                            name="dniruc"
                            placeholder=""
                            value={data.dniruc}
                            onChange={handleChange}
                            isInvalid={!!errors.dniruc}
                            maxLength={11}
                        />
                        <Form.Text className="ms-2">
                            {data.dniruc.length} dígitos, <b>máx: 11</b>
                        </Form.Text>
                        <Form.Control.Feedback type="invalid">
                            {errors.dniruc}
                        </Form.Control.Feedback>
                    </FloatingLabel>
                    <FloatingLabel controlId="name" label='Nombre'>
                        <Form.Control
                            type="text"
                            name="name"
                            placeholder=""
                            value={data.name}
                            onChange={handleChange}
                            isInvalid={!!errors.name}
                            maxLength={100}
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors.name}
                        </Form.Control.Feedback>
                    </FloatingLabel>
                    <FloatingLabel controlId="address" label="Dirección">
                        <Form.Control
                            type="text"
                            name="address"
                            placeholder=""
                            value={data.address}
                            onChange={handleChange}
                        />
                    </FloatingLabel>
                    <FloatingLabel controlId="phone" label="Celular">
                        <Form.Control
                            type="text"
                            name="phone"
                            placeholder=""
                            value={data.phone}
                            onChange={handleChange}
                            isInvalid={!!errors.phone}
                            maxLength={13}
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors.phone}
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