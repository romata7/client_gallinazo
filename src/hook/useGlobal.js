import axios from "axios";
import API_BASE_URL from "../config";
import { useEffect, useState } from "react";
import { io } from 'socket.io-client';

export const useGlobal = () => {
    const [shopName, setShopName] = useState("El Gallinazo");
    const [shopFullName, setFullShopName] = useState("Pollería El Gallinazo");
    const [password, setPassword] = useState("123");
    const [printDuplex, setPrintDuplex] = useState(false);

    const [productos, setProductos] = useState([]);
    const [productos_historial, setProductos_historial] = useState([]);

    const fetchProductos = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/api/productos/`);
            setProductos(response.data.productos);
            setProductos_historial(response.data.productos_historial);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        // Connectar Socket.IO
        const newSocket = io(API_BASE_URL);

        // Unirse a la sala de productos
        newSocket.emit('join-productos');

        // Escuchar actualizaciones de productos
        newSocket.on('productos-actualizados', data => {
            setProductos(data.productos);
            setProductos_historial(data.productos_historial);
        });

        return () => {
            newSocket.disconnect();
        }
    }, []);

    useEffect(() => {
        fetchProductos();
    }, []);
    return {
        shopName,
        shopFullName,
        password,
        printDuplex,
        productos,
        productos_historial,
        setProductos_historial,
    };
};