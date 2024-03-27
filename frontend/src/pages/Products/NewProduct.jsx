import React from 'react';
import { Typography } from 'antd';
import InventoryForm from './NewProductForm';

const { Title } = Typography;

function NewProduct() {
    return (
        <div>

            <Title level={3}>Add New Product</Title>

            <InventoryForm />
        </div>
    );
}

export default NewProduct;