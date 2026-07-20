import { useState } from 'react';
import { authService } from '@/services/authService';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Lock, Droplet, ArrowLeft } from 'lucide-react';

const AdminLogin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    const from = location.state?.from?.pathname || '/admin/dashboard';

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await authService.login(email, password);
            toast.success("Welcome back, Admin!");
            navigate(from, { replace: true });
        } catch (error) {
            console.error("Login Error:", error);
            const msg = error.code === 'auth/invalid-credential'
                ? "Invalid email or password."
                : "Login failed. Please try again.";
            toast.error(msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-slate-50 px-4 relative">
            <Link to="/" className="absolute top-4 left-4 md:top-8 md:left-8 flex items-center gap-2 text-slate-600 hover:text-primary transition-colors font-medium text-sm md:text-base">
                <ArrowLeft className="h-4 w-4 md:h-5 md:w-5" /> Back to Home
            </Link>
            <div className="absolute top-0 left-0 w-full h-1/2 bg-primary/10 -z-10 rounded-b-[30%]" />

            <Card className="w-full max-w-md shadow-2xl border-0 rounded-3xl overflow-hidden">
                <CardHeader className="text-center space-y-4 pb-6 bg-white pt-8">
                    <div className="mx-auto bg-red-50 p-4 rounded-3xl w-fit mb-2">
                        <Droplet className="h-8 w-8 text-primary fill-primary" />
                    </div>
                    <div>
                        <CardTitle className="text-2xl font-bold text-slate-900">Admin Portal</CardTitle>
                        <CardDescription className="text-base text-slate-500">Secure access for staff only</CardDescription>
                    </div>
                </CardHeader>
                <CardContent className="pt-6 px-8 pb-8 bg-white">
                    <form onSubmit={handleLogin} className="space-y-5">
                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-slate-700 font-medium">Email Address</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="admin@smartbloodlife.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="h-12 rounded-xl border-slate-200 focus-visible:ring-primary/20"
                            />
                        </div>
                        <div className="space-y-2">
                            <div className="flex justify-between items-center">
                                <Label htmlFor="password" className="text-slate-700 font-medium">Password</Label>
                                <Link to="/admin/forgot-password" className="text-xs font-semibold text-primary hover:text-red-700 hover:underline">
                                    Forgot Password?
                                </Link>
                            </div>
                            <Input
                                id="password"
                                type="password"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="h-12 rounded-xl border-slate-200 focus-visible:ring-primary/20"
                            />
                        </div>
                        <Button type="submit" className="w-full h-12 text-base mt-4 rounded-xl shadow-lg shadow-red-500/20 hover:shadow-red-500/30 transition-all" disabled={loading}>
                            {loading ? <span className="animate-pulse">Authenticating...</span> : <span className="flex items-center gap-2 justify-center"><Lock className="h-4 w-4" /> Login Securely</span>}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
};

export default AdminLogin;
