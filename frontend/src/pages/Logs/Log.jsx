import React, { useState } from 'react';
import { Typography } from 'antd';
import LogTable from './LogTable';

const { Title } = Typography;

function Log() {
    return (
        <div>

            <Title level={3}>Log</Title>

            <LogTable />

        </div>
    );
}

export default Log;