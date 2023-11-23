import React, { useForm } from 'react';
import { Button, Row, Col, Form, Input, Select, DatePicker, notification } from 'antd';
import moment from 'moment';
import { appUrl } from '../../constants';
import { getCookie } from '../../commons/cookie';

const { Option } = Select;

const NewCustomerForm = ({ customerData, onCustomerAdded, closeModal }) => {
    const [customerForm] = Form.useForm();

    const onFinish = async (values) => {
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
                body: JSON.stringify(values),
            });

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

    return <Form
        form={customerForm}
        layout="horizontal"
        name="new-customer"
        labelAlign="left"
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        style={{
        }}
        /*
        {
    id: 1,
    first_name: 'test',
    last_name: 'testt',
    mobile1: '59440110',
    city: 'Rose Hill',
    nic_number: 'A5241365214452'
  }
        */
        initialValues={{
            title: customerData?.title || null,
            first_name: customerData?.first_name || null,
            last_name: customerData?.last_name || null,
            date_of_birth: customerData?.date_of_birth ? moment(customerData.date_of_birth) : null,
            mobile_1: customerData?.mobile_1 || null,
            mobile_2: customerData?.mobile_2 || null,
            address: customerData?.address || null,
            city: customerData?.city || null,
            email: customerData?.email || null,
            nic_number: customerData?.nic_number || null,
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
                    name="mobile_1"
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
                    name="mobile_2"
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
            <Button type="primary" htmlType="submit" style={{ width: 200, height: 40 }} >
                Save
            </Button>
        </Row>
    </Form>
}

export default NewCustomerForm;