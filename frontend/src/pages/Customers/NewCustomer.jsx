import React, { useState } from 'react';
import { Typography } from 'antd';
import NewCustomerForm from './NewCustomerForm';

const { Title } = Typography;

function NewCustomer() {

    const [customerData, setCustomerData] = useState({});

    return (
        <div>

            <Title level={3}>Add New Customer</Title>

            <NewCustomerForm customerData={customerData} />
        </div>
    );
}

export default NewCustomer;