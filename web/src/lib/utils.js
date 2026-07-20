import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
    return twMerge(clsx(inputs))
}

export function differenceInDays(date1, date2) {
    const oneDay = 24 * 60 * 60 * 1000; // hours * minutes * seconds * milliseconds
    const firstDate = new Date(date1);
    const secondDate = new Date(date2);

    // Return absolute difference
    return Math.round(Math.abs((firstDate - secondDate) / oneDay));
}

export function isEligible(lastDonationDate) {
    if (!lastDonationDate) return true;
    const days = differenceInDays(new Date(), lastDonationDate);
    return days >= 90;
}
