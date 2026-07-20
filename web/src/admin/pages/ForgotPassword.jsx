import React, { useState } from 'react';
import { authService } from '@/services/authService';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { KeyRound, ArrowLeft, Mail } from 'lucide-react';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await authService.resetPassword(email);
            setSubmitted(true);
            toast.success("Reset link sent! Check your email.");
        } catch (error) {
            console.error("Reset Error:", error);
            const msg = error.code === 'auth/user-not-found'
                ? "No account found with this email."
                : "Failed to send reset email. Try again.";
            toast.error(msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-slate-50 px-4 relative">
            <Link to="/admin/login" className="absolute top-4 left-4 md:top-8 md:left-8 flex items-center gap-2 text-slate-600 hover:text-primary transition-colors font-medium text-sm md:text-base">
                <ArrowLeft className="h-4 w-4 md:h-5 md:w-5" /> Back to Login
            </Link>
            <div className="absolute top-0 left-0 w-full h-1/2 bg-primary/10 -z-10 rounded-b-[30%]" />

            <Card className="w-full max-w-md shadow-2xl border-0 rounded-3xl overflow-hidden bg-white">
                <CardHeader className="text-center space-y-4 pb-6 pt-8">
                    <div className="mx-auto bg-red-50 p-4 rounded-3xl w-fit mb-2">
                        <KeyRound className="h-8 w-8 text-primary" />
                    </div>
                    <div>
                        <CardTitle className="text-2xl font-bold text-slate-900">Forgot Password?</CardTitle>
                        <CardDescription className="text-base text-slate-500">
                            {"No worries! Enter your email and we'll verify it's you."}
                        </CardDescription>
                    </div>
                </CardHeader>
                <CardContent className="pt-2 px-8 pb-8">
                    {!submitted ? (
                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div className="space-y-2">
                                <Label htmlFor="email" className="text-slate-700 font-medium">Email Address</Label>
                                <div className="relative">
                                    <Mail className="absolute left-4 top-3.5 h-5 w-5 text-slate-400" />
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="admin@smartbloodlife.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                        className="h-12 pl-12 rounded-xl border-slate-200 focus-visible:ring-primary/20"
                                    />
                                </div>
                            </div>
                            <Button type="submit" className="w-full h-12 text-base mt-2 rounded-xl shadow-lg shadow-red-500/20 hover:shadow-red-500/30 transition-all bg-primary hover:bg-red-700" disabled={loading}>
                                {loading ? "Sending Link..." : "Send Reset Link"}
                            </Button>
                        </form>
                    ) : (
                        <div className="text-center space-y-4 animate-in fade-in zoom-in duration-300">
                            <div className="bg-green-50 text-green-700 p-4 rounded-xl text-sm font-medium border border-green-100">
                                ✅ Reset link sent to <b>{email}</b>. Please check your inbox and spam folder.
                            </div>
                            <Button variant="outline" className="w-full h-12 rounded-xl" onClick={() => setSubmitted(false)}>
                                Try another email
                            </Button>
                        </div>
                    )}

                    <div className="mt-6 text-center">
                        <Link to="/admin/login" className="inline-flex items-center text-sm font-semibold text-slate-500 hover:text-primary transition-colors">
                            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Login
                        </Link>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default ForgotPassword;
