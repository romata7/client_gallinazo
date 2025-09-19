import React, { useEffect, useState } from "react";
import axios from "axios";
import API_BASE_URL from "../config";
import { Modal, Button } from "react-bootstrap";
import moment from "moment";
import { Pencil, Trash } from "react-bootstrap-icons";

function Tipo_pagos() {
  const [showEditTipo_pago, setShowEditTipo_pago] = useState(false);
  const [showDeleteTipo_pago, setShowDeleteTipo_pago] = useState(false);
  const [p_p, setP_p] = useState({
    id_reg_tipo_pago: 0,
    tipo_pago: "",
  });
  const [p_aux, setP_aux] = useState({
    id_reg_tipo_pago: 0,
    tipo_pago: "",
  });
  const [tipo_pagos, setTipo_pagos] = useState([]);
  const [allTipo_pagos, setAllTipo_pagos] = useState([]);

  const fetchTipo_pagos = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/tipo_pagos/`);
      setTipo_pagos(response.data);
    } catch (error) {
      console.error(error);
    }
  };
  const fetchAllTipo_pagos = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/tipo_pagos/all`);
      setAllTipo_pagos(response.data);
    } catch (error) {
      console.error(error);
    }
  };
  const fetchLastID = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/tipo_pagos/last_id`);
      setP_p((prev) => ({
        ...prev,
        id_reg_tipo_pago: response.data.last_id + 1,
      }));
    } catch (error) {
      console.error("Error al obtener last_id_reg_tipo_pago", error);
    }
  };
  useEffect(() => {
    fetchLastID();
    fetchTipo_pagos();
    fetchAllTipo_pagos();
  }, []);

  const agregarTipo_pago = async () => {
    try {
      const response = await axios.post(`${API_BASE_URL}/api/tipo_pagos/agregar`, {
        tipo_pago: p_p,
      });
      setP_p({ id_reg_tipo_pago: 0, tipo_pago: "" });
      fetchLastID();
      fetchTipo_pagos();
      fetchAllTipo_pagos();
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    //
  }, [p_p]);

  const handleOpenEdit = (pp) => {
    setP_aux(pp);
    setShowEditTipo_pago(true);
  };
  const handleCloseEdit = () => {
    setShowEditTipo_pago(false);
    setP_aux({ id_reg_tipo_pago: 0, tipo_pago: "" });
  };
  const handleConfirmEdit = async (pp) => {
    setShowEditTipo_pago(false);
    try {
      const response = await axios.post(`${API_BASE_URL}/api/tipo_pagos/modificar`, {
        tipo_pago: p_aux,
      });
      setP_p({ id_reg_tipo_pago: 0, tipo_pago: "" });
      setP_aux({ id_reg_tipo_pago: 0, tipo_pago: "" });
      fetchLastID();
      fetchTipo_pagos();
      fetchAllTipo_pagos();
    } catch (error) {
      console.error(error);
    }
  };

  const handleOpenDelete = (pp) => {
    setP_aux(pp);
    setShowDeleteTipo_pago(true);
  };
  const handleCloseDelete = () => {
    setShowDeleteTipo_pago(false);
    setP_aux({ id_reg_tipo_pago: 0, tipo_pago: "" });
  };
  const handleConfirmDelete = async (pp) => {
    setShowDeleteTipo_pago(false);
    try {
      const response = await axios.post(`${API_BASE_URL}/api/tipo_pagos/eliminar`, {
        tipo_pago: p_aux,
      });
      setP_p({ id_reg_tipo_pago: 0, tipo_pago: "" });
      setP_aux({ id_reg_tipo_pago: 0, tipo_pago: "" });
      fetchLastID();
      fetchTipo_pagos();
      fetchAllTipo_pagos();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <div>
        <div className="row p-2">
          <div className="col-12 col-sm-12 col-md-4 col-lg-3 col-xl-3 col-xxl-2 mb-2">
            <div className="form-floating mb-2">
              <input
                type="text"
                className="form-control"
                placeholder=""
                value={p_p.tipo_pago}
                onChange={(e) =>
                  setP_p((prev) => ({ ...prev, tipo_pago: e.target.value }))
                }
              />
              <label htmlFor="floatingInput">Tipo_pago</label>
            </div>
            <div className="d-flex justify-content-evenly">
              <button
                className="btn btn-warning"
                onClick={() => window.location.reload()}
              >
                Limpiar
              </button>
              {p_p.tipo_pago !== "" && (
                <button className="btn btn-primary" onClick={agregarTipo_pago}>
                  Agregar
                </button>
              )}
            </div>
          </div>
          <div className="col-12 col-sm-12 col-md-8 col-lg-9 col-xl-9 col-xxl-10">
            <table className="table table-sm">
              <thead className="table-dark">
                <tr>
                  <th>#</th>
                  <th>Tipo_pago</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {tipo_pagos.map((p) => (
                  <tr key={p.id_reg_tipo_pago}>
                    <td className="fw-bold">
                      {p.origen === 0 ? (
                        <>{p.id_reg_tipo_pago}</>
                      ) : (
                        <>
                          <del>{p.origen}</del> {p.id_reg_tipo_pago}
                        </>
                      )}
                    </td>
                    <td>{p.tipo_pago}</td>
                    <td>
                      <div className="d-flex gap-2 justify-content-end">
                        <Button
                          size="sm"
                          variant="warning"
                          onClick={() => handleOpenEdit(p)}
                        >
                          <Pencil />
                        </Button>
                        <Button
                          size="sm"
                          variant="danger"
                          onClick={() => handleOpenDelete(p)}
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
        </div>
        <div className="row p-2">
          <div className="col">
            <table className="table table-sm">
              <thead className="table-dark">
                <tr>
                  <th>#</th>
                  <th>Fecha</th>
                  <th></th>
                  <th>Tipo_pago</th>
                </tr>
              </thead>
              <tbody>
                {allTipo_pagos.map((p) => (
                  <tr key={p.id_reg_tipo_pago}>
                    <td className="fw-bold">
                      {p.origen === 0 ? (
                        <>{p.id_reg_tipo_pago}</>
                      ) : (
                        <>
                          <del>{p.origen}</del> {p.id_reg_tipo_pago}
                        </>
                      )}
                    </td>
                    <td>{moment(p.fecha).format("YYYY-MM-DD HH:mm:ss")}</td>
                    <td
                      className={
                        p.operacion === "Modificado"
                          ? "text-primary"
                          : p.operacion === "Eliminado"
                            ? "text-danger"
                            : ""
                      }
                    >
                      {p.operacion}
                    </td>
                    <td>{p.tipo_pago}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      {showEditTipo_pago && (
        <Modal show={true} onHide={handleCloseEdit}>
          <Modal.Body>
            <div className="form-floating mb-2">
              <input
                type="text"
                className="form-control"
                placeholder=""
                value={p_aux.tipo_pago}
                onChange={(e) =>
                  setP_aux((prev) => ({ ...prev, tipo_pago: e.target.value }))
                }
              />
              <label htmlFor="floatingInput">Tipo_pago</label>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseEdit}>
              Cerrar
            </Button>
            {p_aux.tipo_pago !== "" && (
              <Button variant="warning" onClick={handleConfirmEdit}>
                Modificar Tipo_pago
              </Button>
            )}
          </Modal.Footer>
        </Modal>
      )}
      {showDeleteTipo_pago && (
        <Modal show={true} onHide={handleCloseDelete}>
          <Modal.Body
            style={{ pointerEvents: "none", color: "gray", opacity: "0.7" }}
          >
            <div className="form-floating mb-2">
              <input
                type="text"
                className="form-control"
                placeholder=""
                value={p_aux.tipo_pago}
                onChange={(e) =>
                  setP_aux((prev) => ({ ...prev, tipo_pago: e.target.value }))
                }
              />
              <label htmlFor="floatingInput">Tipo_pago</label>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseDelete}>
              Cerrar
            </Button>
            {p_aux.tipo_pago !== "" && (
              <Button variant="danger" onClick={handleConfirmDelete}>
                Eliminar Tipo_pago
              </Button>
            )}
          </Modal.Footer>
        </Modal>
      )}
    </>
  );
}

export default Tipo_pagos;
