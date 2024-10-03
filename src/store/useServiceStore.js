import { create } from 'zustand';
import { getServiceApi } from '../api/serviceInfo';
import { getService, deleteServiceApi } from '../api/serivce';

const STALE_TIME = 5 * 60 * 1000; // 5 minutes in milliseconds

const useServiceStore = create((set, get) => ({
    loading: false,
    cardData: [],
    tabList: [],
    tabActive: 'all',
    lastFetchTime: null,
    lastFetchTabTime: null,

    setTabActive: (tab) => set({ tabActive: tab }),

    fetchData: async (force = false) => {
        const { lastFetchTime } = get();
        const now = Date.now();

        if (!force && lastFetchTime && now - lastFetchTime < STALE_TIME) {
            return; // Data is still fresh, no need to fetch
        }

        set({ loading: true });
        try {
            const response = await getService();
            if (!response) throw new Error('No response from API');
            set({ cardData: response, lastFetchTime: now });
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            set({ loading: false });
        }
    },

    // category
    fetchDataTab: async (force = false) => {
        const { lastFetchTabTime } = get();
        const now = Date.now();

        if (!force && lastFetchTabTime && now - lastFetchTabTime < STALE_TIME) {
            return; // Tab data is still fresh, no need to fetch
        }

        set({ loading: true });
        try {
            const response = await getServiceApi();
            if (!response) throw new Error('No response from API');
            set({ tabList: [{ id: 'all', name: 'ທັງໝົດ' }, ...response], lastFetchTabTime: now });
        } catch (error) {
            console.error('Error fetching tab data:', error);
        } finally {
            set({ loading: false });
        }
    },

    deleteService: async (id, callback) => {
        try {
            const response = await deleteServiceApi(id);
            if (response) {
                callback();
                // Optionally refresh data after successful deletion
                get().fetchData(true);
            } else {
                throw new Error("Failed to delete");
            }
        } catch (error) {
            console.error('Error deleting item:', error);
        }
    },
}));

export default useServiceStore;