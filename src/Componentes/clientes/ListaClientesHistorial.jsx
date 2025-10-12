import { Alert, Table } from "react-bootstrap"
import { Fechas } from "../commons/Fechas"

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

export const ListaClientesHistorial = ({
    lista = [],
    procesar
}) => {
    return (
        <div className="small">
            <Fechas
                procesar={procesar}
            />
            {lista.length === 0 && (
                <Alert>Sin datos...</Alert>
            )}
            {lista.length > 0 && (
                <Table
                    size="sm"
                    responsive
                    borderless
                    hover
                >
                    <tbody>
                        {lista.map(item => (
                            <tr key={item.id}>
                                <td>{item.id}</td>
                                <td className="small text-muted text-nowrap">{item.fecha}</td>
                                <td className={`${variant[item.operacion]} text-center`}>{operacion[item.operacion]}</td>
                                <td>{item.orden}</td>
                                <td>{item.dniruc}</td>
                                <td>{item.name}</td>
                                <td>{item.address}</td>
                                <td>{item.phone}</td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            )}
        </div>
    )
}