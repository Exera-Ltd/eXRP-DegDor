import React from 'react';
import { Button, Row, Col, Form, Input, Select, DatePicker } from 'antd';
import moment from 'moment';

const onFinish = (values) => {
    console.log('Success:', values);
};
const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
};

const onChange = (date, dateString) => {
    console.log(date, dateString);
};

const handleSave = (customer_id) => {
    if (customer_id) {
        //Todo: Update
        return;
    }
    //Todo: Add New
}

const NewCustomerForm = ({ customerData }) => {
    return <Form
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
                        <Option value="mr">Mr</Option>
                        <Option value="mrs">Mrs</Option>
                        <Option value="miss">Miss</Option>
                    </Select>
                </Form.Item>
            </Col>
            <Col span={8}>
                <Form.Item
                    label="First Name"
                    name="firstname"
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
                    name="lastname"
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
                    name="dob"
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
                    name="nic"
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
                        <Option value="swan">Swan</Option>
                        <Option value="mauritius-union">Mauritius Union</Option>
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