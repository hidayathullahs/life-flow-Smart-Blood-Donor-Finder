import { useState, useEffect } from 'react';
import {
    Users,
    Activity,
    AlertTriangle,
    TrendingUp,
    Droplet,
    MapPin,
    ShieldCheck,
    RefreshCw
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import {
    getDashboardStats,
    getBloodGroupDistribution,
    getCityDistribution,
    getEligibilityBreakdown
} from '@/services/analyticsService';

const StatCard = ({ title, value, icon: Icon, trend, trendValue, color = 'primary' }) => {
    const colorClasses = {
        primary: 'text-primary bg-primary/10',
        green: 'text-green-600 bg-green-100 dark:bg-green-900/30',
        amber: 'text-amber-600 bg-amber-100 dark:bg-amber-900/30',
        blue: 'text-blue-600 bg-blue-100 dark:bg-blue-900/30',
        purple: 'text-purple-600 bg-purple-100 dark:bg-purple-900/30'
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
        >
            <Card className="dark:bg-slate-800/50 dark:border-slate-700">
                <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-slate-500 dark:text-slate-400">{title}</p>
                            <h3 className="text-3xl font-bold mt-1 text-slate-900 dark:text-white">
                                {value?.toLocaleString() || '0'}
                            </h3>
                            {trend && (
                                <p className={`text-sm mt-1 flex items-center gap-1 ${trend === 'up' ? 'text-green-600' : 'text-red-500'}`}>
                                    <TrendingUp className={`h-4 w-4 ${trend === 'down' ? 'rotate-180' : ''}`} />
                                    {trendValue}
                                </p>
                            )}
                        </div>
                        <div className={`p-4 rounded-xl ${colorClasses[color]}`}>
                            <Icon className="h-6 w-6" />
                        </div>
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    );
};

const BloodGroupChart = ({ data }) => {
    const maxCount = Math.max(...data.map(d => d.count), 1);

    return (
        <Card className="dark:bg-slate-800/50 dark:border-slate-700">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Droplet className="h-5 w-5 text-primary" />
                    Blood Group Distribution
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {data.map((item, index) => (
                        <motion.div
                            key={item.bloodGroup}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className="flex items-center gap-4"
                        >
                            <div className="w-12 text-center">
                                <span className="inline-flex items-center justify-center h-8 px-2 rounded-full bg-primary/10 text-primary font-bold text-sm">
                                    {item.bloodGroup}
                                </span>
                            </div>
                            <div className="flex-1">
                                <div className="h-6 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${(item.count / maxCount) * 100}%` }}
                                        transition={{ duration: 0.5, delay: index * 0.05 }}
                                        className="h-full bg-gradient-to-r from-primary to-red-400 rounded-full"
                                    />
                                </div>
                            </div>
                            <div className="w-20 text-right">
                                <span className="font-semibold text-slate-900 dark:text-white">{item.count}</span>
                                <span className="text-slate-400 text-sm ml-1">({item.percentage}%)</span>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
};

const CityDistribution = ({ data }) => {
    return (
        <Card className="dark:bg-slate-800/50 dark:border-slate-700">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-blue-500" />
                    Top Cities
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-2 gap-3">
                    {data.slice(0, 10).map((item, index) => (
                        <motion.div
                            key={item.city}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.05 }}
                            className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-lg"
                        >
                            <span className="text-sm text-slate-700 dark:text-slate-300 truncate">{item.city}</span>
                            <span className="text-sm font-semibold text-primary ml-2">{item.count}</span>
                        </motion.div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
};

const EligibilityPieChart = ({ data }) => {
    const segments = [
        { label: 'Eligible', count: data.eligible, color: 'rgb(34, 197, 94)' },
        { label: 'First-Time', count: data.firstTime, color: 'rgb(59, 130, 246)' },
        { label: 'Cooling', count: data.cooling, color: 'rgb(251, 191, 36)' },
        { label: 'Inactive', count: data.inactive, color: 'rgb(156, 163, 175)' }
    ];

    return (
        <Card className="dark:bg-slate-800/50 dark:border-slate-700">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5 text-green-500" />
                    Donor Eligibility
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="flex items-center justify-center mb-6">
                    <div className="relative w-40 h-40">
                        <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                            {segments.reduce((acc, segment) => {
                                const percentage = data.total > 0 ? (segment.count / data.total) * 100 : 0;
                                const offset = acc.offset;
                                acc.elements.push(
                                    <circle
                                        key={segment.label}
                                        cx="50"
                                        cy="50"
                                        r="40"
                                        fill="none"
                                        stroke={segment.color}
                                        strokeWidth="20"
                                        strokeDasharray={`${percentage * 2.51} 251`}
                                        strokeDashoffset={-offset * 2.51}
                                    />
                                );
                                acc.offset += percentage;
                                return acc;
                            }, { elements: [], offset: 0 }).elements}
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="text-center">
                                <div className="text-2xl font-bold text-slate-900 dark:text-white">{data.eligiblePercentage}%</div>
                                <div className="text-xs text-slate-500">Eligible</div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                    {segments.map(segment => (
                        <div key={segment.label} className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: segment.color }} />
                            <span className="text-sm text-slate-600 dark:text-slate-400">{segment.label}</span>
                            <span className="text-sm font-medium text-slate-900 dark:text-white ml-auto">{segment.count}</span>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
};

const AnalyticsDashboard = () => {
    const [stats, setStats] = useState(null);
    const [bloodGroups, setBloodGroups] = useState([]);
    const [cities, setCities] = useState([]);
    const [eligibility, setEligibility] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchData = async () => {
        setLoading(true);
        setError(null);
        try {
            const [statsData, bloodGroupData, cityData, eligibilityData] = await Promise.all([
                getDashboardStats(),
                getBloodGroupDistribution(),
                getCityDistribution(),
                getEligibilityBreakdown()
            ]);

            setStats(statsData);
            setBloodGroups(bloodGroupData);
            setCities(cityData);
            setEligibility(eligibilityData);
        } catch (err) {
            console.error('Error fetching analytics:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <RefreshCw className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center py-12">
                <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
                <p className="text-red-600 dark:text-red-400">Error loading analytics: {error}</p>
                <Button onClick={fetchData} className="mt-4">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Retry
                </Button>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Analytics Dashboard</h1>
                <Button variant="outline" onClick={fetchData} className="gap-2">
                    <RefreshCw className="h-4 w-4" />
                    Refresh
                </Button>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard
                    title="Total Donors"
                    value={stats?.totalDonors}
                    icon={Users}
                    color="primary"
                />
                <StatCard
                    title="Active Donors"
                    value={stats?.activeDonors}
                    icon={Activity}
                    color="green"
                />
                <StatCard
                    title="Verified Donors"
                    value={stats?.verifiedDonors}
                    icon={ShieldCheck}
                    color="blue"
                />
                <StatCard
                    title="Active Emergencies"
                    value={stats?.activeEmergencies}
                    icon={AlertTriangle}
                    color="amber"
                />
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {bloodGroups.length > 0 && <BloodGroupChart data={bloodGroups} />}
                {eligibility && <EligibilityPieChart data={eligibility} />}
            </div>

            {/* City Distribution */}
            {cities.length > 0 && <CityDistribution data={cities} />}
        </div>
    );
};

export default AnalyticsDashboard;
