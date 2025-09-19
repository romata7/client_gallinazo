import React, { useEffect, useState } from "react";
import axios from "axios";
import API_BASE_URL from "../config";
import { Modal, Button, FloatingLabel, Form } from "react-bootstrap";
import moment from "moment";
import { ArrowDown, ArrowUp, Pencil, Trash } from "react-bootstrap-icons";

const vacio = {
  producto: "",
  costo: ""
}

function Productos() {
  const [showEditProduct, setShowEditProduct] = useState(false);
  const [showDeleteProduct, setShowDeleteProduct] = useState(false);
  const [data, setData] = useState(vacio);
  const [p_p, setP_p] = useState({
    id: 0,
    producto: "",
    costo: 0,
  });
  const [p_aux, setP_aux] = useState({
    id: 0,
    producto: "",
    costo: 0,
  });
  const [productos, setProductos] = useState([]);
  const [allProducts, setAllProducts] = useState([]);

  const fetchProductos = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/productos/`);
      setProductos(response.data);
    } catch (error) {
      console.error(error);
    }
  };
  const fetchAllProductos = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/productos/all`);
      setAllProducts(response.data);
    } catch (error) {
      console.error(error);
    }
  };
  const fetchLastID = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/productos/last_id`);
      setP_p((prev) => ({
        ...prev,
        id_reg_producto: response.data.last_id + 1,
      }));
    } catch (error) {
      console.error("Error al obtener last_id_reg_product", error);
    }
  };
  useEffect(() => {
    fetchLastID();
    fetchProductos();
    fetchAllProductos();
  }, []);

  const agregarProducto = async () => {
    try {
      const response = await axios.post(`${API_BASE_URL}/api/productos`,  data )
    } catch (error) {

    }
    // try {
    //   const response = await axios.post(
    //     `${API_BASE_URL}/api/productos/agregar`,
    //     {
    //       producto: p_p,
    //     }
    //   );
    //   setP_p({ id_reg_producto: 0, producto: "", costo: 0 });
    //   fetchLastID();
    //   fetchProductos();
    //   fetchAllProductos();
    // } catch (error) {
    //   console.error(error);
    // }
  };

  useEffect(() => {
    //
  }, [p_p]);

  const handleOpenEdit = (pp) => {
    setP_aux(pp);
    setShowEditProduct(true);
  };
  const handleCloseEdit = () => {
    setShowEditProduct(false);
    setP_aux({ id_reg_producto: 0, producto: "", costo: 0 });
  };
  const handleConfirmEdit = async (pp) => {
    setShowEditProduct(false);
    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/productos/modificar`,
        {
          producto: p_aux,
        }
      );
      setP_p({ id_reg_producto: 0, producto: "", costo: 0 });
      setP_aux({ id_reg_producto: 0, producto: "", costo: 0 });
      fetchLastID();
      fetchProductos();
      fetchAllProductos();
    } catch (error) {
      console.error(error);
    }
  };

  const handleOpenDelete = (pp) => {
    setP_aux(pp);
    setShowDeleteProduct(true);
  };
  const handleCloseDelete = () => {
    setShowDeleteProduct(false);
    setP_aux({ id_reg_producto: 0, producto: "", costo: 0 });
  };
  const handleConfirmDelete = async (pp) => {
    setShowDeleteProduct(false);
    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/productos/eliminar`,
        {
          producto: p_aux,
        }
      );
      setP_p({ id_reg_producto: 0, producto: "", costo: 0 });
      setP_aux({ id_reg_producto: 0, producto: "", costo: 0 });
      fetchLastID();
      fetchProductos();
      fetchAllProductos();
    } catch (error) {
      console.error(error);
    }
  };

  const subirOrden = async (p) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/api/productos/subir`, { producto: p })
      console.log(response)
    } catch (error) {
      console.error(error);
    }
    console.log('subir', p)
  }
  const bajarOrden = (p) => {
    console.log('bajar', p)
  }

  const handleChange = (e) => {
    let { name, value } = e.target
    setData(prev => ({ ...prev, [name]: value }));
  }

  return (
    <>
      <div>
        <div className="row p-2">
          <div className="">
            <div className="d-flex flex-column gap-2">
              <FloatingLabel controlId="producto" label="Producto">
                <Form.Control
                  type='text'
                  name="producto"
                  value={data.producto}
                  onChange={handleChange}
                  placeholder=""
                  autoFocus
                />
              </FloatingLabel>
              <FloatingLabel controlId="costo" label="Costo (S/)">
                <Form.Control
                  type="number"
                  step={0.01}
                  name="costo"
                  value={data.costo}
                  onChange={handleChange}
                />
              </FloatingLabel>
            </div>
            <div className="d-flex gap-2 justify-content-evenly my-2">
              <Button
                size="sm"
                variant="warning"
                onClick={() => setData(vacio)}
              >
                Limpiar
              </Button>
              {data.costo > 0 && data.producto !== "" && (

                <Button
                  size="sm"
                  variant="primary"
                  onClick={agregarProducto}
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
                  <th>Orden</th>
                  <th>#</th>
                  <th>Producto</th>
                  <th style={{ textAlign: "right" }}>Costo</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {productos.map((p) => (
                  <tr key={p.id_reg_producto}>
                    <td>
                      <div className="d-flex gap-2 justify-content-start">
                        <Button
                          size="sm"
                          variant="outline-primary"
                          onClick={() => subirOrden(p)}
                        >
                          <ArrowUp />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline-secondary"
                          onClick={() => bajarOrden(p)}
                        >
                          <ArrowDown />
                        </Button>
                      </div>
                    </td>
                    <td className="fw-bold">
                      {p.origen === 0 ? (
                        <>{p.id_reg_producto}</>
                      ) : (
                        <>
                          <del>{p.origen}</del> {p.id_reg_producto}
                        </>
                      )}
                    </td>
                    <td>{p.producto}</td>
                    <td style={{ textAlign: "right" }}>S/ {p.costo}</td>
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
                  <th>Producto</th>
                  <th style={{ textAlign: "right" }}>Costo</th>
                </tr>
              </thead>
              <tbody>
                {allProducts.map((p) => (
                  <tr key={p.id_reg_producto}>
                    <td className="fw-bold">
                      {p.origen === 0 ? (
                        <>{p.id_reg_producto}</>
                      ) : (
                        <>
                          <del>{p.origen}</del> {p.id_reg_producto}
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
                    <td>{p.producto}</td>
                    <td style={{ textAlign: "right" }}>S/ {p.costo}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      {showEditProduct && (
        <Modal show={true} onHide={handleCloseEdit}>
          <Modal.Body>
            <div className="form-floating mb-2">
              <input
                type="text"
                className="form-control"
                placeholder=""
                value={p_aux.producto}
                onChange={(e) =>
                  setP_aux((prev) => ({ ...prev, producto: e.target.value }))
                }
              />
              <label htmlFor="floatingInput">Producto</label>
            </div>
            <div className="form-floating mb-2">
              <input
                type="number"
                min={0}
                step={0.01}
                className="form-control"
                placeholder=""
                value={p_aux.costo}
                onChange={(e) =>
                  setP_aux((prev) => ({
                    ...prev,
                    costo: parseFloat(e.target.value) || 0,
                  }))
                }
              />
              <label htmlFor="floatingInput">Costo (S/)</label>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseEdit}>
              Cerrar
            </Button>
            {p_aux.producto !== "" && p_aux.costo > 0 && (
              <Button variant="warning" onClick={handleConfirmEdit}>
                Modificar Producto
              </Button>
            )}
          </Modal.Footer>
        </Modal>
      )}
      {showDeleteProduct && (
        <Modal show={true} onHide={handleCloseDelete}>
          <Modal.Body
            style={{ pointerEvents: "none", color: "gray", opacity: "0.7" }}
          >
            <div className="form-floating mb-2">
              <input
                type="text"
                className="form-control"
                placeholder=""
                value={p_aux.producto}
                onChange={(e) =>
                  setP_aux((prev) => ({ ...prev, producto: e.target.value }))
                }
              />
              <label htmlFor="floatingInput">Producto</label>
            </div>
            <div className="form-floating mb-2">
              <input
                type="number"
                min={0}
                step={0.01}
                className="form-control"
                placeholder=""
                value={p_aux.costo}
                onChange={(e) =>
                  setP_aux((prev) => ({
                    ...prev,
                    costo: parseFloat(e.target.value) || 0,
                  }))
                }
              />
              <label htmlFor="floatingInput">Costo (S/)</label>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseDelete}>
              Cerrar
            </Button>
            {p_aux.producto !== "" && p_aux.costo > 0 && (
              <Button variant="danger" onClick={handleConfirmDelete}>
                Eliminar Producto
              </Button>
            )}
          </Modal.Footer>
        </Modal>
      )}
    </>
  );
}

export default Productos;