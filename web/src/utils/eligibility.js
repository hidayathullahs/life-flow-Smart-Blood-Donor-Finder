import { differenceInDays } from 'date-fns';

export const calculateDaysSinceDonation = (lastDonationDate) => {
    if (!lastDonationDate) return null;

    // Handle Firestore Timestamp or Date object or String
    let date;
    if (lastDonationDate.toDate) {
        date = lastDonationDate.toDate();
    } else if (lastDonationDate instanceof Date) {
        date = lastDonationDate;
    } else {
        date = new Date(lastDonationDate);
    }

    return differenceInDays(new Date(), date);
};

export const isEligibleToDonate = (lastDonationDate) => {
    if (!lastDonationDate) return true; // Never donated = Eligible
    const days = calculateDaysSinceDonation(lastDonationDate);
    return days >= 90;
};

export const getEligibilityStatus = (lastDonationDate) => {
    if (!lastDonationDate) {
        return { isEligible: true, message: "Eligible (First Time)" };
    }

    const days = calculateDaysSinceDonation(lastDonationDate);
    if (days >= 90) {
        return { isEligible: true, message: "Eligible" };
    } else {
        return { isEligible: false, message: `Wait ${90 - days} more days` };
    }
};
