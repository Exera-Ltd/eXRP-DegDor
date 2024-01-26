import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Select, InputNumber, Space, Typography, Radio, Row, Col, notification, DatePicker } from 'antd';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { appUrl } from '../../constants';
import { getCookie } from '../../commons/cookie';
import dayjs from 'dayjs';

const { Option } = Select;
const { Text } = Typography;

const InvoiceForm = ({ invoiceData, isReadOnly = false }) => {
    const [invoiceForm] = Form.useForm();
    const [totalAmount, setTotalAmount] = useState(0);
    const [downPaymentPercentage, setDownPaymentPercentage] = useState(100);
    const [discountType, setDiscountType] = useState('fixed');
    const [discountValue, setDiscountValue] = useState(0);
    const [date, setDate] = useState(dayjs())
    const [customers, setCustomers] = useState([]);
    const [products, setProducts] = useState([]);
    const [selectedItems, setSelectedItems] = useState({});

    useEffect(() => {
        invoiceForm.setFieldsValue({ balanceDue: calculateBalanceDue() });
    }, [totalAmount, downPaymentPercentage]);

    const calculateTotalAmount = (items) => {
        console.log(items);
        if (items !== undefined) {
            return items.reduce((sum, item) => {
                // Check if quantity and unitPrice are defined before calculating
                if (item !== undefined && item.quantity !== undefined && item.unitPrice !== undefined) {
                    const quantity = item.quantity || 0;
                    const unitPrice = item.unitPrice || 0;
                    return sum + (quantity * unitPrice);
                }
            }, 0);
        }
    };

    const fetchCustomers = () => {
        fetch(appUrl + `dashboard/get_all_customers`)
            .then(response => response.json())
            .then(data => {
                setCustomers(data.values);
            })
            .catch(error => console.error('Error fetching customers:', error));
    };

    useEffect(() => {
        fetchCustomers();
        fetchProducts();
    }, []);

    const fetchProducts = () => {
        fetch(appUrl + `dashboard/get_all_products`)
            .then(response => response.json())
            .then(data => {
                setProducts(data.values);
            })
            .catch(error => console.error('Error fetching products:', error));
    };

    const calculateBalanceDue = () => {
        const downPaymentAmount = (downPaymentPercentage / 100) * totalAmount;
        return totalAmount - downPaymentAmount;
    };

    const onValuesChange = (_, allValues) => {
        console.log(allValues);
        if (allValues.items) {
            const total = calculateTotalAmount(allValues.items);
            setTotalAmount(total);
        }
        if (allValues.downPaymentPercentage !== undefined) {
            setDownPaymentPercentage(allValues.downPaymentPercentage);
        }
    };

    const calculateDiscountedTotal = () => {
        let discountedTotal = totalAmount;
        if (discountType === 'percent') {
            discountedTotal -= (discountValue / 100) * totalAmount;
        } else {
            discountedTotal -= discountValue;
        }
        return discountedTotal > 0 ? discountedTotal : 0;
    };

    const calculateLineTotal = (quantity, unitPrice) => {
        return (quantity || 0) * (unitPrice || 0);
    };

    useEffect(() => {
        invoiceForm.setFieldsValue({
            balanceDue: calculateBalanceDue(),
            discountedTotal: calculateDiscountedTotal(),
            totalAmount: totalAmount,
        });
    }, [totalAmount, downPaymentPercentage, discountType, discountValue, invoiceForm]);

    useEffect(() => {
        // Initialize form with invoice data if available
        if (invoiceData) {
            const items = invoiceData.items.map(item => ({
                item: item.product, // Assuming 'product' is the field name in your invoice items data
                description: item.description,
                quantity: item.quantity,
                unitPrice: item.unitPrice,
            }));

            invoiceForm.setFieldsValue({
                invoiceNumber: invoiceData.invoiceNumber,
                date: invoiceData.date ? dayjs(invoiceData.date) : null, // You might need to convert to your date object format
                customerName: invoiceData.customerName,
                items, // Line items
                downPaymentPercentage: invoiceData.downPaymentPercentage,
                discountType: invoiceData.discountType,
                discountValue: invoiceData.discountValue,
            });

            // Initialize other state variables if needed
            setTotalAmount(invoiceData.totalAmount);
            setDownPaymentPercentage(invoiceData.downPaymentPercentage);
            setDiscountType(invoiceData.discountType);
            setDiscountValue(invoiceData.discountValue);
        } else {
            // If there's no invoiceData, reset to default values
            invoiceForm.resetFields();
            setTotalAmount(0);
            setDownPaymentPercentage(100);
            setDiscountType('fixed');
            setDiscountValue(0);
        }
    }, [invoiceData, invoiceForm]);

    const onFinish = async (values) => {
        console.log('Received values of form: ', values);

        try {
            const csrftoken = getCookie('csrftoken'); // Replace getCookie with your method to get CSRF token if needed
            const invoiceId = invoiceForm.getFieldValue('invoice_id'); // Ensure you have a hidden 'invoice_id' field if editing
            const method = invoiceId ? 'PUT' : 'POST';
            const endpoint = invoiceId ? `dashboard/update_invoice/${invoiceId}/` : 'dashboard/create_invoice/';

            const response = await fetch(`${appUrl}/${endpoint}`, {
                method: method,
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': csrftoken,
                },
                body: JSON.stringify({
                    ...values,
                    totalAmount, // Assuming the API expects this field
                    balanceDue: calculateBalanceDue(),
                    discountedTotal: calculateDiscountedTotal(),
                }),
            });

            if (response.ok) {
                const result = await response.json();
                console.log(result);
                invoiceForm.resetFields();
                notification.success({
                    message: 'Success',
                    description: 'Invoice submitted successfully.',
                });
                //onInvoiceCreated(result);
            } else {
                const error = await response.json();
                notification.error({
                    message: 'Error',
                    description: error.message || 'An error occurred while submitting the invoice.',
                });
            }
        } catch (error) {
            notification.error({
                message: 'Error',
                description: error.message,
            });
        }
    };

    const onDateChange = (date, dateString) => {
        const localDate = date ? dayjs(date).format('YYYY-MM-DD') : null;
        setDate(localDate);
    }

    const onFieldsChange = (_, allFields) => {
        // We only want to force re-render when the 'item' field changes,
        // which is nested inside the 'items' Form.List
        allFields.forEach(field => {
            if (field.name.length === 2 && field.name[1] === 'item') {
                // Trigger a re-render for this specific Form.Item
                invoiceForm.setFields([{ name: field.name, value: field.value }]);
            }
        });
    };

    const handleItemTypeChange = (value, name) => {
        setSelectedItems(prevItems => ({ ...prevItems, [name]: value }));
    };

    return (
        <Form form={invoiceForm} name="invoice_form" onFieldsChange={onFieldsChange} onFinish={onFinish} onValuesChange={onValuesChange} autoComplete="off" >
            <Row gutter={16}>
                <Col span={8}>
                    <Form.Item
                        label="Customer"
                        name="customer"
                        rules={[{ required: true, message: 'Please input customer name!' }]}
                    >
                        <Select
                            showSearch
                            placeholder="Select a customer"
                            optionFilterProp="label"
                            filterOption={(input, option) =>
                                option.label.toLowerCase().includes(input.toLowerCase())
                            }
                            disabled={isReadOnly}
                        >
                            {customers.map(customer => (
                                <Option key={customer.id} value={customer.id} label={`${customer.first_name} ${customer.last_name}`}>
                                    {customer.first_name} {customer.last_name}
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>
                </Col>
                <Col span={8}>
                    <Form.Item name="invoiceNumber" label="Invoice Number" rules={[{ required: true }]}>
                        <Input placeholder="Enter Invoice Number" />
                    </Form.Item>
                </Col>
                <Col span={8}>
                    <Form.Item
                        name="date"
                        label="Date"
                    >
                        <DatePicker format="DD-MM-YYYY" onChange={onDateChange} value={date} disabled={isReadOnly} />
                    </Form.Item>
                </Col>
            </Row>

            <Form.List name="items">
                {(fields, { add, remove }) => (
                    <>
                        {fields.map(({ key, name, ...restField }) => (
                            <Row>
                                <Space key={key} align="baseline">
                                    <Form.Item
                                        {...restField}
                                        name={[name, 'item']}
                                        rules={[{ required: true, message: 'Missing item' }]}
                                    >
                                        <Select placeholder="Select an item" style={{ width: 130 }} onChange={(value) => handleItemTypeChange(value, name)}>
                                            <Option value="product">Product</Option>
                                            <Option value="consultation">Consultation</Option>
                                        </Select>
                                    </Form.Item>

                                    {/* Conditionally render the Product Select based on the item type */}
                                    {invoiceForm.getFieldValue(['items', name, 'item']) === 'product' && (
                                        <Form.Item
                                            {...restField}
                                            name={[name, 'product']}
                                            rules={[{ required: true, message: 'Please select a product' }]}
                                        >
                                            <Select
                                                showSearch
                                                placeholder="Select a product"
                                                optionFilterProp="children"
                                                filterOption={(input, option) =>
                                                    option.children.toLowerCase().includes(input.toLowerCase())
                                                }
                                                disabled={isReadOnly}
                                                style={{ width: 200 }} // Set the width as needed
                                            >
                                                {products.map(product => (
                                                    <Option key={product.id} value={product.id}>
                                                        {product.item_name}
                                                    </Option>
                                                ))}
                                            </Select>
                                        </Form.Item>
                                    )}
                                    <Form.Item
                                        {...restField}
                                        name={[name, 'description']}
                                    >
                                        <Input placeholder="Description" />
                                    </Form.Item>

                                    <Form.Item
                                        {...restField}
                                        name={[name, 'quantity']}
                                        rules={[{ required: true, message: 'Missing quantity' }]}
                                    >
                                        <InputNumber min={1} placeholder="Quantity" />
                                    </Form.Item>

                                    <Form.Item
                                        {...restField}
                                        name={[name, 'unitPrice']}
                                        rules={[{ required: true, message: 'Missing unit price' }]}
                                    >
                                        <InputNumber min={0} placeholder="Unit Price" />
                                    </Form.Item>

                                    <MinusCircleOutlined onClick={() => remove(name)} />
                                </Space>
                            </Row>
                        ))}

                        <Form.Item>
                            <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                                Add Item
                            </Button>
                        </Form.Item>

                        {/* <Form.Item shouldUpdate={(prevValues, curValues) => prevValues.items !== curValues.items}>
                            {() => {
                                const itemName = invoiceForm.getFieldValue(['items', 'name']);
                                const itemValues = invoiceForm.getFieldValue(['items', itemName]);
                                const lineTotal = calculateLineTotal(itemValues?.quantity, itemValues?.unitPrice);
                                return <Text>{lineTotal.toFixed(2)}</Text>;
                            }}
                        </Form.Item> */}

                    </>
                )}
            </Form.List>

            {/* <Form.Item label="Downpayment Percentage" name="downPaymentPercentage">
                <InputNumber min={0} max={100} formatter={value => `${value}%`} parser={value => value.replace('%', '')} />
            </Form.Item>

            <Form.Item label="Discount Type" name="discountType">
                <Radio.Group onChange={e => setDiscountType(e.target.value)}>
                    <Radio value="fixed">Fixed Amount</Radio>
                    <Radio value="percent">Percentage</Radio>
                </Radio.Group>
            </Form.Item>

            <Form.Item label={discountType === 'percent' ? "Discount Percentage" : "Discount Amount"} name="discountValue">
                <InputNumber min={0} max={discountType === 'percent' ? 100 : undefined} formatter={discountType === 'percent' ? value => `${value}%` : value => `$${value}`} parser={discountType === 'percent' ? value => value.replace('%', '') : value => value.replace('$', '')} />
            </Form.Item> */}

            <Form.Item label="Total Amount" name="totalAmount">
                <InputNumber value={totalAmount} readOnly />
            </Form.Item>

            {/* <Form.Item label="Discounted Total" name="discountedTotal">
                <Text type="danger">
                    <InputNumber value={calculateDiscountedTotal()} readOnly />
                </Text>
            </Form.Item> */}

            {/* <Form.Item label="Balance Due" name="balanceDue">
                <Text type="danger">
                    <InputNumber readOnly />
                </Text>
            </Form.Item> */}

            <Form.Item>
                <Button type="primary" htmlType="submit">
                    Create Invoice
                </Button>
            </Form.Item>
        </Form>
    );
};


export default InvoiceForm;
