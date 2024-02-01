import { EyeOutlined, PlusCircleOutlined } from '@ant-design/icons';
import { Card, Col, Input, Modal, Pagination, Row, Typography } from 'antd';
import React, { useEffect, useState } from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import JobCardForm from './JobCardForm';
import { appUrl } from '../../constants';

const { Title } = Typography;
const { Meta } = Card;
const itemsPerPage = 8;

function JobCardListing() {
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState("");
    const [jobCardList, setJobCardList] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isReadOnly, setIsReadOnly] = useState(false);

    const filteredData = jobCardList.filter(item => {
        const firstName = item.customer__first_name || "";
        const lastName = item.customer__last_name || "";

        return (
            firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            lastName.toLowerCase().includes(searchTerm.toLowerCase()) 
        );
    });

    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedData = filteredData.slice(startIndex, startIndex + itemsPerPage);

    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedJobCardData, setSelectedJobCardData] = useState({});

    const showModal = (customerId) => {
        console.log(customerId);
        if (customerId != null) {
            fetchJobCard(customerId);
        }  
    };

    const handleCancel = () => {
        console.log('handleCancel')
        setIsModalVisible(false);
        setSelectedJobCardData({});
    };

    const handleOk = () => {
        console.log('handleOk')
        setIsModalVisible(false);
    };

    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm]);

    const fetchJobCard = (id) => {
        setIsLoading(true);
        fetch(appUrl + `dashboard/get_job_card/${id}/`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                console.log(data);
                setSelectedJobCardData(data.values);
                setIsReadOnly(true);
                setIsLoading(false);
                setIsModalVisible(true);
            })
            .catch(error => {
                console.error('Failed to fetch:', error);
                setIsLoading(false);
            });
    };

    const fetchJobCards = () => {
        setIsLoading(true);
        fetch(appUrl + 'dashboard/get_all_job_cards')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                setJobCardList(data.values);
                setIsLoading(false);
            })
            .catch(error => {
                console.error('Failed to fetch:', error);
                setIsLoading(false);
            });
    };

    useEffect(() => {
        fetchJobCards();
    }, []);

    const closeModal = () => {
        setIsModalVisible(false);
        setSelectedJobCardData({});
    };


    return (
        <div>

            <Row style={{ alignItems: 'baseline', justifyContent: 'space-between' }}>
                <Title level={3}>Job Card Listing </Title>
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
                                        <EyeOutlined key="edit" onClick={() => showModal(item.id)} />
                                    ]}
                                >
                                    <Meta
                                        title={item.customer__first_name + ' ' + item.customer__last_name}
                                        description={item.nic_number}
                                    />
                                    <div>
                                        <p>Delivery Date: {item.estimated_delivery_date.slice(0,10)}</p>
                                        <p>Phone: {item.customer__mobile_1}</p>
                                        <p>Type: {item.job_type}</p>
                                        <span>Status: {item.status}</span>
                                    </div>
                                </Card>
                            </Col>
                        </CSSTransition>
                    ))}
                </TransitionGroup>
            </Row>

            <Modal
                title="New/ Edit Job Card"
                open={isModalVisible}
                onOk={handleOk}
                onCancel={handleCancel}
                width={1000}
                footer={null}
            >
                <JobCardForm jobCardData={selectedJobCardData} onJobCardAdded={fetchJobCards} closeModal={closeModal} isReadOnly={isReadOnly} setIsReadOnly={setIsReadOnly}/>
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

export default JobCardListing;