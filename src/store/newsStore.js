// src/store/newsStore.js
import { create } from 'zustand';
import { getNewsApi } from '../api/news';
import Swal from 'sweetalert2';

const useNewsStore = create((set) => ({
    newsItem: [],
    loading: false,
    error: null,

    // Fetch news data and store in Zustand
    fetchNews: async () => {
        set({ loading: true });
        try {
            const response = await getNewsApi();
            if (!response) {
                throw new Error('No response from API');
            }
            set({ newsItem: response, error: null });
        } catch (error) {
            set({ error: 'Failed to fetch news' });
            Swal.fire({
                icon: 'error',
                title: 'Error fetching news data',
                text: 'Unable to fetch news data',
            });
            console.error('Error fetching data:', error);
        } finally {
            set({ loading: false });
        }
    },
}));

export default useNewsStore;
