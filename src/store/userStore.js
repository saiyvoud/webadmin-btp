import React, { useState, useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import userStore from '../../stores/userStore'; // Import store
import { Sidebar } from '../../components/Sidebar';
import { Modal, Input, Button, Select, Skeleton } from 'antd';
import { FaCamera } from 'react-icons/fa6';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

const { Option } = Select;

const UserInfo = observer(() => {
    const navigate = useNavigate();
    const { users, fetchUsers, updateUser, deleteUser, loading, currentUserRole } = userStore;
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [updatedData, setUpdatedData] = useState({
        name: '',
        email: '',
        role: ''
    });

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    const showEditModal = (user) => {
        setSelectedUser(user);
        setUpdatedData({
            name: user.name,
            email: user.email,
            role: user.role
        });
        setIsModalVisible(true);
    };

    const handleEdit = () => {
        if (!selectedUser) return;
        updateUser(selectedUser.id, updatedData);
        setIsModalVisible(false);
    };

    const handleDelete = (id) => {
        deleteUser(id);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUpdatedData((prevData) => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleRoleChange = (value) => {
        setUpdatedData((prevData) => ({
            ...prevData,
            role: value
        }));
    };

    return (
        <Sidebar>
            <div className={`xl:mt-14 xl:mx-14 bg-white rounded-lg sm:px-6 xl:px-8 lg:py-10 sm:py-6 xl:py-14 ${users.length > 10 ? 'min-h-screen' : 'h-screen'}`}>
                {loading ? (
                    <Skeleton active />
                ) : (
                    <div className="rounded-lg overflow-x-auto border w-full h-full pb-5">
                        <table className="w-full h-full">
                            <thead>
                                <tr>
                                    <th className="px-4 py-2 border">ລ/ດ</th>
                                    <th className="px-4 py-2 border">ຊື່</th>
                                    <th className="px-4 py-2 border">ອີເມລ</th>
                                    <th className="px-4 py-2 border">ສິດທິ</th>
                                    <th className="px-4 py-2 border">ການຈັດການ</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map((user, index) => (
                                    <tr key={user.id}>
                                        <td className="px-4 py-2 border">{index + 1}</td>
                                        <td className="px-4 py-2 border">{user.name}</td>
                                        <td className="px-4 py-2 border">{user.email}</td>
                                        <td className="px-4 py-2 border">{user.role}</td>
                                        <td className="px-4 py-2 border">
                                            <Button type="primary" onClick={() => showEditModal(user)}>
                                                ແກ້ໄຂ
                                            </Button>
                                            <Button type="danger" onClick={() => handleDelete(user.id)} className="ml-2">
                                                ລຶບ
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Modal for editing user */}
            <Modal
                title="ແກ້ໄຂຂໍ້ມູນຜູ້ໃຊ້"
                visible={isModalVisible}
                onOk={handleEdit}
                onCancel={handleCancel}
                okText="ບັນທຶກ"
                cancelText="ຍົກເລີກ"
            >
                <Input
                    name="name"
                    placeholder="ຊື່"
                    value={updatedData.name}
                    onChange={handleInputChange}
                    className="mb-3"
                />
                <Input
                    name="email"
                    placeholder="ອີເມລ"
                    value={updatedData.email}
                    onChange={handleInputChange}
                    className="mb-3"
                />
                <Select
                    name="role"
                    value={updatedData.role}
                    onChange={handleRoleChange}
                    className="mb-3"
                    style={{ width: '100%' }}
                >
                    {/* <Option value="user">ຜູ້ໃຊ້</Option> */}
                    <Option value="admin">ຜູ້ດູແລ</Option>
                    <Option value="superadmin">ເຈົ້າຂອງ</Option>
                </Select>
            </Modal>
        </Sidebar>
    );
});

export default UserInfo;
