import React from "react";
import moment from "moment";
import { useGlobalContext } from "../Contexts/GlobalContext";

function DetallesCliente({ c = {
    id_comanda: 0,
    mesa: "",
    cliente: "",
    mozo: "",
    tipo_pago: "",
    notas_comanda: "",
    total: 0,
    origen: 0,
    items: [],
} }) {
    const { shopFullName } = useGlobalContext();
    return (
        <small>
            <div style={{ color: "black" }}>
                <div style={{ position: "relative" }}>
                    <div
                        style={{
                            position: "relative", // Mantiene el contenido en primer plano
                            zIndex: 1, // Asegura que el contenido esté encima del sello
                        }}
                    >
                        <div
                            style={{
                                textAlign: "center",
                                fontWeight: "bold",
                                fontSize: "1.5rem",
                                whiteSpace: "nowrap",
                                lineHeight: "1",
                            }}
                        >
                            {shopFullName} {c.origen === 0
                                ? `#${c.id_comanda}`
                                : <>
                                    <del>#{c.origen}</del> #{c.id_comanda}
                                </>
                            }
                        </div>
                        <div
                            style={{ textAlign: "center", whiteSpace: "nowrap", lineHeight: "1" }}
                        >
                            {moment().format("YYYY-MM-DD HH:mm:ss")}
                        </div>
                        <div style={{fontSize:"10px"}}>
                            <table style={{ lineHeight: "1", textTransform: "capitalize" }}>
                                <tbody>
                                    <tr>
                                        <td>Mesa</td>
                                        <td>: {c.mesa}</td>
                                    </tr>
                                    <tr>
                                        <td>Cliente</td>
                                        <td>: {c.cliente}</td>
                                    </tr>
                                    <tr>
                                        <td>Mozo</td>
                                        <td>: {c.mozo}</td>
                                    </tr>
                                </tbody>
                            </table>
                            <table
                                style={{
                                    lineHeight: "1.0",
                                    textTransform: "capitalize",
                                    width: "100%",
                                }}
                            >
                                <thead>
                                    <tr style={{ borderBottom: "1px solid" }}>
                                        <th style={{ textAlign: "left" }}>Cant</th>
                                        <th>Producto</th>
                                        <th style={{ textAlign: "right" }}>Costo</th>
                                        <th style={{ textAlign: "right" }}>SubTotal</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {c.items
                                        .filter(({ producto }) => producto !== "")
                                        .map((i, index) => (
                                            <tr key={index} style={{ borderBottom: "1px solid" }}>
                                                <td style={{ textAlign: "left" }}>{i.cant}</td>
                                                <td>
                                                    {i.producto}
                                                    {i.notas_producto && i.notas_producto !== "" && (
                                                        <strong>({i.notas_producto})</strong>
                                                    )}
                                                </td>
                                                <td style={{ textAlign: "right", whiteSpace: "nowrap" }}>
                                                    S/ {Number(i.costo).toFixed(2)}
                                                </td>
                                                <td style={{ textAlign: "right", whiteSpace: "nowrap" }}>
                                                    S/ {(i.costo * i.cant).toFixed(2)}
                                                </td>
                                            </tr>
                                        ))}
                                </tbody>
                            </table>
                            <div className="d-flex justify-content-between">
                                <div style={{ fontWeight: "bold", fontStyle: "italic" }}>
                                    {c.notas_comanda}
                                </div>
                                <div style={{ fontWeight: "bold" }}>Total: S/ {c.total}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </small>
    );
}

export default DetallesCliente;
