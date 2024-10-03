import create from 'zustand';
import { getCompanyDataApi, getCoverImageApi, getAboutApi, delAboutApi } from '../api/about';
import Swal from 'sweetalert2';

const STALE_TIME = 5 * 60 * 1000; // 5 minutes in milliseconds

export const useAboutStore = create((set, get) => ({
    companyData: [],
    coverImg: [],
    aboutData: [],
    loading: false,
    lastFetchTime: {
        companyData: null,
        coverImg: null,
        aboutData: null
    },

    fetchCompanyData: async (force = false) => {
        const { lastFetchTime } = get();
        const now = Date.now();

        if (!force && lastFetchTime.companyData && now - lastFetchTime.companyData < STALE_TIME) {
            return; // Data is still fresh, no need to fetch
        }

        set({ loading: true });
        try {
            const response = await getCompanyDataApi();
            set(state => ({
                companyData: response,
                lastFetchTime: { ...state.lastFetchTime, companyData: now }
            }));
        } catch (error) {
            Swal.fire({
                title: "ເກີດຂໍ້ຜິດພາດ!",
                text: "ການດຶງຂໍ້ມູນບໍ່ສຳເລັດ",
                icon: "error"
            });
        } finally {
            set({ loading: false });
        }
    },

    fetchCoverImg: async (force = false) => {
        const { lastFetchTime } = get();
        const now = Date.now();

        if (!force && lastFetchTime.coverImg && now - lastFetchTime.coverImg < STALE_TIME) {
            return; // Data is still fresh, no need to fetch
        }

        set({ loading: true });
        try {
            const response = await getCoverImageApi();
            set(state => ({
                coverImg: response,
                lastFetchTime: { ...state.lastFetchTime, coverImg: now }
            }));
        } catch (error) {
            Swal.fire({
                title: "ເກີດຂໍ້ຜິດພາດ!",
                text: "ການດຶງຂໍ້ມູນບໍ່ສຳເລັດ",
                icon: "error"
            });
        } finally {
            set({ loading: false });
        }
    },

    fetchAboutData: async (force = false) => {
        const { lastFetchTime } = get();
        const now = Date.now();

        if (!force && lastFetchTime.aboutData && now - lastFetchTime.aboutData < STALE_TIME) {
            return; // Data is still fresh, no need to fetch
        }

        set({ loading: true });
        try {
            const response = await getAboutApi();
            set(state => ({
                aboutData: response,
                lastFetchTime: { ...state.lastFetchTime, aboutData: now }
            }));
        } catch (error) {
            Swal.fire({
                title: "ເກີດຂໍ້ຜິດພາດ!",
                text: "ການດຶງຂໍ້ມູນບໍ່ສຳເລັດ",
                icon: "error"
            });
        } finally {
            set({ loading: false });
        }
    },

    deleteAbout: async (id, fetchAboutData) => {
        try {
            const result = await Swal.fire({
                title: 'ຢືນຢັນການລົບ',
                text: "ທ່ານແນ່ໃຈບໍ່ວ່າຕ້ອງການລົບລາຍການນີ້?",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'ຢືນຢັນ',
                cancelButtonText: 'ຍົກເລີກ'
            });
            if (result.isConfirmed) {
                const response = await delAboutApi(id);
                if (response) {
                    Swal.fire(
                        'ລົບສຳເລັດ!',
                        'ລາຍການຖືກລົບອອກແລ້ວ.',
                        'success'
                    );
                    // Fetch new data after successful deletion
                    get().fetchAboutData(true);
                    get().fetchCompanyData(true);
                    get().fetchCoverImg(true);
                } else {
                    throw new Error("Failed to delete");
                }
            }
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'ເກີດຂໍ້ຜິດພາດ',
                text: 'ບໍ່ສາມາດລົບລາຍການໄດ້',
            });
            console.error('Error deleting item:', error);
        }
    }
}));