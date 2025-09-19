import React, { useEffect, useState } from "react";
import axios from "axios";
import API_BASE_URL from "../config";
import { Modal, Button } from "react-bootstrap";
import moment from "moment";
import { Pencil, Trash } from 'react-bootstrap-icons'

function Clientes() {
  const [showEditCliente, setShowEditCliente] = useState(false);
  const [showDeleteCliente, setShowDeleteCliente] = useState(false);
  const [p_p, setP_p] = useState({
    id_reg_cliente: 0,
    cliente: "",
  });
  const [p_aux, setP_aux] = useState({
    id_reg_cliente: 0,
    cliente: "",
  });
  const [clientes, setClientes] = useState([]);
  const [allClientes, setAllClientes] = useState([]);

  const fetchClientes = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/clientes/`);
      setClientes(response.data);
    } catch (error) {
      console.error(error);
    }
  };
  const fetchAllClientes = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/clientes/all`);
      setAllClientes(response.data);
    } catch (error) {
      console.error(error);
    }
  };
  const fetchLastID = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/clientes/last_id`);
      setP_p((prev) => ({
        ...prev,
        id_reg_cliente: response.data.last_id + 1,
      }));
    } catch (error) {
      console.error("Error al obtener last_id_reg_cliente", error);
    }
  };
  useEffect(() => {
    fetchLastID();
    fetchClientes();
    fetchAllClientes();
  }, []);

  const agregarCliente = async () => {
    try {
      const response = await axios.post(`${API_BASE_URL}/api/clientes/agregar`, {
        cliente: p_p,
      });
      setP_p({ id_reg_cliente: 0, cliente: "" });
      fetchLastID();
      fetchClientes();
      fetchAllClientes();
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    //
  }, [p_p]);

  const handleOpenEdit = (pp) => {
    setP_aux(pp);
    setShowEditCliente(true);
  };
  const handleCloseEdit = () => {
    setShowEditCliente(false);
    setP_aux({ id_reg_cliente: 0, cliente: "" });
  };
  const handleConfirmEdit = async (pp) => {
    setShowEditCliente(false);
    try {
      const response = await axios.post(`${API_BASE_URL}/api/clientes/modificar`, {
        cliente: p_aux,
      });
      setP_p({ id_reg_cliente: 0, cliente: "" });
      setP_aux({ id_reg_cliente: 0, cliente: "" });
      fetchLastID();
      fetchClientes();
      fetchAllClientes();
    } catch (error) {
      console.error(error);
    }
  };

  const handleOpenDelete = (pp) => {
    setP_aux(pp);
    setShowDeleteCliente(true);
  };
  const handleCloseDelete = () => {
    setShowDeleteCliente(false);
    setP_aux({ id_reg_cliente: 0, cliente: "" });
  };
  const handleConfirmDelete = async (pp) => {
    setShowDeleteCliente(false);
    try {
      const response = await axios.post(`${API_BASE_URL}/api/clientes/eliminar`, {
        cliente: p_aux,
      });
      setP_p({ id_reg_cliente: 0, cliente: "" });
      setP_aux({ id_reg_cliente: 0, cliente: "" });
      fetchLastID();
      fetchClientes();
      fetchAllClientes();
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
                value={p_p.cliente}
                onChange={(e) =>
                  setP_p((prev) => ({ ...prev, cliente: e.target.value }))
                }
              />
              <label htmlFor="floatingInput">Cliente</label>
            </div>
            <div className="d-flex justify-content-evenly">
              <Button
                size="sm"
                variant="warning"
                onClick={() => window.location.reload()}
              >
                Limpiar
              </Button>
              {p_p.cliente !== "" && (
                <Button
                  size="sm"
                  onClick={agregarCliente}
                >
                  Agregar
                </Button>
              )}
            </div>
          </div>
          <div className="col-12 col-sm-12 col-md-8 col-lg-9 col-xl-9 col-xxl-10">
            <table className="table table-sm">
              <thead className="table-dark">
                <tr>
                  <th>#</th>
                  <th>Cliente</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {clientes.map((p) => (
                  <tr key={p.id_reg_cliente}>
                    <td className="fw-bold">
                      {p.origen === 0 ? (
                        <>{p.id_reg_cliente}</>
                      ) : (
                        <>
                          <del>{p.origen}</del> {p.id_reg_cliente}
                        </>
                      )}
                    </td>
                    <td>{p.cliente}</td>
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
                  <th>Cliente</th>
                </tr>
              </thead>
              <tbody>
                {allClientes.map((p) => (
                  <tr key={p.id_reg_cliente}>
                    <td className="fw-bold">
                      {p.origen === 0 ? (
                        <>{p.id_reg_cliente}</>
                      ) : (
                        <>
                          <del>{p.origen}</del> {p.id_reg_cliente}
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
                    <td>{p.cliente}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      {showEditCliente && (
        <Modal show={true} onHide={handleCloseEdit}>
          <Modal.Body>
            <div className="form-floating mb-2">
              <input
                type="text"
                className="form-control"
                placeholder=""
                value={p_aux.cliente}
                onChange={(e) =>
                  setP_aux((prev) => ({ ...prev, cliente: e.target.value }))
                }
              />
              <label htmlFor="floatingInput">Cliente</label>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseEdit}>
              Cerrar
            </Button>
            {p_aux.cliente !== "" && (
              <Button variant="warning" onClick={handleConfirmEdit}>
                Modificar Cliente
              </Button>
            )}
          </Modal.Footer>
        </Modal>
      )}
      {showDeleteCliente && (
        <Modal show={true} onHide={handleCloseDelete}>
          <Modal.Body
            style={{ pointerEvents: "none", color: "gray", opacity: "0.7" }}
          >
            <div className="form-floating mb-2">
              <input
                type="text"
                className="form-control"
                placeholder=""
                value={p_aux.cliente}
                onChange={(e) =>
                  setP_aux((prev) => ({ ...prev, cliente: e.target.value }))
                }
              />
              <label htmlFor="floatingInput">Cliente</label>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseDelete}>
              Cerrar
            </Button>
            {p_aux.cliente !== "" && (
              <Button variant="danger" onClick={handleConfirmDelete}>
                Eliminar Cliente
              </Button>
            )}
          </Modal.Footer>
        </Modal>
      )}
    </>
  );
}

export default Clientes;
