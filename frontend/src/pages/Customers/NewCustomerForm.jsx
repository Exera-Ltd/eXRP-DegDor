import React, { useForm } from 'react';
import { Button, Row, Col, Form, Input, Select, DatePicker, notification } from 'antd';
import moment from 'moment';
import { appUrl } from '../../constants';

const { Option } = Select;

function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

const NewCustomerForm = ({ customerData }) => {
    const [customerForm] = Form.useForm();

    const onFinish = async (values) => {
        try {
            const csrftoken = getCookie('csrftoken');
            const response = await fetch(appUrl + 'dashboard/add_customers', {
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
                customerForm.resetFields();
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
    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    const onChange = (date, dateString) => {
        const localDate = date ? moment(date).format('YYYY-MM-DD') : null;
        console.log(localDate);
    };

    const handleSave = (customer_id) => {
        if (customer_id) {
            //Todo: Update
            return;
        }
        //Todo: Add New
    }

    return <Form
        form={customerForm}
        layout="horizontal"
        name="new-customer"
        labelAlign="left"
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        style={{
        }}
        initialValues={{
            title: customerData?.title || null,
            firstname: customerData?.first_name || null,
            lastname: customerData?.last_name || null,
            dob: customerData?.date_of_birth ? moment(customerData.date_of_birth) : null,
            mobile1: customerData?.mobile_1 || null,
            mobile2: customerData?.mobile_2 || null,
            address: customerData?.address || null,
            city: customerData?.city || null,
            email: customerData?.email || null,
            profession: customerData?.profession || null,
            insurance: customerData?.insurance || null
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
                    <DatePicker onChange={onChange} />
                </Form.Item>
            </Col>
            <Col span={8}>
                <Form.Item
                    label="Mobile 1"
                    name="mobile1"
                    rules={[
                        {
                            required: true,
                            message: 'Please input a mobile number!',
                        },
                    ]}
                >
                    <Input />
                </Form.Item>
            </Col>
            <Col span={8}>
                <Form.Item
                    label="Mobile 2"
                    name="mobile2"
                >
                    <Input />
                </Form.Item>
            </Col>
        </Row>

        <Row gutter={24}>
            <Col span={8}>
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
            <Col span={8}>
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
            <Col span={8}>
                <Form.Item
                    label="Email"
                    name="email"
                >
                    <Input />
                </Form.Item>
            </Col>
        </Row>

        <Row gutter={24}>
            <Col span={8}>
                <Form.Item
                    label="NIC Number"
                    name="nic_number"
                >
                    <Input />
                </Form.Item>
            </Col>
            <Col span={8}>
                <Form.Item
                    label="Profession"
                    name="profession"
                >
                    <Input />
                </Form.Item>
            </Col>
            <Col span={8}>
                <Form.Item
                    label="Insurance"
                    name="insurance"
                    hasFeedback
                >
                    <Select placeholder="Insurance">
                        <Option value="Swan">Swan</Option>
                        <Option value="Mauritius Union">Mauritius Union</Option>
                    </Select>
                </Form.Item>
            </Col>
        </Row>
        <Row style={{ justifyContent: 'center' }}>
            <Button type="primary" htmlType="submit" style={{ width: 200, height: 40 }} onClick={() => handleSave(customerData.id)}>
                Save
            </Button>
        </Row>
    </Form>
}

export default NewCustomerForm;