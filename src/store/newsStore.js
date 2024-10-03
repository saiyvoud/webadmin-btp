import { create } from 'zustand';
import { delNewsApi, getNewsApi } from '../api/news';
import Swal from 'sweetalert2';

const STALE_TIME = 5 * 60 * 1000; // 5 minutes in milliseconds

const useNewsStore = create((set, get) => ({
    newsItem: [],
    loading: false,
    error: null,
    lastFetchTime: null,

    fetchNews: async (force = false) => {
        const { lastFetchTime } = get();
        const now = Date.now();

        if (!force && lastFetchTime && now - lastFetchTime < STALE_TIME) {
            return; // Data is still fresh, no need to fetch
        }

        set({ loading: true });
        try {
            const response = await getNewsApi();
            if (!response) {
                throw new Error('No response from API');
            }
            set({ newsItem: response, error: null, lastFetchTime: now });
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

    deleteNews: async (id) => {
        set({ loading: true });
        try {
            await delNewsApi(id);
            set(state => ({
                newsItem: state.newsItem.filter(item => item.id !== id),
                error: null
            }));
            Swal.fire({
                icon: 'success',
                title: 'News deleted successfully',
                showConfirmButton: false,
                timer: 1500
            });
        } catch (error) {
            set({ error: 'Failed to delete news' });
            Swal.fire({
                icon: 'error',
                title: 'Error deleting news',
                text: 'Unable to delete news item',
            });
            console.error('Error deleting news:', error);
        } finally {
            set({ loading: false });
        }
    },

}));

export default useNewsStore;