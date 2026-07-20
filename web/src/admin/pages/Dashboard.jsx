import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { donorService } from '@/services/donorService';
import { authService } from '@/services/authService';
import { validateDonorForm } from '@/utils/validators';
import { isEligibleToDonate, calculateDaysSinceDonation } from '@/utils/eligibility';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'react-toastify';
import { LogOut, Plus, Trash2, Edit2, Phone, Search, X, CheckCircle, Ban, AlertCircle, ShieldCheck, Award, Users, Activity, Heart, FileSpreadsheet, AlertTriangle, Save, Home } from 'lucide-react';


const Dashboard = () => {
    const [donors, setDonors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [editingDonor, setEditingDonor] = useState(null);
    const [statusFilter, setStatusFilter] = useState('all'); // all, active, inactive

    // Form & Validation State
    const [formData, setFormData] = useState(getInitialFormState());
    const [formErrors, setFormErrors] = useState({});

    // Emergency Settings State
    const [emergency, setEmergency] = useState({
        active: false,
        message: '',
        city: '',
        contact: ''
    });

    const navigate = useNavigate();

    function getInitialFormState() {
        return {
            name: '',
            bloodGroup: '',
            phone: '',
            whatsapp: '',
            city: '',
            lastDonationDate: '',
            isAvailable: true,
            isVerified: false,
            donationCount: 0
        };
    }

    useEffect(() => {
        const unsubscribe = donorService.subscribeToAllDonors(
            (data) => {
                setDonors(data);
                setLoading(false);
            },
            (error) => {
                console.error("Error fetching donors:", error);
                toast.error("Failed to sync data.");
                setLoading(false);
            }
        );
        return () => unsubscribe();

    }, []);

    // Fetch Emergency Settings
    useEffect(() => {
        const fetchSettings = async () => {
            const settings = await donorService.getSettings('emergency');
            if (settings) setEmergency(settings);
        };
        fetchSettings();
    }, []);

    const handleLogout = async () => {
        try {
            await authService.logout();
            navigate('/admin/login');
            toast.info("Logged out successfully");
        } catch (error) {
            toast.error("Logout failed");
        }
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
        // Clear error for field on change
        if (formErrors[name]) {
            setFormErrors(prev => ({ ...prev, [name]: null }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate
        const validation = validateDonorForm(formData);
        if (!validation.isValid) {
            setFormErrors(validation.errors);
            toast.error("Please fix form errors.");
            return;
        }

        try {
            const donationDate = formData.lastDonationDate ? new Date(formData.lastDonationDate) : null;

            const payload = {
                ...formData,
                lastDonationDate: donationDate,
                whatsapp: formData.whatsapp || formData.phone
            };

            if (editingDonor) {
                await donorService.updateDonor(editingDonor.id, payload);
                toast.success("Donor updated successfully");
            } else {
                await donorService.createDonor(payload);
                toast.success("Donor added successfully");
            }
            closeForm();
        } catch (error) {
            console.error("Error saving donor:", error);
            toast.error("Failed to save donor");
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to PERMANENTLY delete this donor?")) {
            try {
                await donorService.deleteDonor(id);
                toast.success("Donor deleted");
            } catch (error) {
                toast.error("Failed to delete");
            }
        }
    };

    const toggleStatus = async (donor) => {
        try {
            await donorService.toggleStatus(donor.id, donor.isAvailable);
            toast.success(`Donor marked as ${!donor.isAvailable ? 'Active' : 'Inactive'}`);
        } catch (error) {
            toast.error("Failed to update status");
        }
    };

    const toggleVerification = async (donor) => {
        try {
            await donorService.updateDonor(donor.id, { isVerified: !donor.isVerified });
            toast.success(`Donor ${!donor.isVerified ? 'Verified' : 'Unverified'}`);
        } catch (error) {
            toast.error("Failed to update verification");
        }
    };

    const incrementDonation = async (donor) => {
        try {
            const newCount = (donor.donationCount || 0) + 1;
            const today = new Date();
            await donorService.updateDonor(donor.id, {
                donationCount: newCount,
                lastDonationDate: today
            });
            toast.success(`Donation logged! Total: ${newCount}`);
        } catch (error) {
            toast.error("Failed to log donation");
        }
    };

    const handleEmergencyUpdate = async () => {
        try {
            await donorService.updateSettings('emergency', emergency);
            toast.success("Broadcast Settings Updated!");
        } catch (error) {
            toast.error("Failed to update broadcast");
        }
    };

    const handleExport = () => {
        if (donors.length === 0) {
            toast.warn("No data to export");
            return;
        }

        const headers = ["Name", "Blood Group", "City", "Phone", "WhatsApp", "Status", "Verified", "Donation Count", "Last Donation"];
        const csvContent = [
            headers.join(","),
            ...donors.map(d => [
                `"${d.name}"`,
                d.bloodGroup,
                `"${d.city}"`,
                d.phone,
                d.whatsapp || "",
                d.active ? "Active" : "Inactive",
                d.isVerified ? "Yes" : "No",
                d.donationCount || 0,
                d.lastDonationDate ? new Date(d.lastDonationDate.seconds * 1000).toLocaleDateString() : "Never"
            ].join(","))
        ].join("\n");

        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", `smartbloodlife_donors_${new Date().toISOString().split('T')[0]}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    // Calculate Stats
    const stats = {
        total: donors.length,
        active: donors.filter(d => d.isAvailable).length,
        verified: donors.filter(d => d.isVerified).length,
        livesSaved: donors.reduce((acc, d) => acc + ((d.donationCount || 0) * 3), 0)
    };

    const openEdit = (donor) => {
        setEditingDonor(donor);
        setFormData({
            name: donor.name,
            bloodGroup: donor.bloodGroup,
            phone: donor.phone,
            whatsapp: donor.whatsapp,
            city: donor.city,
            lastDonationDate: donor.lastDonationDate ? donor.lastDonationDate.toDate().toISOString().split('T')[0] : '',
            isAvailable: donor.isAvailable,
            isVerified: donor.isVerified || false,
            donationCount: donor.donationCount || 0
        });
        setFormErrors({});
        setIsFormOpen(true);
    };

    const closeForm = () => {
        setIsFormOpen(false);
        setEditingDonor(null);
        setFormData(getInitialFormState());
        setFormErrors({});
    };

    const filteredDonors = donors.filter(d => {
        const matchesSearch =
            d.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            d.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
            d.bloodGroup.includes(searchTerm);

        const matchesStatus =
            statusFilter === 'all' ? true :
                statusFilter === 'active' ? d.isAvailable :
                    !d.isAvailable;

        return matchesSearch && matchesStatus;
    });

    return (
        <div className="min-h-screen bg-gray-50/50 p-4 lg:p-8">
            <div className="max-w-7xl mx-auto space-y-6">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-lg shadow-sm border">
                    <div>
                        <h1 className="text-2xl font-bold flex items-center gap-2">
                            Dashboard
                            <Badge variant="outline" className="ml-2 bg-gray-100">{donors.length} Donors</Badge>
                        </h1>
                        <p className="text-muted-foreground mt-1">Manage blood donors and requests</p>
                    </div>
                    <div className="flex flex-col sm:flex-row items-center gap-4">
                        <Button variant="outline" onClick={() => navigate('/')} className="gap-2 hover:bg-slate-50">
                            <Home className="h-4 w-4" /> Home
                        </Button>
                        <Button variant="outline" onClick={handleExport} className="gap-2 text-green-600 border-green-200 hover:bg-green-50">
                            <FileSpreadsheet className="h-4 w-4" /> Export CSV
                        </Button>
                        <Button variant="ghost" onClick={handleLogout} className="text-red-600 hover:bg-red-50 hover:text-red-700">
                            <LogOut className="h-4 w-4 mr-2" /> Logout
                        </Button>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <Card className="border-l-4 border-l-blue-500 shadow-sm">
                        <CardContent className="p-6 flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-500">Total Donors</p>
                                <h3 className="text-2xl font-bold">{stats.total}</h3>
                            </div>
                            <div className="h-10 w-10 bg-blue-50 rounded-full flex items-center justify-center">
                                <Users className="h-5 w-5 text-blue-500" />
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="border-l-4 border-l-green-500 shadow-sm">
                        <CardContent className="p-6 flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-500">Active Now</p>
                                <h3 className="text-2xl font-bold">{stats.active}</h3>
                            </div>
                            <div className="h-10 w-10 bg-green-50 rounded-full flex items-center justify-center">
                                <Activity className="h-5 w-5 text-green-500" />
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="border-l-4 border-l-indigo-500 shadow-sm">
                        <CardContent className="p-6 flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-500">Verified Donors</p>
                                <h3 className="text-2xl font-bold">{stats.verified}</h3>
                            </div>
                            <div className="h-10 w-10 bg-indigo-50 rounded-full flex items-center justify-center">
                                <ShieldCheck className="h-5 w-5 text-indigo-500" />
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="border-l-4 border-l-red-500 shadow-sm">
                        <CardContent className="p-6 flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-500">Total Lives Saved</p>
                                <h3 className="text-2xl font-bold">{stats.livesSaved}</h3>
                            </div>
                            <div className="h-10 w-10 bg-red-50 rounded-full flex items-center justify-center">
                                <Heart className="h-5 w-5 text-red-500 fill-red-500" />
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Controls */}
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search by Name, City, or Blood Group..."
                            className="pl-9 bg-white"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                        <option value="all">All Status</option>
                        <option value="active">Active Only</option>
                        <option value="inactive">Inactive Only</option>
                    </Select>
                    <Button onClick={() => setIsFormOpen(true)} className="gap-2 shadow-sm">
                        <Plus className="h-4 w-4" /> Add New Donor
                    </Button>
                </div>

                {/* Emergency Broadcast Control */}
                <Card className={`border-l-4 ${emergency.active ? 'border-l-red-600 bg-red-50/50' : 'border-l-gray-300'} shadow-sm`}>
                    <CardContent className="p-6">
                        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-4">
                            <div className="flex items-center gap-3">
                                <div className={`p-2 rounded-full ${emergency.active ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-500'}`}>
                                    <AlertTriangle className="h-6 w-6" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-gray-900">Emergency Broadcast System</h3>
                                    <p className="text-sm text-muted-foreground">Display a site-wide alert for urgent blood requirements.</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <Label htmlFor="emergency-toggle" className="font-semibold cursor-pointer">
                                    {emergency.active ? 'Broadcast ACTIVE' : 'Broadcast Inactive'}
                                </Label>
                                <div
                                    className={`w-12 h-6 rounded-full p-1 cursor-pointer transition-colors ${emergency.active ? 'bg-red-600' : 'bg-gray-300'}`}
                                    onClick={() => setEmergency(prev => ({ ...prev, active: !prev.active }))}
                                >
                                    <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${emergency.active ? 'translate-x-6' : 'translate-x-0'}`} />
                                </div>
                            </div>
                        </div>

                        <div className={`grid grid-cols-1 md:grid-cols-3 gap-4 transition-all duration-300 ${emergency.active ? 'opacity-100' : 'opacity-50 pointer-events-none'}`}>
                            <div className="space-y-2">
                                <Label>Alert Message</Label>
                                <Input
                                    placeholder="e.g. Urgent O+ Blood Needed at City Hospital"
                                    value={emergency.message}
                                    onChange={(e) => setEmergency(p => ({ ...p, message: e.target.value }))}
                                    className="border-red-200 focus-visible:ring-red-500"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Target City</Label>
                                <Input
                                    placeholder="e.g. Mumbai"
                                    value={emergency.city}
                                    onChange={(e) => setEmergency(p => ({ ...p, city: e.target.value }))}
                                    className="border-red-200 focus-visible:ring-red-500"
                                />
                            </div>
                            <div className="space-y-2 flex items-end gap-2">
                                <div className="flex-1 space-y-2">
                                    <Label>Contact Number</Label>
                                    <Input
                                        placeholder="Emergency Contact"
                                        value={emergency.contact}
                                        onChange={(e) => setEmergency(p => ({ ...p, contact: e.target.value }))}
                                        className="border-red-200 focus-visible:ring-red-500"
                                    />
                                </div>
                                <Button onClick={handleEmergencyUpdate} className="bg-red-600 hover:bg-red-700 text-white">
                                    <Save className="h-4 w-4 mr-2" /> Save Alert
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Main Content */}
                <Card className="border-none shadow-md overflow-hidden">
                    <CardContent className="p-0">
                        <div className="w-full overflow-x-auto">
                            <table className="w-full text-sm text-left">
                                <thead className="text-xs text-gray-700 uppercase bg-gray-50 border-b">
                                    <tr>
                                        <th className="px-6 py-4 font-semibold">Donor Profile</th>
                                        <th className="px-6 py-4 font-semibold">Contact</th>
                                        <th className="px-6 py-4 font-semibold text-center">Status</th>
                                        <th className="px-6 py-4 font-semibold text-center">Donations</th>
                                        <th className="px-6 py-4 font-semibold">Last Donation</th>
                                        <th className="px-6 py-4 font-semibold text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {loading ? (
                                        <tr><td colSpan="5" className="p-8 text-center text-muted-foreground">Loading records...</td></tr>
                                    ) : filteredDonors.length === 0 ? (
                                        <tr><td colSpan="5" className="p-12 text-center text-muted-foreground">
                                            <div className="flex flex-col items-center gap-2">
                                                <AlertCircle className="h-8 w-8 text-gray-300" />
                                                <p>No donors found matching requirements.</p>
                                            </div>
                                        </td></tr>
                                    ) : (
                                        filteredDonors.map((donor) => {
                                            const eligible = isEligibleToDonate(donor.lastDonationDate);
                                            const days = calculateDaysSinceDonation(donor.lastDonationDate);

                                            return (
                                                <tr key={donor.id} className={`hover:bg-gray-50/80 transition-colors ${!donor.isAvailable ? 'bg-gray-50 opacity-60' : 'bg-white'}`}>
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center gap-3">
                                                            <div className={`h-10 w-10 min-w-[2.5rem] rounded-full flex items-center justify-center text-white text-xs font-bold shadow-sm 
                                                                ${donor.bloodGroup.includes('+') ? 'bg-red-500' : 'bg-rose-600'}`}>
                                                                {donor.bloodGroup}
                                                            </div>
                                                            <div>
                                                                <div className="font-semibold text-gray-900 flex items-center gap-1">
                                                                    {donor.name}
                                                                    {donor.isVerified && <ShieldCheck className="h-4 w-4 text-blue-500 fill-blue-50" />}
                                                                </div>
                                                                <div className="text-gray-500 text-xs">{donor.city}</div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="space-y-1">
                                                            <div className="flex items-center gap-2 text-gray-700 font-medium">
                                                                <Phone className="h-3 w-3" /> {donor.phone}
                                                            </div>
                                                            {donor.whatsapp && donor.whatsapp !== donor.phone && (
                                                                <div className="text-xs text-green-600">WA: {donor.whatsapp}</div>
                                                            )}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 text-center">
                                                        <div className="flex flex-col gap-2 items-center">
                                                            {donor.isAvailable ? (
                                                                <Badge variant="outline" className="border-green-200 bg-green-50 text-green-700 gap-1">
                                                                    <CheckCircle className="h-3 w-3" /> Active
                                                                </Badge>
                                                            ) : (
                                                                <Badge variant="outline" className="border-gray-200 bg-gray-100 text-gray-500 gap-1">
                                                                    <Ban className="h-3 w-3" /> Inactive
                                                                </Badge>
                                                            )}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 text-center">
                                                        <div className="flex flex-col items-center gap-1">
                                                            <span className="font-bold text-lg text-gray-800">{donor.donationCount || 0}</span>
                                                            <span className="text-[10px] text-gray-400 uppercase tracking-wider">Donations</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        {eligible ? (
                                                            <span className="inline-flex items-center text-green-600 font-medium text-xs bg-green-50 px-2 py-1 rounded-full">
                                                                Eligible
                                                            </span>
                                                        ) : (
                                                            <div className="flex flex-col">
                                                                <span className="text-xs font-medium text-amber-600 bg-amber-50 px-2 py-1 rounded-full w-fit">Ineligible</span>
                                                                <span className="text-[10px] text-gray-400 mt-1">{days} days ago</span>
                                                            </div>
                                                        )}
                                                    </td>
                                                    <td className="px-6 py-4 text-right">
                                                        <div className="flex justify-end gap-1">
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                className="h-8 w-8 p-0 text-blue-600 hover:bg-blue-50"
                                                                onClick={() => toggleVerification(donor)}
                                                                title={donor.isVerified ? "Remove Verification" : "Verify Donor"}
                                                            >
                                                                <ShieldCheck className={`h-4 w-4 ${donor.isVerified ? 'fill-blue-100' : 'text-gray-300'}`} />
                                                            </Button>
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                className="h-8 w-8 p-0 text-amber-600 hover:bg-amber-50"
                                                                onClick={() => incrementDonation(donor)}
                                                                title="Log New Donation (+1)"
                                                            >
                                                                <Award className="h-4 w-4" />
                                                            </Button>
                                                            <div className="w-px h-4 bg-gray-300 mx-1"></div>
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                className="h-8 w-8 p-0"
                                                                onClick={() => toggleStatus(donor)}
                                                                title={donor.isAvailable ? "Deactivate" : "Activate"}
                                                            >
                                                                <Ban className={`h-4 w-4 ${donor.isAvailable ? 'text-gray-400' : 'text-green-600'}`} />
                                                            </Button>
                                                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-slate-600" onClick={() => openEdit(donor)}>
                                                                <Edit2 className="h-4 w-4" />
                                                            </Button>
                                                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-red-500 hover:bg-red-50" onClick={() => handleDelete(donor.id)}>
                                                                <Trash2 className="h-4 w-4" />
                                                            </Button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            );
                                        })
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Modal Form */}
            {
                isFormOpen && (
                    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
                        <div className="bg-background rounded-xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in duration-200 border">
                            <div className="flex items-center justify-between p-6 border-b bg-muted/20">
                                <h2 className="text-lg font-bold">{editingDonor ? 'Edit Donor Details' : 'Register New Donor'}</h2>
                                <Button variant="ghost" size="icon" onClick={closeForm} className="rounded-full">
                                    <X className="h-5 w-5" />
                                </Button>
                            </div>
                            <div className="p-6">
                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label>Full Name <span className="text-red-500">*</span></Label>
                                            <Input name="name" value={formData.name} onChange={handleInputChange} className={formErrors.name ? 'border-red-500' : ''} />
                                            {formErrors.name && <p className="text-xs text-red-500">{formErrors.name}</p>}
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Blood Group <span className="text-red-500">*</span></Label>
                                            <Select name="bloodGroup" value={formData.bloodGroup} onChange={handleInputChange}>
                                                <option value="">Select Group</option>
                                                {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(bg => (
                                                    <option key={bg} value={bg}>{bg}</option>
                                                ))}
                                            </Select>
                                            {formErrors.bloodGroup && <p className="text-xs text-red-500">{formErrors.bloodGroup}</p>}
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label>Phone (+91) <span className="text-red-500">*</span></Label>
                                            <Input name="phone" value={formData.phone} onChange={handleInputChange} placeholder="9876543210" className={formErrors.phone ? 'border-red-500' : ''} />
                                            {formErrors.phone && <p className="text-xs text-red-500">{formErrors.phone}</p>}
                                        </div>
                                        <div className="space-y-2">
                                            <Label>WhatsApp (Optional)</Label>
                                            <Input name="whatsapp" value={formData.whatsapp} onChange={handleInputChange} placeholder="Same as phone" />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label>City / Area <span className="text-red-500">*</span></Label>
                                        <Input name="city" value={formData.city} onChange={handleInputChange} className={formErrors.city ? 'border-red-500' : ''} />
                                        {formErrors.city && <p className="text-xs text-red-500">{formErrors.city}</p>}
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label>Total Donations</Label>
                                            <Input
                                                type="number"
                                                name="donationCount"
                                                min="0"
                                                value={formData.donationCount}
                                                onChange={handleInputChange}
                                            />
                                        </div>
                                        <div className="flex items-center space-x-2 pt-8">
                                            <input
                                                type="checkbox"
                                                id="isVerified"
                                                name="isVerified"
                                                className="h-4 w-4 text-primary border-gray-300 rounded focus:ring-primary"
                                                checked={formData.isVerified}
                                                onChange={handleInputChange}
                                            />
                                            <Label htmlFor="isVerified" className="cursor-pointer font-medium">Verified Donor Badge</Label>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Last Donation Date</Label>
                                        <Input
                                            type="date"
                                            name="lastDonationDate"
                                            value={formData.lastDonationDate}
                                            onChange={handleInputChange}
                                        />
                                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                                            <AlertCircle className="h-3 w-3" /> Leave empty if first time donor
                                        </p>
                                    </div>

                                    <div className="pt-4 flex justify-end gap-3 border-t mt-4">
                                        <Button type="button" variant="outline" onClick={closeForm}>Cancel</Button>
                                        <Button type="submit" className="px-8">{editingDonor ? 'Save Changes' : 'Add Donor'}</Button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                )
            }
        </div >
    );
};

export default Dashboard;
