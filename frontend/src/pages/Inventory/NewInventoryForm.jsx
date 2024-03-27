import React, { useEffect, useState } from 'react';
import { Form, Input, Button, InputNumber, DatePicker, Select, Upload, Row, Col, notification, Checkbox } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { appUrl } from '../../constants';
import { getCookie } from '../../commons/cookie';
import dayjs from 'dayjs';
import TextArea from 'antd/es/input/TextArea';

const { Option } = Select;

const InventoryForm = ({ inventoryData, onInventoryAdded, closeModal, isReadOnly = false, setIsReadOnly = () => { } }) => {
    const [inventoryForm] = Form.useForm();
    const [startDate, setStartDate] = useState(inventoryData?.startDate ? dayjs(inventoryData.startDate).tz('Indian/Mauritius') : null);
    const [endDate, setEndDate] = useState(inventoryData?.endDate ? dayjs(inventoryData.endDate).tz('Indian/Mauritius') : null);

    const [products, setProducts] = useState([]);

    const onFinish = async (values) => {
        console.log('Received values of inventory form: ', values);
        try {
            const csrftoken = getCookie('csrftoken');
            const inventoryId = inventoryForm.getFieldValue('inventory_id');
            const method = inventoryId ? 'PUT' : 'POST';
            const endpoint = inventoryId ? `dashboard/update_inventory/${inventoryId}/` : 'dashboard/create_inventory/';

            const response = await fetch(appUrl + endpoint, {
                method: method,
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': csrftoken
                },
                body: JSON.stringify(values),
            });

            if (response.ok) {
                const result = await response.json();
                inventoryForm.resetFields();
                notification.success({
                    message: 'Success',
                    description: result['message'],
                });
            } else {
                const result = await response.json();
                console.log('error');
                console.log(result);
                notification.error({
                    message: 'Error ',
                    description: result['message']
                })
            }
        } catch (error) {
            notification.error({
                message: 'Error ',
                description: error.message
            })
        }
    };

    const disableReadOnly = () => {
        setIsReadOnly(false);
    }

    useEffect(() => {
        inventoryForm.resetFields();
        inventoryForm.setFieldsValue({
        });
    }, [inventoryData, inventoryForm]);

    const handleProductChange = id => {
        //fetchTransactionsByCustomer(id);
    };

    const fetchProducts = () => {
        fetch(appUrl + `dashboard/get_all_products`)
            .then(response => response.json())
            .then(data => {
                setProducts(data.values);
            })
            .catch(error => console.error('Error fetching products:', error));
    };

    const onStartDateChange = (date, dateString) => {
        const localDate = date ? dayjs(date).tz('Indian/Mauritius').format('DD-MM-YYYY') : null;
        console.log(localDate);
        setStartDate(localDate);
    };

    const onEndDateChange = (date, dateString) => {
        const localDate = date ? dayjs(date).tz('Indian/Mauritius').format('DD-MM-YYYY') : null;
        console.log(localDate);
        setEndDate(localDate);
    };

    return (
        <Form layout="vertical" onFinish={onFinish} form={inventoryForm}>
            <Row gutter={16}>
            <Col span={8}>
                    <Form.Item
                        label="Product"
                        name="product"
                        rules={[{ required: true, message: 'Please input product!' }]}
                    >
                        <Select
                            showSearch
                            placeholder="Select a product"
                            onChange={handleProductChange}
                            optionFilterProp="label"
                            filterOption={(input, option) =>
                                option.label.toLowerCase().includes(input.toLowerCase())
                            }
                            disabled={isReadOnly}
                        >
                            {products.map(product => (
                                <Option key={product.id} value={product.id} label={product.name}>
                                    {product.name}
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>
                </Col>
                <Col span={8}>
                    <Form.Item label="Inventory Name" name="inventoryName" rules={[{ required: true, message: 'Please input the inventory name!' }]}>
                        <Input placeholder="Enter Inventory Name" />
                    </Form.Item>

                    <Form.Item
                        name="inventory_id"
                        hidden
                    >
                        <Input />
                    </Form.Item>
                </Col>
            </Row>
            <Row gutter={16}>
                <Col span={6}>
                    <Form.Item label="Initial Quantity" name="initialQuantity">
                        <InputNumber min={1} step={1} style={{ width: '100%' }} />
                    </Form.Item>
                </Col>
                <Col span={6}>
                    <Form.Item label="Quantity Sold" name="quantitySold">
                        <InputNumber min={1} step={1} style={{ width: '100%' }} />
                    </Form.Item>
                </Col>
                <Col span={6}>
                    <Form.Item
                        label="Start Date"
                        name="startDate"
                        hasFeedback
                        rules={[
                            {
                                required: true,
                                message: 'Please input start date!',
                            },
                        ]}
                    >
                        <DatePicker onChange={onStartDateChange} value={startDate} format="DD-MM-YYYY" />
                    </Form.Item>
                </Col>
                <Col span={6}>
                    <Form.Item label="IsActive" name="isProductActive" >
                        <Checkbox />
                    </Form.Item>
                </Col>
            </Row>
            <Form.Item>
                <Button type="primary" htmlType="submit">
                    Submit
                </Button>
            </Form.Item>
        </Form>
    );
};

export default InventoryForm;
