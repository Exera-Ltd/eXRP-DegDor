import React, { useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
import PDFComponent from './PDFComponent'; // This is the component we defined above

const InvoiceToPDF = ({ data }) => {
    const componentRef = useRef();

    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
        documentTitle: 'Invoice',
        onAfterPrint: () => alert('PDF generated!'),
    });

    return (
        <div>
            <PDFComponent ref={componentRef} data={data} />
            <button onClick={handlePrint}>Generate PDF</button>
        </div>
    );
};

export default InvoiceToPDF;
