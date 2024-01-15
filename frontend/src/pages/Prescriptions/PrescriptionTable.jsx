import React from 'react';
import { Table } from 'antd';

const PrescriptionTable = ({ prescriptionList, onPrescriptionClick }) => {
    const columns = [
        {
            title: 'Date',
            dataIndex: 'created_date',
            key: 'created_date',
            render: (text, record) => (
                <a onClick={() => onPrescriptionClick(record.prescription.id)}>{text}</a>
            ),
        },
    ];

    const data = prescriptionList.map(p => ({
        key: p.prescription.id,
        created_date: p.prescription.created_date,
        prescription: p.prescription,
    }));

    return <Table columns={columns} dataSource={data} />;
};

export default PrescriptionTable;