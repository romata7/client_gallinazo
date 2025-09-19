import React, { useEffect, useState } from "react";
import moment from "moment";
import axios from "axios";
import API_BASE_URL from "../config";

function Resumen() {
  const [productos_vendidos, setProductos_vendidos] = useState([]);
  const [productos_x_mozo, setProductos_x_mozo] = useState([]);

  const [fi, setFi] = useState(
    moment().startOf("day").format("YYYY-MM-DDTHH:mm")
  );
  const [ff, setFf] = useState(
    moment().endOf("day").format("YYYY-MM-DDTHH:mm")
  );

  const [key, setKey] = useState(0);
  // Manejar cambios en el input de fecha de inicio
  const handleFiChange = (e) => {
    setFi(moment(e.target.value).format("YYYY-MM-DDTHH:mm"));
    setKey((prev) => prev + 1);
  };

  // Manejar cambios en el input de fecha de fin
  const handleFfChange = (e) => {
    setFf(moment(e.target.value).format("YYYY-MM-DDTHH:mm"));
    setKey((prev) => prev + 1);
  };

  const fetchData = async () => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/api/resumen/productos_vendidos`,
        { params: { fi: fi, ff: ff } }
      );
      setProductos_vendidos(response.data);
    } catch (error) {
      console.error(error);
    }
  };
  const fetchProductos_x_mozos = async () => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/api/resumen/productos_x_mozo`,
        { params: { fi: fi, ff: ff } }
      );
      setProductos_x_mozo(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchData();
    fetchProductos_x_mozos();
  }, [fi, ff]);

  // Función para calcular la recaudación total por tipo de pago
  const calcularRecaudacionPorMozo = (datos) => {
    return datos.reduce((acc, px) => {
      const tipoPago = px.tipo_pago;
      const total = parseFloat(px.total);

      if (!acc[tipoPago]) {
        acc[tipoPago] = 0;
      }
      acc[tipoPago] += total;

      return acc;
    }, {});
  };

  const calcularTotalVentas = (productos) => {
    return productos.reduce((acc, mozo) => {
      return (
        acc +
        mozo.datos.reduce((accDatos, comanda) => {
          return accDatos + parseFloat(comanda.total);
        }, 0)
      );
    }, 0);
  };

  const total_x_mozo = (datos) => {
    return datos.reduce((acc, dato) => acc + Number(dato.total), 0);
  };

  // Función para calcular la suma por tipo de pago
  const calcularTotalPorTipoPago = (productos) => {
    let total_x_tipo_pago = {};
    const a = productos.forEach((mozo) => {
      mozo.datos.forEach((dato) => {
        if (!total_x_tipo_pago[dato.tipo_pago]) {
          total_x_tipo_pago[dato.tipo_pago] = 0;
        }
        total_x_tipo_pago[dato.tipo_pago] += parseFloat(dato.total);
      });
    });
    return Object.entries(total_x_tipo_pago);
  };

  return (
    <>
      <div className="row p-2">
        <div className="col-12 col-sm-12 col-md-4 col-lg-3 col-xl-3 col-xxl-2 mb-2 d-print-none">
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
          <div className="mb-2">
            <h3 className="text-center">Top Productos Vendidos</h3>
            <table className="table table-sm mb-2">
              <thead className="table-dark">
                <tr>
                  <th>Producto</th>
                  <th className="text-center">Unidades Vendidas</th>
                </tr>
              </thead>
              <tbody>
                {productos_vendidos.map((p, index) => (
                  <tr key={index}>
                    <td>{p.producto}</td>
                    <td className="text-center">{p.total_vendido}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mb-2">
            <h3 className="text-center">Ventas por Mozo</h3>
            <table className="table table-2 table-sm mb-2">
              <thead className="table-dark">
                <tr>
                  <th>Mozo</th>
                  <th>Comanda</th>
                  <th>Productos</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                {productos_x_mozo.map((p, index) =>
                  p.datos.map((px, indexx) => {
                    const recaudacion = calcularRecaudacionPorMozo(p.datos);
                    const key = Date.now();
                    return (
                      <tr key={`Mozo_${index}_Comanda_${indexx}`}>
                        {indexx === 0 && (
                          <td rowSpan={p.datos.length}>
                            <div>{p.mozo}</div>
                            <div>
                              <ul>
                                {Object.entries(recaudacion).map(
                                  ([tipo, total], index) => (
                                    <li
                                      key={`Mozo_${index}_Comanda_${indexx}_recaudacion_${key}_index`}
                                    >
                                      {tipo}: S/{total.toFixed(2)}
                                    </li>
                                  )
                                )}
                              </ul>
                              <div style={{ fontWeight: "bold" }}>
                                Total: S/{total_x_mozo(p.datos).toFixed(2)}
                              </div>
                            </div>
                          </td>
                        )}
                        <td>
                          <div>
                            <strong>ID Comanda:</strong> {px.id_comanda}
                          </div>
                          {px.origen !== 0 && (
                            <div>
                              <strong>Origen:</strong> {px.origen}
                            </div>
                          )}
                          {px.mesa && (
                            <div>
                              <strong>Mesa:</strong> {px.mesa}
                            </div>
                          )}
                          {px.cliente && (
                            <div>
                              <strong>Cliente:</strong> {px.cliente}
                            </div>
                          )}
                          <div>
                            <strong>Fecha:</strong>{" "}
                            {moment(px.fecha).format("YYYY-MM-DD HH:mm:ss")}
                          </div>
                          {px.notas_comanda && (
                            <div>
                              <strong>Notas:</strong> {px.notas_comanda}
                            </div>
                          )}
                        </td>
                        <td>
                          <table style={{ width: "100%" }}>
                            <tbody>
                              {px.datos.map((py, indexy) => (
                                <tr
                                  key={`Comanda_${px.id_comanda}_Producto_${indexy}`}
                                >
                                  <td>{py.cant}</td>
                                  <td>{py.producto}</td>
                                  <td style={{ textAlign: "right" }}>
                                    S/ {py.costo}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </td>
                        <td style={{ textAlign: "right" }}>
                          <div style={{ fontStyle: "italic" }}>
                            {px.tipo_pago}
                          </div>
                          <div style={{ fontWeight: "bold" }}>
                            S/ {px.total}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
            <div
              style={{
                fontWeight: "bold",
                fontSize: "3rem",
                textAlign: "right",
              }}
            >
              S/{calcularTotalVentas(productos_x_mozo).toFixed(2)}
            </div>
          </div>
          <div>
            {calcularTotalPorTipoPago(productos_x_mozo).map((el, indexz) => (
              <div key={indexz} style={{ textAlign: "right" }}>
                {el[0]}:<strong> S/{el[1].toFixed(2)}</strong>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

export default Resumen;
