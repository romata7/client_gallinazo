import React, { useState, useEffect, useContext } from "react";
import moment from "moment";
import Lista_comandas_aux from "./Lista_comandas_aux";
import Prints from "../Componentes/Prints"
import { useMyContext } from "../Contexts/MyContext";

function ComandasActivas() {
  const { prints } = useMyContext();

  const [fi, setFi] = useState(
    moment().startOf("month").format("YYYY-MM-DDTHH:mm")
  );
  const [ff, setFf] = useState(
    moment().endOf("month").format("YYYY-MM-DDTHH:mm")
  );

  const [key, setKey] = useState(0);
  // Manejar cambios en el input de fecha de inicio
  const handleFiChange = (e) => {
    setFi(moment(e.target.value).format("YYYY-MM-DDTHH:mm"));
    setKey((prev) => prev + 1);
  };

  // Manejar cambios en el input de fecha de fin
  const handleFfChange = (e) => {
    setFf(moment(e.target.value).format("YYYY-MM-DDTHH:mm"));
    setKey((prev) => prev + 1);
  };

  return (
    <>
      <div className="row p-2">
        <div className="col-12 col-sm-12 col-md-4 col-lg-3 col-xl-3 col-xxl-2 mb-2 d-print-none">
          <div className="card">
            <div className="card-body">
              <h2 className="text-center">Filtro Fechas</h2>
              <div className="form-floating mb-3">
                <input
                  type="datetime-local"
                  className="form-control"
                  id="fechaInicio"
                  value={fi}
                  onChange={handleFiChange}
                />
                <label htmlFor="fechaInicio">Fecha Inicio</label>
              </div>
              <div className="form-floating mb-3">
                <input
                  type="datetime-local"
                  className="form-control"
                  id="fechaFin"
                  value={ff}
                  onChange={handleFfChange}
                />
                <label htmlFor="fechaFin">Fecha Fin</label>
              </div>
            </div>
          </div>
          <Prints prints={prints} />
        </div>
        <div className="col-12 col-sm-12 col-md-8 col-lg-9 col-xl-9 col-xxl-10">
          <Lista_comandas_aux key={key} finicio={fi} ffin={ff} />
        </div>
      </div>
    </>
  );
}

export default ComandasActivas;
