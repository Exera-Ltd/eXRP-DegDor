import React, { useEffect, useState } from 'react';
import { Button, Row, Col, Form, Input, Select, DatePicker, notification } from 'antd';
import { appUrl } from '../../constants';
import { getCookie } from '../../commons/cookie';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

dayjs.extend(utc);
dayjs.extend(timezone);

const { Option } = Select;

const NewCustomerForm = ({ customerData, onCustomerAdded, closeModal }) => {
    const [customerForm] = Form.useForm();
    const [dateOfBirth, setDateOfBirth] = useState(customerData?.date_of_birth ? dayjs(customerData.date_of_birth).tz('Indian/Mauritius') : null);

    const onFinish = async (values) => {
        const formattedValues = {
            ...values,
            date_of_birth: values.date_of_birth ? dayjs(values.date_of_birth).tz('Indian/Mauritius') : null
        };
        console.log(formattedValues);
        const endpoint = customerData.id ? `update_customer/${customerData.id}/` : 'create_customer';
        const method = customerData.id ? 'PUT' : 'POST';

        try {
            const csrftoken = getCookie('csrftoken');
            const response = await fetch(appUrl + `dashboard/${endpoint}`, {
                method: method,
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': csrftoken
                },
                body: JSON.stringify(formattedValues),
            });
            console.log(response);
            console.log(response.ok);
            if (response.ok) {
                const result = await response.json();
                customerForm.resetFields();
                notification.success({
                    message: 'Success',
                    description: result['message'],
                });
                onCustomerAdded();
                closeModal();
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
                description: error.message
            })
        }
    };
    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
        notification.error({
            message: 'Error ',
            description: errorInfo.message
        })
    };

    const onChange = (date, dateString) => {
        const localDate = date ? dayjs(date).tz('Indian/Mauritius').format('DD-MM-YYYY') : null;
        console.log(localDate);
        setDateOfBirth(localDate);
    };

    useEffect(() => {
        customerForm.resetFields();
        customerForm.setFieldsValue({
            title: customerData?.title,
            first_name: customerData?.first_name,
            last_name: customerData?.last_name,
            date_of_birth: dayjs(customerData.date_of_birth),
            mobile_1: customerData?.mobile_1,
            mobile_2: customerData?.mobile_2,
            address: customerData?.address,
            city: customerData?.city,
            email: customerData?.email,
            nic_number: customerData?.nic_number,
            profession: customerData?.profession,
            insurance: customerData?.insurance
        });
    }, [customerData, customerForm]);

    return <Form
        form={customerForm}
        layout="horizontal"
        name="new-customer"
        labelAlign="left"
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        style={{
        }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
    >
        <Row gutter={24}>
            <Col span={8}>
                <Form.Item
                    name="title"
                    label="Title"
                    hasFeedback
                    rules={[{ required: true, message: 'Please select title!' }]}
                >
                    <Select placeholder="Title">
                        <Option value="Mr">Mr</Option>
                        <Option value="Mrs">Mrs</Option>
                        <Option value="Miss">Miss</Option>
                    </Select>
                </Form.Item>
            </Col>
            <Col span={8}>
                <Form.Item
                    label="First Name"
                    name="first_name"
                    rules={[
                        {
                            required: true,
                            message: 'Please input your firstname!',
                        },
                    ]}
                >
                    <Input />
                </Form.Item>
            </Col>
            <Col span={8}>
                <Form.Item
                    label="Last Name"
                    name="last_name"
                    rules={[
                        {
                            required: true,
                            message: 'Please input your lastname!',
                        },
                    ]}
                >
                    <Input />
                </Form.Item>
            </Col>
        </Row>

        <Row gutter={24}>
            <Col span={8}>
                <Form.Item
                    label="Date of Birth"
                    name="date_of_birth"
                    hasFeedback
                    rules={[
                        {
                            required: true,
                            message: 'Please input your Date of Birth!',
                        },
                    ]}
                >
                    <DatePicker onChange={onChange} value={dateOfBirth} format="DD-MM-YYYY" />
                </Form.Item>
            </Col>
            <Col span={8}>
                <Form.Item
                    label="Phone"
                    name="phone"
                    rules={[
                        {
                            required: true,
                            message: 'Please input a phone number!',
                        },
                    ]}
                >
                    <Input />
                </Form.Item>
            </Col>
            <Col span={8}>
                <Form.Item
                    label="Mobile"
                    name="mobile"
                >
                    <Input />
                </Form.Item>
            </Col>
        </Row>

        <Row gutter={24}>
            <Col span={12}>
                <Form.Item
                    label="Address"
                    name="address"
                    rules={[
                        {
                            required: true,
                            message: 'Please input an address!',
                        },
                    ]}
                >
                    <Input />
                </Form.Item>
            </Col>
            <Col span={12}>
                <Form.Item
                    label="City"
                    name="city"
                    rules={[
                        {
                            required: true,
                            message: 'Please input a city!',
                        },
                    ]}
                >
                    <Input />
                </Form.Item>
            </Col>
            
        </Row>

        <Row gutter={24}>
            <Col span={12}>
                <Form.Item
                    label="NIC Number"
                    name="nic_number"
                >
                    <Input />
                </Form.Item>
            </Col>
            <Col span={12}>
                <Form.Item
                    label="Email"
                    name="email"
                >
                    <Input />
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

export default NewCustomerForm;