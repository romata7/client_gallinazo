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

    const [productos, setProductos] = useState([]);
    const [productos_historial, setProductos_historial] = useState([]);

    const [clientes, setClientes] = useState([]);
    const [clientes_historial, setClientes_historial] = useState([]);

    const [mesas, setMesas] = useState([]);
    const [mesas_historial, setMesas_historial] = useState([])

    const [mozos, setMozos] = useState([]);
    const [mozos_historial, setMozos_historial] = useState([]);

    const [tipopagos, setTipopagos] = useState([]);
    const [tipopagos_historial, setTipopagos_historial] = useState([]);

    const [gastos, setGastos] = useState([]);
    const [gastos_historial, setGastos_historial] = useState([]);

    const clientsSocket = useRef(null);
    const productsSocket = useRef(null);
    const mesasSocket = useRef(null);
    const mozosSocket = useRef(null);
    const tipopagosSocket = useRef(null);
    const gastosSocket = useRef(null);

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

    const fetchMesas = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/api/mesas`);
            setMesas(response.data.mesas);
            setMesas_historial(response.data.mesas_historial);
        } catch (error) {
            console.error('fetchMesas:', error);
        }
    }

    const fetchMozos = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/api/mozos`);
            setMozos(response.data.mozos);
            setMozos_historial(response.data.mozos_historial);
        } catch (error) {
            console.error('fetchMozos:', error);
        }
    }

    const fetchTipopagos = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/api/tipopagos`);
            setTipopagos(response.data.tipopagos);
            setTipopagos_historial(response.data.tipopagos_historial);
        } catch (error) {
            console.error('fetchTipopagos:', error);
        }
    }

    const fetchGastos = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/api/gastos`);
            setGastos(response.data.gastos);
            setGastos_historial(response.data.gastos_historial);
        } catch (error) {
            console.error('fetchGastos:', error);
        }
    }

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

    // Mesas
    useEffect(() => {
        if (!mesasSocket.current) {
            mesasSocket.current = io(API_BASE_URL);
            mesasSocket.current.emit('join-mesas');
            mesasSocket.current.on('mesas-actualizadas', data => {
                setMesas(data.mesas);
                setMesas_historial(data.mesas_historial);
            })
        }
    }, [])

    // Mozos
    useEffect(() => {
        if (!mozosSocket.current) {
            mozosSocket.current = io(API_BASE_URL);
            mozosSocket.current.emit('join-mozos');
            mozosSocket.current.on('mozos-actualizados', data => {
                setMozos(data.mozos);
                setMozos_historial(data.mozos_historial);
            })
        }
    }, [])

    // Tipopagos
    useEffect(() => {
        if (!tipopagosSocket.current) {
            tipopagosSocket.current = io(API_BASE_URL);
            tipopagosSocket.current.emit('join-tipopagos');
            tipopagosSocket.current.on('tipopagos-actualizados', data => {
                setTipopagos(data.tipopagos);
                setTipopagos_historial(data.tipopagos_historial);
            })
        }
    }, [])

    // Gastos
    useEffect(() => {
        if (!gastosSocket.current) {
            gastosSocket.current = io(API_BASE_URL);
            gastosSocket.current.emit('join-gastos');
            gastosSocket.current.on('gastos-actualizados', data => {
                setGastos(data.gastos);
                setGastos_historial(data.gastos_historial);
            })
        }
    }, []);

    useEffect(() => {
        fetchProductos();
        fetchClientes();
        fetchMesas();
        fetchMozos();
        fetchTipopagos();
        fetchGastos();
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
        setClientes_historial,

        mesas,
        mesas_historial,
        setMesas_historial,

        mozos,
        mozos_historial,
        setMozos_historial,

        tipopagos,
        tipopagos_historial,
        setTipopagos_historial,

        gastos,
        gastos_historial,
        setGastos_historial,
    };
};