import { createContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem('user'));
        if (storedUser) {
            setUser(storedUser);
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        const { data } = await api.post('/auth/login', { email, password });
        localStorage.setItem('user', JSON.stringify(data));
        setUser(data);
        return data;
    };

    const registerAdmin = async (name, email, password) => {
        const { data } = await api.post('/auth/register-admin', { name, email, password });
        return data; // Admin doesn't auto-login usually if created by Super Admin
    };

    const logout = () => {
        localStorage.removeItem('user');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, registerAdmin, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
