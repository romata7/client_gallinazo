import { useEffect, useState } from "react";
import { Form } from "react-bootstrap";
import { format, parseISO } from "date-fns";

export const Fechas = ({ fi = new Date(), ff = new Date() }) => {
    const [startDate, setStartDate] = useState(format(fi, 'yyyy-MM-dd'));
    const [endDate, setEndDate] = useState(format(ff, 'yyyy-MM-dd'));

    const handleStartDateChange = (e) => {
        setStartDate(e.target.value);
    };

    const handleEndDateChange = (e) => {
        setEndDate(e.target.value);
    };

    useEffect(() => {
        console.log("Fecha de Inicio:", startDate);
        console.log("Fecha de Fin:", endDate);
    }, [startDate, endDate]);

    return (
        <div className="container">
            <Form.Group controlId="startDate">
                <Form.Label>Fecha de Inicio:</Form.Label>
                <Form.Control
                    type="date"
                    value={startDate}
                    onChange={handleStartDateChange}
                />
            </Form.Group>
            <Form.Group controlId="endDate">
                <Form.Label>Fecha de Fin:</Form.Label>
                <Form.Control
                    type="date"
                    value={endDate}
                    onChange={handleEndDateChange}
                />
            </Form.Group>
        </div>
    );
};