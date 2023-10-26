import React, { useState, useEffect } from 'react';
import { Typography, Row, Col, Card, Pagination, Input } from 'antd';
import { EditOutlined } from '@ant-design/icons';

const { Title } = Typography;
const { Meta } = Card;

const customerList = [
    {
        "title": "Mr.",
        "first_name": "John",
        "last_name": "Doe",
        "mobile_1": "123-456-7890",
        "city": "Springfield",
        "email": "john.doe@example.com",
        "nic": "A2131233423"
    },
    {
        "title": "Ms.",
        "first_name": "Jane",
        "last_name": "Smith",
        "mobile_1": "555-789-1234",
        "city": "Shelbyville",
        "email": "jane.smith@example.com",
        "nic": "A2131332423"
    },
    {
        "title": "Dr.",
        "first_name": "Alan",
        "last_name": "Walker",
        "mobile_1": "777-888-9999",
        "city": "Capital City",
        "email": "alan.walker@example.com",
        "nic": "A2132332423"
    },
    {
        "title": "Mrs.",
        "first_name": "Emily",
        "last_name": "White",
        "mobile_1": "444-555-6666",
        "city": "West Springfield",
        "email": "emily.white@example.com",
        "nic": "A2131232423"
    },
    {
        "title": "Mr.",
        "first_name": "Michael",
        "last_name": "Brown",
        "mobile_1": "222-333-4444",
        "city": "East Springfield",
        "email": "michael.brown@example.com",
        "nic": "A213123323"
    },
    {
        "title": "Mr.",
        "first_name": "Michael",
        "last_name": "Brown",
        "mobile_1": "222-333-4444",
        "city": "East Springfield",
        "email": "michael.brown@example.com",
        "nic": "A213423"
    },
    {
        "title": "Mr.",
        "first_name": "Michael",
        "last_name": "Brown",
        "mobile_1": "222-333-4444",
        "city": "East Springfield",
        "email": "michael.brown@example.com",
        "nic": "A22332423"
    },
    {
        "title": "Mr.",
        "first_name": "Michael",
        "last_name": "Brown",
        "mobile_1": "222-333-4444",
        "city": "East Springfield",
        "email": "michael.brown@example.com",
        "nic": "A213123"
    }
];

function CustomerListing() {
    const itemsPerPage = 24;
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState("");

    const filteredData = customerList.filter(item => {
        const firstName = item.first_name || "";
        const lastName = item.last_name || "";
        const mobilePhone = item.mobile_1 || "";
        const nic = item.nic || "";

        return (
            firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            mobilePhone.toLowerCase().includes(searchTerm.toLowerCase()) ||
            nic.toLowerCase().includes(searchTerm.toLowerCase())
        );
    });

    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedData = filteredData.slice(startIndex, startIndex + itemsPerPage);

    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm]);

    return (
        <div>

            <Title level={3}>Customer Listing</Title>
            <Input
                placeholder="Search by First Name, Last Name, or Mobile"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                style={{ marginBottom: '20px' }}
            />
            <Row gutter={[16, 16]}> {/* This provides a gap between the cards */}
                {paginatedData.map((item, index) => (
                    <Col key={index} span={4}>
                        <Card
                            key={index}
                            style={{ width: 200 }}
                            actions={[
                                <EditOutlined key="edit" />,
                            ]}
                        >
                            <Meta
                                title={item.first_name + ' ' + item.last_name}
                                description="This is the description"
                            />
                        </Card>
                    </Col>
                ))}
            </Row>
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