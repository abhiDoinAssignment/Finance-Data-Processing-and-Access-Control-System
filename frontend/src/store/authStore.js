import { create } from 'zustand';
import {jwtDecode} from 'jwt-decode';
import { API_BASE_URL } from '../config/apiConfig';

const useAuthStore = create((set) => ({
    user: JSON.parse(localStorage.getItem('user')) || null,
    token: localStorage.getItem('token') || null,
    isAuthenticated: !!localStorage.getItem('token'),
    
    login: (token, user) => {
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        set({ token, user, isAuthenticated: true });
    },
    
    logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        set({ token: null, user: null, isAuthenticated: false });
    },
    
    checkTokenExpiry: () => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const decoded = jwtDecode(token);
                if (decoded.exp * 1000 < Date.now()) {
                    localStorage.removeItem('token');
                    localStorage.removeItem('user');
                    set({ token: null, user: null, isAuthenticated: false });
                }
            } catch (e) {
                set({ token: null, user: null, isAuthenticated: false });
            }
        }
    }
}));

export default useAuthStore;
