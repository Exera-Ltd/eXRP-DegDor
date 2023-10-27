import React, { useState } from 'react';
import { Typography } from 'antd';
import NewPrescriptionForm from './NewPrescriptionForm';

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

    return (
        <div>

            <Title level={3}>New Prescription</Title>

            <NewPrescriptionForm prescriptionData={customerData} />
        </div>
    );
}

export default NewPrescription;