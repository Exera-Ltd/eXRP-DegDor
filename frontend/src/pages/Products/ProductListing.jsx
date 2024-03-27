import { EditOutlined, PlusCircleOutlined } from '@ant-design/icons';
import { Card, Col, Input, Modal, Pagination, Row, Typography } from 'antd';
import React, { useEffect, useState } from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import NewProductForm from './NewProductForm';
import { appUrl } from '../../constants';

const { Title } = Typography;
const { Meta } = Card;
const itemsPerPage = 8;

function ProductListing() {
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState("");
    const [customerList, setProductList] = useState([]);
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
    const [selectedProductData, setSelectedProductData] = useState({});

    const showModal = (customerId) => {
        console.log(customerId);
        if (customerId != null) {
            fetchProduct(customerId);
        } else {
            setIsModalVisible(true);
        }
    };

    const handleCancel = () => {
        console.log('handleCancel')
        setIsModalVisible(false);
        setSelectedProductData({});
    };

    const handleOk = () => {
        console.log('handleOk')
        setIsModalVisible(false);
    };

    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm]);

    const fetchProduct = (id) => {
        setIsLoading(true);
        fetch(appUrl + `dashboard/get_product/${id}/`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                console.log(data);
                setSelectedProductData(data.values);
                setIsLoading(false);
                setIsModalVisible(true);
            })
            .catch(error => {
                console.error('Failed to fetch:', error);
                setIsLoading(false);
            });
    };

    const fetchProducts = () => {
        setIsLoading(true);
        fetch(appUrl + 'dashboard/get_all_products')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                setProductList(data.values);
                setIsLoading(false);
            })
            .catch(error => {
                console.error('Failed to fetch:', error);
                setIsLoading(false);
            });
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const closeModal = () => {
        setIsModalVisible(false);
        setSelectedProductData({});
    };


    return (
        <div>

            <Row style={{ alignItems: 'baseline', justifyContent: 'space-between' }}>
                <Title level={3}>Product Listing </Title>
                <PlusCircleOutlined style={{ fontSize: 20 }} onClick={() => showModal(null)} />
            </Row>
            <Input
                placeholder="Search by Product Name, Product ID or Barcode"
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
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                        <div>
                                            <img src={item.image} style={{ width: '100px', height: '100px' }} />
                                        </div>
                                        <div>
                                            <Meta
                                                title={item.item_name}
                                                description={`Rs ${item.unit_price}`}
                                            />
                                            <div>
                                                <p>Quantity: {item.quantity}</p>
                                            </div>
                                        </div>
                                    </div>
                                </Card>
                            </Col>
                        </CSSTransition>
                    ))}
                </TransitionGroup>
            </Row>

            <Modal
                title="New/ Edit Product"
                open={isModalVisible}
                onOk={handleOk}
                onCancel={handleCancel}
                width={1000}
                footer={null}
            >
                <NewProductForm productData={selectedProductData} onProductAdded={fetchProducts} closeModal={closeModal} />
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

export default ProductListing;