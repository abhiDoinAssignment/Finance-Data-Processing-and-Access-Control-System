import { create } from 'zustand';
import axios from 'axios';
import { API_BASE_URL } from '../config/apiConfig';

const useFinanceStore = create((set, get) => ({
    records: [],
    summary: null,
    loading: false,
    error: null,
    
    fetchRecords: async () => {
        set({ loading: true });
        console.log('DEBUG: FinanceStore - Fetching records...');
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get(`${API_BASE_URL}/records`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            console.log('DEBUG: FinanceStore - Records fetched:', res.data.length);
            set({ records: res.data, loading: false });
        } catch (err) {
            console.error('DEBUG: FinanceStore - Fetch records failed:', err.response?.data || err.message);
            set({ error: err.response?.data?.message || 'Failed to fetch records', loading: false });
        }
    },
    
    fetchSummary: async () => {
        set({ loading: true });
        console.log('DEBUG: FinanceStore - Fetching summary...');
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get(`${API_BASE_URL}/dashboard/summary`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            console.log('DEBUG: FinanceStore - Summary fetched:', res.data);
            set({ summary: res.data, loading: false });
        } catch (err) {
            console.error('DEBUG: FinanceStore - Fetch summary failed:', err.response?.data || err.message);
            set({ error: err.response?.data?.message || 'Failed to fetch summary', loading: false });
        }
    },
    
    addRecord: async (record) => {
        console.log('DEBUG: FinanceStore - Adding record:', record);
        try {
            const token = localStorage.getItem('token');
            const res = await axios.post(`${API_BASE_URL}/records`, record, {
                headers: { Authorization: `Bearer ${token}` }
            });
            console.log('DEBUG: FinanceStore - Record added successfully:', res.data);
            await get().fetchRecords();
            await get().fetchSummary();
            return { success: true };
        } catch (err) {
            console.error('DEBUG: FinanceStore - Add record failed:', err.response?.data || err.message);
            return { success: false, message: err.response?.data?.message || 'Failed to add record' };
        }
    },
    
    deleteRecord: async (id) => {
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`${API_BASE_URL}/records/${id}`, {
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
