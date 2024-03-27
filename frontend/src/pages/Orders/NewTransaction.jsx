import React, { useState } from 'react';
import NewTransactionForm from './NewTransactionForm';
import { Button, Row, Modal, Form, Input, Select, Typography, Divider } from 'antd';
import JobCardForm from '../JobCards/JobCardForm';

const { Title } = Typography;

function NewTransaction() {
    const [customerData, setCustomerData] = useState({});

    const handleSave = (customer_id) => {
        if (customer_id) {
            //Todo: Update
            return;
        }
        //Todo: Add New
    }

    const [isModalVisible, setIsModalVisible] = useState(false);

    const showModal = (id) => {
        if (id != null) {
            //setSelectedCustomerId(id);
        }
        setIsModalVisible(true);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    const handleOk = () => {
        setIsModalVisible(false);
    };

    return (
        <div>

            <Title level={3}>New Order</Title>

            <NewTransactionForm transactionData={customerData} />

            <Modal
                title="Job Card"
                open={isModalVisible}
                onOk={handleOk}
                onCancel={handleCancel}
                width={1000}
                footer={null}
            >
                <JobCardForm jobCardData={{}} />
            </Modal>
        </div>
    );
}

export default NewTransaction;