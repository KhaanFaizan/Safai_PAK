import { useEffect, useState } from 'react';
import api from '../../utils/api';
import { Loader } from '../../components/ui/Loader';
import { BackButton } from '../../components/ui/BackButton';
import { DollarSign, TrendingUp, CheckCircle, Calendar, ArrowUpRight } from 'lucide-react';

interface Booking {
    _id: string;
    scheduledDate: string;
    status: string;
    service: {
        name: string;
        price: number;
    };
    customer: {
        name: string;
    };
}

const ProviderEarnings = () => {
    const [loading, setLoading] = useState(true);
    const [earnings, setEarnings] = useState({
        total: 0,
        thisMonth: 0,
        completedJobs: 0,
        pendingPayout: 0
    });
    const [history, setHistory] = useState<Booking[]>([]);

    useEffect(() => {
        fetchEarningsData();
    }, []);

    const fetchEarningsData = async () => {
        try {
            const { data: bookings } = await api.get('/bookings');

            // Filter Completed Jobs for Earnings
            const completed = bookings.filter((b: Booking) => b.status === 'completed');

            const total = completed.reduce((sum: number, b: Booking) => sum + (b.service?.price || 0), 0);

            // Calculate "This Month" (Simple logic: checks if date is within current month/year)
            const now = new Date();
            const thisMonthEarnings = completed
                .filter((b: Booking) => {
                    const d = new Date(b.scheduledDate);
                    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
                })
                .reduce((sum: number, b: Booking) => sum + (b.service?.price || 0), 0);

            // Mock "Pending Payout" (e.g., jobs done but not yet withdrawn - just a visual metric for now)
            const pending = total; // Assuming no withdrawal system yet, all is pending/available.

            setEarnings({
                total,
                thisMonth: thisMonthEarnings,
                completedJobs: completed.length,
                pendingPayout: pending
            });

            // Set History (Newest first)
            setHistory(completed.sort((a: Booking, b: Booking) => new Date(b.scheduledDate).getTime() - new Date(a.scheduledDate).getTime()));

        } catch (error) {
            console.error('Failed to fetch earnings', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <Loader />;

    return (
        <div className="space-y-8">
            <BackButton to="/provider/dashboard" className="text-gray-400 hover:text-white" />
            <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-white">Earnings & Payouts</h1>
                    <p className="text-gray-400 text-sm">Overview of your financial performance.</p>
                </div>
                <div className="bg-gray-800 px-4 py-2 rounded-lg border border-gray-700 text-sm text-gray-400">
                    <span className="text-primary-400 font-bold">Pro Tip: </span>
                    Complete more jobs to increase your tier!
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 p-6 rounded-2xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <DollarSign size={100} className="text-primary-500" />
                    </div>
                    <div className="relative z-10">
                        <p className="text-gray-400 font-medium text-sm uppercase tracking-wider">Total Earnings</p>
                        <h2 className="text-3xl font-bold text-white mt-1 mb-2">PKR {earnings.total.toLocaleString()}</h2>
                        <span className="text-green-400 text-xs font-bold bg-green-900/30 px-2 py-1 rounded inline-flex items-center gap-1">
                            <ArrowUpRight size={12} /> +100% Lifetime
                        </span>
                    </div>
                </div>

                <div className="bg-gray-800 border border-gray-700 p-6 rounded-2xl">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="w-10 h-10 rounded-full bg-blue-900/30 flex items-center justify-center text-blue-400">
                            <TrendingUp size={20} />
                        </div>
                        <div>
                            <p className="text-gray-400 text-sm font-medium">This Month</p>
                            <h3 className="text-xl font-bold text-white">PKR {earnings.thisMonth.toLocaleString()}</h3>
                        </div>
                    </div>
                    <div className="w-full bg-gray-700 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-blue-500 h-full rounded-full" style={{ width: '60%' }}></div>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">60% of monthly goal</p>
                </div>

                <div className="bg-gray-800 border border-gray-700 p-6 rounded-2xl">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="w-10 h-10 rounded-full bg-purple-900/30 flex items-center justify-center text-purple-400">
                            <CheckCircle size={20} />
                        </div>
                        <div>
                            <p className="text-gray-400 text-sm font-medium">Jobs Completed</p>
                            <h3 className="text-xl font-bold text-white">{earnings.completedJobs}</h3>
                        </div>
                    </div>
                    <div className="w-full bg-gray-700 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-purple-500 h-full rounded-full" style={{ width: '85%' }}></div>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">High completion rate!</p>
                </div>
            </div>

            {/* Transaction History */}
            <div className="bg-gray-800 border border-gray-700 rounded-2xl overflow-hidden">
                <div className="p-6 border-b border-gray-700 flex justify-between items-center">
                    <h3 className="font-bold text-white text-lg">Payment History</h3>
                    <button className="text-sm text-primary-400 hover:text-primary-300 transition-colors">Download Statement</button>
                </div>

                {history.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm text-gray-400">
                            <thead className="bg-gray-900/50 text-gray-300 uppercase font-bold text-xs">
                                <tr>
                                    <th className="px-6 py-4">Service</th>
                                    <th className="px-6 py-4">Date</th>
                                    <th className="px-6 py-4">Customer</th>
                                    <th className="px-6 py-4 text-right">Amount</th>
                                    <th className="px-6 py-4 text-center">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-700">
                                {history.map((job) => (
                                    <tr key={job._id} className="hover:bg-gray-700/30 transition-colors">
                                        <td className="px-6 py-4 font-medium text-white">{job.service?.name}</td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <Calendar size={14} className="text-gray-500" />
                                                {new Date(job.scheduledDate).toLocaleDateString()}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">{job.customer?.name}</td>
                                        <td className="px-6 py-4 text-right font-bold text-white">PKR {job.service?.price.toLocaleString()}</td>
                                        <td className="px-6 py-4 text-center">
                                            <span className="px-2 py-1 rounded-full text-xs font-bold bg-green-900/30 text-green-400 border border-green-500/20">
                                                Paid
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="text-center py-20">
                        <div className="bg-gray-700/30 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-500">
                            <DollarSign size={32} />
                        </div>
                        <h3 className="text-lg font-medium text-white">No earnings yet</h3>
                        <p className="text-gray-400 mt-2 max-w-sm mx-auto">
                            Complete your first booking to see your earnings history here.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProviderEarnings;
