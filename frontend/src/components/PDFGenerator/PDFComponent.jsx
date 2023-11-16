import React from 'react';

const PDFComponent = ({ data }) => {
    // Here `data` would be the object containing all the details needed for the invoice
    return (
        <div>
            <div className="header-section">
                {/* ... header content ... */}
            </div>

            <div className="body-section">
                {/* ... body content ... */}
            </div>

            <div className="footer-section">
                {/* ... footer content ... */}
            </div>
        </div>
    );
};

export default PDFComponent;
