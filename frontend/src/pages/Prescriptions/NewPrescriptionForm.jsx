import React, { useState, useEffect } from 'react';
import { Row, Col, Form, Input, Select, Typography, Divider, Button, notification, InputNumber, Drawer, Modal } from 'antd';
import dayjs from 'dayjs';
import { useUser } from '../../contexts/UserContext';
import { appUrl } from '../../constants';
import { getCookie } from '../../commons/cookie';
import PrescriptionTable from './PrescriptionTable';
import JobCardForm from '../JobCards/JobCardForm';

const { Paragraph } = Typography;
const { Option } = Select;

const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
};



const NewPrescriptionForm = ({ prescriptionData, readOnly = false }) => {
    const { user } = useUser();
    const [customers, setCustomers] = useState([]);
    const [prescriptionForm] = Form.useForm();
    const [drawerVisible, setDrawerVisible] = useState(false);
    const [prescriptionList, setPrescriptionList] = useState([]);
    const [selectedPrescriptionData, setSelectedPrescriptionData] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isJobCardModalVisible, setIsJobCardModalVisible] = useState(false);
    const [selectedJobCardData, setSelectedJobCardData] = useState({});

    const fetchCustomers = () => {
        fetch(appUrl + `dashboard/get_all_customers`)
            .then(response => response.json())
            .then(data => {
                setCustomers(data.values);
            })
            .catch(error => console.error('Error fetching customers:', error));
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    const handleOk = () => {
        setIsModalVisible(false);
    };

    const handleJobCardCancel = () => {
        setIsJobCardModalVisible(false);
    };

    const handleJobCardOk = () => {
        setIsJobCardModalVisible(false);
    };

    const closeJobCardModal = () => {
        setIsJobCardModalVisible(false);
        setSelectedJobCardData({});
    };

    // Function to call the server and get the PDF
    const generatePdf = async (formData) => {
        try {
            const csrftoken = getCookie('csrftoken');
            const response = await fetch(appUrl + `dashboard/generate_prescription_pdf`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': csrftoken
                    // Include authorization headers if necessary
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) throw new Error('Network response was not ok.');

            // Get the PDF Blob from the response
            const blob = await response.blob();

            // Create a link element, use it to download the PDF
            const downloadUrl = window.URL.createObjectURL(blob);
            const downloadLink = document.createElement('a');
            downloadLink.href = downloadUrl;
            downloadLink.setAttribute('download', `prescription_${formData.prescription_id}.pdf`); // Any filename you like
            document.body.appendChild(downloadLink);
            downloadLink.click();
            document.body.removeChild(downloadLink);

        } catch (error) {
            console.error('Error:', error);
            notification.error({
                message: 'Error',
                description: 'There was a problem generating the PDF.'
            });
        }
    };

    const handleCustomerChange = id => {
        fetchPrescriptionsByCustomer(id);
    };

    const fetchPrescriptionsByCustomer = (customer_id) => {
        fetch(appUrl + `dashboard/get_prescriptions_by_customer/${customer_id}/`)
            .then(response => response.json())
            .then(data => {
                console.log(data);
                setPrescriptionList(data);
            })
            .catch(error => console.error('Error fetching prescriptions:', error));
    };

    // Toggle drawer visibility
    const toggleDrawer = () => {
        setDrawerVisible(!drawerVisible);
    };

    // Function to handle Print button click
    const handlePrint = () => {
        const values = prescriptionForm.getFieldsValue();
        generatePdf(values);
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
                    description: result['error']
                })
            }
        } catch (error) {
            notification.error({
                message: 'Error ',
                description: error
            })
        }
    };

    const fetchPrescription = (id) => {
        setIsLoading(true);
        fetch(appUrl + `dashboard/get_prescription/${id}/`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                console.log(data);
                data.id = id;
                setSelectedPrescriptionData(data);
                setIsLoading(false);
                setIsModalVisible(true);
            })
            .catch(error => {
                console.error('Failed to fetch:', error);
                setIsLoading(false);
            });
    };

    useEffect(() => {
        fetchCustomers();
        prescriptionForm.setFieldsValue({
            doctor: user.id,
        });
    }, [user]);

    const [checkupInterval, setCheckupInterval] = useState();

    useEffect(() => {
        if (checkupInterval) {
            const nextCheckupDate = dayjs().add(checkupInterval, 'months').format('YYYY-MM-DD');
            prescriptionForm.setFieldsValue({ 'next-checkup-date': nextCheckupDate });
        }
    }, [checkupInterval, prescriptionForm]);

    const handleCheckupChange = (value) => {
        setCheckupInterval(value);
    };

    const onPrescriptionClick = async (prescription_id) => {
        console.log('prescription clicked');
        console.log(prescription_id);
        fetchPrescription(prescription_id)
    };

    const showJobCardModal = () => {
        const customerId = prescriptionForm.getFieldValue('customer_id')
        const prescriptionId = prescriptionForm.getFieldValue('prescription_id')
        console.log(customerId);
        console.log(prescriptionId);
        if (customerId != null) {
            let jobCardData = { 'prescription' : {'customer_id': customerId, 'id': prescriptionId} }
            setSelectedJobCardData(jobCardData);
            setIsJobCardModalVisible(true);
        } else {
            setIsJobCardModalVisible(true);
        }
    };

    useEffect(() => {
        prescriptionForm.resetFields();
        prescriptionForm.setFieldsValue({
            prescription_id: prescriptionData.prescription?.id ? prescriptionData.prescription?.id : null,
            doctor_name: prescriptionData.prescription?.doctor_name,
            customer: prescriptionData.prescription?.customer_name,
            customer_id: prescriptionData.prescription?.customer_id,
            "last-eye-test": prescriptionData.prescription?.last_eye_test,
            vision: prescriptionData.prescription?.vision,
            "care-system": prescriptionData.prescription?.care_system,
            recommendation: prescriptionData.prescription?.recommendation,
            "next-checkup-date": prescriptionData.prescription?.next_checkup,

            "glass-right-sph": prescriptionData.glass_prescription?.lens_detail_right.sph,
            "glass-right-cyl": prescriptionData.glass_prescription?.lens_detail_right.cyl,
            "glass-right-axis": prescriptionData.glass_prescription?.lens_detail_right.axis,
            "glass-left-sph": prescriptionData.glass_prescription?.lens_detail_left.sph,
            "glass-left-cyl": prescriptionData.glass_prescription?.lens_detail_left.cyl,
            "glass-left-axis": prescriptionData.glass_prescription?.lens_detail_left.axis,
            pdr: prescriptionData.glass_prescription?.pdr,
            pdl: prescriptionData.glass_prescription?.pdl,
            "type-of-lenses": prescriptionData.glass_prescription?.type_of_lenses,
            "type-of-contact-lenses": prescriptionData.contact_lens_prescription?.type_of_contact_lenses,

            "lens-right-sph": prescriptionData.contact_lens_prescription?.lens_detail_right.sph,
            "lens-right-cyl": prescriptionData.contact_lens_prescription?.lens_detail_right.cyl,
            "lens-right-axis": prescriptionData.contact_lens_prescription?.lens_detail_right.axis,
            "lens-left-sph": prescriptionData.contact_lens_prescription?.lens_detail_left.sph,
            "lens-left-cyl": prescriptionData.contact_lens_prescription?.lens_detail_left.cyl,
            "lens-left-axis": prescriptionData.contact_lens_prescription?.lens_detail_left.axis,
        });
    }, [prescriptionData, prescriptionForm]);

    return <Form
        form={prescriptionForm}
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

                <Form.Item
                    name="prescription_id"
                    hidden
                >
                    <Input />
                </Form.Item>
            </Col>
        </Row>

        <Row gutter={24}>
            <Col span={8}>
                <Form.Item
                    label="Customer"
                    name="customer"
                    rules={[{ required: true, message: 'Please input customer name!' }]}
                >
                    <Select
                        showSearch
                        placeholder="Select a customer"
                        onChange={handleCustomerChange}
                        optionFilterProp="label"
                        filterOption={(input, option) =>
                            option.label.toLowerCase().includes(input.toLowerCase())
                        }
                        disabled={readOnly}
                    >
                        {customers.map(customer => (
                            <Option key={customer.id} value={customer.id} label={`${customer.first_name} ${customer.last_name}`}>
                                {customer.first_name} {customer.last_name}
                            </Option>
                        ))}
                    </Select>
                </Form.Item>
                <Form.Item
                    name="customer_id"
                    hidden
                >
                    <Input />
                </Form.Item>
            </Col>

            {(!readOnly && prescriptionList.length > 0) && (
                <Col span={8}>
                    <Button onClick={toggleDrawer}>View Previous Prescriptions</Button>
                </Col>
            )}

            <Drawer
                title="Customer Details"
                placement="right"
                closable={true}
                onClose={toggleDrawer}
                open={drawerVisible}
            >
                <p>Previous Prescriptions</p>
                <PrescriptionTable
                    prescriptionList={prescriptionList}
                    onPrescriptionClick={onPrescriptionClick}
                />
            </Drawer>

            <Modal
                title="New/ Edit Prescription"
                open={isModalVisible}
                onOk={handleOk}
                onCancel={handleCancel}
                width={1500}
                footer={null}
                style={{
                    top: 20,
                }}

            >
                <NewPrescriptionForm prescriptionData={selectedPrescriptionData} readOnly={true} />
            </Modal>

            <Col span={8}>
                <Form.Item
                    label="Last Eye Test"
                    name="last-eye-test"
                >
                    <Input readOnly={readOnly} />
                </Form.Item>
            </Col>
        </Row>
        <Row gutter={24}>
            <Col span={12}>
                <Form.Item
                    label="Vision"
                    name="vision"
                >
                    <Input.TextArea readOnly={readOnly} />
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
                    <InputNumber readOnly={readOnly} step={0.25} precision={2} formatter={value => !value || isNaN(value) ? value : value > 0 ? `+${value}` : value} />
                </Form.Item>
            </Col>
            <Col span={7}>
                <Form.Item
                    label="CYL"
                    name="glass-right-cyl"
                >
                    <InputNumber readOnly={readOnly} step={0.25} precision={2} formatter={value => !value || isNaN(value) ? value : value > 0 ? `+${value}` : value} />
                </Form.Item>
            </Col>
            <Col span={7}>
                <Form.Item
                    label="Axis"
                    name="glass-right-axis"
                >
                    <InputNumber readOnly={readOnly} step={0.25} precision={2} formatter={value => !value || isNaN(value) ? value : value > 0 ? `+${value}` : value} />
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
                    <InputNumber readOnly={readOnly} step={0.25} precision={2} formatter={value => !value || isNaN(value) ? value : value > 0 ? `+${value}` : value} />
                </Form.Item>
            </Col>
            <Col span={7}>
                <Form.Item
                    label="CYL"
                    name="glass-left-cyl"
                >
                    <InputNumber readOnly={readOnly} step={0.25} precision={2} formatter={value => !value || isNaN(value) ? value : value > 0 ? `+${value}` : value} />
                </Form.Item>
            </Col>
            <Col span={7}>
                <Form.Item
                    label="Axis"
                    name="glass-left-axis"
                >
                    <InputNumber readOnly={readOnly} step={0.25} precision={2} formatter={value => !value || isNaN(value) ? value : value > 0 ? `+${value}` : value} />
                </Form.Item>
            </Col>
        </Row>
        <Row gutter={24}>
            <Col span={8}>
                <Form.Item
                    label="PDR."
                    name="pdr"
                >
                    <InputNumber readOnly={readOnly} step={0.25} precision={2} formatter={value => !value || isNaN(value) ? value : value > 0 ? `+${value}` : value} />
                </Form.Item>
            </Col>
            <Col span={8}>
                <Form.Item
                    label="PDL."
                    name="pdl"
                >
                    <InputNumber readOnly={readOnly} step={0.25} precision={2} formatter={value => !value || isNaN(value) ? value : value > 0 ? `+${value}` : value} />
                </Form.Item>
            </Col>
            <Col span={8}>
                <Form.Item
                    label="Type of Lenses"
                    name="type-of-lenses"
                    hasFeedback
                >
                    <Select placeholder="Lenses" disabled={readOnly}>
                        <Option value="Single">Single</Option>
                        <Option value="Bi Focal">Bi Focal</Option>
                        <Option value="Progressive">Progressive</Option>
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
                    <InputNumber readOnly={readOnly} step={0.25} precision={2} formatter={value => !value || isNaN(value) ? value : value > 0 ? `+${value}` : value} />
                </Form.Item>
            </Col>
            <Col span={7}>
                <Form.Item
                    label="CYL"
                    name="lens-right-cyl"
                >
                    <InputNumber readOnly={readOnly} step={0.25} precision={2} formatter={value => !value || isNaN(value) ? value : value > 0 ? `+${value}` : value} />
                </Form.Item>
            </Col>
            <Col span={7}>
                <Form.Item
                    label="Axis"
                    name="lens-right-axis"
                >
                    <InputNumber readOnly={readOnly} step={0.25} precision={2} formatter={value => !value || isNaN(value) ? value : value > 0 ? `+${value}` : value} />
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
                    <InputNumber readOnly={readOnly} step={0.25} precision={2} formatter={value => !value || isNaN(value) ? value : value > 0 ? `+${value}` : value} />
                </Form.Item>
            </Col>
            <Col span={7}>
                <Form.Item
                    label="CYL"
                    name="lens-left-cyl"
                >
                    <InputNumber readOnly={readOnly} step={0.25} precision={2} formatter={value => !value || isNaN(value) ? value : value > 0 ? `+${value}` : value} />
                </Form.Item>
            </Col>
            <Col span={7}>
                <Form.Item
                    label="Axis"
                    name="lens-left-axis"
                >
                    <InputNumber readOnly={readOnly} step={0.25} precision={2} formatter={value => !value || isNaN(value) ? value : value > 0 ? `+${value}` : value} />
                </Form.Item>
            </Col>
        </Row>
        <Row gutter={24}>
            <Col span={12}>
                <Form.Item
                    label="Type of Contact Lenses"
                    name="type-of-contact-lenses"
                    hasFeedback
                >
                    <Select placeholder="Contact Lenses" disabled={readOnly}>
                        <Option value="Daily">Daily</Option>
                        <Option value="Monthly">Monthly</Option>
                    </Select>
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
                    <Select placeholder="Care" disabled={readOnly}>
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
                    <Select placeholder="Next Checkup" onChange={handleCheckupChange} disabled={readOnly}>
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
                    <Input.TextArea readOnly={readOnly} />
                </Form.Item>
            </Col>
        </Row>
        <Modal
            title="New/ Edit Job Card"
            open={isJobCardModalVisible}
            onOk={handleJobCardOk}
            onCancel={handleJobCardCancel}
            width={1000}
            footer={null}
        >
            <JobCardForm jobCardData={selectedJobCardData} closeModal={closeJobCardModal} />
        </Modal>
        {!readOnly &&
            <Row style={{ justifyContent: 'center' }}>
                <Button type="primary" htmlType="submit" style={{ width: 200, height: 40 }} >
                    Save
                </Button>
            </Row>
        }
        {readOnly &&
            <Row style={{ justifyContent: 'center' }}>
                <Button type="primary" htmlType="button" style={{ width: 200, height: 40 }} onClick={handlePrint} >
                    Print
                </Button>

                <Button type="primary" htmlType="button" style={{ width: 200, height: 40, marginLeft: 10 }} onClick={() => showJobCardModal()}>
                    Add Job Card
                </Button>
            </Row>
        }
    </Form>
}

export default NewPrescriptionForm;