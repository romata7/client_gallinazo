import React, { useEffect, useState } from "react";
import Lista_comandas_aux from "./Lista_comandas_aux";
import Form from "./Form";
import ModalAgregar from "./ModalAgregar";
import Detalles from "./Detalles";
import { useMyContext } from "../Contexts/MyContext";
import axios from "axios";
import API_BASE_URL from "../config";
import DetallesCliente from "./DetallesCliente";
import Prints from "./Prints";
import { useGlobalContext } from "../Contexts/GlobalContext";
import { Button } from "react-bootstrap";

const AgregarComanda = () => {
  const { printDuplex } = useGlobalContext();
  const [baseKey, setBaseKey] = useState(`AgregarComanda`);
  const { last_id_comanda, updateLastIdComanda, prints, msg } = useMyContext();
  const [loadId, setLoadId] = useState(false);

  const [p_c, setP_c] = useState({
    id_comanda: 0,
    mesa: "",
    cliente: "",
    mozo: "",
    tipo_pago: "",
    notas_comanda: "",
    total: 0,
    origen: 0,
    items: [],
  });

  const [showModalAdd, setShowModalAdd] = useState(false);
  const [showAreaAdd, setShowAreaAdd] = useState(false);

  const [printClient, setPrintClient] = useState(false)

  useEffect(() => {
    const initializeComanda = async () => {
      await updateLastIdComanda(); // Espera a que se actualice el ID
    };

    initializeComanda();
  }, [updateLastIdComanda]);

  useEffect(() => {
    // Actualiza p_c cuando last_id_comanda cambia
    if (last_id_comanda > 0) {
      setP_c((prev) => ({ ...prev, id_comanda: last_id_comanda }));
    }
  }, [last_id_comanda]);

  const handleChange = (cx) => {
    setP_c((prev) => ({ ...prev, ...cx }));
  };

  useEffect(() => {
    if (p_c.id_comanda > 0) {
      setLoadId(true);
    }
  }, [p_c]);

  const handleOpenAdd = () => {
    setShowAreaAdd(true);
    setShowModalAdd(true);
  };

  const handleCloseAdd = () => {
    window.location.reload();
  };

  const handleConfirmAdd = async () => {
    setShowModalAdd(false);
    // enviar datos al servidor
    const sendDataToServer = async () => {
      try {
        const response = await axios.post(
          `${API_BASE_URL}/api/comandas/agregar`,
          {
            reg_datos: p_c,
            items: p_c.items.filter(({ producto }) => producto !== ""),
          }
        );
      } catch (error) {
        console.error("Error al Agregar comanda:", error);
      }
    };
    await sendDataToServer();

    setPrintClient(true);
    setShowAreaAdd(false);
    setTimeout(() => {
      window.print();
      setPrintClient(false);

      if (printDuplex) {
        setShowAreaAdd(true);
        setTimeout(() => {
          window.print();
          setShowAreaAdd(false)
        }, 100);
      };
      window.location.reload();
    }, 100);
  };

  return (
    <>
      {loadId && (
        <>
          <div className="row p-2">
            <div className="col-12 col-lg-6 col-xl-5 col-xxl-4 d-print-none">
              <div className="mb-2">
                <Form c={p_c} onChangeForm={handleChange} showTitle={true} />
              </div>
              <div className="d-flex justify-content-between">
                <Button
                  size="sm"
                  variant="warning"
                  onClick={handleCloseAdd}
                >
                  Limpiar
                </Button>
                {p_c.total > 0 && (
                  <Button
                    size="sm"
                    variant="primary"
                    onClick={handleOpenAdd}
                  >
                    Agregar Comanda
                  </Button>
                )}
              </div>

              {/* Agregado para ver el registro de impresiones */}
              <div>
                <Prints prints={prints} />
              </div>
            </div>
            <div className="col-12 col-lg-6 col-xl-7 col-xxl-8">
              <Lista_comandas_aux />
            </div>
          </div>
          {showAreaAdd && (
            <div style={{ display: "block" }}>
              <Detalles c={p_c} />
            </div>
          )}
          {printClient && (
            <div style={{ display: 'block' }}>
              <DetallesCliente c={p_c} />
            </div>
          )}
          {showModalAdd && (
            <ModalAgregar
              showModal={showModalAdd}
              onClose={handleCloseAdd}
              onConfirm={handleConfirmAdd}
              c={p_c}
            />
          )}
        </>
      )}
    </>
  );
};

export default AgregarComanda;
