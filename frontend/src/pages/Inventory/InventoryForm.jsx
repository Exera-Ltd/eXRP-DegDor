import React from 'react';
import { Form, Input, Button, InputNumber, DatePicker, Select, Upload } from 'antd';
import { UploadOutlined } from '@ant-design/icons';

const { Option } = Select;

const InventoryForm = () => {
    const onFinish = (values) => {
        console.log('Received values of form: ', values);
    };

    const normFile = (e) => {
        if (Array.isArray(e)) {
          return e;
        }
        return e?.fileList;
      };

    return (
        <Form layout="vertical" onFinish={onFinish}>
            <Form.Item label="Item ID" name="itemId" rules={[{ required: true, message: 'Please input the item ID!' }]}>
                <Input placeholder="Enter Item ID" />
            </Form.Item>

            <Form.Item label="Item Name" name="itemName" rules={[{ required: true, message: 'Please input the item name!' }]}>
                <Input placeholder="Enter Item Name" />
            </Form.Item>

            <Form.Item label="Category" name="category">
                <Select placeholder="Select a category">
                    <Option value="electronics">Electronics</Option>
                    <Option value="clothing">Clothing</Option>
                    {/* Add more categories as needed */}
                </Select>
            </Form.Item>

            <Form.Item label="Quantity" name="quantity">
                <InputNumber min={1} />
            </Form.Item>

            <Form.Item label="Unit Price" name="unitPrice">
                <InputNumber min={0.01} step={0.01} />
            </Form.Item>

            <Form.Item label="Supplier" name="supplier">
                <Input placeholder="Supplier Name" />
            </Form.Item>

            <Form.Item label="Date of Purchase" name="dateOfPurchase">
                <DatePicker />
            </Form.Item>

            <Form.Item label="Location" name="location">
                <Input placeholder="Storage Location" />
            </Form.Item>

            <Form.Item label="Reorder Level" name="reorderLevel">
                <InputNumber min={1} />
            </Form.Item>

            <Form.Item label="Expiry Date" name="expiryDate">
                <DatePicker />
            </Form.Item>

            <Form.Item label="Status" name="status">
                <Select placeholder="Select a status">
                    <Option value="available">Available</Option>
                    <Option value="outOfStock">Out of Stock</Option>
                    <Option value="discontinued">Discontinued</Option>
                </Select>
            </Form.Item>

            <Form.Item label="Serial Number/Barcode" name="serialNumber">
                <Input placeholder="Enter Serial Number or Barcode" />
            </Form.Item>

            <Form.Item label="SKU" name="sku">
                <Input placeholder="Enter SKU" />
            </Form.Item>

            <Form.Item label="Image" name="image" valuePropName="fileList" getValueFromEvent={normFile}>
                <Upload name="logo" action="/upload.do" listType="picture">
                    <Button icon={<UploadOutlined />}>Click to upload</Button>
                </Upload>
            </Form.Item>

            <Form.Item>
                <Button type="primary" htmlType="submit">
                    Submit
                </Button>
            </Form.Item>
        </Form>
    );
};

export default InventoryForm;
