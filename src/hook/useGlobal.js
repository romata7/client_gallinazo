import { useState } from "react"

export const useGlobal = () => {
    const [shopName, setShopName] = useState("El Gallinazo");
    const [shopFullName, setFullShopName] = useState("Pollería El Gallinazo");
    const [password, setPassword] = useState("gallinazo2025");
    const [printDuplex, setPrintDuplex] = useState(false)
    return {
        shopName,
        shopFullName,
        password,
        printDuplex
    };
};