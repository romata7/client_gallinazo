import React from "react";
import { Modal, Button } from "react-bootstrap";
import DetallesCliente from "./DetallesCliente";

function ModalClienteImprimir({ c, showModal, onClose, onConfirm }) {
  return (
    <Modal show={showModal} onHide={onClose}>
      <Modal.Body>
        <DetallesCliente c={c} />
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

export default ModalClienteImprimir;
