import { create } from 'zustand';
import axios from 'axios';
import { API_BASE_URL } from '../config/apiConfig';

const authHeaders = () => {
  const token = localStorage.getItem('token');
  return { headers: { Authorization: `Bearer ${token}` } };
};

const useFinanceStore = create((set, get) => ({
  records: [],
  summary: null,
  loading: false,
  error: null,

  fetchRecords: async () => {
    set({ loading: true, error: null });
    console.log('[FinanceStore] Fetching records…');
    try {
      const res = await axios.get(`${API_BASE_URL}/records`, authHeaders());
      console.log('[FinanceStore] Records fetched:', res.data.length);
      set({ records: res.data, loading: false });
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to fetch records';
      console.error('[FinanceStore] fetchRecords error:', msg);
      set({ error: msg, loading: false });
    }
  },

  fetchSummary: async () => {
    set({ loading: true, error: null });
    console.log('[FinanceStore] Fetching summary…');
    try {
      const res = await axios.get(`${API_BASE_URL}/dashboard/summary`, authHeaders());
      console.log('[FinanceStore] Summary fetched:', res.data);
      set({ summary: res.data, loading: false });
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to fetch summary';
      console.error('[FinanceStore] fetchSummary error:', msg);
      set({ error: msg, loading: false });
    }
  },

  addRecord: async (record) => {
    console.log('[FinanceStore] Adding record:', record);
    try {
      const res = await axios.post(`${API_BASE_URL}/records`, record, authHeaders());
      console.log('[FinanceStore] Record added:', res.data);
      await get().fetchRecords();
      await get().fetchSummary();
      return { success: true };
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to add record';
      console.error('[FinanceStore] addRecord error:', msg);
      return { success: false, message: msg };
    }
  },

  updateRecord: async (id, record) => {
    console.log('[FinanceStore] Updating record id:', id, record);
    try {
      const res = await axios.put(`${API_BASE_URL}/records/${id}`, record, authHeaders());
      console.log('[FinanceStore] Record updated:', res.data);
      await get().fetchRecords();
      await get().fetchSummary();
      return { success: true };
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to update record';
      console.error('[FinanceStore] updateRecord error:', msg);
      return { success: false, message: msg };
    }
  },

  deleteRecord: async (id) => {
    console.log('[FinanceStore] Deleting record id:', id);
    try {
      await axios.delete(`${API_BASE_URL}/records/${id}`, authHeaders());
      console.log('[FinanceStore] Record deleted:', id);
      await get().fetchRecords();
      await get().fetchSummary();
      return { success: true };
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to delete record';
      console.error('[FinanceStore] deleteRecord error:', msg);
      set({ error: msg });
      return { success: false, message: msg };
    }
  },

  // Alias kept for compatibility
  createRecord: async (record) => {
    return await get().addRecord(record);
  },
}));

export default useFinanceStore;
