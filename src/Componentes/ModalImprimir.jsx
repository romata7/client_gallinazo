import React from "react";
import { Modal, Button } from "react-bootstrap";
import Detalles from "./Detalles";

function ModalImprimir({ c, showModal, onClose, onConfirm }) {
  return (
    <Modal show={showModal} onHide={onClose}>
      <Modal.Body>
        <Detalles c={c} />
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          Cerrar
        </Button>
        <Button variant="primary" onClick={() => onConfirm(c)}>
          Imprimir Comanda
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default ModalImprimir;
