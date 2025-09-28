import { useState } from "react";
import { Button, Form, InputGroup } from "react-bootstrap";
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
        <div className="d-flex align-items-center gap-3 flex-wrap">
            <div className="d-flex gap-2">
                <Button size="sm" variant="outline-primary" onClick={esteDia}>
                    Hoy
                </Button>
                <Button size="sm" variant="outline-secondary" onClick={esteMes}>
                    Este Mes
                </Button>
            </div>
            
            <InputGroup size="sm" style={{ width: '170px' }}>
                <InputGroup.Text>Desde</InputGroup.Text>
                <Form.Control
                    type="date"
                    value={startDate}
                    onChange={handleStartDateChange}
                />
            </InputGroup>
            
            <InputGroup size="sm" style={{ width: '170px' }}>
                <InputGroup.Text>Hasta</InputGroup.Text>
                <Form.Control
                    type="date"
                    value={endDate}
                    onChange={handleEndDateChange}
                />
            </InputGroup>
        </div>
    );
};