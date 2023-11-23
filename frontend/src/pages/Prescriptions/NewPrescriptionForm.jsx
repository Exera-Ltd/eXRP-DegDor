import React, { useState, useEffect } from 'react';
import { Row, Col, Form, Input, Select, Typography, Divider, Button, notification, InputNumber } from 'antd';
import moment from 'moment';
import { useUser } from '../../contexts/UserContext';
import { appUrl } from '../../constants';
import { getCookie } from '../../commons/cookie';

const { Paragraph } = Typography;
const { Option } = Select;

const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
};



const NewPrescriptionForm = ({ prescriptionData }) => {
    const { user } = useUser();
    const [customers, setCustomers] = useState([]);
    const [prescriptionForm] = Form.useForm();

    const fetchCustomers = () => {
        fetch(appUrl + `dashboard/get_all_customers`)
            .then(response => response.json())
            .then(data => {
                setCustomers(data.values);
            })
            .catch(error => console.error('Error fetching customers:', error));
    };

    const onFinish = async (values) => {
        console.log('Success:', values);

        try {
            const csrftoken = getCookie('csrftoken');
            const response = await fetch(appUrl + `dashboard/create_prescription/`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': csrftoken
                },
                body: JSON.stringify(values),
            });

            if (response.ok) {
                const result = await response.json();
                prescriptionForm.resetFields();
                notification.success({
                    message: 'Success',
                    description: result['message'],
                });
            } else {
                const result = await response.json();
                notification.error({
                    message: 'Error ',
                    description: result['message']
                })
            }
        } catch (error) {
            notification.error({
                message: 'Error ',
                description: error
            })
        }
    };

    useEffect(() => {
        fetchCustomers();
    }, []);

    const [checkupInterval, setCheckupInterval] = useState();

    useEffect(() => {
        if (checkupInterval) {
            const nextCheckupDate = moment().add(checkupInterval, 'months').format('YYYY-MM-DD');
            prescriptionForm.setFieldsValue({ 'next-checkup-date': nextCheckupDate });
        }
    }, [checkupInterval, prescriptionForm]);

    const handleCheckupChange = (value) => {
        setCheckupInterval(value);
    };

    return <Form
        form={prescriptionForm}
        layout="horizontal"
        name="new-customer"
        labelAlign="left"
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        style={{
        }}
        initialValues={{
            title: prescriptionData?.title || null,
            firstname: prescriptionData?.first_name || null,
            lastname: prescriptionData?.last_name || null,
            dob: prescriptionData?.date_of_birth ? moment(prescriptionData.date_of_birth) : null,
            mobile1: prescriptionData?.mobile_1 || null,
            mobile2: prescriptionData?.mobile_2 || null,
            address: prescriptionData?.address || null,
            city: prescriptionData?.city || null,
            email: prescriptionData?.email || null,
            profession: prescriptionData?.profession || null,
            insurance: prescriptionData?.insurance || null
        }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
    >
        <Divider orientation="left" orientationMargin="0">Details</Divider>
        <Row gutter={24}>
            <Col span={12}>
                <Form.Item
                    label="Doctor Name"
                >
                    <Input
                        value={user.first_name + ' ' + user.last_name}
                        disabled
                    />
                </Form.Item>

                <Form.Item
                    name="doctor"
                    initialValue={user.id}
                    hidden
                >
                    <Input />
                </Form.Item>
            </Col>
        </Row>

        <Row gutter={24}>
            <Col span={12}>
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
                    >
                        {customers.map(customer => (
                            <Option key={customer.id} value={customer.id} label={`${customer.first_name} ${customer.last_name}`}>
                                {customer.first_name} {customer.last_name}
                            </Option>
                        ))}
                    </Select>
                </Form.Item>

            </Col>

            <Col span={12}>
                <Form.Item
                    label="Last Eye Test"
                    name="last-eye-test"
                >
                    <Input />
                </Form.Item>
            </Col>
        </Row>
        <Row gutter={24}>
            <Col span={12}>
                <Form.Item
                    label="Vision"
                    name="vision"
                >
                    <Input.TextArea />
                </Form.Item>
            </Col>
        </Row>

        <Divider orientation="left" orientationMargin="0">Glass Prescriptions</Divider>

        <Row gutter={24}>
            <Col span={3}>
                <Paragraph strong>Right</Paragraph>
            </Col>
            <Col span={7}>
                <Form.Item
                    label="SPH"
                    name="glass-right-sph"
                >
                    <InputNumber />
                </Form.Item>
            </Col>
            <Col span={7}>
                <Form.Item
                    label="CYL"
                    name="glass-right-cyl"
                >
                    <InputNumber />
                </Form.Item>
            </Col>
            <Col span={7}>
                <Form.Item
                    label="Axis"
                    name="glass-right-axis"
                >
                    <InputNumber />
                </Form.Item>
            </Col>
        </Row>
        <Row gutter={24}>
            <Col span={3}>
                <Paragraph strong>Left</Paragraph>
            </Col>
            <Col span={7}>
                <Form.Item
                    label="SPH"
                    name="glass-left-sph"
                >
                    <InputNumber />
                </Form.Item>
            </Col>
            <Col span={7}>
                <Form.Item
                    label="CYL"
                    name="glass-left-cyl"
                >
                    <InputNumber />
                </Form.Item>
            </Col>
            <Col span={7}>
                <Form.Item
                    label="Axis"
                    name="glass-left-axis"
                >
                    <InputNumber />
                </Form.Item>
            </Col>
        </Row>
        <Row gutter={24}>
            <Col span={8}>
                <Form.Item
                    label="PDR."
                    name="pdr"
                >
                    <InputNumber />
                </Form.Item>
            </Col>
            <Col span={8}>
                <Form.Item
                    label="PDL."
                    name="pdl"
                >
                    <InputNumber />
                </Form.Item>
            </Col>
            <Col span={8}>
                <Form.Item
                    label="Type of Lenses"
                    name="type-of-lenses"
                    hasFeedback
                >
                    <Select placeholder="Lenses">
                        <Option value="Single">Single</Option>
                        <Option value="Double">Double</Option>
                    </Select>
                </Form.Item>
            </Col>
        </Row>
        <Divider orientation="left" orientationMargin="0">Lens Prescriptions</Divider>
        <Row gutter={24}>
            <Col span={3}>
                <Paragraph strong>Right</Paragraph>
            </Col>
            <Col span={7}>
                <Form.Item
                    label="SPH"
                    name="lens-right-sph"
                >
                    <InputNumber />
                </Form.Item>
            </Col>
            <Col span={7}>
                <Form.Item
                    label="CYL"
                    name="lens-right-cyl"
                >
                    <InputNumber />
                </Form.Item>
            </Col>
            <Col span={7}>
                <Form.Item
                    label="Axis"
                    name="lens-right-axis"
                >
                    <InputNumber />
                </Form.Item>
            </Col>
        </Row>
        <Row gutter={24}>
            <Col span={3}>
                <Paragraph strong>Left</Paragraph>
            </Col>
            <Col span={7}>
                <Form.Item
                    label="SPH"
                    name="lens-left-sph"
                >
                    <InputNumber />
                </Form.Item>
            </Col>
            <Col span={7}>
                <Form.Item
                    label="CYL"
                    name="lens-left-cyl"
                >
                    <InputNumber />
                </Form.Item>
            </Col>
            <Col span={7}>
                <Form.Item
                    label="Axis"
                    name="lens-left-axis"
                >
                    <InputNumber />
                </Form.Item>
            </Col>
        </Row>
        <Divider orientation="left" orientationMargin="0">Other</Divider>
        <Row gutter={24}>
            <Col span={8}>
                <Form.Item
                    label="Care System"
                    name="care-system"
                    hasFeedback
                >
                    <Select placeholder="Care">
                        <Option value="Permanent">Permanent</Option>
                        <Option value="One Off">One Off</Option>
                    </Select>
                </Form.Item>
            </Col>
            <Col span={8}>
                <Form.Item
                    label="Next Checkup"
                    name="next-checkup"
                    hasFeedback
                >
                    <Select placeholder="Next Checkup" onChange={handleCheckupChange}>
                        <Option value="6">6 Months</Option>
                        <Option value="12">1 Year</Option>
                        <Option value="24">2 Years</Option>
                    </Select>
                </Form.Item>
            </Col>
            <Col span={8}>
                <Form.Item
                    label="Next Checkup Date"
                    name="next-checkup-date"
                    hasFeedback
                >
                    <Input readOnly />
                </Form.Item>
            </Col>
        </Row>
        <Row gutter={24}>
            <Col span={12}>
                <Form.Item
                    label="Recommendation"
                    name="recommendation"
                >
                    <Input.TextArea />
                </Form.Item>
            </Col>
        </Row>
        <Row style={{ justifyContent: 'center' }}>
            <Button type="primary" htmlType="submit" style={{ width: 200, height: 40 }} >
                Save
            </Button>
        </Row>
    </Form>
}

export default NewPrescriptionForm;