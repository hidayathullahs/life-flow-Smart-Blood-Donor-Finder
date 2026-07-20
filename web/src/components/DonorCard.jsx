import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Phone, MessageCircle, Calendar, MapPin, CheckCircle2 } from 'lucide-react';
import { isEligibleToDonate, calculateDaysSinceDonation } from '@/utils/eligibility';
import { motion } from 'framer-motion';

const DonorCard = ({ donor }) => {
    const eligible = isEligibleToDonate(donor.lastDonationDate);
    const daysSince = calculateDaysSinceDonation(donor.lastDonationDate);

    // Smart Features Logic (Assumes donor object has these fields or they are mocked)
    const isElite = (donor.donationCount || 0) > 5;
    const isVerified = donor.isVerified || false;
    const isNew = !donor.lastDonationDate;

    const badgeColor = {
        'A+': 'bg-red-500 shadow-red-500/50',
        'A-': 'bg-rose-600 shadow-rose-600/50',
        'B+': 'bg-red-500 shadow-red-500/50',
        'B-': 'bg-rose-600 shadow-rose-600/50',
        'AB+': 'bg-red-600 shadow-red-600/50',
        'AB-': 'bg-rose-700 shadow-rose-700/50',
        'O+': 'bg-red-500 shadow-red-500/50',
        'O-': 'bg-rose-600 shadow-rose-600/50',
    };

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
        >
            <Card className="relative overflow-hidden hover:shadow-2xl transition-all duration-300 border-0 shadow-lg shadow-slate-200/50 rounded-[1.5rem] group bg-white">
                {/* Priority Ribbon */}
                {isElite && (
                    <div className="absolute top-4 right-0 bg-gradient-to-l from-amber-400 to-yellow-500 text-white text-[10px] font-bold px-3 py-1 rounded-l-full shadow-md z-10 animate-fade-in-left">
                        ⭐ Elite Donor
                    </div>
                )}

                <CardHeader className="flex flex-row items-start justify-between pb-4 bg-gradient-to-b from-slate-50/80 to-transparent">
                    <div className="flex gap-4">
                        <div className={`h-14 w-14 rounded-2xl flex items-center justify-center text-white text-xl font-bold shadow-lg ${badgeColor[donor.bloodGroup] || 'bg-gray-500'} transform group-hover:scale-110 transition-transform duration-300`}>
                            {donor.bloodGroup}
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <h3 className="font-bold text-lg text-slate-900 leading-tight">{donor.name}</h3>
                                {isVerified && <CheckCircle2 className="h-4 w-4 text-blue-500 fill-blue-50" />}
                            </div>
                            <div className="flex items-center text-sm text-slate-500 mt-1">
                                <MapPin className="mr-1 h-3.5 w-3.5 text-primary" />
                                <span className="font-medium">{donor.city || 'Unknown Location'}</span>
                            </div>
                        </div>
                    </div>
                </CardHeader>

                <CardContent className="pt-0 pb-4">
                    <div className="grid grid-cols-2 gap-2 text-xs mb-4 p-3 bg-slate-50/50 rounded-xl border border-slate-100">
                        <div className="space-y-1">
                            <span className="text-slate-400">Availability</span>
                            <div className="font-semibold flex items-center gap-1.5">
                                {eligible ? (
                                    <>
                                        <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
                                        <span className="text-green-700">Available Now</span>
                                    </>
                                ) : (
                                    <span className="text-slate-600">Resting ({daysSince}d ago)</span>
                                )}
                            </div>
                        </div>
                        <div className="space-y-1">
                            <span className="text-slate-400">Total Donations</span>
                            <div className="font-semibold text-slate-700">
                                {donor.donationCount || 0} Lives Saved
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center justify-between gap-3 text-xs text-slate-400 px-1">
                        <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            Registered {new Date().getFullYear()}
                        </span>
                        {isNew && <span className="bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full font-medium">New</span>}
                    </div>
                </CardContent>

                <CardFooter className="grid grid-cols-2 gap-3 p-4 bg-slate-50/50">
                    <Button variant="outline" className="w-full gap-2 rounded-xl border-green-200 text-green-700 hover:bg-green-50 font-semibold h-11" asChild>
                        <a href={`https://wa.me/${donor.whatsapp?.replace('+', '') || donor.phone?.replace('+', '')}`} target="_blank" rel="noopener noreferrer">
                            <MessageCircle className="h-4.5 w-4.5" />
                            WhatsApp
                        </a>
                    </Button>
                    <Button className="w-full gap-2 rounded-xl bg-primary hover:bg-red-700 font-semibold h-11 shadow-lg shadow-red-500/20" asChild>
                        <a href={`tel:${donor.phone}`}>
                            <Phone className="h-4.5 w-4.5" /> Call Now
                        </a>
                    </Button>
                </CardFooter>
            </Card>
        </motion.div>
    );
};

export default DonorCard;
