import { Alert, Button, Table } from "react-bootstrap"
import { useGlobalContext } from "../../Contexts/GlobalContext"

export const List = ({
    list = [],
    headers = ['orden', 'producto', 'costo'],
    subir,
    bajar,
    abrirModal
}) => {
    const { subirProducto, bajarProducto } = useGlobalContext();
    return (
        <div
            className="font-monospace"
        >
            {list.length === 0 && (
                <Alert>
                    Sin Datos...
                </Alert>
            )}
            {list.length > 0 && (
                <Table
                    hover
                    borderless
                    size="sm"
                    responsive="sm"
                >
                    <tbody>
                        {list.map(item => (
                            <tr key={item.id}>
                                <td
                                    className="d-flex gap-1 justify-content-center"
                                >
                                    <Button
                                        size="sm"
                                        variant="outline-primary"
                                        className="px-1 py-0"
                                        title="Subir orden"
                                        onClick={() => subir(item)}
                                    >
                                        ↑
                                    </Button>
                                    <Button
                                        size="sm"
                                        variant="outline-secondary"
                                        title="Bajar orden"
                                        className="px-1 py-0"
                                        onClick={() => bajar(item)}
                                    >
                                        ↓
                                    </Button>
                                </td>
                                {headers.map(head => (
                                    head === "orden"
                                        ? <td className="text-primary" key={`${item.id}_${item[head]}`}>{`#${item[head]}`}</td>
                                        : head === "costo"
                                            ? <td className="text-success text-end" key={`${item.id}_${item[head]}`}>{`S/${parseFloat(item[head]).toFixed(2)}`}</td>
                                            : <td key={`${item.id}_${item[head]}`}>{item[head]}</td>
                                ))}
                                <td
                                    className="d-flex gap-2 justify-content-center"
                                >
                                    <Button
                                        size="sm"
                                        variant="outline-warning"
                                        className="px-1 py-0"
                                        title="Modificar"
                                        onClick={() => abrirModal('Modificar', 'Productos', item)}
                                    >
                                        ✎
                                    </Button>
                                    <Button
                                        size="sm"
                                        variant="outline-danger"
                                        className="px-1 py-0"
                                        title="Eliminar"
                                        onClick={() => abrirModal('Eliminar', 'Productos', item)}
                                    >
                                        ×
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