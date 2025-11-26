"use client";

import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { ClientOnly } from "@/components/common/ClientOnly";
import { HealthCard } from "@/components/dashboard/HealthCard";
import { VitalsChart } from "@/components/dashboard/VitalsChart";
import { BluetoothManager } from "@/components/dashboard/BluetoothManager";
import { ManualInputForm } from "@/components/dashboard/ManualInputForm";
import { AlertSystem } from "@/components/alerts/AlertSystem";
import { HealthChatbot } from "@/components/chat/HealthChatbot";
import { useVitals } from "@/hooks/useVitals";
import { Activity, Droplets, Heart, MessageCircleMore, Thermometer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useLanguage } from "@/contexts/LanguageContext";

export default function DashboardPage() {
    const { vitals, history, isConnected, connect, disconnect } = useVitals();
    const { t } = useLanguage();

    const sendWhatsAppAlert = () => {
        const profile = JSON.parse(localStorage.getItem("user_profile") || "{}");
        const emergencyContact = profile.emergencyContact;

        if (!emergencyContact) {
            toast.error("Please add an emergency contact in Settings");
            return;
        }

        const send = (locationUrl: string = "") => {
            const message = `🚨 HEALTH ALERT 🚨%0A%0AHeart Rate: ${vitals.heartRate.value} bpm%0ABlood Pressure: ${vitals.bp.systolic}/${vitals.bp.diastolic} mmHg%0ASpO2: ${vitals.spO2.value}%%0ATemperature: ${vitals.temperature.value}°C%0A%0APlease check on the patient immediately.${locationUrl ? `%0A%0ALocation: ${locationUrl}` : ""}`;
            const whatsappUrl = `https://wa.me/${emergencyContact.replace(/[^0-9]/g, '')}?text=${message}`;
            window.open(whatsappUrl, '_blank');
            toast.success("WhatsApp alert sent");
        };

        if (navigator.geolocation) {
            toast("Acquiring location...");
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    const mapsUrl = `https://www.google.com/maps?q=${latitude},${longitude}`;
                    send(mapsUrl);
                },
                (error) => {
                    console.error("Location error:", error);
                    send();
                }
            );
        } else {
            send();
        }
    };

    return (
        <DashboardLayout>
            <ClientOnly>
                <div className="space-y-6">
                    {/* Header with Actions */}
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight">{t("dashboardTitle")}</h1>
                            <p className="text-muted-foreground">
                                {t("dashboardSubtitle")}
                            </p>
                        </div>
                        <div className="flex gap-2">
                            <Button
                                variant="destructive"
                                onClick={sendWhatsAppAlert}
                                className="gap-2"
                                disabled={!isConnected}
                            >
                                <MessageCircleMore className="h-4 w-4" />
                                {t("sosWhatsapp")}
                            </Button>
                            <ManualInputForm />
                            <BluetoothManager
                                isConnected={isConnected}
                                onConnect={connect}
                                onDisconnect={disconnect}
                            />
                        </div>
                    </div>

                    {/* Alert System */}
                    <AlertSystem />

                    {/* Vitals Cards Grid */}
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                        <HealthCard
                            title={t("heartRate")}
                            value={isConnected ? vitals.heartRate.value : "--"}
                            unit="bpm"
                            status={vitals.heartRate.status}
                            trend={vitals.heartRate.trend}
                            icon={Heart}
                        />
                        <HealthCard
                            title={t("bloodPressure")}
                            value={isConnected ? `${vitals.bp.systolic}/${vitals.bp.diastolic}` : "--"}
                            unit="mmHg"
                            status={vitals.bp.status}
                            icon={Activity}
                        />
                        <HealthCard
                            title="SpO2"
                            value={isConnected ? vitals.spO2.value : "--"}
                            unit="%"
                            status={vitals.spO2.status}
                            trend={vitals.spO2.trend}
                            icon={Droplets}
                        />
                        <HealthCard
                            title={t("temperature")}
                            value={isConnected ? vitals.temperature.value : "--"}
                            unit="°C"
                            status={vitals.temperature.status}
                            trend={vitals.temperature.trend}
                            icon={Thermometer}
                        />
                    </div>

                    {/* Charts Grid */}
                    <div className="grid gap-6 md:grid-cols-2">
                        <div className="h-[500px]">
                            <VitalsChart
                                title={`${t("heartRate")} Trends`}
                                data={history}
                                dataKeys={[
                                    { key: "heartRate", name: t("heartRate"), color: "#ef4444" },
                                ]}
                            />
                        </div>
                        <div className="h-[500px]">
                            <VitalsChart
                                title={`${t("bloodPressure")} Trends`}
                                data={history}
                                dataKeys={[
                                    { key: "systolicBP", name: "Systolic", color: "#3b82f6" },
                                    { key: "diastolicBP", name: "Diastolic", color: "#10b981" },
                                ]}
                            />
                        </div>
                    </div>
                </div>

                {/* Floating Chatbot */}
                <HealthChatbot />
            </ClientOnly>
        </DashboardLayout>
    );
}
