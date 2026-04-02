import { create } from 'zustand';
import {jwtDecode} from 'jwt-decode';
import { API_BASE_URL } from '../config/apiConfig';

const useAuthStore = create((set) => ({
    user: JSON.parse(localStorage.getItem('user')) || null,
    token: localStorage.getItem('token') || null,
    isAuthenticated: !!localStorage.getItem('token'),
    
    login: (token, user) => {
        console.log('DEBUG: AuthStore - Login called with token:', token ? 'EXISTS' : 'MISSING');
        console.log('DEBUG: AuthStore - User data:', user);
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        set({ token, user, isAuthenticated: true });
    },
    
    logout: () => {
        console.log('DEBUG: AuthStore - Logout called');
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        set({ token: null, user: null, isAuthenticated: false });
    },
    
    checkTokenExpiry: () => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const decoded = jwtDecode(token);
                console.log('DEBUG: AuthStore - Token Expiry Check:', new Date(decoded.exp * 1000).toLocaleString());
                if (decoded.exp * 1000 < Date.now()) {
                    console.warn('DEBUG: AuthStore - Token EXPIRED');
                    localStorage.removeItem('token');
                    localStorage.removeItem('user');
                    set({ token: null, user: null, isAuthenticated: false });
                }
            } catch (e) {
                console.error('DEBUG: AuthStore - Token decode failed', e);
                set({ token: null, user: null, isAuthenticated: false });
            }
        }
    }
}));

export default useAuthStore;
