import React from 'react';
import { Button, Row, Col, Form, Input, Select, Typography, Divider } from 'antd';
import moment from 'moment';

const { Paragraph } = Typography;

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

const NewPrescriptionForm = ({ prescriptionData }) => {
    return <Form
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
        <Divider orientation="left" orientationMargin="0">Glass Prescriptions</Divider>
        <Row gutter={24}>
            <Col span={12}>
                <Form.Item
                    label="Doctor Name"
                    name="doctorname"
                    rules={[
                        {
                            required: true,
                            message: 'Please input doctor name!',
                        },
                    ]}
                >
                    <Input />
                </Form.Item>
            </Col>
            <Col span={12}>
                <Form.Item
                    label="Last Eye Test"
                    name="lasteyetest"
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
        <Row gutter={24}>
            <Col span={3}>
                <Paragraph strong>Right</Paragraph>
            </Col>
            <Col span={7}>
                <Form.Item
                    label="SPH"
                    name="right-sph"
                >
                    <Input />
                </Form.Item>
            </Col>
            <Col span={7}>
                <Form.Item
                    label="CYL"
                    name="right-cyl"
                >
                    <Input />
                </Form.Item>
            </Col>
            <Col span={7}>
                <Form.Item
                    label="Axis"
                    name="right-axis"
                >
                    <Input />
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
                    name="left-sph"
                >
                    <Input />
                </Form.Item>
            </Col>
            <Col span={7}>
                <Form.Item
                    label="CYL"
                    name="left-cyl"
                >
                    <Input />
                </Form.Item>
            </Col>
            <Col span={7}>
                <Form.Item
                    label="Axis"
                    name="left-axis"
                >
                    <Input />
                </Form.Item>
            </Col>
        </Row>
        <Row gutter={24}>
            <Col span={8}>
                <Form.Item
                    label="PDR."
                    name="pdr"
                >
                    <Input />
                </Form.Item>
            </Col>
            <Col span={8}>
                <Form.Item
                    label="PDL."
                    name="pdl"
                >
                    <Input />
                </Form.Item>
            </Col>
            <Col span={8}>
                <Form.Item
                    label="Type of Lenses"
                    name="lenses"
                    hasFeedback
                >
                    <Select placeholder="Lenses">
                        <Option value="single">Single</Option>
                        <Option value="doublie">Double</Option>
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
                    name="right-sph"
                >
                    <Input />
                </Form.Item>
            </Col>
            <Col span={7}>
                <Form.Item
                    label="CYL"
                    name="right-cyl"
                >
                    <Input />
                </Form.Item>
            </Col>
            <Col span={7}>
                <Form.Item
                    label="Axis"
                    name="right-axis"
                >
                    <Input />
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
                    name="left-sph"
                >
                    <Input />
                </Form.Item>
            </Col>
            <Col span={7}>
                <Form.Item
                    label="CYL"
                    name="left-cyl"
                >
                    <Input />
                </Form.Item>
            </Col>
            <Col span={7}>
                <Form.Item
                    label="Axis"
                    name="left-axis"
                >
                    <Input />
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
                    <Select placeholder="care">
                        <Option value="permanent">Permanent</Option>
                        <Option value="one-off">One Off</Option>
                    </Select>
                </Form.Item>
            </Col>
            <Col span={8}>
                <Form.Item
                    label="Next Checkup"
                    name="next-checkup"
                    hasFeedback
                >
                    <Select placeholder="next-checkup">
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
            <Button type="primary" htmlType="submit" style={{ width: 200, height: 40 }} onClick={() => handleSave(prescriptionData.id)}>
                Save
            </Button>
        </Row>
    </Form>
}

export default NewPrescriptionForm;