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
        console.log("🚀 ~ UserProvider ~ user:", user)
        const storedUser = JSON.parse(localStorage.getItem('bankUser'));
        if (storedUser) {
            setUser({ ...storedUser, isLoggedIn: true, navbar: true}); 
            console.log(storedUser)
        }
    }, []);

    const toggleNavbarVisibility = async () => {
        setUser({...user, navbar: true})
        localStorage.setItem("bankUser", JSON.stringify({ ...user,  navbar: true}));
        console.log(user)
    }
    console.log("🚀 ~ UserProvider ~ user:", user)
    return (
        <UserContext.Provider value={{ user, setUser, toggleNavbarVisibility}}>
            {children}
        </UserContext.Provider>
    );
}
