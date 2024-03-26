import React, { useState, useEffect } from 'react';
import { Row, Col, Form, Input, Select, Typography, Divider, Button, notification, InputNumber, Drawer, Modal, Space, DatePicker } from 'antd';
import dayjs from 'dayjs';
import { useUser } from '../../contexts/UserContext';
import { appUrl } from '../../constants';
import { getCookie } from '../../commons/cookie';
import TransactionTable from './TransactionTable';
import JobCardForm from '../JobCards/JobCardForm';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';

const { Paragraph } = Typography;
const { Option } = Select;
const { TextArea } = Input;

const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
};

const NewTransactionForm = ({ orderData, isReadOnly = false, setIsReadOnly = () => { }, setIsTransactionModalVisible = () => { } }) => {
    const { user } = useUser();
    const [customers, setCustomers] = useState([]);
    const [orderForm] = Form.useForm();
    const [drawerVisible, setDrawerVisible] = useState(false);
    const [orderList, setTransactionList] = useState([]);
    const [selectedTransactionData, setSelectedTransactionData] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const [isJobCardModalVisible, setIsJobCardModalVisible] = useState(false);
    const [selectedJobCardData, setSelectedJobCardData] = useState({});
    const [isModalVisible, setIsModalVisible] = useState(false);

    const fetchCustomers = () => {
        fetch(appUrl + `dashboard/get_all_customers`)
            .then(response => response.json())
            .then(data => {
                setCustomers(data.values);
            })
            .catch(error => console.error('Error fetching customers:', error));
    };

    const handleCancel = () => {
        console.log('cancelled');
        setIsModalVisible(false);
    };

    const handleOk = () => {
        //setIsModalVisible(false);
    };

    const handleJobCardCancel = () => {
        setIsReadOnly(true);
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
            const response = await fetch(appUrl + `dashboard/generate_order_pdf`, {
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
            downloadLink.setAttribute('download', `order_${formData.order_id}.pdf`); // Any filename you like
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
        fetchTransactionsByCustomer(id);
    };

    const fetchTransactionsByCustomer = (customer_id) => {
        fetch(appUrl + `dashboard/get_orders_by_customer/${customer_id}/`)
            .then(response => response.json())
            .then(data => {
                console.log(data);
                setTransactionList(data);
            })
            .catch(error => console.error('Error fetching orders:', error));
    };

    // Toggle drawer visibility
    const toggleDrawer = () => {
        setDrawerVisible(!drawerVisible);
    };

    // Function to handle Print button click
    const handlePrint = () => {
        const values = orderForm.getFieldsValue();
        generatePdf(values);
    };

    const onFinish = async (values) => {
        console.log('Success:', values);

        try {
            const csrftoken = getCookie('csrftoken');
            const orderId = orderForm.getFieldValue('order_id');
            const method = orderId ? 'PUT' : 'POST';
            const endpoint = orderId ? `dashboard/update_order/${orderId}/` : 'dashboard/create_order/';

            const response = await fetch(appUrl + endpoint, {
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
                notification.success({
                    message: 'Success',
                    description: result['message'],
                });
                setIsTransactionModalVisible(false);
                setIsReadOnly(true);
                orderForm.resetFields();
            } else {
                const result = await response.json();
                notification.error({
                    message: 'Error',
                    description: result['error']
                });
            }
        } catch (error) {
            notification.error({
                message: 'Error',
                description: error.message
            });
        }
    };

    const fetchTransaction = (id) => {
        setIsLoading(true);
        fetch(appUrl + `dashboard/get_order/${id}/`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                console.log(data);
                data.id = id;
                setSelectedTransactionData(data);
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
        orderForm.setFieldsValue({
            doctor: user.id,
        });
    }, [user]);

    const [checkupInterval, setCheckupInterval] = useState();

    useEffect(() => {
        if (checkupInterval) {
            const nextCheckupDate = dayjs().add(checkupInterval, 'months').format('YYYY-MM-DD');
            orderForm.setFieldsValue({ 'next-checkup-date': nextCheckupDate });
        }
    }, [checkupInterval, orderForm]);

    const handleCheckupChange = (value) => {
        setCheckupInterval(value);
    };

    const onTransactionClick = async (order_id) => {
        console.log('order clicked');
        console.log(order_id);
        fetchTransaction(order_id)
    };

    const showJobCardModal = () => {
        const customerId = orderForm.getFieldValue('customer_id')
        const orderId = orderForm.getFieldValue('order_id')
        console.log(customerId);
        console.log(orderId);
        if (customerId != null) {
            let jobCardData = { 'customer': customerId, 'order': orderId }
            setSelectedJobCardData(jobCardData);
            setIsJobCardModalVisible(true);
        } else {
            setIsJobCardModalVisible(true);
        }
    };

    const disableReadOnly = () => {
        setIsReadOnly(false);
    }

    useEffect(() => {
        orderForm.resetFields();
        orderForm.setFieldsValue({

        });
    }, [orderData, orderForm]);

    return <Form
        form={orderForm}
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
        <Divider orientation="left" orientationMargin="0">Customer Details</Divider>
        <Row gutter={24}>
            <Col span={12}>
                <Form.Item
                    name="order_id"
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
                        disabled={isReadOnly}
                    >
                        {customers.map(customer => (
                            <Option key={customer.id} value={customer.id} label={`${customer.first_name} ${customer.last_name.toUpperCase()}`}>
                                {customer.first_name} {customer.last_name.toUpperCase()}
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

            {(!isReadOnly && orderList.length > 0) && (
                <Col span={8}>
                    <Button onClick={toggleDrawer}>View Previous Orders</Button>
                </Col>
            )}

            <Drawer
                title="Customer Details"
                placement="right"
                closable={true}
                onClose={toggleDrawer}
                open={drawerVisible}
            >
                <p>Previous Orders</p>
                <TransactionTable
                    orderList={orderList}
                    onTransactionClick={onTransactionClick}
                />
            </Drawer>

            <Modal
                title="New/ Edit Transaction"
                open={isModalVisible}
                onOk={handleOk}
                onCancel={handleCancel}
                width={1500}
                footer={null}
                style={{
                    top: 20,
                }}

            >
                <NewTransactionForm orderData={selectedTransactionData} isReadOnly={true} />
            </Modal>
        </Row>

        <Divider orientation="left" orientationMargin="0">Products</Divider>
        <Row gutter={24}>
            <Form.List name="items">
                {(fields, { add, remove }) => (
                    <>
                        {fields.map(({ key, name }) => (
                            <div key={key} style={{ marginBottom: 8, width: '100%', display: 'flex', alignItems: 'baseline' }}>
                                <Col span={8} style={{ marginRight: 8 }}>
                                    <Form.Item
                                        {...name}
                                        label="Product"
                                        name={[name, 'customer']}
                                        rules={[{ required: true, message: 'Please input customer name!' }]}
                                        style={{ width: '100%' }}
                                    >
                                        <Select
                                            showSearch
                                            placeholder="Select a Product"
                                            onChange={handleCustomerChange}
                                            optionFilterProp="label"
                                            filterOption={(input, option) =>
                                                option.label.toLowerCase().includes(input.toLowerCase())
                                            }
                                            disabled={isReadOnly}
                                            style={{ width: '100%' }}
                                        >
                                            {customers.map(customer => (
                                                <Option key={customer.id} value={customer.id} label={`${customer.first_name} ${customer.last_name.toUpperCase()}`}>
                                                    {customer.first_name} {customer.last_name.toUpperCase()}
                                                </Option>
                                            ))}
                                        </Select>
                                    </Form.Item>
                                </Col>
                                <Col span={6}>
                                    <Form.Item {...name} label="Product Price" name={[name, 'productPrice']} style={{ width: '100%' }}>
                                        <InputNumber min={1} step={1} style={{ width: '100%' }} />
                                    </Form.Item>
                                </Col>
                                <Col span={6}>
                                    <Form.Item {...name} label="Quantity" name={[name, 'productQuantity']} style={{ width: '100%' }}>
                                        <InputNumber min={1} step={1} style={{ width: '100%' }} />
                                    </Form.Item>
                                </Col>
                                <Col span={4}>
                                    {!isReadOnly && <MinusCircleOutlined onClick={() => remove(name)} />}
                                </Col>
                            </div>
                        ))}

                        {!isReadOnly && (
                            <Col span={24} style={{ textAlign: 'right' }}>
                                <Button type="dashed" onClick={() => add()} icon={<PlusOutlined />} style={{ width: '100%' }}>
                                    Add Item
                                </Button>
                            </Col>
                        )}
                    </>
                )}
            </Form.List>
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
        {
            !isReadOnly &&
            <Row style={{ justifyContent: 'center', marginTop: 20 }}>
                <Button type="primary" htmlType="submit" style={{ width: 200, height: 40 }} >
                    Save
                </Button>
            </Row>
        }
        {
            isReadOnly &&
            <Row style={{ justifyContent: 'center', marginTop: 20 }}>
                <Button type="primary" htmlType="button" style={{ width: 200, height: 40 }} onClick={handlePrint} >
                    Print
                </Button>

                <Button type="primary" htmlType="button" style={{ width: 200, height: 40, marginLeft: 10 }} onClick={() => showJobCardModal()}>
                    Add Job Card
                </Button>

                {user.profile.role !== 'Staff' &&
                    <Button type="primary" htmlType="button" style={{ width: 200, height: 40, marginLeft: 10 }} onClick={() => disableReadOnly()}>
                        Edit
                    </Button>
                }
            </Row>
        }
    </Form >
}

export default NewTransactionForm;