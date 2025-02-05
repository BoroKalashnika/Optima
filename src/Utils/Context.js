import { createContext , useState } from "react";
const Context = createContext();
export const Provider = ({children})=>{
    const [loading, setLoading] = useState(false);
    return(
        <Context.Provider value={{loading,setLoading}}>
            {children}
        </Context.Provider>
    );
};
export default Context;