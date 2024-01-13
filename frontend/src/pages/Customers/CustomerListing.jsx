import { EditOutlined, PlusCircleOutlined } from '@ant-design/icons';
import { Card, Col, Input, Modal, Pagination, Row, Typography } from 'antd';
import React, { useEffect, useState } from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import NewCustomerForm from './NewCustomerForm';
import { appUrl } from '../../constants';

const { Title } = Typography;
const { Meta } = Card;
const itemsPerPage = 8;

function CustomerListing() {
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState("");
    const [customerList, setCustomerList] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const filteredData = customerList.filter(item => {
        const firstName = item.first_name || "";
        const lastName = item.last_name || "";
        const mobilePhone = item.mobile_1 || "";
        const nic = item.nic_number || "";

        return (
            firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            mobilePhone.toLowerCase().includes(searchTerm.toLowerCase()) ||
            nic.toLowerCase().includes(searchTerm.toLowerCase())
        );
    });

    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedData = filteredData.slice(startIndex, startIndex + itemsPerPage);

    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedCustomerData, setSelectedCustomerData] = useState({});

    const showModal = (customerId) => {
        console.log(customerId);
        if (customerId != null) {
            fetchCustomer(customerId);
        }  else {
            setIsModalVisible(true);
        }
    };

    const handleCancel = () => {
        console.log('handleCancel')
        setIsModalVisible(false);
        setSelectedCustomerData({});
    };

    const handleOk = () => {
        console.log('handleOk')
        setIsModalVisible(false);
    };

    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm]);

    const fetchCustomer = (id) => {
        setIsLoading(true);
        fetch(appUrl + `dashboard/get_customer/${id}/`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                console.log(data);
                setSelectedCustomerData(data.values);
                setIsLoading(false);
                setIsModalVisible(true);
            })
            .catch(error => {
                console.error('Failed to fetch:', error);
                setIsLoading(false);
            });
    };

    const fetchCustomers = () => {
        setIsLoading(true);
        fetch(appUrl + 'dashboard/get_all_customers')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                setCustomerList(data.values);
                setIsLoading(false);
            })
            .catch(error => {
                console.error('Failed to fetch:', error);
                setIsLoading(false);
            });
    };

    useEffect(() => {
        fetchCustomers();
    }, []);

    const closeModal = () => {
        setIsModalVisible(false);
        setSelectedCustomerData({});
    };


    return (
        <div>

            <Row style={{ alignItems: 'baseline', justifyContent: 'space-between' }}>
                <Title level={3}>Customer Listing </Title>
                <PlusCircleOutlined style={{ fontSize: 20 }} onClick={() => showModal(null)} />
            </Row>
            <Input
                placeholder="Search by First Name, Last Name, Mobile or NIC"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                style={{ marginBottom: '20px' }}
            />
            <Row gutter={[16, 16]}>
                <TransitionGroup component={null}>
                    {paginatedData.map((item) => (
                        <CSSTransition
                            key={item.id}
                            timeout={300}
                            classNames="card"
                        >
                            <Col span={6}>
                                <Card
                                    style={{ boxShadow: 'rgba(0, 0, 0, 0.15) 0px 2px 8px' }}
                                    actions={[
                                        <EditOutlined key="edit" onClick={() => showModal(item.id)} />
                                    ]}
                                >
                                    <Meta
                                        title={item.title + ' ' + item.first_name + ' ' + item.last_name}
                                        description={item.nic_number}
                                    />
                                    <div>
                                        <p>Address: {item.city}</p>
                                        <span>Phone: {item.mobile_1}</span>
                                    </div>
                                </Card>
                            </Col>
                        </CSSTransition>
                    ))}
                </TransitionGroup>
            </Row>

            <Modal
                title="New/ Edit Customer"
                open={isModalVisible}
                onOk={handleOk}
                onCancel={handleCancel}
                width={1000}
                footer={null}
            >
                <NewCustomerForm customerData={selectedCustomerData} onCustomerAdded={fetchCustomers} closeModal={closeModal} />
            </Modal>
            <Pagination
                current={currentPage}
                total={filteredData.length}
                pageSize={itemsPerPage}
                onChange={page => setCurrentPage(page)}
                style={{ textAlign: 'center', marginTop: '20px' }}
            />
        </div>
    );
}

export default CustomerListing;