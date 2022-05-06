import React, { createContext, useContext, useState, useEffect } from 'react';
import commerce from '../lib/commerce';
const Context = createContext();

export const StateContext = ({children}) => {
    const [categories, setCategories] = useState([]);

    const getCategories = async () => {
        commerce.categories.list().then(categories => setCategories(categories.data))  
    }

    useEffect(() => {
        getCategories();
    },[]);
    return (
        <Context.Provider value={{
            categories
        }}>
            {children}
        </Context.Provider>
    )
}

export const useStateContext = () => useContext(Context);