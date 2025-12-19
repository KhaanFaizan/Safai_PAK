import { createContext, useContext, useState, type ReactNode } from 'react';

type Language = 'en' | 'ur';

interface LanguageContextType {
    language: Language;
    toggleLanguage: () => void;
    t: (key: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
    en: {
        login: "Login",
        register: "Register",
        email: "Email",
        password: "Password",
        name: "Name",
        phone: "Mobile Number",
        address: "Address",
        bookNow: "Book Now",
        services: "Services",
        dashboard: "Dashboard",
        myBookings: "My Bookings",
        logout: "Logout",
        welcome: "Welcome",
        search: "Search Services...",
        filter: "Filter",
        price: "Price",
        duration: "Duration",
        description: "Description",
        confirm: "Confirm",
        cancel: "Cancel",
        status: "Status",
        pending: "Pending",
        accepted: "Accepted",
        completed: "Completed",
        cancelled: "Cancelled",
        noBookings: "No bookings found.",
        loading: "Loading...",
        error: "An error occurred.",
        success: "Success!",
        slogan: "Connecting you with trusted local service providers.",
        heroTitle: "Premium Home Services",
        heroSubtitle: "Book expert pest control, cleaning, and more in seconds.",
    },
    ur: {
        login: "لاگ ان کریں",
        register: "رجسٹر کریں",
        email: "ای میل",
        password: "پاس ورڈ",
        name: "نام",
        phone: "موبائل نمبر",
        address: "پتہ",
        bookNow: "ابھی بک کریں",
        services: "خدمات",
        dashboard: "ڈیش بورڈ",
        myBookings: "میری بکنگ",
        logout: "لاگ آؤٹ",
        welcome: "خوش آمدید",
        search: "خدمات تلاش کریں...",
        filter: "فلٹر",
        price: "قیمت",
        duration: "دورانیہ",
        description: "تفصیل",
        confirm: "تصدیق کریں",
        cancel: "منسوخ کریں",
        status: "حیثیت",
        pending: "زیر التواء",
        accepted: "قبول شدہ",
        completed: "مکمل",
        cancelled: "منسوخ شدہ",
        noBookings: "کوئی بکنگ نہیں ملی۔",
        loading: "لوڈ ہو رہا ہے...",
        error: "کوئی مسئلہ پیش آیا۔",
        success: "کامیابی!",
        slogan: "آپ کو قابل اعتماد مقامی سروس فراہم کنندگان سے جوڑنا۔",
        heroTitle: "پریمیم ہوم سروسز",
        heroSubtitle: "ماہر کیڑوں کے کنٹرول، صفائی، اور مزید سیکنڈوں میں بُک کریں۔",
    }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
    const [language, setLanguage] = useState<Language>('en');

    const toggleLanguage = () => {
        setLanguage((prev) => (prev === 'en' ? 'ur' : 'en'));
    };

    const t = (key: string) => {
        return translations[language][key] || key;
    };

    return (
        <LanguageContext.Provider value={{ language, toggleLanguage, t }}>
            <div dir={language === 'ur' ? 'rtl' : 'ltr'} className={language === 'ur' ? 'font-urdu' : 'font-sans'}>
                {children}
            </div>
        </LanguageContext.Provider>
    );
};

export const useLanguage = () => {
    const context = useContext(LanguageContext);
    if (!context) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
};
