import React, { useEffect, useState } from 'react';
import { Form, Input, Button, InputNumber, DatePicker, Select, Upload, Row, Col, notification, Checkbox } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { appUrl } from '../../constants';
import { getCookie } from '../../commons/cookie';
import dayjs from 'dayjs';
import TextArea from 'antd/es/input/TextArea';

const { Option } = Select;

const ProductForm = ({ productData, onProductAdded, closeModal, isReadOnly = false, setIsReadOnly = () => { } }) => {
    const [productForm] = Form.useForm();
    const [productBrands, setProductBrands] = useState([]);
    const [productTypes, setProductTypes] = useState([]);

    const onFinish = async (values) => {
        console.log('Received values of product form: ', values);
        try {
            const csrftoken = getCookie('csrftoken');
            const productId = productForm.getFieldValue('product_id');
            const method = productId ? 'PUT' : 'POST';
            const endpoint = productId ? `dashboard/update_product/${productId}/` : 'dashboard/create_product/';

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
                productForm.resetFields();
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
        fetch(appUrl + 'dashboard/product_brands')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                if (data.length > 0) {
                    setProductBrands(data);
                }
            })
            .catch(error => {
                console.log(error);
            });
    }, [])

    useEffect(() => {
        fetch(appUrl + 'dashboard/product_types')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                if (data.length > 0) {
                    setProductTypes(data);
                }
            })
            .catch(error => {
                console.log(error);
            });
    }, [])

    useEffect(() => {
        console.log(productData);

        productForm.resetFields();
        productForm.setFieldsValue({
            product_id: productData?.id,
            productId: productData?.product_id,
            productName: productData?.product_name,
            category: productData?.category,
            quantity: productData?.quantity,
            unitPrice: productData?.unit_price,
            location: productData?.location,
            supplier: productData?.supplier,
            dateOfPurchase: productData?.date_of_purchase ? dayjs(productData.dateOfPurchase) : null, // use moment.js to set date object
            reorderLevel: productData?.reorder_level,
            expiryDate: productData?.expiry_date ? dayjs(productData.expiryDate) : null, // use moment.js to set date object
            status: productData?.status,
            serialNumber: productData?.serial_number_or_barcode,
            sku: productData?.sku,
            // For image, you need to convert whatever format you have into the format expected by the Upload component
            image: productData?.image ? [{
                uid: '-1', // You can generate a unique id here
                name: 'image.png', // Replace with image file name
                status: 'done',
                url: productData.image, // URL or path of the image
            }] : [],
        });
    }, [productData, productForm]);

    return (
        <Form layout="vertical" onFinish={onFinish} form={productForm}>
            <Row gutter={16}>
                <Col span={8}>
                    <Form.Item label="Product Name" name="productName" rules={[{ required: true, message: 'Please input the product name!' }]}>
                        <Input placeholder="Enter Product Name" />
                    </Form.Item>

                    <Form.Item
                        name="product_id"
                        hidden
                    >
                        <Input />
                    </Form.Item>
                </Col>
                <Col span={8}>
                    <Form.Item label="Product Reference" name="productReference" rules={[{ required: true, message: 'Please input the product Reference!' }]}>
                        <Input placeholder="Enter Product Reference" />
                    </Form.Item>
                </Col>
                <Col span={8}>
                    <Form.Item label="Product Description" name="producDescription" >
                        <TextArea rows={4} placeholder="Enter Product Description" />
                    </Form.Item>
                </Col>
            </Row>
            <Row gutter={16}>
                <Col span={6}>
                    <Form.Item label="Product Price" name="productPrice">
                        <InputNumber min={0.01} step={10} style={{ width: '100%' }} />
                    </Form.Item>
                </Col>
                <Col span={6}>
                    <Form.Item label="Product Inventory" name="productInventory">
                        <InputNumber min={1} step={1} style={{ width: '100%' }}/>
                    </Form.Item>
                </Col>
                <Col span={6}>
                    <Form.Item label="Product Quantity" name="productQuantity">
                        <InputNumber min={1} step={1} style={{ width: '100%' }}/>
                    </Form.Item>
                </Col>
                <Col span={6}>
                    <Form.Item label="Product Type" name="productType">
                        <Select placeholder="Select a Type">
                            {productTypes.map(type => (
                                <Option key={type.id} value={type.name}>
                                    {type.name}
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>
                </Col>

            </Row>
            <Row gutter={16}>
                <Col span={6}>
                    <Form.Item label="Promo Price" name="productPromoPrice">
                        <InputNumber min={0.01} step={10} style={{ width: '100%' }}/>
                    </Form.Item>
                </Col>
                <Col span={6}>
                    <Form.Item label="Product Brand" name="productBrand">
                        <Select placeholder="Select a Type">
                            {productBrands.map(brand => (
                                <Option key={brand.id} value={brand.name}>
                                    {brand.name}
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>
                </Col>
                <Col span={6}>
                    <Form.Item label="Store Location" name="productStoreLocation">
                        <Input placeholder="Storage Location" />
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

export default ProductForm;
