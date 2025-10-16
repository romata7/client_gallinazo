import { Alert, Table } from "react-bootstrap"
import { Fechas } from "../commons/Fechas"
import {format} from 'date-fns'

const operacion = {
    SUBE: '↑',
    BAJA: '↓',
    AGREGADO: 'Agregado',
    MODIFICADO: 'Modificado',
    ELIMINADO: 'Eliminado',
}
const variant = {
    SUBE: 'text-primary',
    BAJA: 'text-danger',
    AGREGADO: 'text-success',
    MODIFICADO: 'text-warning',
    ELIMINADO: 'text-danger',
}

export const ListaGastosHistorial = ({
    lista = [],
    procesar,
}) => {
    return (
        <div>
            <Fechas procesar={procesar} />
            {lista.length === 0 && (
                <Alert>Sin datos...</Alert>
            )}
            {lista.length > 0 && (
                <Table size="sm" responsive="sm" borderless hover>
                    <tbody>
                        {lista.map(item => (
                            <tr key={item.id}>
                                <td>{item.id}</td>
                                <td className="small text-muted text-nowrap">{format(item.fecha, 'yyyy-MM-dd HH:mm:ss')}</td>
                                <td className="fw-bold">#{item.id_gasto}</td>
                                <td className={`${variant[item.operacion]} text-center`}>{operacion[item.operacion]}</td>
                                <td>{item.gasto}</td>
                                <td>{item.detalles}</td>
                                <td className="text-entd">{parseFloat(item.costo).toFixed(2)}</td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            )}
        </div>
    )
}