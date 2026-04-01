import { create } from 'zustand';
import axios from 'axios';

const useFinanceStore = create((set, get) => ({
    records: [],
    summary: null,
    loading: false,
    error: null,
    
    fetchRecords: async () => {
        set({ loading: true });
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get('http://localhost:5000/api/records', {
                headers: { Authorization: `Bearer ${token}` }
            });
            set({ records: res.data, loading: false });
        } catch (err) {
            set({ error: err.response?.data?.message || 'Failed to fetch records', loading: false });
        }
    },
    
    fetchSummary: async () => {
        set({ loading: true });
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get('http://localhost:5000/api/dashboard/summary', {
                headers: { Authorization: `Bearer ${token}` }
            });
            set({ summary: res.data, loading: false });
        } catch (err) {
            set({ error: err.response?.data?.message || 'Failed to fetch summary', loading: false });
        }
    },
    
    addRecord: async (record) => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.post('http://localhost:5000/api/records', record, {
                headers: { Authorization: `Bearer ${token}` }
            });
            await get().fetchRecords();
            await get().fetchSummary();
            return { success: true };
        } catch (err) {
            return { success: false, message: err.response?.data?.message || 'Failed to add record' };
        }
    },
    
    deleteRecord: async (id) => {
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`http://localhost:5000/api/records/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            await get().fetchRecords();
            await get().fetchSummary();
        } catch (err) {
            set({ error: err.response?.data?.message || 'Failed to delete record' });
        }
    }
}));

export default useFinanceStore;
