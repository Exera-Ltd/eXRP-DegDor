import { React } from 'react';
import { Button, Row, Col, Form, Input, DatePicker, TimePicker, Select } from 'antd';
import moment from 'moment';
import CustomerSelect from '../../components/CustomerSelect';
import DoctorSelect from '../../components/DoctorSelect';

const { Option } = Select;

const AppointmentForm = ({ onSubmit, slotInfo }) => {

    const onFinish = (values) => {
        onSubmit(values); // Pass the form values up to the parent component
    };

    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    const selectedStartDate = slotInfo ? moment(slotInfo.start) : null;
    const selectedEndDate = slotInfo ? moment(slotInfo.end) : null;

    return (
        <>
            <Form
                layout="horizontal"
                name="appointment-form"
                labelAlign="left"
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 16 }}
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                initialValues={{
                    appointmentDate: selectedStartDate ? selectedStartDate : '',
                    startTime: selectedStartDate,
                    endTime: selectedEndDate,
                }}
                autoComplete="off"
            >
                <Row gutter={24}>
                    <Col span={12}>
                        <Form.Item
                            name="customerName"
                            label="Customer Name"
                        >
                            <CustomerSelect />
                        </Form.Item>
                    </Col>
                </Row>

                <Row gutter={24}>
                    <Col span={12}>
                        <Form.Item
                            name="appointmentDate"
                            label="Appointment Date"
                        >
                            <DatePicker.MonthPicker
                                format="DD-MM-YYYY"
                                defaultValue={selectedStartDate ? selectedStartDate : ''}
                            />
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
                            <TimePicker
                                format="HH:mm"
                                defaultValue={selectedStartDate}
                                use12Hours // Remove this line if you want 24-hour format
                            />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            name="endTime"
                            label="End Time"
                        >
                            <TimePicker
                                format="HH:mm"
                                defaultValue={selectedEndDate}
                                use12Hours // Remove this line if you want 24-hour format
                            />
                        </Form.Item>
                    </Col>
                </Row>

                <Row gutter={24}>
                    <Col span={12}>
                        <Form.Item
                            name="doctor"
                            label="Doctor"
                        >
                            <DoctorSelect />
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
        </>
    );
};

export default AppointmentForm;
