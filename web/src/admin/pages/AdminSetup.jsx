import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { auth, db } from '@/lib/firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'react-toastify';
import { ShieldAlert, ArrowLeft } from 'lucide-react';

const AdminSetup = () => {
    const [email, setEmail] = useState('admin@smartbloodlife.com');
    const [password, setPassword] = useState('salmanannanbajar123');
    const [secretKey, setSecretKey] = useState('life-flow-admin');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSetup = async (e) => {
        e.preventDefault();

        if (secretKey !== 'life-flow-admin') {
            toast.error("Invalid Secret Key");
            return;
        }

        setLoading(true);
        try {
            // 1. Create Auth User
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // 2. Create Admin Profile in Firestore
            await setDoc(doc(db, 'users', user.uid), {
                email: user.email,
                displayName: 'System Admin',
                role: 'admin', // Force Admin Role
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp()
            });

            toast.success("Admin Account Created Successfully!");

            // Redirect to dashboard after 2 seconds
            setTimeout(() => {
                navigate('/admin/dashboard');
            }, 2000);

        } catch (error) {
            console.error("Setup Error:", error);
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 relative">
            <Link to="/" className="absolute top-4 left-4 md:top-8 md:left-8 flex items-center gap-2 text-slate-400 hover:text-white transition-colors font-medium text-sm md:text-base">
                <ArrowLeft className="h-4 w-4 md:h-5 md:w-5" /> Back to Home
            </Link>
            <Card className="w-full max-w-md border-red-500/20 bg-slate-950 text-slate-100">
                <CardHeader className="text-center space-y-2">
                    <div className="mx-auto bg-red-500/10 p-4 rounded-full w-fit">
                        <ShieldAlert className="h-10 w-10 text-red-500" />
                    </div>
                    <CardTitle className="text-2xl font-bold text-red-500">Admin Setup Console</CardTitle>
                    <p className="text-sm text-slate-400">Initialize the first Administrator Account</p>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSetup} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email">Admin Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="admin@smartbloodlife.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="bg-slate-900 border-slate-800"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <Input
                                id="password"
                                type="password"
                                placeholder="Strong Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="bg-slate-900 border-slate-800"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="secret">Setup Key</Label>
                            <Input
                                id="secret"
                                type="password"
                                placeholder="Enter Setup Key"
                                value={secretKey}
                                onChange={(e) => setSecretKey(e.target.value)}
                                className="bg-slate-900 border-slate-800"
                                required
                            />
                            <p className="text-xs text-slate-500">Key: life-flow-admin</p>
                        </div>
                        <Button
                            type="submit"
                            className="w-full bg-red-600 hover:bg-red-700 text-white font-bold"
                            disabled={loading}
                        >
                            {loading ? "Initializing..." : "Create Admin Account"}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
};

export default AdminSetup;
