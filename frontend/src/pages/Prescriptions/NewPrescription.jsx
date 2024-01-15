import React, { useState } from 'react';
import NewPrescriptionForm from './NewPrescriptionForm';
import { Button, Row, Modal, Form, Input, Select, Typography, Divider } from 'antd';
import JobCardForm from '../JobCards/JobCardForm';

const { Title } = Typography;

function NewPrescription() {
    /* const [customerData, setCustomerData] = useState({
        "title": "Mr.",
        "first_name": "John",
        "last_name": "Doe",
        "date_of_birth": "1986-06-15",
        "mobile_1": "123-456-7890",
        "mobile_2": "098-765-4321",
        "address": "123 Elm Street",
        "city": "Springfield",
        "email": "john.doe@example.com",
        "profession": "Software Engineer",
        "insurance": "HealthSaver"
    }); */

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

            <Title level={3}>New Prescription</Title>

            <NewPrescriptionForm prescriptionData={customerData} />

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

export default NewPrescription;