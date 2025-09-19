import moment from "moment"

const Prints = ({ prints }) => {    
    return (
        <div>
            {prints && (
                <div className="my-2 text-center">
                    <h4>Impresiones Realizadas</h4>
                    <table className="table table-hover table-sm">
                        <thead className="table-dark">
                            <tr>
                                <th scope="col">#</th>
                                <th scope="col">Fecha</th>
                                <th scope="col">#Comanda</th>
                                <th scope="col">Destino</th>
                            </tr>
                        </thead>
                        <tbody>
                            {prints.map(print => (
                                <tr key={print.id_print} className={print.destino === "Cocina" ? "table-warning": "table-primary"}>
                                    <th scope="row">{print.id_print}</th>
                                    <td>{moment(print.printingDate).format('YYYY-MM-DD HH:mm:ss')}</td>
                                    <td>{print.id_comanda}</td>
                                    <td className="fw-bold">{print.destino}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    )
}


export default Prints