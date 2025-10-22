import { useState } from "react"
import { Button, FloatingLabel, Form, InputGroup, Table } from "react-bootstrap"

const default_data = {
    mozo: "",
    mesa: "",
    cliente: "",
    tipopago: "",
    detalles: "",
    items: [],
}

export const Comandas = ({

}) => {
    const [data, setData] = useState(default_data)
    return (
        <div>
            <FloatingLabel controlId="mozo" label="Mozo">
                <Form.Control
                    type="text"
                    name="mozo"
                    placeholder=""
                />
            </FloatingLabel>
            <FloatingLabel controlId="mesa" label="Mesa">
                <Form.Control
                    type="text"
                    name="mesa"
                    placeholder=""
                />
            </FloatingLabel>
            <FloatingLabel controlId="cliente" label="Cliente">
                <Form.Control
                    type="text"
                    name="cliente"
                    placeholder=""
                />
            </FloatingLabel>
            <FloatingLabel controlId="tipopago" label="Tipo de pago">
                <Form.Control
                    type="text"
                    name="tipopago"
                    placeholder=""
                />
            </FloatingLabel>
            <FloatingLabel controlId="detalles" label="Detalles">
                <Form.Control
                    type="text"
                    name="detalles"
                    placeholder=""
                />
            </FloatingLabel>
            <Table
                size="sm"
                responsive="sm"
                borderless
                hover
            >
                <tbody>
                    <tr>
                        <td>
                            <div className="d-flex gap-2 justify-content-center align-items-center">
                                <Button
                                    size="sm"
                                    variant="outline-primary"
                                >
                                    +
                                </Button>
                                <span>99</span>
                                <Button
                                    size="sm"
                                    variant="outline-danger"
                                >
                                    -
                                </Button>
                            </div>
                        </td>
                        <td>
                            <InputGroup size="sm">
                                <Form.Select>
                                    <option>Pollo</option>
                                    <option>Pollo entero mas ensaladas</option>
                                </Form.Select>
                                <InputGroup.Text>
                                    S/12.00
                                </InputGroup.Text>
                            </InputGroup>
                        </td>
                        <td>
                            <div className="d-flex gap-2 justify-content-center align-items-center">
                                <span>Total: S/12.00</span>
                                <Button>
                                    trash
                                </Button>
                            </div>
                        </td>
                    </tr>
                </tbody>
            </Table>
            <div className="">
                <div className="row">
                    <div className="col">
                        <InputGroup>
                            <Button variant="outline-primary" size="sm">
                                +
                            </Button>
                            <InputGroup.Text>1</InputGroup.Text>
                            <Button variant="outline-danger" size="sm">
                                -
                            </Button>
                        </InputGroup>
                    </div>
                    <div className="col ">
                        <InputGroup>
                            <Form.Select>
                                <option>Pollo</option>
                                <option>Pollo entero mas ensaladas</option>
                            </Form.Select>
                            <InputGroup.Text>
                                S/12.00
                            </InputGroup.Text>
                        </InputGroup>
                    </div>
                    <div className="col col-auto">
                        <InputGroup>
                            <InputGroup.Text>Total:</InputGroup.Text>
                            <InputGroup.Text>S/12.00</InputGroup.Text>
                            <Button size="sm" variant="outline-danger">✘</Button>
                        </InputGroup>
                    </div>

                </div>
            </div>
        </div>
    )
}