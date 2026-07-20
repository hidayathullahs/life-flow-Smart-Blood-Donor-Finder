import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { isEligibleToDonate, calculateDaysSinceDonation } from '@/utils/eligibility';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Phone, MessageCircle, MapPin, Calendar, Clock, ArrowLeft, AlertTriangle, ShieldCheck, Timer } from 'lucide-react';
import LoadingSkeleton from '@/components/LoadingSkeleton';
import BloodCompatibilityChart from '@/components/BloodCompatibilityChart';
import ShareButton from '@/components/ShareButton';

const DonorDetails = () => {
    const { id } = useParams();
    const [donor, setDonor] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDonor = async () => {
            try {
                const docRef = doc(db, 'donors', id);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    setDonor({ id: docSnap.id, ...docSnap.data() });
                }
            } catch (error) {
                console.error("Error fetching donor:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchDonor();
    }, [id]);

    if (loading) return <div className="container mx-auto px-4 py-8"><LoadingSkeleton count={1} /></div>;

    if (!donor) return (
        <div className="container mx-auto py-20 text-center">
            <h2 className="text-2xl font-bold">Donor Not Found</h2>
            <Button asChild className="mt-4"><Link to="/search">Find other donors</Link></Button>
        </div>
    );

    const isEligible = isEligibleToDonate(donor.lastDonationDate);
    const daysSince = calculateDaysSinceDonation(donor.lastDonationDate);

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            {/* Header / Breadcrumb */}
            <div className="bg-white border-b py-4">
                <div className="container mx-auto px-4 flex items-center justify-between">
                    <Link to="/search" className="inline-flex items-center text-sm text-gray-500 hover:text-primary">
                        <ArrowLeft className="h-4 w-4 mr-1" /> Back to Search
                    </Link>
                    <ShareButton
                        title={`${donor.name} - ${donor.bloodGroup} Blood Donor`}
                        text={`Need ${donor.bloodGroup} blood? Contact this verified donor in ${donor.city} through SmartBloodLife.`}
                    />
                </div>
            </div>

            <div className="container mx-auto px-4 py-8 space-y-8">
                <Card className="max-w-2xl mx-auto overflow-hidden shadow-lg border-t-8 border-t-primary">
                    <div className="bg-gradient-to-r from-red-50 to-white p-8 pb-4">
                        <div className="flex justify-between items-start">
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900">{donor.name}</h1>
                                <div className="flex items-center text-gray-600 mt-2">
                                    <MapPin className="h-4 w-4 mr-1 text-primary" /> {donor.city}
                                </div>
                            </div>
                            <div className="flex flex-col items-center">
                                <div className="h-20 w-20 bg-primary text-white rounded-full flex items-center justify-center text-2xl font-bold shadow-md">
                                    {donor.bloodGroup}
                                </div>
                                <span className="text-xs font-semibold text-primary mt-2 uppercase tracking-wide">Group</span>
                            </div>
                        </div>
                    </div>

                    <CardContent className="p-8 pt-4">
                        {/* Eligibility Status */}
                        <div className={`mb-8 p-4 rounded-lg border ${isEligible ? 'bg-green-50 border-green-200' : 'bg-amber-50 border-amber-200'}`}>
                            <div className="flex items-start gap-3">
                                {isEligible ? (
                                    <ShieldCheck className="h-6 w-6 text-green-600 mt-0.5" />
                                ) : (
                                    <AlertTriangle className="h-6 w-6 text-amber-600 mt-0.5" />
                                )}
                                <div className="flex-1">
                                    <h3 className={`font-bold ${isEligible ? 'text-green-800' : 'text-amber-800'}`}>
                                        {isEligible ? "Medically Eligible to Donate" : "Currently Not Eligible"}
                                    </h3>
                                    <p className={`text-sm mt-1 ${isEligible ? 'text-green-700' : 'text-amber-700'}`}>
                                        {isEligible
                                            ? "This donor has not donated recently and meets the interval criteria."
                                            : `Last donated ${daysSince} days ago. Creating a standard 90-day gap is recommended for donor safety.`
                                        }
                                    </p>
                                    {/* Eligibility Countdown for Ineligible Donors */}
                                    {!isEligible && daysSince !== null && (
                                        <div className="mt-3 flex items-center gap-2 bg-white/50 rounded-lg p-3 border border-amber-200">
                                            <Timer className="h-5 w-5 text-amber-600" />
                                            <div>
                                                <span className="text-sm font-semibold text-amber-800">
                                                    Eligible in {90 - daysSince} days
                                                </span>
                                                <div className="w-32 h-2 bg-amber-200 rounded-full mt-1.5 overflow-hidden">
                                                    <div
                                                        className="h-full bg-amber-500 rounded-full transition-all duration-500"
                                                        style={{ width: `${Math.min((daysSince / 90) * 100, 100)}%` }}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Details Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                            <div className="space-y-4">
                                <div className="flex items-center text-gray-700">
                                    <Calendar className="h-5 w-5 mr-3 text-gray-400" />
                                    <div>
                                        <p className="text-xs text-gray-500 uppercase">Last Donation</p>
                                        <p className="font-medium">{donor.lastDonationDate ? donor.lastDonationDate.toDate().toLocaleDateString() : 'Never Donated'}</p>
                                    </div>
                                </div>
                                <div className="flex items-center text-gray-700">
                                    <Clock className="h-5 w-5 mr-3 text-gray-400" />
                                    <div>
                                        <p className="text-xs text-gray-500 uppercase">Registered On</p>
                                        <p className="font-medium">{donor.createdAt?.toDate().toLocaleDateString()}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex flex-col sm:flex-row gap-3">
                            <Button size="lg" className="flex-1 gap-2 text-lg h-14" asChild>
                                <a href={`tel:${donor.phone}`}>
                                    <Phone className="h-5 w-5" /> Call Now
                                </a>
                            </Button>
                            <Button size="lg" variant="outline" className="flex-1 gap-2 text-lg h-14 border-green-200 text-green-700 hover:bg-green-50" asChild>
                                <a href={`https://wa.me/${donor.whatsapp?.replace('+', '') || donor.phone?.replace('+', '')}`} target="_blank" rel="noopener noreferrer">
                                    <MessageCircle className="h-5 w-5" /> WhatsApp
                                </a>
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Blood Compatibility Chart */}
                <div className="max-w-2xl mx-auto">
                    <BloodCompatibilityChart bloodType={donor.bloodGroup} />
                </div>
            </div>
        </div>
    );
};

export default DonorDetails;

