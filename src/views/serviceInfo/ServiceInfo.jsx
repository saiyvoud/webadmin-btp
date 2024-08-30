import React, { useEffect, useState } from 'react';
import { Sidebar } from '../../components/Sidebar';
import { Modal, Input, Button, Skeleton } from 'antd'; // Import Skeleton from Ant Design
import { getServiceApi, deleteCategoryApi } from '../../api/serviceInfo';
import Swal from 'sweetalert2';
import { formatDate } from '../utils';
import { ModalAddService } from './components/ModalAddService';
import { ModalFormEditService } from './components/ModalFormEditService';

export const ServiceInfo = () => {
    const [isModalEdit, setIsModalEdit] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [newItemName, setNewItemName] = useState('');
    const [category, setCategory] = useState([]);
    const [loading, setLoading] = useState(false);
    const [nameCategory, setNameCategory] = useState();
    const [editCategoryId, setEditCategoryId] = useState(null); // State for the category ID to be edited

    const fetchData = async () => {
        setLoading(true);
        try {
            const response = await getServiceApi();
            if (!response) {
                throw new Error("No response from API");
            }
            setCategory(response);
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: "ເກີດຂໍ້ຜິດພາດ",
                text: "ບໍ່ສາມາດດຶງຂໍ້ມູນໄດ້",
            });
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
        console.log(category);
    }, []);

    const showModal = () => {
        setIsModalVisible(true);
    };

    const showModalEdit = (id, name) => {
        setEditCategoryId(id); // Set the ID of the category to be edited
        setNameCategory(name); // Set the name of the category to be edited
        setIsModalEdit(true);
    };

    const handleDelete = async (id) => {
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
                const response = await deleteCategoryApi(id);
                if (response) {
                    Swal.fire(
                        'ລົບສຳເລັດ!',
                        'ລາຍການຖືກລົບອອກແລ້ວ.',
                        'success'
                    );
                    fetchData(); // Refresh the data
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
    };

    const TableRow = ({ index, id, name, updatedAt, user, onDelete }) => (
        <tr className="border-b border-gray-200">
            <td className="py-4 px-6 text-[12px] text-gray-500">{index}</td>
            <td className="py-4 px-6 text-[12px] text-center text-gray-900">{name}</td>
            <td className="py-4 px-6 text-[12px] text-center text-gray-500">{formatDate(updatedAt)}</td>
            <td className="py-4 px-6 text-[12px] text-center text-gray-900">{user?.username}</td> {/* Access the username from the user object */}
            <td className="py-4 px-6 text-[12px]">
                <div className='flex items-center justify-center'>
                    <button onClick={() => showModalEdit(id, name)} className="bg-[#01A7B1] text-white w-[45px] py-1 rounded-full mr-2">ແກ້ໄຂ</button>
                    <button onClick={() => onDelete(id)} className="bg-red-500 text-white w-[45px] py-1 rounded-full">ລົບ</button>
                </div>
            </td>
        </tr>
    );


    return (
        <Sidebar>
            <div className="mt-14 mx-14 bg-white rounded-lg px-8 py-14 h-full">
                <div className="flex items-center justify-between mb-6">
                    <p className="text-gray-500 text-[14px]">
                        ທັງໝົດ {category.length} ລາຍການ
                    </p>
                    <button onClick={showModal} className="text-white px-4 py-2 text-[14px] bg-[#01A7B1] rounded-full">
                        ເພີ່ມປະເພດລາຍການ
                    </button>
                </div>
                <ModalAddService fetchData={fetchData} showModal={showModal} isModalVisible={isModalVisible} setIsModalVisible={setIsModalVisible} />
                <ModalFormEditService
                    fetchData={fetchData}
                    isModalEdit={isModalEdit}
                    setIsModalEdit={setIsModalEdit}
                    categoryId={editCategoryId}
                    nameCategory={nameCategory} // Pass the category name
                    setNameCategory={setNameCategory} // Pass the state setter
                />

                <div className="overflow-x-auto mt-16">
                    {loading ? (
                        // Skeleton Loading State
                        <Skeleton active paragraph={{ rows: 10 }} />
                    ) : (
                        <table className="min-w-full">
                            <thead className="bg-gray-100 h-[40px]">
                                <tr>
                                    <th className="py-3 px-6 text-start text-[12px] font-medium text-gray-500 tracking-wider">ລຳດັບ</th>
                                    <th className="py-3 px-6 text-center text-[12px] font-medium text-gray-500 tracking-wider">ຊື່</th>
                                    <th className="py-3 px-6 text-center text-[12px] font-medium text-gray-500 tracking-wider">ແກ້ໄຂລ່າສຸດ</th>
                                    <th className="py-3 px-6 text-center text-[12px] font-medium text-gray-500 tracking-wider">ຜູ້ເພີ່ມ</th>
                                    <th className="py-3 px-6 text-center text-[12px] font-medium text-gray-500 tracking-wider">ຈັດການ</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white">
                                {category.map((item, index) => (
                                    <TableRow
                                        key={item.id}
                                        index={index + 1}
                                        id={item.id}
                                        name={item.name}
                                        updatedAt={item.updatedAt}
                                        user={item.user} // Pass the user object to TableRow
                                        onDelete={handleDelete}
                                    />
                                ))}
                            </tbody>

                        </table>
                    )}
                </div>
            </div>
        </Sidebar>
    );
};
