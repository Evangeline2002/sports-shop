const validateShopName = (name) => {
    if (!name || name.trim() === '') {
        return 'Shop name is required.';
    }
    if (name.length < 3) {
        return 'Shop name must be at least 3 characters long.';
    }
    return null;
};

const validateAddress = (address) => {
    if (!address || address.trim() === '') {
        return 'Address is required.';
    }
    return null;
};

const validatePhone = (phone) => {
    const phoneRegex = /^[0-9]{10}$/;
    if (!phone || phone.trim() === '') {
        return 'Phone number is required.';
    }
    if (!phoneRegex.test(phone)) {
        return 'Phone number must be 10 digits.';
    }
    return null;
};

const validateLatitude = (latitude) => {
    if (latitude === undefined || latitude === null) {
        return 'Latitude is required.';
    }
    if (latitude < -90 || latitude > 90) {
        return 'Latitude must be between -90 and 90.';
    }
    return null;
};

const validateLongitude = (longitude) => {
    if (longitude === undefined || longitude === null) {
        return 'Longitude is required.';
    }
    if (longitude < -180 || longitude > 180) {
        return 'Longitude must be between -180 and 180.';
    }
    return null;
};

export {
    validateShopName,
    validateAddress,
    validatePhone,
    validateLatitude,
    validateLongitude,
};