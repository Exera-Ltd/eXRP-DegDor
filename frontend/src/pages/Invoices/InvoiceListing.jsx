import { EyeOutlined, PlusCircleOutlined } from '@ant-design/icons';
import { Card, Col, Input, Modal, Pagination, Row, Typography } from 'antd';
import React, { useEffect, useState } from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import InvoiceForm from './InvoiceForm';
import { appUrl } from '../../constants';

const { Title } = Typography;
const { Meta } = Card;
const itemsPerPage = 8;

function InvoiceListing() {
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState("");
    const [invoiceList, setInvoiceList] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isReadOnly, setIsReadOnly] = useState(false);

    const filteredData = invoiceList.filter(item => {
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
    const [selectedInvoiceData, setSelectedInvoiceData] = useState({});

    const showModal = (customerId) => {
        console.log(customerId);
        if (customerId != null) {
            fetchInvoice(customerId);
        }  
    };

    const handleCancel = () => {
        console.log('handleCancel')
        setIsModalVisible(false);
        setSelectedInvoiceData({});
    };

    const handleOk = () => {
        console.log('handleOk')
        setIsModalVisible(false);
    };

    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm]);

    const fetchInvoice = (id) => {
        setIsLoading(true);
        fetch(appUrl + `dashboard/get_invoice/${id}/`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                console.log(data);
                setSelectedInvoiceData(data.invoice);
                setIsReadOnly(true);
                setIsLoading(false);
                setIsModalVisible(true);
            })
            .catch(error => {
                console.error('Failed to fetch:', error);
                setIsLoading(false);
            });
    };

    const fetchInvoices = () => {
        setIsLoading(true);
        fetch(appUrl + 'dashboard/get_all_invoices')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                setInvoiceList(data.values);
                setIsLoading(false);
            })
            .catch(error => {
                console.error('Failed to fetch:', error);
                setIsLoading(false);
            });
    };

    useEffect(() => {
        fetchInvoices();
    }, []);

    const closeModal = () => {
        setIsModalVisible(false);
        setSelectedInvoiceData({});
    };


    return (
        <div>

            <Row style={{ alignItems: 'baseline', justifyContent: 'space-between' }}>
                <Title level={3}>Invoice Listing </Title>
            </Row>
            <Input
                placeholder="Search by Invoice ID"
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
                                        title={item.invoice_number}
                                        description={item.customer}
                                    />
                                    <div>
                                        <span>{item.customer__first_name} {item.customer__last_name}</span><br />
                                        <span>Date: {item.date}</span>
                                        <p>Amount: {item.total_amount}</p>
                                    </div>
                                </Card>
                            </Col>
                        </CSSTransition>
                    ))}
                </TransitionGroup>
            </Row>

            <Modal
                title="View Invoice"
                open={isModalVisible}
                onOk={handleOk}
                onCancel={handleCancel}
                width={1000}
                footer={null}
            >
                <InvoiceForm invoiceData={selectedInvoiceData} onInvoiceAdded={fetchInvoices} closeModal={closeModal} isReadOnly={isReadOnly} setIsReadOnly={setIsReadOnly}/>
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

export default InvoiceListing;