import { useEffect, useState } from "react"
import { Button, FloatingLabel, Form, Modal } from "react-bootstrap"

const variant = {
    "Registrar": "primary",
    "Modificar": "warning",
    "Eliminar": "danger"
}

const DEFAULT_DATA = {
    producto: "",
    costo: ""
}

export const ModalProductos = ({
    operation = "Registrar",
    show,
    handleClose,
    initialData,
    handleSubmit
}) => {
    const [data, setData] = useState(initialData);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setData(prev => ({ ...prev, [name]: value }));
    }

    useEffect(() => {
        if (show) {
            setData(initialData || DEFAULT_DATA);
        }
    }, [show, initialData])
    return (
        <Modal show={show} onHide={handleClose} size="sm">
            <Modal.Header closeButton>
                <Modal.Title>{operation} Producto</Modal.Title>
            </Modal.Header>
            <fieldset disabled={operation === "Eliminar"}>
                <Modal.Body
                    className="d-flex flex-column gap-2"
                >
                    <FloatingLabel controlId="producto" label="Productos">
                        <Form.Control
                            type="text"
                            name="producto"
                            value={data.producto}
                            onChange={handleChange}
                            placeholder=""
                            autoFocus
                        />
                    </FloatingLabel>
                    <FloatingLabel controlId="costo" label="Costo (S/)">
                        <Form.Control
                            type="number"
                            step={0.01}
                            name="costo"
                            value={data.costo}
                            onChange={handleChange}
                            placeholder=""
                        />
                    </FloatingLabel>
                </Modal.Body>
            </fieldset>
            <Modal.Footer>
                <Button
                    variant="secondary"
                    onClick={handleClose}
                >
                    Cerrar
                </Button>
                {operation === "Registrar" || operation === "Modificar"
                    ? data.producto !== "" && data.costo > 0 && (
                        <Button
                            variant={variant[operation]}
                            onClick={() => handleSubmit(data)}
                        >
                            {operation}
                        </Button>
                    )
                    : <Button
                        variant={variant[operation]}
                        onClick={() => handleSubmit(data)}
                    >
                        {operation}
                    </Button>
                }
            </Modal.Footer>
        </Modal>
    )
}