import React, { useState } from 'react';
import { Typography } from 'antd';
import InvoiceForm from './InvoiceForm';
import InvoiceToPDF from '../../components/PDFGenerator/InvoiceToPDF';

const { Title } = Typography;

function NewInvoice() {
    return (
        <div>

            <Title level={3}>Create New Invoice</Title>

            <InvoiceForm />
        </div>
    );
}

export default NewInvoice;