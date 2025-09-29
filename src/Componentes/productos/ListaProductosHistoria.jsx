import { Alert, Table } from "react-bootstrap"
import API_BASE_URL from "../../config"
import { Fechas } from '../commons/Fechas'
import axios from "axios"
import { format } from "date-fns"

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

export const ListaProductosHistorial = ({
    lista = [],
    procesar
}) => {    
    return (
        <div>
            <Fechas
                procesar={procesar}
            />
            {lista.length === 0 && (
                <Alert>
                    Sin datos...
                </Alert>
            )}
            {lista.length > 0 && (
                <Table
                    hover
                    borderless
                    size="sm"
                    className="small"
                    responsive="sm"
                >
                    <tbody>
                        {lista.map(item => (
                            <tr key={item.id}>
                                <td className="text-nowrap text-muted text-center">{format(item.fecha, 'MM-dd HH:mm')}</td>
                                <td className="text-primary fw-bold text-center">#{item.id}</td>
                                <td className={`${variant[item.operacion]} text-center`}>{operacion[item.operacion]}</td>
                                <td className="text-nowrap">{item.producto}</td>
                                <td className="text-success text-end">S/{parseFloat(item.costo).toFixed(2)}</td>
                                <td className="text-muted text-center text-nowrap">Orden {item.orden}</td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            )}
        </div>
    )
}