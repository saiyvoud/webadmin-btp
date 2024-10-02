import { create } from 'zustand';
import { getServiceApi } from '../api/serviceInfo';
import { getService, deleteServiceApi } from '../api/serivce';

const useServiceStore = create((set) => ({
    loading: false,
    cardData: [],
    tabList: [],
    tabActive: 'all',

    setTabActive: (tab) => set({ tabActive: tab }),

    fetchData: async () => {
        set({ loading: true });
        try {
            const response = await getService();
            if (!response) throw new Error('No response from API');
            set({ cardData: response });
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            set({ loading: false });
        }
    },

    fetchDataTab: async () => {
        set({ loading: true });
        try {
            const response = await getServiceApi();
            if (!response) throw new Error('No response from API');
            set({ tabList: [{ id: 'all', name: 'ທັງໝົດ' }, ...response] });
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
            } else {
                throw new Error("Failed to delete");
            }
        } catch (error) {
            console.error('Error deleting item:', error);
        }
    },
}));

export default useServiceStore;
