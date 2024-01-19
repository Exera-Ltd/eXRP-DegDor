import React, { useState, useEffect } from 'react';
import { Typography, Row, Col, Card, Pagination, Input, Modal } from 'antd';
import { EyeOutlined, PlusCircleOutlined } from '@ant-design/icons';
import NewPrescriptionForm from './NewPrescriptionForm';
import { appUrl } from '../../constants';

const { Title } = Typography;
const { Meta } = Card;

function PrescriptionListing() {
    const itemsPerPage = 24;
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState("");
    const [prescriptionList, setPrescriptionList] = useState([]);
    const [isReadOnly, setIsReadOnly] = useState(false);
    const filteredData = prescriptionList.filter(item => {
        const doctorFirstName = item.doctor__first_name || "";
        const doctorLastName = item.doctor__last_name || "";
        const customerFirstName = item.customer__first_name || "";
        const customerLastName = item.customer__last_name || "";
        const createdDate = item.created_date || "";

        return (
            doctorFirstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            doctorLastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            customerFirstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            customerLastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            createdDate.toLowerCase().includes(searchTerm.toLowerCase())
        );
    });

    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedData = filteredData.slice(startIndex, startIndex + itemsPerPage);

    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedPrescriptionId, setSelectedPrescriptionId] = useState(null);
    const [selectedPrescriptionData, setSelectedPrescriptionData] = useState({});
    const [isLoading, setIsLoading] = useState(true);

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
                setIsReadOnly(true);
                setIsLoading(false);
                setIsModalVisible(true);
            })
            .catch(error => {
                console.error('Failed to fetch:', error);
                setIsLoading(false);
            });
    };

    const showModal = (id) => {
        if (id != null) {
            //setSelectedPrescriptionId(id);
            //let prescription = prescriptionList.find(item => item.id === id);
            fetchPrescription(id);
            console.log(selectedPrescriptionData);
        }
        setIsModalVisible(true);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    const handleOk = () => {
        setIsModalVisible(false);
    };

    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm]);

    const fetchPrescriptions = () => {
        //setIsLoading(true);
        fetch(appUrl + 'dashboard/get_all_prescriptions')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                setPrescriptionList(data.values);
                console.log(data.values);
                //setIsLoading(false);
            })
            .catch(error => {
                console.error('Failed to fetch:', error);
                //setIsLoading(false);
            });
    };

    useEffect(() => {
        fetchPrescriptions();
    }, []);

    return (
        <div>

            <Row style={{ alignItems: 'baseline', justifyContent: 'space-between' }}>
                <Title level={3}>All Prescriptions </Title>
            </Row>
            <Input
                placeholder="Search by Customer or Doctor Name or Date"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                style={{ marginBottom: '20px' }}
            />
            <Row gutter={[16, 16]}> {/* This provides a gap between the cards */}
                {paginatedData.map((item, index) => (
                    <Col key={index} span={6}>
                        <Card
                            key={index}
                            style={{ boxShadow: 'rgba(0, 0, 0, 0.15) 0px 2px 8px' }}
                            actions={[
                                <EyeOutlined key="edit" onClick={() => showModal(item.id)} />
                            ]}
                        >
                            <Meta
                                title={item.customer__first_name + ' ' + item.customer__last_name.toUpperCase()}
                                description={"Consulted by Dr. " + item.doctor__first_name + " on " + item.created_date}
                            />
                        </Card>
                    </Col>
                ))}
            </Row>
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
                <NewPrescriptionForm prescriptionData={selectedPrescriptionData} isReadOnly={isReadOnly} setIsReadOnly={setIsReadOnly} setIsPrescriptionModalVisible={setIsModalVisible}/>
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

export default PrescriptionListing;