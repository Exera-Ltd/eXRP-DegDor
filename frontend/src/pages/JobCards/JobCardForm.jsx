import React, { useState } from 'react';
import { Button, Row, Col, Form, Input, Select } from 'antd';

const { Option } = Select;

const onFinish = (values) => {
    console.log('Success:', values);
};

const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
};

const JobCardForm = () => {
    const [jobCardType, setJobCardType] = useState('contactLenses');

    const handleJobCardTypeChange = (value) => {
        setJobCardType(value);
    };

    return (
        <Form
            layout="horizontal"
            name="job-card-form"
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
                        name="typeOfJobCard"
                        label="Type of Job Card"
                        hasFeedback
                        rules={[{ required: true, message: 'Please select a job card type!' }]}
                    >
                        <Select placeholder="Select a job card type" onChange={handleJobCardTypeChange}>
                            <Option value="contactLenses">Contact Lenses</Option>
                            <Option value="lenses">Lenses</Option>
                            {/* Add other job card types as needed */}
                        </Select>
                    </Form.Item>
                </Col>
                <Col span={12}>
                    <Form.Item
                        name="supplier"
                        label="Supplier"
                    >
                        <Input />
                    </Form.Item>
                </Col>
            </Row>

            <Row gutter={24}>
                <Col span={12}>
                    <Form.Item
                        name="salesman"
                        label="Salesman"
                    >
                        <Input />
                    </Form.Item>
                </Col>
                <Col span={12}>
                    <Form.Item
                        name={jobCardType === 'contactLenses' ? "contactLens" : "lens"}
                        label={jobCardType === 'contactLenses' ? "Contact Lens" : "Lens"}
                    >
                        <Input />
                    </Form.Item>
                </Col>
            </Row>

            {/* Toggle the number of boxes based on job card type */}
            {jobCardType === 'contactLenses' && (
                <Row gutter={24}>
                    <Col span={12}>
                        <Form.Item
                            name="noOfBoxes"
                            label="Number of boxes"
                        >
                            <Input />
                        </Form.Item>
                    </Col>
                </Row>
            )}

            <Row gutter={24}>
                <Col span={12}>
                    <Form.Item
                        name="baseCurve"
                        label="Base Curve"
                    >
                        <Input />
                    </Form.Item>
                </Col>
                <Col span={12}>
                    <Form.Item
                        name="diameter"
                        label="Diameter"
                    >
                        <Input />
                    </Form.Item>
                </Col>
            </Row>

            <Row gutter={24}>
                <Col span={12}>
                    <Form.Item
                        name="status"
                        label="Status"
                    >
                        <Input defaultValue="Work in Progress" />
                    </Form.Item>
                </Col>

                {/* Conditionally render HT and Frame fields based on job card type */}
                {jobCardType === 'lenses' && (
                    <>
                        <Col span={12}>
                            <Form.Item
                                name="ht"
                                label="HT"
                            >
                                <Input />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                name="frame"
                                label="Frame"
                            >
                                <Input />
                            </Form.Item>
                        </Col>
                    </>
                )}
            </Row>

            <Row gutter={24}>
                <Col span={12}>
                    <Form.Item
                        name="supplierReference"
                        label="Supplier Reference"
                    >
                        <Input />
                    </Form.Item>
                </Col>
                <Col span={12}>
                    <Form.Item
                        name="estimatedDeliveryDate"
                        label="Estimated Delivery Date"
                    >
                        <Input />
                    </Form.Item>
                </Col>
            </Row>

            <Row style={{ justifyContent: 'center' }}>
                <Button type="primary" htmlType="submit" style={{ width: 200, height: 40 }}>
                    Add Job Card
                </Button>
            </Row>
        </Form>
    );
};

export default JobCardForm;
