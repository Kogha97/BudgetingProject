import { createContext, useEffect, useState } from "react";

export const UserContext = createContext();

export default function UserProvider({ children }) {
    const [user, setUser] = useState({
        email: "",
        id: "",
        username: "",
        image: "",
        firstName: '',
        lastName: '',
        phoneNumber: '',
        isLoggedIn: false, // Initially, the user is not logged in
        navbar: true
    });

    useEffect(() => {
  
        const storedUser = JSON.parse(localStorage.getItem('bankUser'));
        if (storedUser) {
            setUser({ ...storedUser, isLoggedIn: true, navbar: true}); 

        }
    }, []);
    const toggleNavbarVisibility = () => {
        setUser(currentState => {
            const newState = { ...currentState, navbar: !currentState.navbar };
            localStorage.setItem("bankUser", JSON.stringify(newState));
            return newState;
        });
    };
    

    return (
        <UserContext.Provider value={{ user, setUser, toggleNavbarVisibility}}>
            {children}
        </UserContext.Provider>
    );
}
