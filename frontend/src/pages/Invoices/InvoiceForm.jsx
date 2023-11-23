import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Select, InputNumber, Space, Typography, Radio, Row, Col } from 'antd';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';

const { Option } = Select;
const { Text } = Typography;

const InvoiceForm = () => {
    const [form] = Form.useForm();
    const [totalAmount, setTotalAmount] = useState(0);
    const [downPaymentPercentage, setDownPaymentPercentage] = useState(100);
    const [discountType, setDiscountType] = useState('fixed');
    const [discountValue, setDiscountValue] = useState(0);

    const onFinish = (values) => {
        console.log('Received values of form: ', values);
    };

    useEffect(() => {
        form.setFieldsValue({ balanceDue: calculateBalanceDue() });
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

    return (
        <Form form={form} name="dynamic_invoice_form" onFinish={onFinish} onValuesChange={onValuesChange} autoComplete="off">
            <Row gutter={16}>
                <Col span={12}>
                    <Form.Item name="invoiceNumber" label="Invoice Number" rules={[{ required: true }]}>
                        <Input placeholder="Enter Invoice Number" />
                    </Form.Item>
                </Col>
                <Col span={12}>
                    <Form.Item name="date" label="Date" rules={[{ required: true }]}>
                        <Input placeholder="Enter Date" />
                    </Form.Item></Col>
            </Row>

            <Form.Item label="Customer Name" rules={[{ required: true }]}>
                <Input placeholder="Enter Customer Name" />
            </Form.Item>

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
                                        <Select placeholder="Select an item">

                                            <Option value="product">Product from Inventory</Option>
                                            <Option value="consultation">Consultation Fee</Option>
                                        </Select>
                                    </Form.Item>

                                    <Form.Item
                                        {...restField}
                                        name={[name, 'description']}
                                        rules={[{ required: true, message: 'Missing description' }]}
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

                        <Form.Item shouldUpdate={(prevValues, curValues) => prevValues.items !== curValues.items}>
                            {() => {
                                const itemName = form.getFieldValue(['items', 'name']);
                                const itemValues = form.getFieldValue(['items', itemName]);
                                const lineTotal = calculateLineTotal(itemValues?.quantity, itemValues?.unitPrice);
                                return <Text>{lineTotal.toFixed(2)}</Text>;
                            }}
                        </Form.Item>

                    </>
                )}
            </Form.List>

            <Form.Item label="Downpayment Percentage" name="downPaymentPercentage">
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
            </Form.Item>

            <Form.Item label="Total Amount" name="totalAmount">
                <InputNumber value={totalAmount} readOnly />
            </Form.Item>

            <Form.Item label="Discounted Total" name="discountedTotal">
                <Text type="danger">
                    <InputNumber value={calculateDiscountedTotal()} readOnly />
                </Text>
            </Form.Item>

            <Form.Item label="Balance Due" name="balanceDue">
                <Text type="danger">
                    <InputNumber readOnly />
                </Text>
            </Form.Item>

            <Form.Item>
                <Button type="primary" htmlType="submit">
                    Create Invoice
                </Button>
            </Form.Item>
        </Form>
    );
};

export default InvoiceForm;
