import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Search, User } from 'lucide-react';
import { cn } from '@/lib/utils';

const MobileBottomNav = () => {
    const location = useLocation();
    const isActive = (path) => location.pathname === path;

    const navItems = [
        { icon: Home, label: 'Home', path: '/' },
        { icon: Search, label: 'Find', path: '/search' },
        { icon: User, label: 'Admin', path: '/admin/dashboard' },
    ];

    return (
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 md:hidden pb-safe">
            <div className="flex items-center justify-around h-16">
                {navItems.map((item) => {
                    const active = isActive(item.path);
                    return (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={cn(
                                "flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors duration-200",
                                active
                                    ? "text-primary"
                                    : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
                            )}
                        >
                            <item.icon className={cn("h-6 w-6", active && "fill-current/20")} />
                            <span className="text-[10px] font-medium">{item.label}</span>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
};

export default MobileBottomNav;
