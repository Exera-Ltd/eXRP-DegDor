import React, { useState } from 'react';
import { Select } from 'antd';
import axios from 'axios';

const { Option } = Select;

const DoctorSelect = () => {
    const [options, setOptions] = useState([]);

    const handleSearch = value => {
        if (value) {
            // Replace with your actual AJAX call
            axios.get(`your-api-endpoint/doctors?name=${value}`)
                .then((response) => {
                    // Map your response data to Option components
                    const newOptions = response.data.map(customer => (
                        <Option key={customer.id} value={customer.name}>
                            {customer.name}
                        </Option>
                    ));
                    setOptions(newOptions);
                })
                .catch((error) => {
                    // Handle error
                    console.error('Error fetching the doctors:', error);
                });
        } else {
            setOptions([]);
        }
    };

    return (
        <Select
            showSearch
            placeholder="Select a doctor"
            defaultActiveFirstOption={false}
            showArrow={false}
            filterOption={false}
            onSearch={handleSearch}
            notFoundContent={null}
        >
            {options}
        </Select>
    );
};

export default DoctorSelect;