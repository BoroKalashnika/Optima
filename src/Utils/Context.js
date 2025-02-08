import { createContext, useState } from "react";
const Context = createContext();
export const Provider = ({ children }) => {
    const [loading, setLoading] = useState(false);
    const [token, setToken] = useState('');
    const [email, setEmail] = useState('');
    const [codigo, setCodigo] = useState('');
    const [modalVisible, setModalVisible] = useState(false);
    return (
        <Context.Provider value={{
            loading,
            setLoading,
            token,
            setToken,
            email,
            setEmail,
            codigo,
            setCodigo, 
            modalVisible, 
            setModalVisible
        }}>
            {children}
        </Context.Provider>
    );
};
export default Context;