"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

type Language = "en" | "hi";

interface Translations {
    [key: string]: {
        en: string;
        hi: string;
    };
}

export const translations: Translations = {
    // Landing Page
    heroTitle: {
        en: "Senior Health Monitoring System",
        hi: "वरिष्ठ स्वास्थ्य निगरानी प्रणाली",
    },
    heroSubtitle: {
        en: "Real-time health monitoring and predictive care for senior citizens, powered by AI",
        hi: "एआई द्वारा संचालित वरिष्ठ नागरिकों के लिए वास्तविक समय स्वास्थ्य निगरानी और पूर्वानुमानित देखभाल",
    },
    imSenior: {
        en: "I'm a Senior",
        hi: "मैं एक वरिष्ठ हूँ",
    },
    imCaregiver: {
        en: "I'm a Caregiver",
        hi: "मैं एक देखभालकर्ता हूँ",
    },
    realTimeMonitoring: {
        en: "Real-Time Monitoring",
        hi: "वास्तविक समय निगरानी",
    },
    realTimeDesc: {
        en: "Track vital signs including heart rate, blood pressure, SpO2, and temperature",
        hi: "हृदय गति, रक्तचाप, SpO2 और तापमान सहित महत्वपूर्ण संकेतों को ट्रैक करें",
    },
    smartAlerts: {
        en: "Smart Alerts",
        hi: "स्मार्ट अलर्ट",
    },
    smartAlertsDesc: {
        en: "AI-powered predictive health alerts and emergency notifications",
        hi: "एआई-संचालित पूर्वानुमानित स्वास्थ्य अलर्ट और आपातकालीन सूचनाएं",
    },
    healthTrends: {
        en: "Health Trends",
        hi: "स्वास्थ्य रुझान",
    },
    healthTrendsDesc: {
        en: "Visualize health data trends and patterns over time",
        hi: "समय के साथ स्वास्थ्य डेटा रुझानों और पैटर्न की कल्पना करें",
    },
    howItWorks: {
        en: "How It Works",
        hi: "यह कैसे काम करता है",
    },
    connectDevice: {
        en: "Connect Device",
        hi: "डिवाइस कनेक्ट करें",
    },
    connectDeviceDesc: {
        en: "Connect your health monitoring device via Bluetooth or enter vitals manually",
        hi: "ब्लूटूथ के माध्यम से अपने स्वास्थ्य निगरानी उपकरण को कनेक्ट करें या मैन्युअल रूप से विटाल दर्ज करें",
    },
    monitorRealTime: {
        en: "Monitor in Real-Time",
        hi: "वास्तविक समय में निगरानी करें",
    },
    monitorRealTimeDesc: {
        en: "View live updates of your vital signs on an intuitive dashboard",
        hi: "एक सहज डैशबोर्ड पर अपने महत्वपूर्ण संकेतों के लाइव अपडेट देखें",
    },
    getAIInsights: {
        en: "Get AI Insights",
        hi: "एआई अंतर्दृष्टि प्राप्त करें",
    },
    getAIInsightsDesc: {
        en: "Receive intelligent health recommendations and emergency alerts",
        hi: "बुद्धिमान स्वास्थ्य सिफारिशें और आपातकालीन अलर्ट प्राप्त करें",
    },

    // Dashboard
    dashboardTitle: {
        en: "Health Dashboard",
        hi: "स्वास्थ्य डैशबोर्ड",
    },
    dashboardSubtitle: {
        en: "Real-time monitoring of your vital signs",
        hi: "आपके महत्वपूर्ण संकेतों की वास्तविक समय निगरानी",
    },
    sosWhatsapp: {
        en: "SOS WhatsApp",
        hi: "एसओएस व्हाट्सएप",
    },
    addVitals: {
        en: "Add Vitals",
        hi: "विटाल जोड़ें",
    },
    heartRate: {
        en: "Heart Rate",
        hi: "हृदय गति",
    },
    bloodPressure: {
        en: "Blood Pressure",
        hi: "रक्तचाप",
    },
    temperature: {
        en: "Temperature",
        hi: "तापमान",
    },

    // Settings
    settings: {
        en: "Settings",
        hi: "सेटिंग्स",
    },
    profile: {
        en: "Profile",
        hi: "प्रोफ़ाइल",
    },
    thresholds: {
        en: "Thresholds",
        hi: "सीमाएँ",
    },
    history: {
        en: "History",
        hi: "इतिहास",
    },
};

interface LanguageContextType {
    language: Language;
    setLanguage: (lang: Language) => void;
    t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
    const [language, setLanguage] = useState<Language>("en");

    const t = (key: string) => {
        return translations[key]?.[language] || key;
    };

    return (
        <LanguageContext.Provider value={{ language, setLanguage, t }}>
            {children}
        </LanguageContext.Provider>
    );
}

export function useLanguage() {
    const context = useContext(LanguageContext);
    if (context === undefined) {
        throw new Error("useLanguage must be used within a LanguageProvider");
    }
    return context;
}
