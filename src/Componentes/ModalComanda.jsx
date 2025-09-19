// src/components/ModalComanda.jsx

import React from "react";
import { Modal, Button } from "react-bootstrap";
import DetailsComanda from "./DetailsComanda"; // Asegúrate de tener la ruta correcta

const ModalComanda = ({
  showModal,
  handleCloseModal,
  id_comanda,
  datos_comanda,
  items,
  resaltados,
  origen,
  confirmarComanda,
}) => {
  return (
    <Modal show={showModal} onHide={handleCloseModal}>
      <Modal.Body>
        <DetailsComanda
          id_comanda={id_comanda}
          datos_comanda={datos_comanda}
          items={items}
          resaltados={resaltados}
          origen={origen}
        />
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleCloseModal}>
          Cerrar
        </Button>
        <Button variant="primary" onClick={confirmarComanda}>
          Confirmar Comanda
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalComanda;
