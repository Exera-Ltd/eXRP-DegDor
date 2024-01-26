import React, { useEffect } from 'react';
import { Form, Input, Button, InputNumber, DatePicker, Select, Upload, Row, Col, notification } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { appUrl } from '../../constants';
import { getCookie } from '../../commons/cookie';
import dayjs from 'dayjs';

const { Option } = Select;

const ProductForm = ({ productData, onProductAdded, closeModal, isReadOnly = false, setIsReadOnly = () => { } }) => {
    const [productForm] = Form.useForm();

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
                    description: result['error']
                })
            }
        } catch (error) {
            notification.error({
                message: 'Error ',
                description: error.message
            })
        }
    };

    const normFile = (e) => {
        console.log('Upload event:', e);

        if (Array.isArray(e)) {
            return e;
        }

        // FileList from the Upload component
        return e && e.fileList.map(file => {
            if (file.originFileObj) {
                // This is a file being uploaded
                const reader = new FileReader();
                reader.onload = (event) => {
                    // Assign the thumbnail URL for preview
                    file.thumbUrl = event.target.result;
                };
                reader.readAsDataURL(file.originFileObj);
            }
            return file;
        });
    };

    const disableReadOnly = () => {
        setIsReadOnly(false);
    }

    useEffect(() => {
        console.log(productData);

        productForm.resetFields();
        productForm.setFieldsValue({
            product_id: productData?.id,
            itemId: productData?.item_id,
            itemName: productData?.item_name,
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
                <Col span={12}>
                    <Form.Item label="Item ID" name="itemId" rules={[{ required: true, message: 'Please input the item ID!' }]}>
                        <Input placeholder="Enter Item ID" />
                    </Form.Item>
                </Col>
                <Col span={12}>
                    <Form.Item label="Item Name" name="itemName" rules={[{ required: true, message: 'Please input the item name!' }]}>
                        <Input placeholder="Enter Item Name" />
                    </Form.Item>

                    <Form.Item
                        name="product_id"
                        hidden
                    >
                        <Input />
                    </Form.Item>
                </Col>
            </Row>
            <Row gutter={16}>
                <Col span={6}>
                    <Form.Item label="Category" name="category">
                        <Select placeholder="Select a category">
                            <Option value="electronics">Electronics</Option>
                            <Option value="clothing">Clothing</Option>
                            {/* Add more categories as needed */}
                        </Select>
                    </Form.Item>
                </Col>
                <Col span={6}>
                    <Form.Item label="Quantity" name="quantity">
                        <InputNumber min={1} />
                    </Form.Item>
                </Col>
                <Col span={6}>
                    <Form.Item label="Unit Price" name="unitPrice">
                        <InputNumber min={0.01} step={0.01} />
                    </Form.Item>
                </Col>
                <Col span={6}>
                    <Form.Item label="Location" name="location">
                        <Input placeholder="Storage Location" />
                    </Form.Item>
                </Col>
            </Row>
            <Row gutter={16}>
                <Col span={6}>
                    <Form.Item label="Supplier" name="supplier">
                        <Input placeholder="Supplier Name" />
                    </Form.Item>
                </Col>
                <Col span={6}>
                    <Form.Item label="Date of Purchase" name="dateOfPurchase">
                        <DatePicker format="DD-MM-YYYY" />
                    </Form.Item>
                </Col>
                <Col span={6}>
                    <Form.Item label="Reorder Level" name="reorderLevel">
                        <InputNumber min={1} />
                    </Form.Item>
                </Col>
                <Col span={6}>
                    <Form.Item label="Expiry Date" name="expiryDate">
                        <DatePicker format="DD-MM-YYYY" />
                    </Form.Item>
                </Col>
            </Row>
            <Row gutter={16}>
                <Col span={6}>
                    <Form.Item label="Status" name="status">
                        <Select placeholder="Select a status">
                            <Option value="available">Available</Option>
                            <Option value="outOfStock">Out of Stock</Option>
                            <Option value="discontinued">Discontinued</Option>
                        </Select>
                    </Form.Item>
                </Col>
                <Col span={6}>
                    <Form.Item label="Serial Number/Barcode" name="serialNumber">
                        <Input placeholder="Enter Serial Number or Barcode" />
                    </Form.Item>
                </Col>
                <Col span={6}>
                    <Form.Item label="SKU" name="sku">
                        <Input placeholder="Enter SKU" />
                    </Form.Item>
                </Col>
                <Col span={6}>
                    <Form.Item label="Image" name="image" valuePropName="fileList" getValueFromEvent={normFile}>
                        <Upload name="logo" listType="picture" beforeUpload={() => false}>
                            <Button icon={<UploadOutlined />}>Click to upload</Button>
                        </Upload>
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
