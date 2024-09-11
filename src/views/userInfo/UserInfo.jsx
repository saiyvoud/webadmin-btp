import React, { useEffect, useState } from 'react';
import { Sidebar } from '../../components/Sidebar';
import { Modal, Input, Button, Skeleton, Select } from 'antd'; // Import Skeleton from Ant Design
import { useNavigate } from 'react-router-dom';
import { delteUserApi, getUserApi, updateUserApi } from '../../api/user'; // Import updateUserApi
import Swal from 'sweetalert2';
import { FaCamera } from 'react-icons/fa6';
import CryptoJS from "crypto-js";
import { SECREAT_KEY } from '../../constants';



export const UserInfo = () => {
    const navigate = useNavigate();
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [loading, setLoading] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [updatedData, setUpdatedData] = useState({
        email: '',
        password: '',
        firstName: '',
        lastName: '',
        phoneNumber: '',
        role: '',
    });
    const [data, setData] = useState([]);

    function decryptData(data) {
        return CryptoJS.AES.decrypt(data, SECREAT_KEY).toString(CryptoJS.enc.Utf8);
    }
    const encryptedRole = localStorage.getItem("role");
    const currentRole = decryptData(encryptedRole);
    console.log(currentRole);

    const fetchData = async () => {
        setLoading(true);
        try {
            const response = await getUserApi();
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
                firstName: item.firstName,
                lastName: item.lastName,
                phoneNumber: item.phoneNumber,
                email: item.email,
                password: item.password,
                role: item.role,
            });
        } else {
            setEditingItem(null);
            setUpdatedData({
                firstName: '',
                lastName: '',
                phoneNumber: '',
                email: '',
                password: '',
                role: '',
            });
        }
        setIsModalVisible(true);
    };

    const handleOk = async () => {
        setLoading(true);
        if (!(currentRole === "superadmin")) {
            Swal.fire({
                icon: "error",
                title: "ທ່ານບໍ່ມີສິດໃນການແກ້ໄຂ",
            })
            setLoading(false)
        }
        else {
            try {
                if (editingItem) {
                    const updatedFields = { ...updatedData };

                    // Compare the original email with the updated email
                    if (editingItem.email === updatedData.email) {
                        delete updatedFields.email; // Remove the email field if it hasn't changed
                    }

                    const response = await updateUserApi(
                        editingItem.id,
                        updatedFields // Pass only the changed fields
                    );

                    if (response) {
                        Swal.fire('ສຳເລັດ', 'ຂໍ້ມູນຖືກອັບເດດແລ້ວ', 'success');
                        fetchData(); // Refresh data after update
                    }
                }
            } catch (error) {
                Swal.fire('ເກີດຂໍ້ຜິດພາດ', 'ບໍ່ສາມາດອັບເດດຂໍ້ມູນໄດ້', 'error');
                console.error('Error updating user:', error);
            } finally {
                setLoading(false);
                setIsModalVisible(false);
            }
        }
    };


    const handleCancel = () => {
        setIsModalVisible(false);
    };

    const deleteItem = async (id) => {
        // console.log(!(currentRole === "superadmin"));

        if (!(currentRole === "superadmin")) {
            Swal.fire({
                icon: "error",
                title: "ທ່ານບໍ່ມີສິດໃນການລົບ",
            })
        } else {
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
                    const response = await delteUserApi(id);
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
        }
    };


    const TableRow = ({ index, id, profile, firstName, lastName, phoneNumber, email, password, role, onEdit, onDelete }) => (
        <tr className={`border-b w-full border-gray-200 ${data.length > 10 && 'h-full'}`}>
            <td className="py-4 sm:px-5 xl:px-1 xl:w-[70px] text-[12px] text-gray-500 text-center">{index}</td>
            <td className="py-4 px-3 text-[12px] text-center flex justify-center items-center">
                <div className="relative w-16 h-16">
                    <img src={profile} alt={firstName} className="w-16 h-16 object-cover rounded-full" />
                    <div
                        onClick={() => navigate(`/userInfo/editProfile/${id}`)}
                        className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300 cursor-pointer"
                    >
                        <FaCamera className='text-white text-[16px]' />
                    </div>
                </div>
            </td>
            <td className="py-4 px-3 text-[12px] w-[120px] text-center text-gray-900 truncate">{firstName}</td>
            <td className="py-4 px-3 text-[12px] w-[120px] text-center text-gray-500 truncate">{lastName}</td>
            <td className="py-4 px-3 text-[12px] w-[120px] text-center text-gray-500 truncate">{phoneNumber}</td>
            <td className="py-4 px-3 text-[12px] w-[150px] text-center text-gray-500 truncate">{email}</td>
            <td className="py-4 px-3 text-[12px] w-[120px] text-center text-gray-500 truncate">{password}</td>
            <td className="py-4 px-3 text-[12px] w-[100px] text-center text-gray-500 truncate">{role}</td>
            <td className="py-4 px-3 text-[12px] w-[150px]">
                <div className='flex items-center justify-center space-x-2'>
                    <button
                        onClick={() => onEdit({ id, firstName, lastName, phoneNumber, email, password, role })}
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
            <div className={`xl:mt-14 xl:mx-14 bg-white rounded-lg sm:px-6 xl:px-8 lg:py-10 sm:py-6 xl:py-14 ${data.length > 10 ? 'min-h-screen' : 'h-screen'}`}>
                <div div className="flex items-center justify-between mb-6">
                    <p className="text-gray-500 text-[14px]">
                        ທັງໝົດ {data ? data.length : 0} ລາຍການ
                    </p>
                    <button onClick={() => navigate('/userInfo/formAddUser')}
                        className="text-white px-4 py-2 text-[14px] bg-[#01A7B1] rounded-full">
                        ເພີ່ມປະເພດລາຍການ
                    </button>
                </div>
                <Modal
                    open={isModalVisible}
                    onOk={handleOk}
                    onCancel={handleCancel}
                    footer={null}
                >
                    <div className="py-10">
                        <h2 className='mb-7 text-[20px] font-medium text-center'>ແກ້ໄຂຂໍໍໍມູນຜູ້ໃຊ້</h2>
                        <Input
                            placeholder="First Name"
                            value={updatedData.firstName}
                            onChange={(e) => setUpdatedData({ ...updatedData, firstName: e.target.value })}
                            className="mb-3"
                        />
                        <Input
                            placeholder="Last Name"
                            value={updatedData.lastName}
                            onChange={(e) => setUpdatedData({ ...updatedData, lastName: e.target.value })}
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
                        <Input
                            placeholder="Password"
                            value={updatedData.password}
                            onChange={(e) => setUpdatedData({ ...updatedData, password: e.target.value })}
                            className="mb-3"
                        />
                        <Select
                            placeholder="Select Role"
                            value={updatedData.role}
                            onChange={(value) => setUpdatedData({ ...updatedData, role: value })}
                            className="mb-7 w-full"
                        >
                            <Option value="admin">Admin</Option>
                            <Option value="superadmin">Super Admin</Option>
                        </Select>
                        <div className="flex justify-center">
                            <Button onClick={handleOk} type="primary" className="mr-2">Save</Button>
                            <Button onClick={handleCancel}>Cancel</Button>
                        </div>
                    </div>
                </Modal>

                {/* Display Skeleton while loading */}
                {loading ? (
                    <Skeleton active />
                ) : (
                    <div className="rounded-lg overflow-x-auto border w-full h-full pb-5">
                        <table className="w-full h-full">
                            <thead>
                                <tr className="bg-[#01A7B1]/20 border-b w-full">
                                    <th className="py-4 xl:px-3 xl:w-fit  text-black text-[12px] font-medium text-center">ລໍາດັບ</th>
                                    <th className="py-4 xl:px-3 text-black text-[12px] font-medium text-center">ຮູບ</th>
                                    <th className="py-4 xl:px-3 text-black text-[12px] font-medium text-center">ຊື່</th>
                                    <th className="py-4 xl:px-3 text-black text-[12px] font-medium text-center">ນາມສະກຸນ</th>
                                    <th className="py-4 xl:px-3 text-black text-[12px] font-medium text-center">ເບີໂທ</th>
                                    <th className="py-4 xl:px-3 text-black text-[12px] font-medium text-center">ອີເມລ</th>
                                    <th className="py-4 xl:px-3 text-black text-[12px] font-medium text-center">ລະຫັດຜ່ານ</th>
                                    <th className="py-4 xl:px-3 text-black text-[12px] font-medium text-center">Role</th>
                                    <th className="py-4 xl:px-3 text-black text-[12px] font-medium text-center">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data && data.map((item, index) => (
                                    <TableRow
                                        key={item.id}
                                        index={index + 1}
                                        id={item.id}
                                        profile={item.profile}
                                        firstName={item.firstName}
                                        lastName={item.lastName}
                                        phoneNumber={item.phoneNumber}
                                        email={item.email}
                                        password={item.password}
                                        role={item.role}
                                        onEdit={showModal}
                                        onDelete={deleteItem}
                                    />
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </Sidebar >
    );
};
