import { createContext, useContext } from "react";
import { useGlobal } from "../hook/useGlobal";

const GlobalContext = createContext();

export const GlobalProvider = ({ children }) => {
    const globalData = useGlobal();

    return (
        <GlobalContext.Provider value={globalData}>
            {children}
        </GlobalContext.Provider>
    );
};

export const useGlobalContext = () => {
    const context = useContext(GlobalContext);
    if (!context) {
        throw new Error('useGlobalContext debe usarse dentroe de un GlobalProvider');
    }
    return context;
}