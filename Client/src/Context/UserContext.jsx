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
        navbar: false
    });

    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem('bankUser'));
        if (storedUser) {
            setUser({ ...storedUser, isLoggedIn: true }); 
            console.log(storedUser)
        }
    }, []);

    const toggleNavbarVisibility = () => {
        setUser({...user, navbar: true})
        localStorage.setItem("bankUser", JSON.stringify({ ...user,  navbar: true}));
        console.log(user)
    }

    return (
        <UserContext.Provider value={{ user, setUser, toggleNavbarVisibility}}>
            {children}
        </UserContext.Provider>
    );
}
