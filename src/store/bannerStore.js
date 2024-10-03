import { create } from 'zustand';
import { getBannerApi, delBannerApi, upadteSwitchBannerApi } from '../api/banner';
import Swal from 'sweetalert2';

const STALE_TIME = 5 * 60 * 1000; // 5 minutes in milliseconds

export const useBannerStore = create((set, get) => ({
    bannerData: [],
    loading: false,
    error: null,
    lastFetchTime: null,

    fetchBanner: async (force = false) => {
        const { lastFetchTime } = get();
        const now = Date.now();

        if (!force && lastFetchTime && now - lastFetchTime < STALE_TIME) {
            return; // Data is still fresh, no need to fetch
        }

        set({ loading: true });
        try {
            const response = await getBannerApi();
            if (!response) {
                throw new Error('No response from API');
            }
            set({ bannerData: response, error: null, lastFetchTime: now });
        } catch (error) {
            set({ error: 'Failed to fetch banner data' });
            Swal.fire({
                icon: 'error',
                title: 'Error fetching banner data',
                text: 'Unable to fetch banner data',
            });
            console.error('Error fetching data:', error);
        } finally {
            set({ loading: false });
        }
    },

    deleteBanner: async (id) => {
        try {
            const result = await Swal.fire({
                title: 'ຢືນຢັນການລົບ',
                text: "ທ່ານແນ່ໃຈບໍ່ວ່າຕ້ອງການລົບລາຍການນີ້?",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'ຢືນຢັນ',
                cancelButtonText: 'ຍົກເລີກ',
            });
            if (result.isConfirmed) {
                const response = await delBannerApi(id);
                if (response) {
                    Swal.fire('ລົບສຳເລັດ!', 'ລາຍການຖືກລົບອອກແລ້ວ.', 'success');
                    set((state) => ({
                        bannerData: state.bannerData.filter(item => item.id !== id)
                    }));
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
    },

    updateBannerSwitch: async (id, value) => {
        try {
            const response = await upadteSwitchBannerApi(id, value);
            if (response) {
                set((state) => ({
                    bannerData: state.bannerData.map(item =>
                        item.id === id ? { ...item, isPublished: value } : item
                    )
                }));
                Swal.fire(
                    value ? 'ເຊື່ອງສຳເລັດ!' : 'ປິດການເຊື່ອງສຳເລັດ!',
                    value ? 'ລາຍການຖືກເຊື່ອງແລ້ວ.' : 'ປິດການເຊື່ອງລາຍການແລ້ວ.',
                    'success'
                );
            }
        } catch (error) {
            console.error('Error updating banner switch:', error);
        }
    },
}));