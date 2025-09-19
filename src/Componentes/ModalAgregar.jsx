import React, { useState } from "react";
import { Modal, Button } from "react-bootstrap";
import Form from "./Form";
import Detalles from "./Detalles";

function ModalModificar({ showModal, onClose, onConfirm, c }) {
  const [cx, setCx] = useState(c || {});
  const aplicarCambios = (cy) => {
    setCx(cy);
  };
  return (
    <Modal show={showModal} onHide={onClose}>
      <Modal.Body>
        <Detalles c={c} />
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          Cerrar
        </Button>
        <Button variant="primary" onClick={() => onConfirm(cx)}>
          Confirmar Comanda
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default ModalModificar;
