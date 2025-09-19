import React, { useEffect } from "react";
import { useState } from "react";
import { useMyContext } from "../Contexts/MyContext";
import Item from "./Item";
import { useGlobalContext } from "../Contexts/GlobalContext";
import { Plus, PlusSquare, PlusSquareFill } from "react-bootstrap-icons";
import { Button } from "react-bootstrap";

function Form({ c, onChangeForm, showTitle }) {
  const baseKey = "Form";
  const [cx, setCx] = useState(c || {});
  const { shopFullName } = useGlobalContext();
  const { reg_mesas, reg_clientes, reg_mozos, reg_tipos_pago } = useMyContext();

  const calcularTotal = (items) => {
    return items
      .reduce((total, item) => {
        return total + parseFloat(item.costo) * item.cant;
      }, 0)
      .toFixed(2); // Devuelve el total con dos decimales
  };

  const changeOnI = (ix) => {
    setCx((prev) => {
      const updatedItems = prev.items.map((item) =>
        item.id_reg_item === ix.id_reg_item ? { ...item, ...ix } : item
      );

      return {
        ...prev,
        items: updatedItems,
        total: calcularTotal(updatedItems), // Calcula el nuevo total
      };
    });
  };

  const deleteI = (id) => {
    setCx((prev) => {
      const updatedItems = prev.items.filter((item) => item.id_reg_item !== id); // Filtra el item a eliminar
      return {
        ...prev,
        items: updatedItems,
        total: calcularTotal(updatedItems), // Recalcula el total después de la eliminación
      };
    });
  };

  const agregarItem = () => {
    setCx((prev) => {
      const newItem = {
        id_reg_item: Date.now(),
        cant: 1,
        costo: 0,
        nostas_producto: "",
        producto: "",
      };

      const updatedItems = [...prev.items, newItem]; // Agrega el nuevo item
      return {
        ...prev,
        items: updatedItems,
        total: calcularTotal(updatedItems), // Recalcula el total
      };
    });
  };

  useEffect(() => {
    onChangeForm(cx);
  }, [cx]);
  return (
    <div>
      {showTitle && (
        <div
          className="mb-2"
          style={{
            textAlign: "center",
            fontWeight: "bold",
            fontSize: "1.68rem",
            whiteSpace: "nowrap",
            lineHeight: "1",
          }}
        >
          {shopFullName}{" "}
          {c.origen === 0 ? (
            `#${c.id_comanda}`
          ) : (
            <>
              <del>#{c.origen}</del> #{c.id_comanda}
            </>
          )}
        </div>
      )}
      <div className="small">
        <div className="form-floating mb-2">
          <input
            type="text"
            className="form-control"
            placeholder=""
            value={cx.mesa}
            list="mesas"
            onChange={(e) =>
              setCx((prev) => ({ ...prev, mesa: e.target.value }))
            }
          />
          <label htmlFor="floatingInput">Mesa</label>
          <datalist id="mesas">
            {reg_mesas.map((m) => (
              <option key={m} value={m} />
            ))}
          </datalist>
        </div>
        <div className="form-floating mb-2">
          <input
            type="text"
            className="form-control"
            placeholder=""
            value={cx.cliente}
            list="clientes"
            onChange={(e) =>
              setCx((prev) => ({ ...prev, cliente: e.target.value }))
            }
          />
          <label htmlFor="floatingInput">Cliente</label>
          <datalist id="clientes">
            {reg_clientes.map((m) => (
              <option key={m} value={m} />
            ))}
          </datalist>
        </div>
        <div className="form-floating mb-2">
          <input
            type="text"
            className="form-control"
            placeholder=""
            value={cx.mozo}
            list="mozos"
            onChange={(e) =>
              setCx((prev) => ({ ...prev, mozo: e.target.value }))
            }
          />
          <label htmlFor="floatingInput">Mozo</label>
          <datalist id="mozos">
            {reg_mozos.map((m) => (
              <option key={m} value={m} />
            ))}
          </datalist>
        </div>
        <div className="form-floating mb-2">
          <input
            type="text"
            className="form-control"
            placeholder=""
            value={cx.tipo_pago}
            list="tipos_pago"
            onChange={(e) =>
              setCx((prev) => ({ ...prev, tipo_pago: e.target.value }))
            }
          />
          <label htmlFor="floatingInput">Forma de Pago</label>
          <datalist id="tipos_pago">
            {reg_tipos_pago.map((m) => (
              <option key={m} value={m} />
            ))}
          </datalist>
        </div>
        <div className="form-floating mb-2">
          <input
            type="text"
            className="form-control"
            placeholder=""
            value={cx.notas_comanda}
            list="notas"
            onChange={(e) =>
              setCx((prev) => ({ ...prev, notas_comanda: e.target.value }))
            }
          />
          <label htmlFor="floatingInput">Nota</label>
        </div>
        {cx.items.map((i) => (
          <Item
            i={i}
            key={`${baseKey}_${i.id_reg_item}`}
            onChange={changeOnI}
            onDelete={deleteI}
          />
        ))}
        <div className="d-flex justify-content-center mb-3">
          <Button variant="success"
            size="sm"
            onClick={agregarItem}
          >
            <Plus /> Agregar
          </Button>
        </div>
        <div
          style={{ fontWeight: "bold", textAlign: "right", fontSize: "1.5rem" }}
        >
          {cx.total > 0 ? <>S/ {cx.total}</> : ""}
        </div>
      </div>
    </div>
  );
}

export default Form;
