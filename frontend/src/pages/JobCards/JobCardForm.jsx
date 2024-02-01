import React, { useState, useEffect } from 'react';
import { Button, Row, Col, Form, Input, Select, DatePicker, InputNumber, notification } from 'antd';
import { appUrl } from '../../constants';
import { getCookie } from '../../commons/cookie';
import { useUser } from '../../contexts/UserContext';
import dayjs from 'dayjs';

const { Option } = Select;

const JobCardForm = ({ jobCardData, onJobCardAdded, closeModal, isReadOnly = false, setIsReadOnly = () => { } }) => {
    const [jobCardType, setJobCardType] = useState('Contact Lens');
    const [jobCardForm] = Form.useForm();
    const [customers, setCustomers] = useState([]);
    const [deliveryDate, setDeliveryDate] = useState(dayjs())
    const { user } = useUser();

    const onFinish = async (values) => {
        console.log('Success:', values);
        const submissionValues = { ...values };
        console.log(submissionValues.estimatedDeliveryDate);
        if (submissionValues.estimatedDeliveryDate) {
            submissionValues.estimatedDeliveryDate = dayjs(submissionValues.estimatedDeliveryDate).format('YYYY-MM-DD');
        }
        console.log(submissionValues.estimatedDeliveryDate);

        try {
            const csrftoken = getCookie('csrftoken');
            const jobCardId = jobCardForm.getFieldValue('job_card_id');
            const method = jobCardId ? 'PUT' : 'POST';
            const endpoint = jobCardId ? `dashboard/update_job_card/${jobCardId}/` : 'dashboard/create_job_card/';

            const response = await fetch(appUrl + endpoint, {
                method: method,
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': csrftoken
                },
                body: JSON.stringify(submissionValues),
            });

            if (response.ok) {
                const result = await response.json();
                console.log('success');
                console.log(result);
                console.log(result['message']);
                setIsReadOnly(true);
                jobCardForm.resetFields();
                notification.success({
                    message: 'Success',
                    description: result['message'],
                });
            } else {
                const result = await response.json();
                console.log('error');
                console.log(result);
                notification.error({
                    message: 'Error ',
                    description: result['error']
                })
            }
            closeModal();
        } catch (error) {
            notification.error({
                message: 'Error ',
                description: error.message
            })
        }
    };

    const disableReadOnly = () => {
        setIsReadOnly(false);
    }

    const generatePdf = async (job_card_id) => {
        try {
            const csrftoken = getCookie('csrftoken');
            const response = await fetch(appUrl + `dashboard/generate_job_card_pdf`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': csrftoken
                    // Include authorization headers if necessary
                },
                body: JSON.stringify({ 'job_card_id': job_card_id }),
            });

            if (!response.ok) throw new Error('Network response was not ok.');

            // Get the PDF Blob from the response
            const blob = await response.blob();

            // Create a link element, use it to download the PDF
            const downloadUrl = window.URL.createObjectURL(blob);
            const downloadLink = document.createElement('a');
            downloadLink.href = downloadUrl;
            downloadLink.setAttribute('download', `job_card_${job_card_id}.pdf`); // Any filename you like
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

    const handlePrint = () => {
        const job_card_id = jobCardForm.getFieldValue('job_card_id');
        console.log(job_card_id);

        generatePdf(job_card_id);
    };

    const fetchCustomers = () => {
        fetch(appUrl + `dashboard/get_all_customers`)
            .then(response => response.json())
            .then(data => {
                setCustomers(data.values);
            })
            .catch(error => console.error('Error fetching customers:', error));
    };

    useEffect(() => {
        fetchCustomers();
    }, []);

    useEffect(() => {
        fetchCustomers();
    }, [jobCardData]);

    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    const handleJobCardTypeChange = (value) => {
        setJobCardType(value);
    };

    const onChange = (date, dateString) => {
        const localDate = date ? dayjs(date).format('YYYY-MM-DD') : null;
        setDeliveryDate(localDate);
    };

    useEffect(() => {
        console.log('from job card listing');

        console.log(jobCardData);
        jobCardForm.resetFields();
        jobCardForm.setFieldsValue({
            job_card_id: jobCardData?.id,
            customer: jobCardData?.customer,//issues
            prescription_id: jobCardData?.prescription,
            typeOfJobCard: jobCardData?.job_type,
            supplier: jobCardData?.supplier,
            salesman: jobCardData?.salesman,
            status: jobCardData?.status || 'Work in Progress', // Default value if status is not set
            supplierReference: jobCardData?.supplier_reference,
            estimatedDeliveryDate: dayjs(jobCardData?.estimated_delivery_date), // Format this date if necessary
            baseCurve: jobCardData?.base_curve,
            diameter: jobCardData?.diameter,

            contactLens: jobCardData?.job_type === 'Contact Lens' ? jobCardData?.contact_lens : undefined,
            noOfBoxes: jobCardData?.job_type === 'Contact Lens' ? jobCardData?.no_of_boxes : undefined,

            lens: jobCardData?.job_type === 'Lens' ? jobCardData?.lens : undefined,
            ht: jobCardData?.job_type === 'Lens' ? jobCardData?.ht : undefined,
            frame: jobCardData?.job_type === 'Lens' ? jobCardData?.frame : undefined,
        });
        setJobCardType(jobCardData?.job_type);
    }, [jobCardData, jobCardForm]);

    return (
        <Form
            form={jobCardForm}
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
                            disabled={isReadOnly}
                        >
                            {customers.map(customer => (
                                <Option key={customer.id} value={customer.id} label={`${customer.first_name} ${customer.last_name}`}>
                                    {customer.first_name} {customer.last_name}
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>

                    <Form.Item
                        name="prescription_id"
                        hidden
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        name="job_card_id"
                        hidden
                    >
                        <Input />
                    </Form.Item>

                </Col>
            </Row>
            <Row gutter={24}>
                <Col span={12}>
                    <Form.Item
                        name="typeOfJobCard"
                        label="Type of Job Card"
                        hasFeedback
                        rules={[{ required: true, message: 'Please select a job card type!' }]}
                    >
                        <Select placeholder="Select a job card type" onChange={handleJobCardTypeChange} disabled={isReadOnly}>
                            <Option value="Lens">Lens</Option>
                            <Option value="Contact Lens">Contact Lens</Option>
                        </Select>
                    </Form.Item>
                </Col>
                <Col span={12}>
                    <Form.Item
                        name="supplier"
                        label="Supplier"
                    >
                        <Input readOnly={isReadOnly} />
                    </Form.Item>
                </Col>
            </Row>

            <Row gutter={24}>
                <Col span={12}>
                    <Form.Item
                        name="salesman"
                        label="Salesman"
                    >
                        <Input readOnly={isReadOnly} />
                    </Form.Item>
                </Col>
                <Col span={12}>
                    <Form.Item
                        name={jobCardType === 'Contact Lens' ? "contactLens" : "lens"}
                        label={jobCardType === 'Contact Lens' ? "Contact Lens" : "Lens"}
                    >
                        <Input readOnly={isReadOnly} />
                    </Form.Item>
                </Col>
            </Row>

            {/* Toggle the number of boxes based on job card type */}
            {jobCardType === 'Contact Lens' && (
                <Row gutter={24}>
                    <Col span={12}>
                        <Form.Item
                            name="noOfBoxes"
                            label="Number of boxes"
                        >
                            <InputNumber readOnly={isReadOnly} />
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
                        <Input readOnly={isReadOnly} />
                    </Form.Item>
                </Col>
                <Col span={12}>
                    <Form.Item
                        name="diameter"
                        label="Diameter"
                    >
                        <Input readOnly={isReadOnly} />
                    </Form.Item>
                </Col>
            </Row>

            <Row gutter={24}>
                <Col span={12}>
                    <Form.Item
                        name="status"
                        label="Status"
                    >
                        <Input defaultValue="Work in Progress" readOnly={isReadOnly} />
                    </Form.Item>
                </Col>

                {/* Conditionally render HT and Frame fields based on job card type */}
                {jobCardType === 'Lens' && (
                    <>
                        <Col span={12}>
                            <Form.Item
                                name="ht"
                                label="HT"
                            >
                                <Input readOnly={isReadOnly} />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                name="frame"
                                label="Frame"
                            >
                                <Input readOnly={isReadOnly} />
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
                        <Input readOnly={isReadOnly} />
                    </Form.Item>
                </Col>
                <Col span={12}>
                    <Form.Item
                        name="estimatedDeliveryDate"
                        label="Estimated Delivery Date"
                    >
                        <DatePicker format="DD-MM-YYYY" onChange={onChange} value={deliveryDate} disabled={isReadOnly} />
                    </Form.Item>
                </Col>
            </Row>

            {!isReadOnly &&
                <Row style={{ justifyContent: 'center' }}>
                    <Button type="primary" htmlType="submit" style={{ width: 200, height: 40 }}>
                        Save
                    </Button>
                </Row>}
            {isReadOnly &&
                <Row style={{ justifyContent: 'center' }}>
                    <Button type="primary" htmlType="button" style={{ width: 200, height: 40 }} onClick={handlePrint} >
                        Print
                    </Button>

                    {user.profile.role !== 'Staff' &&
                        <Button type="primary" htmlType="button" style={{ width: 200, height: 40, marginLeft: 10 }} onClick={() => disableReadOnly()}>
                            Edit
                        </Button>
                    }
                </Row>
            }
        </Form>
    );
};

export default JobCardForm;
