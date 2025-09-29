import { useState } from "react";
import { Button, Form, InputGroup } from "react-bootstrap";
import { endOfMonth, format, startOfMonth } from "date-fns";

export const Fechas = ({ fi = new Date(), ff = new Date(), procesar }) => {
    const [startDate, setStartDate] = useState(format(fi, 'yyyy-MM-dd'));
    const [endDate, setEndDate] = useState(format(ff, 'yyyy-MM-dd'));

    const handleStartDateChange = (e) => {
        const newStartDate = e.target.value;
        setStartDate(newStartDate);
        if (newStartDate <= endDate) {
            procesar(newStartDate, endDate);
        }
    };

    const handleEndDateChange = (e) => {
        const newEndDate = e.target.value;
        setEndDate(newEndDate);
        if (startDate <= newEndDate) {
            procesar(startDate, newEndDate);
        }
    };

    const esteDia = () => {
        const hoy = format(new Date(), 'yyyy-MM-dd');
        setStartDate(hoy);
        setEndDate(hoy);
        procesar(hoy, hoy);
    };

    const esteMes = () => {
        const inicioMes = format(startOfMonth(new Date()), 'yyyy-MM-dd');
        const finMes = format(endOfMonth(new Date()), 'yyyy-MM-dd')
        setStartDate(inicioMes);
        setEndDate(finMes);
        procesar(inicioMes, finMes);
    };

    return (
        <div className="d-flex gap-2 justify-content-center">
            <div className="d-flex gap-2">
                <Button size="sm" variant="outline-primary" onClick={esteDia}>
                    Hoy
                </Button>
                <Button size="sm" variant="outline-secondary" onClick={esteMes}
                    className="text-nowrap"
                >
                    Este Mes
                </Button>
            </div>

            <Form.Control
                type="date"
                size="sm"
                value={startDate}
                onChange={handleStartDateChange}
                style={{ width: "120px" }}
            />
            <Form.Control
                type="date"
                size="sm"
                value={endDate}
                onChange={handleEndDateChange}
                style={{ width: "120px" }}
            />

        </div>
    );
};