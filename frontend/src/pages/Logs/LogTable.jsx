import React, { useEffect, useState } from 'react';
import { Space, Table, Tag } from 'antd';
import { appUrl } from '../../constants';
import moment from 'moment';
const columns = [
    {
        title: 'Time',
        dataIndex: 'timestamp',
        key: 'timestamp',
        render: (date) => <a>{moment(date).format('LLLL')}</a>,
    },
    {
        title: 'Action',
        key: 'action',
        dataIndex: 'action',
        render: (tag) => {
            let color = tag === 'CREATED' ? 'green' : 'geekblue';
            if (tag === 'DELETED' || tag === 'ERROR') {
                color = 'red';
            }
            return (
                <Tag color={color} key={tag}>
                    {tag?.toUpperCase()}
                </Tag>
            );
        },

    },
    {
        title: 'Description',
        dataIndex: 'description',
        key: 'description',
    },
    {
        title: 'Activity',
        dataIndex: 'user__first_name',
        key: 'user__first_name',
    },

];

const LogTable = () => {
    const [data, setData] = useState([]);

    const fetchLogs = () => {
        fetch(appUrl + 'log/get_all_logs')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                console.log(data);
                setData(data.values);
            })
            .catch(error => {
                console.error('Failed to fetch:', error);
            });
    };

    useEffect(() => {
        fetchLogs();
    }, []);

    return (
        <Table columns={columns} dataSource={data} pagination={{ pageSize: 5 }} />
    );
}
export default LogTable;