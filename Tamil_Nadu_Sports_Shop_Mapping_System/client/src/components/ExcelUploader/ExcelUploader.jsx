import React, { useState } from 'react';
import * as XLSX from 'xlsx';

const ExcelUploader = ({ onUpload }) => {
    const [file, setFile] = useState(null);
    const [error, setError] = useState('');

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile && selectedFile.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
            setFile(selectedFile);
            setError('');
        } else {
            setError('Please upload a valid Excel file.');
        }
    };

    const handleUpload = () => {
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                const data = new Uint8Array(event.target.result);
                const workbook = XLSX.read(data, { type: 'array' });
                const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
                const jsonData = XLSX.utils.sheet_to_json(firstSheet);
                onUpload(jsonData);
                setFile(null);
            };
            reader.readAsArrayBuffer(file);
        }
    };

    return (
        <div className="p-4 border border-gray-300 rounded-lg">
            <h2 className="text-lg font-semibold mb-2">Upload Excel File</h2>
            <input
                type="file"
                accept=".xlsx"
                onChange={handleFileChange}
                className="mb-2"
            />
            {error && <p className="text-red-500">{error}</p>}
            <button
                onClick={handleUpload}
                className="bg-blue-500 text-white px-4 py-2 rounded"
                disabled={!file}
            >
                Upload
            </button>
        </div>
    );
};

export default ExcelUploader;