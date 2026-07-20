import { db } from './lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

const sampleDonors = [
    {
        name: "Ramesh Gupta",
        bloodGroup: "O+",
        phone: "+919876543210",
        city: "Mumbai",
        whatsapp: "+919876543210",
        lastDonationDate: new Date("2023-10-15"), // Eligible (> 90 days)
        active: true
    },
    {
        name: "Sita Verma",
        bloodGroup: "A+",
        phone: "+919876543211",
        city: "Delhi",
        whatsapp: "+919876543211",
        lastDonationDate: new Date("2024-01-10"), // Ineligible (< 90 days as of early 2024)
        active: true
    },
    {
        name: "John Doe",
        bloodGroup: "AB-",
        phone: "+919876543212",
        city: "Bangalore",
        whatsapp: "+919876543212",
        lastDonationDate: null, // Eligible (Never donated)
        active: true
    },
    {
        name: "Amit Patel",
        bloodGroup: "B+",
        phone: "+919876543213",
        city: "Ahmedabad",
        whatsapp: "+919876543213",
        lastDonationDate: new Date("2023-11-20"), // Eligible
        active: true
    }
];

export const seedDonors = async () => {
    try {
        const promises = sampleDonors.map(donor =>
            addDoc(collection(db, 'donors'), {
                ...donor,
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp()
            })
        );
        await Promise.all(promises);
        console.log("Seeding complete!");
        alert("Sample donors added successfully!");
    } catch (error) {
        console.error("Error seeding donors:", error);
    }
};
