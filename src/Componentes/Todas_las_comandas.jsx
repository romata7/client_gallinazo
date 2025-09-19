import React, { useEffect, useState } from "react";
import axios from "axios";
import moment from "moment";
import API_BASE_URL from "../config";
import { useMyContext } from "../Contexts/MyContext";

function Todas_las_comandas() {
  const [fi, setFi] = useState(
    moment().startOf("month").format("YYYY-MM-DDTHH:mm")
  );
  const [ff, setFf] = useState(
    moment().endOf("month").format("YYYY-MM-DDTHH:mm")
  );
  const [comandas, setComandas] = useState([]);
  const { get_resumen } = useMyContext();

  // Cargar comandas con las fechas establecidas
  const fetchComandas = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/comandas`, {
        params: { fi: fi, ff: ff },
      });
      setComandas(response.data);
    } catch (error) {
      console.error("Error fetching comandas:", error);
    }
  };
  useEffect(() => {
    fetchComandas();
  }, [fi, ff]);

  // Manejar cambios en el input de fecha de inicio
  const handleFiChange = (e) => {
    setFi(moment(e.target.value).format("YYYY-MM-DDTHH:mm"));
  };

  // Manejar cambios en el input de fecha de fin
  const handleFfChange = (e) => {
    setFf(moment(e.target.value).format("YYYY-MM-DDTHH:mm"));
  };

  return (
    <>
      <div className="row p-2">
        <div className="col-12 col-sm-12 col-md-4 col-lg-3 col-xl-3 col-xxl-2 mb-2">
          <div className="card">
            <div className="card-body">
              <h2 className="text-center">Filtro Fechas</h2>
              <div className="form-floating mb-3">
                <input
                  type="datetime-local"
                  className="form-control"
                  id="fechaInicio"
                  value={fi}
                  onChange={handleFiChange}
                />
                <label htmlFor="fechaInicio">Fecha Inicio</label>
              </div>
              <div className="form-floating mb-3">
                <input
                  type="datetime-local"
                  className="form-control"
                  id="fechaFin"
                  value={ff}
                  onChange={handleFfChange}
                />
                <label htmlFor="fechaFin">Fecha Fin</label>
              </div>
            </div>
          </div>
        </div>
        <div className="col-12 col-sm-12 col-md-8 col-lg-9 col-xl-9 col-xxl-10">
          <table className="table table-sm table-hover">
            <thead className="table-dark">
              <tr>
                <th>#</th>
                <th>Comanda</th>
                <th>Productos</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>              
              {comandas.map((c) => (
                <tr key={c.id_comanda} className="small">
                  <td>
                    <div className="fw-bold">{c.id_comanda}</div>
                    <div>
                      <s>{c.origen === 0 ? "" : c.origen}</s>
                    </div>
                    <div>{c.activo ? "true" : "false"}</div>
                  </td>
                  <td>
                    <div>{moment(c.fecha).format("YYYY-MM-DD HH:mm:ss")}</div>
                    {c.mesa && <div className="fw-bold">{c.mesa}</div>}
                    {c.mozo && <div className="fw-bold">Mozo: {c.mozo}</div>}
                    {c.cliente && (
                      <div className="fw-bold">Cliente: {c.cliente}</div>
                    )}
                    {c.notas_comanda && <div>Notas: {c.notas_comanda}</div>}
                    <div
                      style={{
                        fontStyle: "italic",
                        fontWeight: "bold",
                        color:
                          c.operacion === "Modificado"
                            ? "blue"
                            : c.operacion === "Eliminado"
                              ? "red"
                              : "inherit",
                      }}
                    >
                      {c.operacion}
                    </div>
                  </td>
                  <td>
                    <table
                      style={{
                        lineHeight: "1.0",
                        textTransform: "capitalize",
                        width: "100%",
                      }}
                    >
                      <thead></thead>
                      <tbody>
                        <tr className="text-center fw-bold">
                          <td colSpan={4}>{get_resumen(c.items)}</td>
                        </tr>
                        {c.items.map((i, index) => (
                          <tr key={index} style={{ borderBottom: "1px solid" }}>
                            <td style={{ textAlign: "left" }}>{i.cant}</td>
                            <td>
                              {i.producto}
                              {i.notas_producto && i.notas_producto !== "" && (
                                <strong>({i.notas_producto})</strong>
                              )}
                            </td>
                            <td
                              style={{
                                textAlign: "right",
                                whiteSpace: "nowrap",
                              }}
                            >
                              S/ {Number(i.costo).toFixed(2)}
                            </td>
                            <td
                              style={{
                                textAlign: "right",
                                whiteSpace: "nowrap",
                              }}
                            >
                              S/ {(i.costo * i.cant).toFixed(2)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </td>
                  <td style={{ textAlign: "right" }}>
                    <div>{c.tipo_pago}</div>
                    <div className="fw-bold">S/ {c.total}</div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

export default Todas_las_comandas;
