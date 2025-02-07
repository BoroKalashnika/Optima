import { createContext, useState } from "react";
const Context = createContext();
export const Provider = ({ children }) => {
    const [loading, setLoading] = useState(false);
    const [token, setToken] = useState('');
    const [email, setEmail] = useState('');
    return (
        <Context.Provider value={{ loading, setLoading, token, setToken, email, setEmail }}>
            {children}
        </Context.Provider>
    );
};
export default Context;