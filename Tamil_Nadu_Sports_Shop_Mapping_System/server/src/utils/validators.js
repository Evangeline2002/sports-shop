const validateShopData = (data) => {
    const { shop_name, address, phone, latitude, longitude } = data;
    const errors = {};

    if (!shop_name || shop_name.trim() === '') {
        errors.shop_name = 'Shop name is required';
    }

    if (!address || address.trim() === '') {
        errors.address = 'Address is required';
    }

    const phoneRegex = /^[0-9]{10}$/;
    if (!phone || !phoneRegex.test(phone)) {
        errors.phone = 'Phone number must be a valid 10-digit number';
    }

    if (latitude === undefined || latitude === null || isNaN(latitude)) {
        errors.latitude = 'Latitude is required and must be a number';
    }

    if (longitude === undefined || longitude === null || isNaN(longitude)) {
        errors.longitude = 'Longitude is required and must be a number';
    }

    return {
        isValid: Object.keys(errors).length === 0,
        errors,
    };
};

const validateDistrict = (district) => {
    if (!district || district.trim() === '') {
        return { isValid: false, error: 'District name is required' };
    }
    return { isValid: true };
};

module.exports = {
    validateShopData,
    validateDistrict,
};