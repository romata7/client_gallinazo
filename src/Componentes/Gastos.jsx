import React, { useEffect, useState } from "react";
import moment from "moment";
import { Modal, Button } from "react-bootstrap";
import axios from "axios";
import API_BASE_URL from "../config";
import { Pencil, Trash } from "react-bootstrap-icons";

function Gastos() {
  const [key, setKey] = useState(0);
  const [fi, setFi] = useState(
    moment().startOf("day").format("YYYY-MM-DDTHH:mm")
  );
  const [ff, setFf] = useState(
    moment().endOf("day").format("YYYY-MM-DDTHH:mm")
  );
  const handleFiChange = (e) => {
    setFi(moment(e.target.value).format("YYYY-MM-DDTHH:mm"));
    setKey((prev) => prev + 1);
  };

  // Manejar cambios en el input de fecha de fin
  const handleFfChange = (e) => {
    setFf(moment(e.target.value).format("YYYY-MM-DDTHH:mm"));
    setKey((prev) => prev + 1);
  };

  const [gasto, setGasto] = useState({ cant: 1, concepto: "", costo: 0.0 });
  const [showModalGasto, setShowModalGasto] = useState(false);
  const [operacion, setOperacion] = useState("Agregar");

  const handleOpenGastoModal = () => {
    setShowModalGasto(true);
  };
  const handleCloseGastoModal = () => {
    setShowModalGasto(false);
  };
  const handleAgregarGasto = async () => {
    //Enviar datos
    try {
      const response = await axios.post(`${API_BASE_URL}/api/gastos`, {
        gasto,
      });
    } catch (error) {
      console.error(error);
    }
    setShowModalGasto(false);
    setGasto({ cant: 1, concepto: "", costo: 0.0 });
    update();
  };
  const handleModificarGasto = async () => {
    try {
      const response = await axios.put(`${API_BASE_URL}/api/gastos`, { gasto });
    } catch (error) {
      console.error(error);
    }
    setShowModalGasto(false);
    setGasto({ cant: 1, concepto: "", costo: 0.0 });
    update();
    setOperacion("Agregar");
  };

  const handleEliminarGasto = async () => {
    try {
      const response = await axios.delete(
        `${API_BASE_URL}/api/gastos/${gasto.id_reg_gasto}`
      );
    } catch (error) {
      console.error(error);
    }
    setShowModalGasto(false);
    setGasto({ cant: 1, concepto: "", costo: 0.0 });
    update();
    setOperacion("Agregar");
  };

  const [gastos, setGastos] = useState([]);
  const [gastosAll, setGastosAll] = useState([]);

  const [ingresos, setIngresos] = useState([]);
  const [totalIngreso, setTotalIngreso] = useState(0);

  const fetchGastos = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/gastos`, {
        params: { fi, ff },
      });
      setGastos(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchGastosAll = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/gastos/all`, {
        params: { fi, ff },
      });
      setGastosAll(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchComandas = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/comandas/activas`, {
        params: { fi, ff },
      });
      const sumaPorTipoPago = {};
      let sumaTotal = 0;

      // Iterar sobre cada comanda
      response.data.forEach((comanda) => {
        const tipoPago = comanda.tipo_pago.toLowerCase(); // Normalizar el tipo de pago
        const total = parseFloat(comanda.total); // Convertir el total a número

        // Sumar al tipo de pago correspondiente
        if (!sumaPorTipoPago[tipoPago]) {
          sumaPorTipoPago[tipoPago] = 0; // Inicializar si no existe
        }
        sumaPorTipoPago[tipoPago] += total; // Acumular el total

        // Sumar al total general
        sumaTotal += total;
      });

      // Mostrar resultados
      setIngresos(sumaPorTipoPago);
      setTotalIngreso(sumaTotal);
    } catch (error) {
      console.error(error);
    }
  };

  const update = () => {
    fetchGastos();
    fetchComandas();
    fetchGastosAll();
  };

  useEffect(() => {
    update();
  }, [fi, ff]);

  const modificarGasto = (g) => {
    setOperacion("Modificar");
    setGasto(g);
  };
  const eliminarGasto = (g) => {
    setOperacion("Eliminar");
    setGasto(g);
  };

  const calcularTotalGasto = () => {
    return gastos.reduce((acc, g) => {
      return acc + Number(g.cant) * Number(g.costo);
    }, 0);
  };

  return (
    <>
      <div className="row p-2">
        <div className="col-12 col-sm-12 col-md-4 col-lg-3 col-xl-3 col-xxl-2 mb-2 d-print-none">
          <div className="mb-2">
            <div>
              <h3 className="text-center">{operacion} Gasto</h3>
              <div
                style={{
                  pointerEvents: operacion === "Eliminar" ? "none" : "auto",
                  color: operacion === "Eliminar" ? "gray" : "black",
                  opacity: operacion === "Eliminar" ? "0.7" : "1",
                }}
              >
                <div className="form-floating mb-2">
                  <input
                    type="number"
                    min={0}
                    placeholder=""
                    className="form-control"
                    required
                    autoFocus
                    value={gasto.cant}
                    onChange={(e) =>
                      setGasto((prev) => ({
                        ...prev,
                        cant: Number(e.target.value),
                      }))
                    }
                  />
                  <label htmlFor="">Cantidad</label>
                </div>
                <div className="form-floating mb-2">
                  <input
                    type="text"
                    placeholder=""
                    className="form-control"
                    required
                    autoFocus
                    value={gasto.concepto}
                    onChange={(e) =>
                      setGasto((prev) => ({
                        ...prev,
                        concepto: e.target.value,
                      }))
                    }
                  />
                  <label htmlFor="">Concepto</label>
                </div>
                <div className="form-floating mb-2">
                  <input
                    type="number"
                    step={0.01}
                    min={0}
                    placeholder=""
                    className="form-control"
                    value={gasto.costo}
                    onChange={(e) =>
                      setGasto((prev) => ({
                        ...prev,
                        costo: parseFloat(e.target.value) || 0,
                      }))
                    }
                  />
                  <label htmlFor="">Costo Unitario (S/.)</label>
                </div>
              </div>
              <div className="d-flex justify-content-evenly mb-2">
                <button
                  className="btn btn-warning"
                  onClick={() => window.location.reload()}
                >
                  {operacion === "Agregar" ? "Limpiar" : "Cancelar"}
                </button>
                {gasto.concepto && gasto.costo > 0 && (
                  <button
                    className={`btn ${operacion === "Agregar"
                      ? "btn-primary"
                      : operacion === "Modificar"
                        ? "btn-success"
                        : "btn-danger"
                      }`}
                    onClick={handleOpenGastoModal}
                  >
                    {operacion}
                  </button>
                )}
              </div>
            </div>
            {showModalGasto && (
              <Modal show={showModalGasto} onHide={handleCloseGastoModal}>
                <Modal.Body>
                  <h3 className="text-center">{operacion} Gasto</h3>
                  <table style={{ width: "100%" }}>
                    <tbody>
                      <tr>
                        <td>{gasto.cant}</td>
                        <td>{gasto.concepto}</td>
                        <td>S/{Number(gasto.costo).toFixed(2)}</td>
                      </tr>
                    </tbody>
                  </table>
                </Modal.Body>
                <Modal.Footer>
                  <Button variant="secondary" onClick={handleCloseGastoModal}>
                    Cerrar
                  </Button>
                  <Button
                    variant={`${operacion === "Agregar"
                      ? "primary"
                      : operacion === "Modificar"
                        ? "success"
                        : "danger"
                      }`}
                    onClick={
                      operacion === "Agregar"
                        ? handleAgregarGasto
                        : operacion === "Modificar"
                          ? handleModificarGasto
                          : handleEliminarGasto
                    }
                  >
                    {operacion}
                  </Button>
                </Modal.Footer>
              </Modal>
            )}
          </div>
          <div className="card mb-2">
            <div className="card-body">
              <h2 className="text-center">Filtro por Fechas</h2>
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
          <div>
            <div className="input-group mb-2">
              <span className="input-group-text">Total Gasto:</span>
              <input
                style={{ textAlign: "right", fontWeight: "bold" }}
                type="text"
                className="form-control"
                value={`S/${Number(calcularTotalGasto()).toFixed(2)}`}
                readOnly
              />
            </div>
            <div className="">
              <table className="table table-sm">
                <tbody>
                  {Object.entries(ingresos).map(([tipo, suma]) => (
                    <tr key={tipo}>
                      <td>{tipo.charAt(0).toUpperCase() + tipo.slice(1)}</td>
                      <td style={{ textAlign: "right" }}>
                        S/{suma.toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="input-group mb-2">
                <span className="input-group-text">Total Ingreso:</span>
                <input
                  type="text"
                  readOnly
                  style={{ textAlign: "right", fontWeight: "bold" }}
                  value={`S/${Number(totalIngreso).toFixed(2)}`}
                  className="form-control"
                />
              </div>
              <div className="input-group mb-2">
                <span className="input-group-text">Diferencia:</span>
                <input
                  type="text"
                  readOnly
                  style={{
                    textAlign: "right",
                    fontWeight: "bold",
                    color: `${totalIngreso - calcularTotalGasto() < 0 ? "red" : "blue"
                      }`,
                  }}
                  value={`S/${Number(
                    totalIngreso - calcularTotalGasto()
                  ).toFixed(2)}`}
                  className="form-control"
                />
              </div>
            </div>
          </div>
        </div>
        <div className="col-12 col-sm-12 col-md-8 col-lg-9 col-xl-9 col-xxl-10">
          <div>
            <table className="table table-sm">
              <thead className="table-dark">
                <tr>
                  <th>[{gastos.length}]</th>
                  <th></th>
                  <th>Cant.</th>
                  <th>Concepto</th>
                  <th style={{ textAlign: "right" }}>Costo</th>
                  <th>Total</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {gastos.map((g) => (
                  <tr key={g.id_reg_gasto}>
                    <td>{g.id_reg_gasto}</td>
                    <td>{moment(g.fecha).format("YYYY-MM-DD HH:mm:ss")}</td>
                    <td>{Number(g.cant)}</td>
                    <td>{g.concepto}</td>
                    <td style={{ textAlign: "right" }}>S/{g.costo}</td>
                    <td style={{ textAlign: "right", fontWeight: "bold" }}>
                      S/{(Number(g.costo) * Number(g.cant)).toFixed(2)}
                    </td>
                    <td>
                      <div className="d-flex justify-content-center gap-2">
                        <Button
                          size="sm"
                          variant="warning"
                          onClick={() => modificarGasto(g)}
                        >
                          <Pencil />
                        </Button>
                        <Button
                          size="sm"
                          variant="danger"
                          onClick={() => eliminarGasto(g)}
                        >
                          <Trash />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div>
            <table className="table table-sm">
              <thead>
                <tr>
                  <th>[{gastosAll.length}]</th>
                  <th>Operación</th>
                  <th>Fecha</th>
                  <th>Cant.</th>
                  <th>Concepto</th>
                  <th style={{ textAlign: "right" }}>Costo</th>
                  <th style={{ textAlign: "right" }}>Total</th>
                </tr>
              </thead>
              <tbody>
                {gastosAll.map((g) => (
                  <tr key={g.id_reg_gasto}>
                    <td>
                      {g.id_reg_gasto}{" "}
                      {g.origen > 0 ? <del>{g.origen}</del> : ``}
                    </td>
                    <td
                      style={{
                        color: `${g.operacion === "Eliminado"
                          ? "red"
                          : g.operacion === "Modificado"
                            ? "blue"
                            : "black"
                          }`,
                      }}
                    >
                      {g.operacion}
                    </td>
                    <td>{moment(g.fecha).format("YYYY-MM-DD HH:mm:ss")}</td>
                    <td>{g.cant}</td>
                    <td>{g.concepto}</td>
                    <td style={{ textAlign: "right" }}>S/{g.costo}</td>
                    <td style={{ textAlign: "right" }}>
                      S/{Number(g.costo * g.cant).toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}

export default Gastos;
