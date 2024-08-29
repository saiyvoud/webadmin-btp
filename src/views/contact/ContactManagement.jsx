import React, { useEffect, useState } from 'react';
import { Sidebar } from '../../components/Sidebar';
import { Modal, Input, Button, Skeleton } from 'antd';
import { useNavigate } from 'react-router-dom';
import { delteUserApi, getUserApi, updateUserApi } from '../../api/user';
import Swal from 'sweetalert2';
import { FaCamera } from 'react-icons/fa6';
import { deleteContactApi, getContactApi } from '../../api/contact';
import TextArea from 'antd/es/input/TextArea';

export const ContactManagement = () => {
    const navigate = useNavigate();
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [loading, setLoading] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [updatedData, setUpdatedData] = useState({
        email: '',
        name: '',
        phoneNumber: '',
        comment: '',
    });
    const [data, setData] = useState([]);

    const fetchData = async () => {
        setLoading(true);
        try {
            const response = await getContactApi();
            if (!response) {
                throw new Error('No response from API');
            }
            setData(response);
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
    }, []);

    const showModal = (item = null) => {
        if (item) {
            setEditingItem(item);
            setUpdatedData({
                name: item.name,
                phoneNumber: item.phoneNumber,
                email: item.email,
                comment: item.comment
            });
        } else {
            setEditingItem(null);
            setUpdatedData({
                name: '',
                phoneNumber: '',
                email: '',
                comment: ''
            });
        }
        setIsModalVisible(true);
    };

    const handleOk = async () => {
        setLoading(true);
        try {
            if (editingItem) {
                const response = await updateUserApi(
                    editingItem.id,
                    updatedData
                );

                if (response) {
                    Swal.fire('ສຳເລັດ', 'ຂໍໍໍມູນຖືກອັບເດດແລ້ວ', 'success');
                    fetchData();
                }
            }
        } catch (error) {
            Swal.fire('ເກີດຂໍ້ຜິດພາດ', 'ບໍ່ສາມາດອັບເດດຂໍໍໍມູນໄດ້', 'error');
            console.error('Error updating user:', error);
        } finally {
            setLoading(false);
            setIsModalVisible(false);
        }
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    const deleteItem = async (id) => {
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
                const response = await deleteContactApi(id);
                if (response) {
                    Swal.fire(
                        'ລົບສຳເລັດ!',
                        'ລາຍການຖືກລົບອອກແລ້ວ.',
                        'success'
                    );
                    fetchData();
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

    const TableRow = ({ index, id, name, phoneNumber, email, comment, onShowDetail, onDelete }) => (
        <tr className="border-b w-full border-gray-200">
            <td className="py-4 px-1 w-[70px] text-[12px] text-gray-500 text-center">{index}</td>
            <td className="py-4 px-3 text-[12px] w-[120px] text-center text-gray-900 truncate">{name}</td>
            <td className="py-4 px-3 text-[12px] w-[120px] text-center text-gray-500 truncate">{phoneNumber}</td>
            <td className="py-4 px-3 text-[12px] w-[150px] text-center text-gray-500 truncate">{email}</td>
            <td className="py-4 px-3 text-[12px] w-[200px] text-center text-gray-500">
                <div className="max-w-[200px] overflow-hidden text-ellipsis whitespace-nowrap">
                    {comment}
                </div>
            </td>
            <td className="py-4 px-3 text-[12px] w-[150px]">
                <div className='flex items-center justify-center space-x-2'>
                    <button
                        onClick={() => onShowDetail({ id, name, phoneNumber, email, comment })}
                        className="bg-[#01A7B1] text-white w-[60px] py-1 rounded-full"
                    >
                        ແກ້ໄຂ
                    </button>
                    <button onClick={() => onDelete(id)} className="bg-red-500 text-white w-[60px] py-1 rounded-full">ລົບ</button>
                </div>
            </td>
        </tr>
    );

    return (
        <Sidebar>
            <div className="mt-14 mx-14 bg-white rounded-lg px-8 py-14 h-screen">
                <div className="flex items-center justify-between mb-6">
                    <p className="text-gray-500 text-[14px]">
                        ທັງໝົດ {data ? data.length : 0} ລາຍການ
                    </p>
                    {/* <button onClick={() => navigate('/userInfo/formAddUser')}
                        className="text-white px-4 py-2 text-[14px] bg-[#01A7B1] rounded-full">
                        ເພີ່ມປະເພດລາຍການ
                    </button> */}
                </div>
                <Modal
                    open={isModalVisible}
                    // onOk={handleOk}
                    onCancel={handleCancel}
                    footer={null}
                >
                    <div className="py-10">
                        <h2 className='mb-7 text-[20px] font-medium text-center'>ລາຍລະອຽດຂໍ້ມູນການຕິດຕໍໍ່</h2>
                        <Input
                            placeholder="Full name"
                            value={updatedData.name}
                            onChange={(e) => setUpdatedData({ ...updatedData, name: e.target.value })}
                            className="mb-3"
                        />
                        <Input
                            placeholder="Phone Number"
                            value={updatedData.phoneNumber}
                            onChange={(e) => setUpdatedData({ ...updatedData, phoneNumber: e.target.value })}
                            className="mb-3"
                        />
                        <Input
                            placeholder="Email"
                            value={updatedData.email}
                            onChange={(e) => setUpdatedData({ ...updatedData, email: e.target.value })}
                            className="mb-3"
                        />
                        <TextArea
                            rows={5}
                            placeholder="Comment"
                            value={updatedData.comment}
                            onChange={(e) => setUpdatedData({ ...updatedData, comment: e.target.value })}
                            className="mb-3"
                        />
                        <div className="flex justify-center">
                            {/* <Button onClick={handleOk} type="primary" className="mr-2">Save</Button> */}
                            <Button onClick={handleCancel} type="primary" >ປິດ</Button>
                        </div>
                    </div>
                </Modal>

                {loading ? (
                    <Skeleton active />
                ) : (
                    <div className="rounded-lg overflow-x-auto border w-full h-full pb-5">
                        <table className="w-full h-full">
                            <thead>
                                <tr className="bg-[#01A7B1]/20 border-b w-full">
                                    <th className="py-4 px-3 text-black text-[12px] font-medium text-center">ລໍາດັບ</th>
                                    <th className="py-4 px-3 text-black text-[12px] font-medium text-center">ຊື່</th>
                                    <th className="py-4 px-3 text-black text-[12px] font-medium text-center">ເບີໂທ</th>
                                    <th className="py-4 px-3 text-black text-[12px] font-medium text-center">ອີເມລ</th>
                                    <th className="py-4 px-3 text-black text-[12px] font-medium text-center w-[200px]">Comment</th>
                                    <th className="py-4 px-3 text-black text-[12px] font-medium text-center">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data && data.map((item, index) => (
                                    <TableRow
                                        key={item.id}
                                        index={index + 1}
                                        id={item.id}
                                        name={item.name}
                                        phoneNumber={item.phoneNumber}
                                        email={item.email}
                                        comment={item.comment}
                                        onShowDetail={showModal}
                                        onDelete={deleteItem}
                                    />
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </Sidebar>
    );
};