const XLSX = require('xlsx');

const excelProcessor = {
    readExcelFile: (filePath) => {
        const workbook = XLSX.readFile(filePath);
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const data = XLSX.utils.sheet_to_json(worksheet);
        return data;
    },

    validateData: (data) => {
        const errors = [];
        data.forEach((row, index) => {
            if (!row.shop_name || !row.address || !row.phone || !row.latitude || !row.longitude || !row.district) {
                errors.push(`Row ${index + 1}: Missing required fields.`);
            }
            if (isNaN(row.latitude) || isNaN(row.longitude)) {
                errors.push(`Row ${index + 1}: Latitude and Longitude must be numbers.`);
            }
            if (row.phone && !/^\d+$/.test(row.phone)) {
                errors.push(`Row ${index + 1}: Phone number must be numeric.`);
            }
        });
        return errors;
    },

    processExcelData: (filePath) => {
        const data = this.readExcelFile(filePath);
        const validationErrors = this.validateData(data);
        if (validationErrors.length > 0) {
            throw new Error(validationErrors.join('\n'));
        }
        return data;
    }
};

module.exports = excelProcessor;