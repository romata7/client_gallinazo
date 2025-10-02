import axios from "axios";
import API_BASE_URL from "../config";
import { useEffect, useState } from "react";
import { io } from 'socket.io-client';
import { useRef } from "react";

export const useGlobal = () => {
    const [shopName, setShopName] = useState("El Gallinazo");
    const [shopFullName, setFullShopName] = useState("Pollería El Gallinazo");
    const [password, setPassword] = useState("123");
    const [printDuplex, setPrintDuplex] = useState(false);

    const socketRef = useRef(null);

    const [productos, setProductos] = useState([]);
    const [productos_historial, setProductos_historial] = useState([]);

    const [clientes, setClientes] = useState([]);
    const [clientes_historial, setClientes_historial] = useState([])

    const fetchProductos = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/api/productos/`);
            setProductos(response.data.productos);
            setProductos_historial(response.data.productos_historial);
        } catch (error) {
            console.error(error);
        }
    };

    const fetchClientes = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/api/clientes`);
            setClientes(response.data.clientes);
            setClientes_historial(response.data.clientes_historial);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        if (!socketRef.current) {
            socketRef.current = io(API_BASE_URL);

            socketRef.current.emit('join-clientes');
            socketRef.current.on('clientes-actualizados', data => {
                setClientes(data.clientes);
                setClientes_historial(data.clientes_historial);
            })
        }

        return () => { }
    }, [])

    useEffect(() => {
        fetchProductos();
        fetchClientes();
    }, []);
    return {
        shopName,
        shopFullName,
        password,
        printDuplex,
        productos,
        productos_historial,
        setProductos_historial,
        clientes,
        clientes_historial,
    };
};