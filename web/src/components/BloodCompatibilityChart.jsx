import React from 'react';
import { motion } from 'framer-motion';
import { Check, X, Droplet, ArrowRight, Info } from 'lucide-react';
import {
    getCompatibleRecipients,
    getCompatibleDonors,
    getBloodTypeInfo,
    getAllBloodTypes
} from '@/utils/bloodCompatibility';

const BloodCompatibilityChart = ({ bloodType }) => {
    const canDonateTo = getCompatibleRecipients(bloodType);
    const canReceiveFrom = getCompatibleDonors(bloodType);
    const typeInfo = getBloodTypeInfo(bloodType);
    const allTypes = getAllBloodTypes();

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="bg-white rounded-2xl border border-slate-100 shadow-lg overflow-hidden"
        >
            {/* Header with Blood Type Badge */}
            <div className={`bg-gradient-to-r ${typeInfo.color} p-6 text-white`}>
                <div className="flex items-center justify-between">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <div className="h-14 w-14 bg-white/20 backdrop-blur rounded-xl flex items-center justify-center">
                                <span className="text-2xl font-bold">{bloodType}</span>
                            </div>
                            <div>
                                <span className="bg-white/20 px-3 py-1 rounded-full text-sm font-medium">
                                    {typeInfo.badge}
                                </span>
                                <p className="text-white/80 text-sm mt-1">{typeInfo.rarity}</p>
                            </div>
                        </div>
                        <p className="text-white/90 text-sm mt-3 max-w-md">
                            {typeInfo.description}
                        </p>
                    </div>
                    <Droplet className="h-16 w-16 text-white/20" />
                </div>
            </div>

            {/* Compatibility Grid */}
            <div className="p-6">
                <div className="grid md:grid-cols-2 gap-6">
                    {/* Can Donate To */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                            <div className="h-8 w-8 rounded-lg bg-green-100 flex items-center justify-center">
                                <ArrowRight className="h-4 w-4 text-green-600" />
                            </div>
                            Can Donate To ({canDonateTo.length} types)
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {allTypes.map((type) => {
                                const canDonate = canDonateTo.includes(type);
                                return (
                                    <motion.div
                                        key={type}
                                        whileHover={{ scale: 1.05 }}
                                        className={`
                                            flex items-center gap-1.5 px-3 py-2 rounded-xl font-medium text-sm
                                            transition-all duration-200
                                            ${canDonate
                                                ? 'bg-green-50 text-green-700 border-2 border-green-200'
                                                : 'bg-slate-50 text-slate-400 border border-slate-100'
                                            }
                                        `}
                                    >
                                        {canDonate ? (
                                            <Check className="h-3.5 w-3.5" />
                                        ) : (
                                            <X className="h-3.5 w-3.5" />
                                        )}
                                        {type}
                                    </motion.div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Can Receive From */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                            <div className="h-8 w-8 rounded-lg bg-blue-100 flex items-center justify-center">
                                <ArrowRight className="h-4 w-4 text-blue-600 rotate-180" />
                            </div>
                            Can Receive From ({canReceiveFrom.length} types)
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {allTypes.map((type) => {
                                const canReceive = canReceiveFrom.includes(type);
                                return (
                                    <motion.div
                                        key={type}
                                        whileHover={{ scale: 1.05 }}
                                        className={`
                                            flex items-center gap-1.5 px-3 py-2 rounded-xl font-medium text-sm
                                            transition-all duration-200
                                            ${canReceive
                                                ? 'bg-blue-50 text-blue-700 border-2 border-blue-200'
                                                : 'bg-slate-50 text-slate-400 border border-slate-100'
                                            }
                                        `}
                                    >
                                        {canReceive ? (
                                            <Check className="h-3.5 w-3.5" />
                                        ) : (
                                            <X className="h-3.5 w-3.5" />
                                        )}
                                        {type}
                                    </motion.div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Info Footer */}
                <div className="mt-6 p-4 bg-slate-50 rounded-xl flex items-start gap-3">
                    <Info className="h-5 w-5 text-slate-400 mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-slate-600">
                        Blood type compatibility is crucial for safe transfusions. This chart shows which blood types
                        a <strong>{bloodType}</strong> donor can give to and receive from.
                    </p>
                </div>
            </div>
        </motion.div>
    );
};

export default BloodCompatibilityChart;
