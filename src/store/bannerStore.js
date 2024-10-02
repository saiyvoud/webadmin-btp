import { create } from 'zustand';
import { getBannerApi, delBannerApi, upadteSwitchBannerApi } from '../api/banner';

export const useBannerStore = create((set) => ({
    bannerData: [],
    loading: false,

    // Fetch banner data
    fetchBanner: async () => {
        set({ loading: true });
        try {
            const response = await getBannerApi();
            if (response) {
                set({ bannerData: response });
            } else {
                throw new Error("No response from API");
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            set({ loading: false });
        }
    },

    // Delete banner
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
                    await set((state) => ({ bannerData: state.bannerData.filter(item => item.id !== id) }));
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

    // Update banner switch
    updateBannerSwitch: async (id, value) => {
        try {
            const response = await upadteSwitchBannerApi(id, value);
            if (response) {
                await set((state) => ({
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
