import { Table } from "react-bootstrap"
import { Fechas } from "./Fechas"
import { format } from "date-fns"

export const Historial = ({
    list = [],
    headers = ['fecha', 'id', 'operacion', 'producto', 'costo', 'orden'],
}) => {
    return (
        <div className="font-monospace">
            <Fechas />
            {list.length === 0 && (
                <Alert>Sin datos...</Alert>
            )}
            {list.length > 0 && (
                <Table borderless hover size="sm" responsive="sm">
                    <tbody>
                        {list.map(item => (
                            <tr key={item.id}
                                className="small"
                            >
                                {headers.map(head => (
                                    head === 'fecha'
                                        ? <td
                                            className="small text-muted"
                                        >
                                            {format(item[head], 'yyyy/MM/dd HH:mm:ss')}
                                        </td>
                                        : head === 'costo'
                                            ? <td
                                                className="text-success"
                                            >
                                                S/{parseFloat(item[head]).toFixed(2)}
                                            </td>
                                            : <td>
                                                {item[head]}
                                            </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </Table>
            )}
        </div>
    )
}