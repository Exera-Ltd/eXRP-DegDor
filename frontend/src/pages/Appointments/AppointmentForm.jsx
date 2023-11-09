import React from 'react';
import { Button, Row, Col, Form, Input, DatePicker, TimePicker, Select } from 'antd';
import moment from 'moment';

const { Option } = Select;

const AppointmentForm = ({ onSubmit }) => {
    const onFinish = (values) => {
        onSubmit(values); // Pass the form values up to the parent component
    };

    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    return (
        <Form
            layout="horizontal"
            name="appointment-form"
            labelAlign="left"
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
        >
            <Row gutter={24}>
                <Col span={12}>
                    <Form.Item
                        name="title"
                        label="Title"
                        hasFeedback
                    >
                        <Select placeholder="Select Title">
                            <Option value="mr">Mr.</Option>
                            <Option value="mrs">Mrs.</Option>
                            <Option value="ms">Ms.</Option>
                            <Option value="dr">Dr.</Option>
                            {/* Add more titles as needed */}
                        </Select>
                    </Form.Item>
                </Col>
                <Col span={12}>
                    <Form.Item
                        name="lastName"
                        label="Last Name"
                    >
                        <Input />
                    </Form.Item>
                </Col>
            </Row>

            <Row gutter={24}>
                <Col span={12}>
                    <Form.Item
                        name="customerName"
                        label="Customer Name"
                    >
                        <Input />
                    </Form.Item>
                </Col>
                <Col span={12}>
                    <Form.Item
                        name="city"
                        label="City"
                    >
                        <Input />
                    </Form.Item>
                </Col>
            </Row>

            <Row gutter={24}>
                <Col span={12}>
                    <Form.Item
                        name="phoneNumber"
                        label="Phone Number"
                    >
                        <Input />
                    </Form.Item>
                </Col>
                <Col span={12}>
                    <Form.Item
                        name="customerAddress"
                        label="Customer Address"
                    >
                        <Input />
                    </Form.Item>
                </Col>
            </Row>

            <Row gutter={24}>
                <Col span={12}>
                    <Form.Item
                        name="mobile1"
                        label="Mobile 1"
                    >
                        <Input />
                    </Form.Item>
                </Col>
                <Col span={12}>
                    <Form.Item
                        name="mobile2"
                        label="Mobile 2"
                    >
                        <Input />
                    </Form.Item>
                </Col>
            </Row>

            <Row gutter={24}>
                <Col span={12}>
                    <Form.Item
                        name="dateOfBirth"
                        label="Date of Birth"
                    >
                        <DatePicker format="DD-MM-YYYY" />
                    </Form.Item>
                </Col>
                <Col span={12}>
                    <Form.Item
                        name="emailPersonal"
                        label="Email(personal)"
                    >
                        <Input />
                    </Form.Item>
                </Col>
            </Row>

            <Row gutter={24}>
                <Col span={12}>
                    <Form.Item
                        name="emailWork"
                        label="Email(Work)"
                    >
                        <Input />
                    </Form.Item>
                </Col>
                <Col span={12}>
                    <Form.Item
                        name="profession"
                        label="Profession"
                    >
                        <Input />
                    </Form.Item>
                </Col>
            </Row>

            <Row gutter={24}>
                <Col span={12}>
                    <Form.Item
                        name="insurance"
                        label="Insurance"
                    >
                        <Input />
                    </Form.Item>
                </Col>
                <Col span={12}>
                    <Form.Item
                        name="customerAge"
                        label="Customer Age"
                    >
                        <Input />
                    </Form.Item>
                </Col>
            </Row>

            <Row gutter={24}>
                <Col span={12}>
                    <Form.Item
                        name="startEndDate"
                        label="Start/End Date"
                    >
                        <DatePicker.RangePicker format="DD-MM-YYYY" />
                    </Form.Item>
                </Col>
                <Col span={12}>
                    <Form.Item
                        name="status"
                        label="Status"
                    >
                        <Select placeholder="Select Status">
                            <Option value="scheduled">Scheduled</Option>
                            <Option value="completed">Completed</Option>
                            <Option value="noshow">No Show</Option>
                            <Option value="canceled">Canceled</Option>
                            {/* Add more statuses as needed */}
                        </Select>
                    </Form.Item>
                </Col>
            </Row>

            <Row gutter={24}>
                <Col span={12}>
                    <Form.Item
                        name="startTime"
                        label="Start Time"
                    >
                        <TimePicker format="HH:mm" />
                    </Form.Item>
                </Col>
                <Col span={12}>
                    <Form.Item
                        name="endTime"
                        label="End Time"
                    >
                        <TimePicker format="HH:mm" />
                    </Form.Item>
                </Col>
            </Row>

            <Row gutter={24}>
                <Col span={12}>
                    <Form.Item
                        name="doctor"
                        label="Doctor"
                    >
                        <Input />
                    </Form.Item>
                </Col>
                <Col span={12}>
                    <Form.Item
                        name="noOfPatients"
                        label="No. of Patients"
                    >
                        <Input />
                    </Form.Item>
                </Col>
            </Row>

            <Row gutter={24}>
                <Col span={24}>
                    <Form.Item
                        name="description"
                        label="Description"
                    >
                        <Input.TextArea />
                    </Form.Item>
                </Col>
            </Row>

            <Row style={{ justifyContent: 'center' }}>
                <Button type="primary" htmlType="submit" style={{ width: 200, height: 40 }}>
                    Add
                </Button>
            </Row>
        </Form>
    );
};

export default AppointmentForm;
