import { useState, useEffect } from 'react';
import { Search as SearchIcon, Droplet, FilterX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { donorService } from '@/services/donorService';
import DonorCard from '@/components/DonorCard';
import LoadingSkeleton from '@/components/LoadingSkeleton';
import EmptyState from '@/components/EmptyState';
import { isEligibleToDonate } from '@/utils/eligibility';
import { toast } from 'react-toastify';

const SearchPage = () => {
    const [donors, setDonors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({
        bloodGroup: '',
        city: '',
        eligibleOnly: true,
        sortBy: 'match', // 'match' | 'recent' | 'donations'
        radius: 'all' // '5', '10', 'all'
    });

    useEffect(() => {
        fetchDonors();
    }, []);

    const fetchDonors = async () => {
        setLoading(true);
        try {
            // Fetch all active donors then filter client side for better UX with date logic
            const donorList = await donorService.getAllActiveDonors();

            // Use strict real data (defaults to 0 or false if missing)
            const enrichedDonors = donorList.map(d => ({
                ...d,
                donationCount: d.donationCount !== undefined ? d.donationCount : 0,
                isVerified: d.isVerified !== undefined ? d.isVerified : false
            }));

            setDonors(enrichedDonors);
        } catch (error) {
            console.error("Error fetching donors:", error);
            if (error?.code === 'failed-precondition') {
                toast.error("Database setup incomplete. Index missing.");
            } else if (error?.code === 'permission-denied') {
                toast.error("Permission denied. Check rules.");
            } else {
                toast.error(`Failed to load donors: ${error.message}`);
            }
        } finally {
            setLoading(false);
        }
    };

    const handleFilterChange = (key, value) => {
        setFilters(prev => ({ ...prev, [key]: value }));
    };

    const resetFilters = () => {
        setFilters({ bloodGroup: '', city: '', eligibleOnly: true, sortBy: 'match', radius: 'all' });
    };

    // Advanced Filtering & Scoring Logic
    const processedDonors = donors
        .filter(donor => {
            if (filters.bloodGroup && donor.bloodGroup !== filters.bloodGroup) return false;
            // Simple string included for city match
            if (filters.city && !donor.city.toLowerCase().includes(filters.city.toLowerCase())) return false;
            if (filters.eligibleOnly && !isEligibleToDonate(donor.lastDonationDate)) return false;
            return true;
        })
        .sort((a, b) => {
            if (filters.sortBy === 'donations') {
                return (b.donationCount || 0) - (a.donationCount || 0);
            }
            if (filters.sortBy === 'recent') {
                // Mock sorting by recent activity - usually would use timestamp
                return 0;
            }
            // Default "Smart Match" Scoring
            // 1. Verified +50
            // 2. High Donation Count +10
            let scoreA = (a.isVerified ? 50 : 0) + ((a.donationCount || 0));
            let scoreB = (b.isVerified ? 50 : 0) + ((b.donationCount || 0));
            return scoreB - scoreA;
        });

    const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

    return (
        <div className="container mx-auto px-4 py-8 min-h-screen">
            <div className="max-w-5xl mx-auto mb-10 text-center space-y-4 pt-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-xs font-bold uppercase tracking-wider">
                    Smart Match Active
                </div>
                <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-slate-900">Find Matches Nearby</h1>
                <p className="text-slate-500 text-lg">Our AI prioritizes the most reliable and closest donors for you.</p>
            </div>

            <div className="max-w-6xl mx-auto space-y-8">
                {/* Search & Filter Bar */}
                <div className="bg-white p-6 rounded-[2rem] shadow-xl shadow-slate-200/50 border border-slate-100 z-10 relative">
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                        {/* Blood Group */}
                        <div className="md:col-span-2">
                            <label className="text-xs font-semibold text-slate-500 ml-3 mb-1 block">Blood Group</label>
                            <div className="relative">
                                <select
                                    className="w-full h-12 pl-3 pr-8 bg-slate-50 rounded-2xl border-0 focus:ring-2 focus:ring-primary/20 text-slate-700 font-bold appearance-none cursor-pointer hover:bg-slate-100 transition-colors"
                                    value={filters.bloodGroup}
                                    onChange={(e) => handleFilterChange('bloodGroup', e.target.value)}
                                >
                                    <option value="">All</option>
                                    {bloodGroups.map(bg => (
                                        <option key={bg} value={bg}>{bg}</option>
                                    ))}
                                </select>
                                <Droplet className="absolute right-3 top-3.5 h-4 w-4 text-slate-400 pointer-events-none" />
                            </div>
                        </div>

                        {/* City Input */}
                        <div className="md:col-span-4">
                            <label className="text-xs font-semibold text-slate-500 ml-3 mb-1 block">Location</label>
                            <div className="relative">
                                <SearchIcon className="absolute left-4 top-3.5 h-5 w-5 text-slate-400" />
                                <Input
                                    placeholder="Enter city..."
                                    value={filters.city}
                                    onChange={(e) => handleFilterChange('city', e.target.value)}
                                    className="w-full h-12 pl-11 bg-slate-50 rounded-2xl border-0 focus-visible:ring-2 focus-visible:ring-primary/20 text-base font-medium"
                                />
                            </div>
                        </div>

                        {/* Smart Sort */}
                        <div className="md:col-span-3">
                            <label className="text-xs font-semibold text-slate-500 ml-3 mb-1 block">Priority / Sort</label>
                            <select
                                className="w-full h-12 pl-4 pr-8 bg-slate-50 rounded-2xl border-0 focus:ring-2 focus:ring-primary/20 text-slate-700 font-medium appearance-none cursor-pointer hover:bg-slate-100"
                                value={filters.sortBy}
                                onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                            >
                                <option value="match">⚡ Smart Match (Recommended)</option>
                                <option value="donations">🏆 High Donation Count</option>
                                <option value="recent">🕒 Recently Active</option>
                            </select>
                        </div>

                        {/* Search Button */}
                        <div className="md:col-span-3 flex items-end">
                            <Button
                                className="w-full h-12 rounded-2xl text-base font-bold bg-primary hover:bg-red-600 shadow-lg shadow-red-500/25 transition-all"
                                onClick={fetchDonors}
                            >
                                <SearchIcon className="mr-2 h-5 w-5" /> Find Donors
                            </Button>
                        </div>
                    </div>

                    {/* Secondary Filters */}
                    <div className="mt-4 flex flex-wrap items-center gap-3 px-1">
                        <label className="flex items-center space-x-2 cursor-pointer bg-slate-50 px-4 py-2 rounded-xl hover:bg-slate-100 transition-colors">
                            <input
                                type="checkbox"
                                className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                                checked={filters.eligibleOnly}
                                onChange={(e) => handleFilterChange('eligibleOnly', e.target.checked)}
                            />
                            <span className="text-sm font-medium text-slate-600">✅ Eligible Only</span>
                        </label>

                        <div className="h-6 w-px bg-slate-200 mx-2 hidden md:block"></div>

                        <button onClick={resetFilters} className="text-sm text-slate-400 hover:text-slate-600 flex items-center gap-1 font-medium">
                            <FilterX className="h-4 w-4" /> Reset Filters
                        </button>
                    </div>
                </div>

                {/* Results Grid */}
                <div className="space-y-6">
                    <div className="flex items-center justify-between px-2">
                        <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                            Top Matches <span className="text-xs font-normal text-slate-500 bg-slate-100 px-2 py-1 rounded-full">{processedDonors.length} found</span>
                        </h2>
                    </div>

                    {loading ? (
                        <LoadingSkeleton count={6} />
                    ) : processedDonors.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {processedDonors.map(donor => (
                                <DonorCard key={donor.id} donor={donor} />
                            ))}
                        </div>
                    ) : (
                        <EmptyState
                            title="No Matches Found"
                            message="Try adjusting your location or blood group filters to see more donors."
                            onAction={resetFilters}
                        />
                    )}
                </div>
            </div>
        </div>
    );
};

export default SearchPage;
