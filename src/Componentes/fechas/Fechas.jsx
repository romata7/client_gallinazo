import { useEffect, useState } from "react";
import { Button, Form } from "react-bootstrap";
import { endOfMonth, format, parseISO, startOfMonth } from "date-fns";

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
    }
    const esteMes = () => {
        const inicioMes = format(startOfMonth(new Date()), 'yyyy-MM-dd');
        const finMes = format(endOfMonth(new Date()), 'yyyy-MM-dd')
        setStartDate(inicioMes);
        setEndDate(finMes);
        procesar(inicioMes, finMes);
    }
    return (
        <div className="d-flex gap-2">
            <Button
                size="sm"
                onClick={esteDia}
            >
                Hoy
            </Button>
            <Button
                size="sm"
                onClick={esteMes}
            >
                Mes
            </Button>
            <Form.Control
                type="date"
                value={startDate}
                style={{ width: '150px' }}
                onChange={handleStartDateChange}
            />
            <Form.Control
                type="date"
                value={endDate}
                style={{ width: '150px' }}
                onChange={handleEndDateChange}
            />
        </div>
    );
};