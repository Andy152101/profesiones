import React from 'react';

const PowerBI = ({ embedUrl }) => {
    return (
        <div style={{ width: '100%', height: '500px' }}>
            <iframe
                title="Power BI Report"
                width="100%"
                height="100%"
                src={embedUrl}
                style={{ border: 'none' }} // Usamos CSS para eliminar el borde
                allowFullScreen={true}
            ></iframe>
        </div>
    );
};

export default PowerBI;