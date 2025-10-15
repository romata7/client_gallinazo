import { Alert, Button, Table } from "react-bootstrap"

export const ListaMozos = ({
    lista = [],
    modificar,
    eliminar,
    subir,
    bajar,
}) => {
    return (
        <div>
            {lista.length === 0 && (
                <Alert>Sin datos...</Alert>
            )}
            {lista.length > 0 && (
                <Table
                    size="sm"
                    borderless
                    responsive="sm"
                    hover
                >
                    <tbody>
                        {lista.map(item => (
                            <tr key={item.id}>
                                <td className="d-flex gap-1 justify-content-center">
                                    <Button
                                        size="sm"
                                        variant="outline-primary"
                                        className="px-1 py-0"
                                        onClick={() => subir(item)}
                                    >
                                        ↑
                                    </Button>
                                    <Button
                                        size="sm"
                                        variant="outline-secondary"
                                        className="px-1 py-0"
                                        onClick={() => bajar(item)}
                                    >
                                        ↓
                                    </Button>
                                </td>
                                <td className="fw-bold">#{item.id}</td>
                                <td>{item.dni}</td>
                                <td>{item.mozo}</td>
                                <td>{item.direccion}</td>
                                <td>{item.telefono}</td>
                                <td
                                    className="d-flex gap-2 justify-content-center"
                                >
                                    <Button
                                        size="sm"
                                        variant="outline-warning"
                                        className="px-1 py-0"
                                        onClick={() => modificar(item)}
                                    >
                                        ✎
                                    </Button>
                                    <Button
                                        ize="sm"
                                        variant="outline-danger"
                                        className="px-1 py-0"
                                        onClick={() => eliminar(item)}
                                    >
                                        ✘
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            )}
        </div>
    )
}