import React, { useState } from 'react';
import { Typography, Statistic, Row, Col, Card, Divider } from 'antd';

const { Title } = Typography;

function Dashboard() {

    return (
        <div>

            <Title level={3}>Dashboard</Title>
            <Title level={5}>Client Data</Title>
            <Row gutter={16}>
            <Col span={6}>
                    <Card style={{ boxShadow: 'rgba(0, 0, 0, 0.15) 0px 2px 8px' }}>
                        <Statistic
                            title="Total Sales of the Month"
                            value={800000}
                            prefix="Rs"
                            valueStyle={{ color: '#3f8600' }}
                        />
                    </Card>
                </Col>
                <Col span={6}>
                    <Card style={{ boxShadow: 'rgba(0, 0, 0, 0.15) 0px 2px 8px' }}>
                        <Statistic
                            title="Total Customers"
                            value={28}
                            valueStyle={{ color: '#3f8600' }}
                        />
                    </Card>
                </Col>
                <Col span={6}>
                    <Card style={{ boxShadow: 'rgba(0, 0, 0, 0.15) 0px 2px 8px' }}>
                        <Statistic
                            title="Total Prescriptions"
                            value={104}
                            valueStyle={{ color: '#cf1322' }}
                        />
                    </Card>
                </Col>
            </Row>
            <Title level={5}>Inventory Data</Title>
            <Row gutter={16}>
                <Col span={6}>
                    <Card style={{ boxShadow: 'rgba(0, 0, 0, 0.15) 0px 2px 8px' }}>
                        <Statistic
                            title="Zeiss"
                            value={16}
                            valueStyle={{ color: '#3f8600' }}
                        />
                    </Card>
                </Col>
                <Col span={6}>
                    <Card style={{ boxShadow: 'rgba(0, 0, 0, 0.15) 0px 2px 8px' }}>
                        <Statistic
                            title="Lenses"
                            value={8}
                            valueStyle={{ color: '#cf1322' }}
                        />
                    </Card>
                </Col>
            </Row>
        </div>
    );
}

export default Dashboard;