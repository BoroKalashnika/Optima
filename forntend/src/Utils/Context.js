import { createContext, useState } from "react";
const Context = createContext();
export const Provider = ({ children }) => {
    const [loading, setLoading] = useState(false);
    const [token, setToken] = useState('');
    const [email, setEmail] = useState('');
    const [codigo, setCodigo] = useState('');
    const [idRutina, setIdRutina] = useState('');
    const [idEjercicios, setIdEjercicios] = useState([]);
    const [idEjercicio, setIdEjercicio] = useState('');
    const [modalVisible, setModalVisible] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [alertTitle, setAlertTitle] = useState('');

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
            idRutina,
            setIdRutina,
            idEjercicios,
            setIdEjercicios,
            modalVisible, 
            setModalVisible,
            alertMessage, 
            setAlertMessage,
            alertTitle, 
            setAlertTitle,
            idEjercicio,
            setIdEjercicio
        }}>
            {children}
        </Context.Provider>
    );
};
export default Context;