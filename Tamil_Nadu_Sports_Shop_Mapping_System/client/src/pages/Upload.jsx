import React, { useState } from 'react';
import ExcelUploader from '../components/ExcelUploader/ExcelUploader';
import { toast } from 'react-toastify';

const Upload = () => {
    const [loading, setLoading] = useState(false);

    const handleUploadSuccess = () => {
        toast.success('Excel file uploaded successfully!');
        setLoading(false);
    };

    const handleUploadError = (error) => {
        toast.error(`Error uploading file: ${error}`);
        setLoading(false);
    };

    return (
        <div className="flex flex-col items-center justify-center h-full p-4">
            <h1 className="text-2xl font-bold mb-4">Upload Sports Shops Data</h1>
            <p className="mb-4">Upload an Excel file containing sports shop information to add them to the directory.</p>
            <ExcelUploader 
                onUploadSuccess={handleUploadSuccess} 
                onUploadError={handleUploadError} 
                loading={loading} 
                setLoading={setLoading} 
            />
        </div>
    );
};

export default Upload;