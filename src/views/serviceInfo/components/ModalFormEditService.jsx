import React, { useState } from 'react';
import { Modal, Input, Button } from 'antd';
import Swal from 'sweetalert2';
import { updateServiceApi } from '../../../api/serviceInfo';

export const ModalFormEditService = ({ fetchData, isModalEdit, setIsModalEdit, categoryId, nameCategory, setNameCategory }) => {
    const [loading, setLoading] = useState(false);

    const handleOk = async () => {
        setLoading(true);
        try {
            const response = await updateServiceApi(categoryId, nameCategory);

            if (response) {
                Swal.fire({
                    title: "ສຳເລັດ",
                    text: "ແກ້ໄຂປະເພດທຶນສຳເລັດ",
                    icon: "success",
                });
                setIsModalEdit(false);
                fetchData();
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
            setNameCategory('');
        }
    };

    const handleCancel = () => {
        setIsModalEdit(false);
        setNameCategory('');
    };

    return (
        <Modal
            open={isModalEdit}
            onOk={handleOk}
            onCancel={handleCancel}
            footer={null}
        >
            <div className="py-10">
                <h2 className='mb-7 text-[20px] font-medium text-center text-[#01A7B1]'>
                    ປ່ຽນຊື່ປະເພດບໍລິການ
                </h2>
                <label className="block text-[14px] font-medium text-[#01A7B1] mb-2">ຊື່ປະເພດບໍລິການ</label>
                <Input
                    placeholder="ປ້ອນຊື່ບໍລິການ...."
                    value={nameCategory}
                    className='rounded-full border border-[#01A7B1] py-3 px-7 mt-3'
                    onChange={(e) => setNameCategory(e.target.value)}
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
