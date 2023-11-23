import React, { useState } from 'react';
import { Select, Button, Modal } from 'antd';
import axios from 'axios';
import NewCustomerForm from '../pages/Customers/NewCustomerForm';
import { PlusOutlined } from '@ant-design/icons';

const { Option } = Select;

const CustomerSelect = () => {
    const [options, setOptions] = useState([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedCustomerData] = useState(null);

    const showCustomerModal = () => {
        setIsModalVisible(true);
    };

    const handleCustomerModalOk = () => {
        // Implement functionality for when OK is clicked
    };

    const handleCustomerModalCancel = () => {
        setIsModalVisible(false);
    };

    const handleSearch = value => {
        if (value) {
            axios.get(`your-api-endpoint/customers?name=${value}`)
                .then((response) => {
                    const newOptions = response.data.map(customer => (
                        <Option key={customer.id} value={customer.name}>
                            {customer.name}
                        </Option>
                    ));
                    setOptions(newOptions);
                })
                .catch((error) => {
                    console.error('Error fetching the customers:', error);
                });
        } else {
            setOptions([]);
        }
    };

    return (
        <>
            <div style={{ display: 'flex' }}>
                <Select
                    showSearch
                    placeholder="Select a customer"
                    defaultActiveFirstOption={false}
                    showArrow={false}
                    filterOption={false}
                    onSearch={handleSearch}
                    notFoundContent={null}
                    className='custom-exera-selector'
                >
                    {options}
                </Select>
                <Button
                    style={{ height: 32, width: 33, borderRadius: '0 5px 5px 0', marginLeft: -1 }}
                    icon={<PlusOutlined />}
                    size="small"
                    onClick={showCustomerModal}
                />
            </div>
            <Modal
                title="New/ Edit Customer"
                open={isModalVisible}
                onOk={handleCustomerModalOk}
                onCancel={handleCustomerModalCancel}
                width={1000}
                footer={null} // Assuming you handle the form submission within the NewCustomerForm
            >
                <NewCustomerForm customerData={selectedCustomerData} />
            </Modal>
        </>
    );
};

export default CustomerSelect;