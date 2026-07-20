import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Share2, Link2, Check, X, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

const ShareButton = ({ title, text, url }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [copied, setCopied] = useState(false);

    const shareUrl = url || window.location.href;
    const shareTitle = title || 'SmartBloodLife Blood Donor';
    const shareText = text || 'Check out this blood donor on SmartBloodLife';

    const handleNativeShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: shareTitle,
                    text: shareText,
                    url: shareUrl,
                });
            } catch (err) {
                if (err.name !== 'AbortError') {
                    console.error('Share failed:', err);
                }
            }
        } else {
            setIsOpen(true);
        }
    };

    const copyLink = async () => {
        try {
            await navigator.clipboard.writeText(shareUrl);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Copy failed:', err);
        }
    };

    const shareToWhatsApp = () => {
        const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(`${shareText}\n${shareUrl}`)}`;
        window.open(whatsappUrl, '_blank');
    };

    const shareToTwitter = () => {
        const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;
        window.open(twitterUrl, '_blank');
    };

    return (
        <div className="relative">
            <Button
                variant="outline"
                size="sm"
                onClick={handleNativeShare}
                className="gap-2 rounded-xl border-slate-200 hover:border-slate-300"
            >
                <Share2 className="h-4 w-4" />
                Share
            </Button>

            <AnimatePresence>
                {isOpen && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsOpen(false)}
                            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
                        />

                        {/* Share Menu */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: -10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: -10 }}
                            transition={{ duration: 0.15 }}
                            className="absolute right-0 top-full mt-2 w-64 bg-white rounded-2xl shadow-xl border border-slate-100 p-2 z-50"
                        >
                            <div className="flex items-center justify-between p-2 mb-1">
                                <span className="text-sm font-semibold text-slate-700">Share Donor</span>
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="h-6 w-6 rounded-full hover:bg-slate-100 flex items-center justify-center"
                                >
                                    <X className="h-4 w-4 text-slate-400" />
                                </button>
                            </div>

                            {/* Copy Link */}
                            <button
                                onClick={copyLink}
                                className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 transition-colors"
                            >
                                <div className={`h-10 w-10 rounded-xl flex items-center justify-center ${copied ? 'bg-green-100' : 'bg-slate-100'}`}>
                                    {copied ? (
                                        <Check className="h-5 w-5 text-green-600" />
                                    ) : (
                                        <Link2 className="h-5 w-5 text-slate-600" />
                                    )}
                                </div>
                                <div className="text-left">
                                    <div className="font-medium text-slate-800">
                                        {copied ? 'Copied!' : 'Copy Link'}
                                    </div>
                                    <div className="text-xs text-slate-400">Copy to clipboard</div>
                                </div>
                            </button>

                            {/* WhatsApp */}
                            <button
                                onClick={shareToWhatsApp}
                                className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-green-50 transition-colors"
                            >
                                <div className="h-10 w-10 rounded-xl bg-green-100 flex items-center justify-center">
                                    <MessageCircle className="h-5 w-5 text-green-600" />
                                </div>
                                <div className="text-left">
                                    <div className="font-medium text-slate-800">WhatsApp</div>
                                    <div className="text-xs text-slate-400">Share via WhatsApp</div>
                                </div>
                            </button>

                            {/* Twitter */}
                            <button
                                onClick={shareToTwitter}
                                className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-blue-50 transition-colors"
                            >
                                <div className="h-10 w-10 rounded-xl bg-blue-100 flex items-center justify-center">
                                    <svg className="h-5 w-5 text-blue-500" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                                    </svg>
                                </div>
                                <div className="text-left">
                                    <div className="font-medium text-slate-800">X (Twitter)</div>
                                    <div className="text-xs text-slate-400">Share on X</div>
                                </div>
                            </button>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
};

export default ShareButton;
