import React, { useEffect, useState } from "react";
import axios from "axios";
import API_BASE_URL from "../config";
import { Modal, Button } from "react-bootstrap";
import moment from "moment";
import { Pencil, Trash } from "react-bootstrap-icons";

function Mozos() {
  const [showEditMozo, setShowEditMozo] = useState(false);
  const [showDeleteMozo, setShowDeleteMozo] = useState(false);
  const [p_p, setP_p] = useState({
    id_reg_mozo: 0,
    mozo: "",
  });
  const [p_aux, setP_aux] = useState({
    id_reg_mozo: 0,
    mozo: "",
  });
  const [mozos, setMozos] = useState([]);
  const [allMozos, setAllMozos] = useState([]);

  const fetchMozos = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/mozos/`);
      setMozos(response.data);
    } catch (error) {
      console.error(error);
    }
  };
  const fetchAllMozos = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/mozos/all`);
      setAllMozos(response.data);
    } catch (error) {
      console.error(error);
    }
  };
  const fetchLastID = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/mozos/last_id`);
      setP_p((prev) => ({
        ...prev,
        id_reg_mozo: response.data.last_id + 1,
      }));
    } catch (error) {
      console.error("Error al obtener last_id_reg_mozo", error);
    }
  };
  useEffect(() => {
    fetchLastID();
    fetchMozos();
    fetchAllMozos();
  }, []);

  const agregarMozo = async () => {
    try {
      const response = await axios.post(`${API_BASE_URL}/api/mozos/agregar`, {
        mozo: p_p,
      });
      setP_p({ id_reg_mozo: 0, mozo: "" });
      fetchLastID();
      fetchMozos();
      fetchAllMozos();
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    //
  }, [p_p]);

  const handleOpenEdit = (pp) => {
    setP_aux(pp);
    setShowEditMozo(true);
  };
  const handleCloseEdit = () => {
    setShowEditMozo(false);
    setP_aux({ id_reg_mozo: 0, mozo: "" });
  };
  const handleConfirmEdit = async (pp) => {
    setShowEditMozo(false);
    try {
      const response = await axios.post(`${API_BASE_URL}/api/mozos/modificar`, {
        mozo: p_aux,
      });
      setP_p({ id_reg_mozo: 0, mozo: "" });
      setP_aux({ id_reg_mozo: 0, mozo: "" });
      fetchLastID();
      fetchMozos();
      fetchAllMozos();
    } catch (error) {
      console.error(error);
    }
  };

  const handleOpenDelete = (pp) => {
    setP_aux(pp);
    setShowDeleteMozo(true);
  };
  const handleCloseDelete = () => {
    setShowDeleteMozo(false);
    setP_aux({ id_reg_mozo: 0, mozo: "" });
  };
  const handleConfirmDelete = async (pp) => {
    setShowDeleteMozo(false);
    try {
      const response = await axios.post(`${API_BASE_URL}/api/mozos/eliminar`, {
        mozo: p_aux,
      });
      setP_p({ id_reg_mozo: 0, mozo: "" });
      setP_aux({ id_reg_mozo: 0, mozo: "" });
      fetchLastID();
      fetchMozos();
      fetchAllMozos();
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
                value={p_p.mozo}
                onChange={(e) =>
                  setP_p((prev) => ({ ...prev, mozo: e.target.value }))
                }
              />
              <label htmlFor="floatingInput">Mozo</label>
            </div>
            <div className="d-flex justify-content-evenly">
              <button
                className="btn btn-warning"
                onClick={() => window.location.reload()}
              >
                Limpiar
              </button>
              {p_p.mozo !== "" && (
                <button className="btn btn-primary" onClick={agregarMozo}>
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
                  <th>Mozo</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {mozos.map((p) => (
                  <tr key={p.id_reg_mozo}>
                    <td className="fw-bold">
                      {p.origen === 0 ? (
                        <>{p.id_reg_mozo}</>
                      ) : (
                        <>
                          <del>{p.origen}</del> {p.id_reg_mozo}
                        </>
                      )}
                    </td>
                    <td>{p.mozo}</td>
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
                  <th>Mozo</th>
                </tr>
              </thead>
              <tbody>
                {allMozos.map((p) => (
                  <tr key={p.id_reg_mozo}>
                    <td className="fw-bold">
                      {p.origen === 0 ? (
                        <>{p.id_reg_mozo}</>
                      ) : (
                        <>
                          <del>{p.origen}</del> {p.id_reg_mozo}
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
                    <td>{p.mozo}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      {showEditMozo && (
        <Modal show={true} onHide={handleCloseEdit}>
          <Modal.Body>
            <div className="form-floating mb-2">
              <input
                type="text"
                className="form-control"
                placeholder=""
                value={p_aux.mozo}
                onChange={(e) =>
                  setP_aux((prev) => ({ ...prev, mozo: e.target.value }))
                }
              />
              <label htmlFor="floatingInput">Mozo</label>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseEdit}>
              Cerrar
            </Button>
            {p_aux.mozo !== "" && (
              <Button variant="warning" onClick={handleConfirmEdit}>
                Modificar Mozo
              </Button>
            )}
          </Modal.Footer>
        </Modal>
      )}
      {showDeleteMozo && (
        <Modal show={true} onHide={handleCloseDelete}>
          <Modal.Body
            style={{ pointerEvents: "none", color: "gray", opacity: "0.7" }}
          >
            <div className="form-floating mb-2">
              <input
                type="text"
                className="form-control"
                placeholder=""
                value={p_aux.mozo}
                onChange={(e) =>
                  setP_aux((prev) => ({ ...prev, mozo: e.target.value }))
                }
              />
              <label htmlFor="floatingInput">Mozo</label>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseDelete}>
              Cerrar
            </Button>
            {p_aux.mozo !== "" && (
              <Button variant="danger" onClick={handleConfirmDelete}>
                Eliminar Mozo
              </Button>
            )}
          </Modal.Footer>
        </Modal>
      )}
    </>
  );
}

export default Mozos;
