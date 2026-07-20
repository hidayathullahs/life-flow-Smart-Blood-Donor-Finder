export const validateIndianPhone = (phone) => {
    // Regex for Indian mobile numbers (allows +91, 0, or just 10 digits)
    const regex = /^(?:\+91|0)?[6-9]\d{9}$/;
    return regex.test(phone);
};

export const validateDonorForm = (data) => {
    const errors = {};

    if (!data.name || data.name.length < 2) {
        errors.name = "Name must be at least 2 characters.";
    }

    if (!data.bloodGroup) {
        errors.bloodGroup = "Blood group is required.";
    }

    if (!data.city) {
        errors.city = "City is required.";
    }

    if (!data.phone) {
        errors.phone = "Phone number is required.";
    } else if (!validateIndianPhone(data.phone)) {
        errors.phone = "Invalid Indian phone number.";
    }

    // WhatsApp defaults to phone if empty, but if provided check validity
    if (data.whatsapp && !validateIndianPhone(data.whatsapp)) {
        errors.whatsapp = "Invalid WhatsApp number.";
    }

    return {
        isValid: Object.keys(errors).length === 0,
        errors
    };
};
