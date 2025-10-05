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
    const [clientes_historial, setClientes_historial] = useState([]);

    const clientsSocket = useRef(null);
    const productsSocket = useRef(null);

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

    // Clientes
    useEffect(() => {
        if (!clientsSocket.current) {
            clientsSocket.current = io(API_BASE_URL);
            clientsSocket.current.emit('join-clientes');
            clientsSocket.current.on('clientes-actualizados', data => {
                setClientes(data.clientes);
                setClientes_historial(data.clientes_historial);
            });
        };
        return () => {
        }
    }, []);

    // Productos
    useEffect(() => {
        if (!productsSocket.current) {
            productsSocket.current = io(API_BASE_URL);
            productsSocket.current.emit('join-productos');
            productsSocket.current.on('productos-actualizados', data => {
                setProductos(data.productos);
                setProductos_historial(data.productos_historial);
            })
        }
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