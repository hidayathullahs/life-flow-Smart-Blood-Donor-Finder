import React, { useState } from 'react';
import { db } from '@/lib/firebase';
import { collection, addDoc } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Activity } from 'lucide-react';

const FirebaseTestComponent = () => {
    const [status, setStatus] = useState('idle'); // idle, loading, success, error
    const [message, setMessage] = useState('');

    const testConnection = async () => {
        setStatus('loading');
        try {
            await addDoc(collection(db, "test_connections"), {
                message: "Firebase connected successfully",
                timestamp: new Date(),
                platform: "React"
            });
            setStatus('success');
            setMessage('Firebase is working ✅ Data written to Firestore.');
        } catch (error) {
            console.error("Firebase connection error:", error);
            setStatus('error');
            setMessage(`Error ❌ ${error.message}`);
        }
    };

    return (
        <div className="my-8 p-6 bg-slate-50 border border-slate-200 rounded-xl text-center max-w-md mx-auto">
            <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center justify-center gap-2">
                <Activity className="h-5 w-5 text-primary" />
                System Status Check
            </h3>

            <Button
                onClick={testConnection}
                disabled={status === 'loading'}
                variant={status === 'error' ? 'destructive' : 'default'}
                className="w-full mb-4"
            >
                {status === 'loading' ? 'Testing Connection...' : 'Test Firebase Integration'}
            </Button>

            {message && (
                <div className={`p-3 rounded-lg text-sm font-medium animate-in fade-in zoom-in ${status === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}>
                    {message}
                </div>
            )}
        </div>
    );
};

export default FirebaseTestComponent;
