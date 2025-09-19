import React, { useEffect, useState } from "react";
import moment from "moment";
import axios from "axios";
import API_BASE_URL from "../config";
import Detalles from "./Detalles";
import ModalImprimir from "./ModalImprimir";
import ModalModificar from "./ModalModificar";
import ModalEliminar from "./ModalEliminar";
import { useMyContext } from "../Contexts/MyContext";
import ModalClienteImprimir from "./ModalClienteImprimir";
import DetallesCliente from "./DetallesCliente";
import { Button } from "react-bootstrap";
import { Pencil, Printer, Trash } from "react-bootstrap-icons";

export default function Lista_comandas_aux({ finicio, ffin }) {
  const [baseKey, setBaseKey] = useState("Lista_comandas_aux");

  const { last_id_comanda, updateLastIdComanda, get_resumen, fetchPrints, setMsg } = useMyContext();

  const [comandas, setComandas] = useState([]);

  const [showModalPrint, setShowModalPrint] = useState(false);
  const [showModalClientPrint, setShowModalClientPrint] = useState(false)
  const [showAreaPrint, setShowAreaPrint] = useState(false);
  const [showClientPrint, setShowClientPrint] = useState(false)

  const [showModalEdit, setShowModalEdit] = useState(false);
  const [showAreaEdit, setShowAreaEdit] = useState(false);

  const [showModalDelete, setShowModalDelete] = useState(false);

  const [p_comanda, setP_comanda] = useState({});



  const sendPrintToServer = async (ticket) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/api/print`, {
        ticket
      })
    } catch (error) {
      console.error(error);
    }
  }

  const handleOpenPrint = (c) => {
    updateLastIdComanda();
    setP_comanda(c);
    setShowAreaPrint(true);
    setShowModalPrint(true);
  };
  const handleOpenPrintClient = (c) => {
    updateLastIdComanda();
    setP_comanda(c);
    setShowClientPrint(true);
    setShowModalClientPrint(true);
  };
  const handleClosePrint = () => {
    setShowAreaPrint(false);
    setShowModalPrint(false);
  };
  const handleCloseClientPrint = () => {
    setShowClientPrint(false);
    setShowModalClientPrint(false);
  };
  const handleConfirmPrint = (c) => {
    updateLastIdComanda();
    setShowModalPrint(false);
    setTimeout(async () => {
      window.print();
      await sendPrintToServer({ destino: 'Cocina', ...p_comanda })
      setShowAreaPrint(false);
      console.log('cocina', fi, ff)
      fetchPrints(fi, ff);
    }, 100);
  };
  const handleConfirmClientPrint = (c) => {
    updateLastIdComanda();
    setShowModalClientPrint(false);
    setTimeout(async () => {
      window.print();
      await sendPrintToServer({ destino: 'Cliente', ...p_comanda })
      setShowClientPrint(false);
      console.log('cocina', fi, ff)
      fetchPrints(fi, ff);
    }, 100);
  };

  // Edit
  const handleOpenEdit = (c) => {
    updateLastIdComanda();
    setP_comanda(c);
    setShowAreaEdit(true);
    setShowModalEdit(true);
  };
  const handleCloseEdit = (c) => {
    setShowAreaEdit(false);
    setShowModalEdit(false);
  };
  const handleConfirmEdit = async (c) => {
    updateLastIdComanda();
    setP_comanda(c);
    setShowModalEdit(false);

    const sendDataToServer = async () => {
      try {
        const response = await axios.post(
          `${API_BASE_URL}/api/comandas/modificar`,
          {
            reg_datos: c,
            items: c.items.filter(({ producto }) => producto !== ""),
          }
        );
      } catch (error) {
        console.error("Error al Modificar comanda:", error);
      }
    };

    setTimeout(async () => {
      await sendDataToServer();
      fetchComandas();
      window.print();
      setShowAreaEdit(false);
    }, 100);
  };

  // Delete
  const handleOpenDelete = (c) => {
    setP_comanda(c);
    setShowModalDelete(true);
  };

  const handleCloseDelete = (c) => {
    setShowModalDelete(false);
  };

  const handleConfirmDelete = async (c) => {
    setShowModalDelete(false);
    const sendDataToServer = async () => {
      try {
        const response = await axios.post(
          `${API_BASE_URL}/api/comandas/eliminar`,
          {
            reg_datos: c,
            items: c.items.filter(({ producto }) => producto !== ""),
          }
        );
      } catch (error) {
        console.error("Error al Eliminar comanda:", error);
      }
    };
    setTimeout(async () => {
      await sendDataToServer();
      fetchComandas();
    }, 100);
  };

  const [fi, setFi] = useState(
    finicio || moment().startOf("day").format("YYYY-MM-DDTHH:mm")
  );
  const [ff, setFf] = useState(
    ffin || moment().endOf("day").format("YYYY-MM-DDTHH:mm")
  );
  // Manejar cambios en el input de fecha de inicio
  const handleFiChange = (e) => {
    setFi(moment(e.target.value).format("YYYY-MM-DDTHH:mm"));
  };

  // Manejar cambios en el input de fecha de fin
  const handleFfChange = (e) => {
    setFf(moment(e.target.value).format("YYYY-MM-DDTHH:mm"));
  };
  // Cargar comandas con las fechas establecidas
  const fetchComandas = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/comandas/activas`, {
        params: { fi: fi, ff: ff },
      });
      if (response.data.length && response.data.length > 0) {
        setComandas(response.data);
      }
    } catch (error) {
      console.error("Error fetching comandas:", error);
    }
  };
  useEffect(() => {
    fetchComandas();
    fetchPrints(fi, ff);
  }, [fi, ff]);

  return (
    <>
      <div className="small d-print-none">
        <div className="table-responsive p-2">
          <table className="table table-sm">
            <thead className="table-dark">
              <tr>
                <th>#</th>
                <th>Fecha</th>
                <th>Mesa</th>
                <th>Items</th>
                <th style={{ textAlign: "right" }}>Total</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {comandas.map((c) => (
                <tr
                  key={`${baseKey}_comanda_${c.id_comanda}`}
                  style={{ lineHeight: "1" }}
                >
                  <td style={{ fontWeight: "bold" }}>
                    <div>{c.id_comanda}</div>
                    <div>
                      {Number(c.origen) > 0 ? <del>{c.origen}</del> : ""}
                    </div>
                  </td>
                  <td>{moment(c.fecha).format("YYYY-MM-DD HH:mm:ss")}</td>
                  <td>
                    {c.mesa}
                    <div style={{ whiteSpace: "nowrap", fontWeight: "bold" }}>
                      {c.mozo}
                    </div>
                    <div style={{ whiteSpace: "nowrap" }}>{c.cliente}</div>
                    <div style={{ fontWeight: "bold", fontStyle: "italic" }}>
                      {c.notas_comanda}
                    </div>
                  </td>
                  <td>
                    <table
                      style={{
                        lineHeight: "1",
                        textTransform: "capitalize",
                        width: "100%",
                      }}
                    >
                      <thead></thead>
                      <tbody>
                        <tr className="text-center">
                          <td colSpan={4} className="fw-bold fs-5">{get_resumen(c.items)}</td>
                        </tr>
                        {c.items.map((i, index) => (
                          <tr
                            key={`${baseKey}_comanda_item_${i.id_reg_item}`}
                            style={{
                              borderBottom:
                                index < c.items.length - 1
                                  ? "1px solid black"
                                  : "0px solid black",
                            }}
                          >
                            <td style={{ fontWeight: "bold" }}>{i.cant}</td>
                            <td>
                              {i.producto}
                              {i.notas_producto && i.notas_producto !== "" && (
                                <strong>({i.notas_producto})</strong>
                              )}
                            </td>
                            <td
                              className="text-end small"
                              style={{ whiteSpace: "nowrap" }}
                            >
                              S/ {i.costo}
                            </td>
                            <td
                              className="text-end fw-bold"
                              style={{ whiteSpace: "nowrap" }}
                            >
                              S/ {(i.costo * i.cant).toFixed(2)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </td>
                  <td className="text-end" style={{ fontWeight: "bold" }}>
                    <div>{c.tipo_pago}</div>
                    <div>S/ {c.total}</div>
                  </td>
                  <td className="text-end">
                    <div className="d-flex flex-column gap-2 justify-content-center align-items-center">
                      <div className="d-flex gap-2">
                        <Button
                          size="sm"
                          variant="warning"
                          onClick={() => handleOpenPrint(c)}
                        >
                          <Printer />
                        </Button>
                        <Button
                          size="sm"
                          variant="primary"
                          onClick={() => handleOpenPrintClient(c)}
                        >
                          <Printer />
                        </Button>
                      </div>
                      <div className="d-flex gap-2">
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => handleOpenEdit(c)}
                        >
                          <Pencil />
                        </Button>
                        <Button
                          size="sm"
                          variant="danger"
                          onClick={() => handleOpenDelete(c)}
                        >
                          <Trash />
                        </Button>
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showAreaPrint && (
        <div style={{ display: "block" }}>
          <Detalles c={p_comanda} />
        </div>
      )}
      {showClientPrint && (
        <div style={{ display: "block" }}>
          <DetallesCliente c={p_comanda} />
        </div>
      )}
      {showModalPrint && (
        <ModalImprimir
          showModal={showModalPrint}
          onClose={handleClosePrint}
          onConfirm={handleConfirmPrint}
          c={p_comanda}
        />
      )}
      {showModalClientPrint && (
        <ModalClienteImprimir
          showModal={showModalClientPrint}
          onClose={handleCloseClientPrint}
          onConfirm={handleConfirmClientPrint}
          c={p_comanda}
        />
      )}

      {showAreaEdit && (
        <div style={{ display: "block" }}>
          <Detalles
            c={{
              ...p_comanda,
              id_comanda: last_id_comanda,
              origen: p_comanda.id_comanda,
            }}
          />
        </div>
      )}
      {showModalEdit && (
        <ModalModificar
          showModal={showModalEdit}
          onClose={handleCloseEdit}
          onConfirm={handleConfirmEdit}
          c={p_comanda}
        />
      )}

      {showModalDelete && (
        <ModalEliminar
          showModal={showModalDelete}
          onClose={handleCloseDelete}
          onConfirm={handleConfirmDelete}
          c={p_comanda}
        />
      )}
    </>
  );
}
