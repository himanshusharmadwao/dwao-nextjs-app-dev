import React from 'react'

const StructuredData = ({ data }) => {
    if (!data) return null;

    return (
        <script
            id="structured-data"
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
        />
    );
}

export default StructuredData