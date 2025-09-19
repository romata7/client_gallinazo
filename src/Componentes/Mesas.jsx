import React, { useEffect, useState } from "react";
import axios from "axios";
import API_BASE_URL from "../config";
import { Modal, Button } from "react-bootstrap";
import moment from "moment";
import { Pencil, Trash } from "react-bootstrap-icons";

function Mesas() {
  const [showEditMesa, setShowEditMesa] = useState(false);
  const [showDeleteMesa, setShowDeleteMesa] = useState(false);
  const [p_p, setP_p] = useState({
    id_reg_mesa: 0,
    mesa: "",
  });
  const [p_aux, setP_aux] = useState({
    id_reg_mesa: 0,
    mesa: "",
  });
  const [mesas, setMesas] = useState([]);
  const [allMesas, setAllMesas] = useState([]);

  const fetchMesas = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/mesas/`);
      setMesas(response.data);
    } catch (error) {
      console.error(error);
    }
  };
  const fetchAllMesas = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/mesas/all`);
      setAllMesas(response.data);
    } catch (error) {
      console.error(error);
    }
  };
  const fetchLastID = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/mesas/last_id`);
      setP_p((prev) => ({
        ...prev,
        id_reg_mesa: response.data.last_id + 1,
      }));
    } catch (error) {
      console.error("Error al obtener last_id_reg_mesa", error);
    }
  };
  useEffect(() => {
    fetchLastID();
    fetchMesas();
    fetchAllMesas();
  }, []);

  const agregarMesa = async () => {
    try {
      const response = await axios.post(`${API_BASE_URL}/api/mesas/agregar`, {
        mesa: p_p,
      });
      setP_p({ id_reg_mesa: 0, mesa: "" });
      fetchLastID();
      fetchMesas();
      fetchAllMesas();
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    //
  }, [p_p]);

  const handleOpenEdit = (pp) => {
    setP_aux(pp);
    setShowEditMesa(true);
  };
  const handleCloseEdit = () => {
    setShowEditMesa(false);
    setP_aux({ id_reg_mesa: 0, mesa: "" });
  };
  const handleConfirmEdit = async (pp) => {
    setShowEditMesa(false);
    try {
      const response = await axios.post(`${API_BASE_URL}/api/mesas/modificar`, {
        mesa: p_aux,
      });
      setP_p({ id_reg_mesa: 0, mesa: "" });
      setP_aux({ id_reg_mesa: 0, mesa: "" });
      fetchLastID();
      fetchMesas();
      fetchAllMesas();
    } catch (error) {
      console.error(error);
    }
  };

  const handleOpenDelete = (pp) => {
    setP_aux(pp);
    setShowDeleteMesa(true);
  };
  const handleCloseDelete = () => {
    setShowDeleteMesa(false);
    setP_aux({ id_reg_mesa: 0, mesa: "" });
  };
  const handleConfirmDelete = async (pp) => {
    setShowDeleteMesa(false);
    try {
      const response = await axios.post(`${API_BASE_URL}/api/mesas/eliminar`, {
        mesa: p_aux,
      });
      setP_p({ id_reg_mesa: 0, mesa: "" });
      setP_aux({ id_reg_mesa: 0, mesa: "" });
      fetchLastID();
      fetchMesas();
      fetchAllMesas();
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
                value={p_p.mesa}
                onChange={(e) =>
                  setP_p((prev) => ({ ...prev, mesa: e.target.value }))
                }
              />
              <label htmlFor="floatingInput">Mesa</label>
            </div>
            <div className="d-flex justify-content-evenly">
              <button
                className="btn btn-warning"
                onClick={() => window.location.reload()}
              >
                Limpiar
              </button>
              {p_p.mesa !== "" && (
                <button className="btn btn-primary" onClick={agregarMesa}>
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
                  <th>Mesa</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {mesas.map((p) => (
                  <tr key={p.id_reg_mesa}>
                    <td className="fw-bold">
                      {p.origen === 0 ? (
                        <>{p.id_reg_mesa}</>
                      ) : (
                        <>
                          <del>{p.origen}</del> {p.id_reg_mesa}
                        </>
                      )}
                    </td>
                    <td>{p.mesa}</td>
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
                  <th>Mesa</th>
                </tr>
              </thead>
              <tbody>
                {allMesas.map((p) => (
                  <tr key={p.id_reg_mesa}>
                    <td className="fw-bold">
                      {p.origen === 0 ? (
                        <>{p.id_reg_mesa}</>
                      ) : (
                        <>
                          <del>{p.origen}</del> {p.id_reg_mesa}
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
                    <td>{p.mesa}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      {showEditMesa && (
        <Modal show={true} onHide={handleCloseEdit}>
          <Modal.Body>
            <div className="form-floating mb-2">
              <input
                type="text"
                className="form-control"
                placeholder=""
                value={p_aux.mesa}
                onChange={(e) =>
                  setP_aux((prev) => ({ ...prev, mesa: e.target.value }))
                }
              />
              <label htmlFor="floatingInput">Mesa</label>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseEdit}>
              Cerrar
            </Button>
            {p_aux.mesa !== "" && (
              <Button variant="warning" onClick={handleConfirmEdit}>
                Modificar Mesa
              </Button>
            )}
          </Modal.Footer>
        </Modal>
      )}
      {showDeleteMesa && (
        <Modal show={true} onHide={handleCloseDelete}>
          <Modal.Body
            style={{ pointerEvents: "none", color: "gray", opacity: "0.7" }}
          >
            <div className="form-floating mb-2">
              <input
                type="text"
                className="form-control"
                placeholder=""
                value={p_aux.mesa}
                onChange={(e) =>
                  setP_aux((prev) => ({ ...prev, mesa: e.target.value }))
                }
              />
              <label htmlFor="floatingInput">Mesa</label>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseDelete}>
              Cerrar
            </Button>
            {p_aux.mesa !== "" && (
              <Button variant="danger" onClick={handleConfirmDelete}>
                Eliminar Mesa
              </Button>
            )}
          </Modal.Footer>
        </Modal>
      )}
    </>
  );
}

export default Mesas;
