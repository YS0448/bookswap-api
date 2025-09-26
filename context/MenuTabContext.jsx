import React, { createContext, useContext, useState } from'react';

const MenuTabContext = createContext();

export const MenuTabProvider = ({ children })=>{
    const [activeTab, setActiveTab] = useState('takeaway');
    return(
        <MenuTabContext.Provider value={{activeTab, setActiveTab}}>
            {children}
        </MenuTabContext.Provider>
    );
};

export const useMenuTab = () => useContext(MenuTabContext);