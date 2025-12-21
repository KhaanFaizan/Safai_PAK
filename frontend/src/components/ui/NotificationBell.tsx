import { useContext, useState, useRef, useEffect } from 'react';
import { Bell, Check, Info, Calendar, Shield, CreditCard } from 'lucide-react';
import { NotificationContext } from '../../context/NotificationContext';
import { Link } from 'react-router-dom';

const NotificationBell = () => {
    const { notifications, unreadCount, markAsRead, markAllAsRead } = useContext(NotificationContext)!;
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [dropdownRef]);

    const getIcon = (type: string) => {
        switch (type) {
            case 'booking_create': return <Calendar className="text-blue-500" size={18} />;
            case 'booking_accept': return <Check className="text-green-500" size={18} />;
            case 'booking_cancel': return <Info className="text-red-500" size={18} />;
            case 'verification': return <Shield className="text-purple-500" size={18} />;
            default: return <Info className="text-gray-500" size={18} />;
        }
    };

    const getLink = (notification: any) => {
        if (!notification.relatedId) return '#';
        if (notification.type.includes('booking')) return `/bookings`; // Or specific booking detail
        if (notification.type === 'verification') return '/provider/dashboard';
        return '#';
    };

    const handleRead = async (id: string) => {
        await markAsRead(id);
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative p-2 text-gray-400 hover:text-white transition-colors rounded-full hover:bg-gray-700/50"
            >
                <Bell size={20} />
                {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-gray-900">
                        {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                )}
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-80 md:w-96 bg-gray-800 rounded-xl shadow-xl border border-gray-700 overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-200">
                    <div className="flex items-center justify-between p-4 border-b border-gray-700 bg-gray-800/50">
                        <h3 className="font-semibold text-white">Notifications</h3>
                        {unreadCount > 0 && (
                            <button
                                onClick={() => markAllAsRead()}
                                className="text-xs text-primary-400 hover:text-primary-300 font-medium"
                            >
                                Mark all as read
                            </button>
                        )}
                    </div>

                    <div className="max-h-[70vh] overflow-y-auto">
                        {notifications.length > 0 ? (
                            notifications.map((notification) => (
                                <div
                                    key={notification._id}
                                    className={`p-4 border-b border-gray-700/50 hover:bg-gray-700/30 transition-colors relative group ${!notification.isRead ? 'bg-gray-700/10' : ''
                                        }`}
                                >
                                    <Link to={getLink(notification)} onClick={() => { handleRead(notification._id); setIsOpen(false); }} className="flex gap-3">
                                        <div className={`mt-1 p-2 rounded-full h-fit shrink-0 ${!notification.isRead ? 'bg-gray-700' : 'bg-gray-800'}`}>
                                            {getIcon(notification.type)}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex justify-between items-start gap-2">
                                                <p className={`text-sm font-medium truncate ${!notification.isRead ? 'text-white' : 'text-gray-300'}`}>
                                                    {notification.title}
                                                </p>
                                                {!notification.isRead && (
                                                    <span className="w-2 h-2 bg-primary-500 rounded-full shrink-0 mt-1.5" />
                                                )}
                                            </div>
                                            <p className="text-xs text-gray-400 mt-0.5 line-clamp-2">
                                                {notification.message}
                                            </p>
                                            <p className="text-[10px] text-gray-500 mt-2">
                                                {new Date(notification.createdAt).toLocaleDateString()} • {new Date(notification.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </p>
                                        </div>
                                    </Link>
                                </div>
                            ))
                        ) : (
                            <div className="p-8 text-center text-gray-500">
                                <Bell size={32} className="mx-auto mb-3 opacity-20" />
                                <p className="text-sm">No notifications yet</p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default NotificationBell;
