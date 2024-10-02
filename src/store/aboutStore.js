import create from 'zustand';
import { getCompanyDataApi, getCoverImageApi, getAboutApi, delAboutApi } from '../api/about';
import Swal from 'sweetalert2';

// Zustand store
export const useAboutStore = create((set) => ({
    companyData: [],
    coverImg: [],
    aboutData: [],
    loading: false,
    fetchCompanyData: async () => {
        set({ loading: true });
        try {
            const response = await getCompanyDataApi();
            set({ companyData: response });
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
    fetchCoverImg: async () => {
        set({ loading: true });
        try {
            const response = await getCoverImageApi();
            set({ coverImg: response });
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
    fetchAboutData: async () => {
        set({ loading: true });
        try {
            const response = await getAboutApi();
            set({ aboutData: response });
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
                    fetchAboutData(); // Refresh the data
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
