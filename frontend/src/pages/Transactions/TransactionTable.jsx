import React from 'react';
import { Table } from 'antd';

const TransactionTable = ({ transactionList, onTransactionClick }) => {
    const columns = [
        {
            title: 'Date',
            dataIndex: 'created_date',
            key: 'created_date',
            render: (text, record) => (
                <a onClick={() => onTransactionClick(record.transaction.id)}>{text}</a>
            ),
        },
    ];

    const data = transactionList.map(p => ({
        key: p.transaction.id,
        created_date: p.transaction.created_date,
        transaction: p.transaction,
    }));

    return <Table columns={columns} dataSource={data} />;
};

export default TransactionTable;