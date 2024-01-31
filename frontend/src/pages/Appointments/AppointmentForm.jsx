import { React, useState, useEffect } from 'react';
import { Button, Row, Col, Form, Input, InputNumber, DatePicker, TimePicker, Select, notification } from 'antd';
import dayjs from 'dayjs';
import { useUser } from '../../contexts/UserContext';
import { appUrl } from '../../constants';
import { getCookie } from '../../commons/cookie';

const { Option } = Select;

const AppointmentForm = ({ onSubmit, slotInfo, readOnly = false }) => {

    const [appointmentForm] = Form.useForm();
    const { user } = useUser();
    const [customers, setCustomers] = useState([]);
    const [doctors, setDoctors] = useState([]);
    const [appointmentDate, setAppointmentDate] = useState(dayjs().tz('Indian/Mauritius'));


    const fetchCustomers = () => {
        fetch(appUrl + `dashboard/get_all_customers`)
            .then(response => response.json())
            .then(data => {
                setCustomers(data.values);
            })
            .catch(error => console.error('Error fetching customers:', error));
    };

    const fetchDoctors = () => {
        fetch(appUrl + `dashboard/get_all_doctors`)
            .then(response => response.json())
            .then(data => {
                setDoctors(data.values);
            })
            .catch(error => console.error('Error fetching doctors:', error));
    };

    useEffect(() => {
        fetchCustomers();
        fetchDoctors();
        appointmentForm.setFieldsValue({
            doctor: user.id,
        });
    }, [user]);

    const onFinish = async (values) => {
        console.log(values);
        const formattedValues = {
            ...values,
            appointmentDate: values.appointmentDate ? dayjs(values.appointmentDate).tz('Indian/Mauritius') : null,
            startTime: values.startTime.format(),
            endTime: values.endTime.format(),
        };
        onSubmit(formattedValues); // Pass the form values up to the parent component
        try {
            const csrftoken = getCookie('csrftoken');
            if (slotInfo.id) {
                const response = await fetch(appUrl + `dashboard/update_appointment/${slotInfo.id}/`, {
                    method: 'PUT',
                    credentials: 'include',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRFToken': csrftoken
                    },
                    body: JSON.stringify(formattedValues),
                });

                if (response.ok) {
                    const result = await response.json();
                    appointmentForm.resetFields();
                    notification.success({
                        message: 'Success',
                        description: result['message'],
                    });
                } else {
                    const result = await response.json();
                    notification.error({
                        message: 'Error ',
                        description: result['error']
                    })
                }
            }
            else {
                const response = await fetch(appUrl + `dashboard/create_appointment/`, {
                    method: 'POST',
                    credentials: 'include',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRFToken': csrftoken
                    },
                    body: JSON.stringify(formattedValues),
                });

                if (response.ok) {
                    const result = await response.json();
                    appointmentForm.resetFields();
                    notification.success({
                        message: 'Success',
                        description: result['message'],
                    });
                } else {
                    const result = await response.json();
                    notification.error({
                        message: 'Error ',
                        description: result['error']
                    })
                }
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
    };

    useEffect(() => {
        appointmentForm.resetFields();
        appointmentForm.setFieldsValue({
            customer: slotInfo.customer ? slotInfo.customer : '',
            appointmentDate: dayjs(slotInfo.appointment_date),
            startTime: dayjs(slotInfo.start),
            endTime: dayjs(slotInfo.end),
            status: slotInfo.status ? slotInfo.status : '',
            doctor: slotInfo.doctor ? slotInfo.doctor : user.id,
            noOfPatients: slotInfo.number_of_patients ? slotInfo.number_of_patients : 1,
            description: slotInfo.description ? slotInfo.description : ''
        });
    }, [slotInfo, appointmentForm]);

    const onChange = (date, dateString) => {
        const localDate = date ? dayjs(date).tz('Indian/Mauritius').format('DD-MM-YYYY') : null;
        console.log(localDate);
        setAppointmentDate(localDate);
    };

    return (
        <>
            <Form
                form={appointmentForm}
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
                                disabled={readOnly}
                            >
                                {customers.map(customer => (
                                    <Option key={customer.id} value={customer.id} label={`${customer.first_name} ${customer.last_name.toUpperCase()}`}>
                                        {customer.first_name} {customer.last_name.toUpperCase()}
                                    </Option>
                                ))}
                            </Select>
                        </Form.Item>

                    </Col>
                </Row>

                <Row gutter={24}>
                    <Col span={12}>
                        <Form.Item
                            name="appointmentDate"
                            label="Appointment Date"
                        >
                            <DatePicker onChange={onChange} value={appointmentDate} format="DD-MM-YYYY" />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            name="status"
                            label="Status"
                            rules={[{ required: true, message: 'Please input initial status!' }]}
                        >
                            <Select placeholder="Select Status">
                                <Option value="scheduled">Scheduled</Option>
                                <Option value="completed">Completed</Option>
                                <Option value="noshow">No Show</Option>
                                <Option value="canceled">Canceled</Option>
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
                                use12Hours // Remove this line if you want 24-hour format
                            />
                        </Form.Item>
                    </Col>
                </Row>

                <Row gutter={24}>
                    <Col span={12}>
                        {/* <Form.Item
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
                        </Form.Item> */}
                        <Form.Item
                            label="Doctor"
                            name="doctor"
                            rules={[{ required: true, message: 'Please input doctor name!' }]}
                        >
                            <Select
                                showSearch
                                placeholder="Select a doctor"
                                optionFilterProp="label"
                                filterOption={(input, option) =>
                                    option.label.toLowerCase().includes(input.toLowerCase())
                                }
                                defaultValue={''}
                                disabled={readOnly}
                            >
                                {doctors.map(doctor => (
                                    <Option key={doctor.id} value={doctor.id} label={`${doctor.first_name} ${doctor.last_name.toUpperCase()}`}>
                                        {doctor.first_name} {doctor.last_name.toUpperCase()}
                                    </Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Col>
                </Row>

                <Row gutter={24}>
                    <Col span={12}>
                        <Form.Item
                            name="noOfPatients"
                            label="No. of Patients"
                        //initialValue={1}
                        >
                            <InputNumber defaultValue={1} />
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
                        Save
                    </Button>
                </Row>
            </Form>
        </>
    );
};

export default AppointmentForm;
