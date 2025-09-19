import React, { useState } from "react";
import { Modal, Button } from "react-bootstrap";
import Form from "./Form";

function ModalModificar({ showModal, onClose, onConfirm, c }) {
  const [cx, setCx] = useState(c || {});
  const aplicarCambios = (cy) => {
    setCx(cy);
  };
  return (
    <Modal show={showModal} onHide={onClose}>
      <Modal.Body
        style={{ pointerEvents: "none", color: "gray", opacity: "0.7" }}
      >
        <Form c={c} onChangeForm={aplicarCambios} showTitle={true}/>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          Cerrar
        </Button>
        <Button variant="danger" onClick={() => onConfirm(cx)}>
          Eliminar Comanda
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default ModalModificar;
