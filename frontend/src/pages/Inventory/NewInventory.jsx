import React from 'react';
import { Typography } from 'antd';
import InventoryForm from './NewInventoryForm';

const { Title } = Typography;

function NewInventory() {
    return (
        <div>

            <Title level={3}>Add New Inventory</Title>

            <InventoryForm />
        </div>
    );
}

export default NewInventory;