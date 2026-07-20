
import { Activity } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="bg-slate-900 text-slate-300 py-12 mt-auto border-t border-slate-800">
            <div className="container mx-auto px-4">
                <div className="grid md:grid-cols-4 gap-8 mb-8">
                    {/* Brand */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2">
                            <div className="bg-red-500/10 p-2 rounded-full">
                                <Activity className="h-6 w-6 text-red-500" />
                            </div>
                            <span className="text-xl font-bold tracking-tight text-white">SmartBloodLife</span>
                        </div>
                        <p className="text-sm text-slate-400 leading-relaxed">
                            Connecting blood donors with those in need. Every drop counts in saving lives.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="font-semibold text-white mb-4">Quick Links</h3>
                        <ul className="space-y-2 text-sm">
                            <li><a href="/" className="hover:text-red-400 transition-colors">Home</a></li>
                            <li><a href="/search" className="hover:text-red-400 transition-colors">Find Donors</a></li>
                            <li><a href="/admin/login" className="hover:text-red-400 transition-colors">Admin Portal</a></li>
                        </ul>
                    </div>

                    {/* Legal */}
                    <div>
                        <h3 className="font-semibold text-white mb-4">Legal</h3>
                        <ul className="space-y-2 text-sm">
                            <li><a href="#" className="hover:text-red-400 transition-colors">Privacy Policy</a></li>
                            <li><a href="#" className="hover:text-red-400 transition-colors">Terms of Service</a></li>
                            <li><a href="#" className="hover:text-red-400 transition-colors">Cookie Policy</a></li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h3 className="font-semibold text-white mb-4">Contact</h3>
                        <ul className="space-y-2 text-sm">
                            <li className="flex items-center gap-2">
                                <span className="w-1 h-1 bg-red-500 rounded-full"></span>
                                smartbloodlife@gmail.com
                            </li>
                            <li className="flex items-center gap-2">
                                <span className="w-1 h-1 bg-red-500 rounded-full"></span>
                                +91 63824 75871
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="pt-8 border-t border-slate-800 text-center text-xs text-slate-500">
                    <div className="flex flex-col items-center gap-6">
                        <div className="flex flex-col sm:flex-row items-center gap-3">
                            <p className="flex items-center gap-2 text-slate-400 text-sm">
                                <span className="relative flex h-3 w-3">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                                </span>
                                Want a website like this?
                            </p>
                            <a
                                href="mailto:certifiedaideveloper@gmail.com?subject=Project Inquiry: Smart Website Development&body=Hi, I saw your work on SmartBloodLife and would like to discuss a similar project."
                                className="group relative px-6 py-2 rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white font-bold text-xs shadow-lg shadow-purple-500/20 hover:shadow-purple-500/40 hover:-translate-y-0.5 transition-all duration-300 overflow-hidden"
                            >
                                <span className="absolute top-0 left-0 w-full h-full bg-white/20 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out"></span>
                                <span className="relative flex items-center gap-2">
                                    Hire Developer <span className="animate-bounce">👋</span>
                                </span>
                            </a>
                        </div>
                        <p>© {new Date().getFullYear()} SmartBloodLife. All rights reserved.</p>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
