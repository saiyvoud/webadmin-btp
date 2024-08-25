import { Modal, Input, Button } from 'antd';
import { useState } from 'react';
import Swal from 'sweetalert2';
import { addServiceApi } from '../../../api/serviceInfo';
import { useNavigate } from 'react-router-dom';

export const ModalAddService = ({ fetchData, isModalVisible, setIsModalVisible }) => {
    const [newItemName, setNewItemName] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const userId = localStorage.getItem("UID")

    const handleOk = async () => {
        setLoading(true);
        try {
            const response = await addServiceApi(newItemName, userId);  // Pass userId here

            if (response) {
                Swal.fire({
                    title: "ສຳເລັດ",
                    text: "ເພີ່ມປະເພດທຶນສຳເລັດ",
                    icon: "success",
                }).then(() => {
                    setIsModalVisible(false);  // Close modal on success
                });
                fetchData()

            } else {
                Swal.fire({
                    title: "ຜິດພາດ",
                    text: "ທຶນນີ້ມີແລ້ວ",
                    icon: 'error'
                });
            }
        } catch (error) {
            Swal.fire({
                title: "ເກີດຂໍ້ຜິດພາດ",
                text: "ລົງທະບຽນບໍ່ສຳເລັດ",
                icon: "error"
            });
        } finally {
            setLoading(false);
            setNewItemName('');
        }
    };

    const handleCancel = () => {
        setIsModalVisible(false);
        setNewItemName('');
    };

    return (
        <Modal
            open={isModalVisible}
            onOk={handleOk}
            onCancel={handleCancel}
            footer={null}
        >
            <div className="py-10">
                <h2 className='mb-7 text-[20px] font-medium text-center text-[#01A7B1]'>
                    ເພີ່ມປະເພດບໍລິການ
                </h2>
                <label className="block text-[14px] font-medium text-[#01A7B1] mb-2">ເພີ່ມຊື່</label>
                <Input
                    placeholder="ປ້ອນຊື່ບໍລິການ...."
                    value={newItemName}
                    className='rounded-full border border-[#01A7B1] py-3 px-7 mt-3'
                    onChange={(e) => setNewItemName(e.target.value)}
                />
                <div className="flex justify-center mt-20 space-x-4">
                    <Button onClick={handleCancel} className="bg-white border-2 text-[14px] border-[#F87171] rounded-full text-[#F87171] w-[80px] h-[35px]">
                        ຍົກເລີກ
                    </Button>
                    <Button onClick={handleOk} loading={loading} className="bg-[#01A7B1] border-2 border-transparent rounded-full text-[14px] text-white w-[80px] h-[35px]">
                        ບັນທຶກ
                    </Button>
                </div>
            </div>
        </Modal>
    );
};
