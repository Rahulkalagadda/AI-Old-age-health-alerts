"use client";

import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { ClientOnly } from "@/components/common/ClientOnly";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useVitals } from "@/hooks/useVitals";
import { toast } from "sonner";
import { Save, Download, Trash2 } from "lucide-react";

export default function SettingsPage() {
    const { thresholds, updateThresholds, exportData, history, disconnect } = useVitals();

    const [profile, setProfile] = useState({
        name: "",
        age: "",
        email: "",
        emergencyContact: "",
    });

    const [localThresholds, setLocalThresholds] = useState({
        heartRateMax: thresholds.heartRateMax,
        heartRateMin: thresholds.heartRateMin,
        bpSystolicMax: thresholds.bpSystolicMax,
        spO2Min: thresholds.spO2Min,
        tempMax: thresholds.tempMax,
        tempMin: thresholds.tempMin,
    });

    useEffect(() => {
        const savedProfile = localStorage.getItem("user_profile");
        if (savedProfile) {
            try {
                setProfile(JSON.parse(savedProfile));
            } catch (e) {
                console.error("Failed to load profile", e);
            }
        }
    }, []);

    useEffect(() => {
        setLocalThresholds({
            heartRateMax: thresholds.heartRateMax,
            heartRateMin: thresholds.heartRateMin,
            bpSystolicMax: thresholds.bpSystolicMax,
            spO2Min: thresholds.spO2Min,
            tempMax: thresholds.tempMax,
            tempMin: thresholds.tempMin,
        });
    }, [thresholds]);

    const handleSaveProfile = () => {
        localStorage.setItem("user_profile", JSON.stringify(profile));
        toast.success("Profile saved successfully");
    };

    const handleSaveThresholds = () => {
        updateThresholds(localThresholds);
        toast.success("Thresholds updated successfully");
    };

    const handleClearHistory = () => {
        if (confirm("Are you sure you want to clear all health data history?")) {
            disconnect();
            toast.success("History cleared");
        }
    };

    return (
        <DashboardLayout>
            <ClientOnly>
                <div className="space-y-6">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
                        <p className="text-muted-foreground">
                            Manage your profile and health monitoring preferences
                        </p>
                    </div>

                    <Card>
                        <CardHeader>
                            <CardTitle>Profile Information</CardTitle>
                            <CardDescription>Update your personal details</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid gap-2">
                                <Label htmlFor="name">Full Name</Label>
                                <Input
                                    id="name"
                                    value={profile.name}
                                    onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                                    placeholder="John Doe"
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="age">Age</Label>
                                <Input
                                    id="age"
                                    type="number"
                                    value={profile.age}
                                    onChange={(e) => setProfile({ ...profile, age: e.target.value })}
                                    placeholder="65"
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={profile.email}
                                    onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                                    placeholder="john@example.com"
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="emergency">Emergency Contact</Label>
                                <Input
                                    id="emergency"
                                    type="tel"
                                    value={profile.emergencyContact}
                                    onChange={(e) => setProfile({ ...profile, emergencyContact: e.target.value })}
                                    placeholder="+1 234 567 8900"
                                />
                            </div>
                            <Button onClick={handleSaveProfile} className="gap-2">
                                <Save className="h-4 w-4" />
                                Save Profile
                            </Button>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Health Alert Thresholds</CardTitle>
                            <CardDescription>
                                Configure when you want to receive health alerts
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="grid gap-2">
                                    <Label htmlFor="hr-max">Max Heart Rate (bpm)</Label>
                                    <Input
                                        id="hr-max"
                                        type="number"
                                        value={localThresholds.heartRateMax}
                                        onChange={(e) => setLocalThresholds({ ...localThresholds, heartRateMax: parseInt(e.target.value) })}
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="hr-min">Min Heart Rate (bpm)</Label>
                                    <Input
                                        id="hr-min"
                                        type="number"
                                        value={localThresholds.heartRateMin}
                                        onChange={(e) => setLocalThresholds({ ...localThresholds, heartRateMin: parseInt(e.target.value) })}
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="bp-max">Max Systolic BP (mmHg)</Label>
                                    <Input
                                        id="bp-max"
                                        type="number"
                                        value={localThresholds.bpSystolicMax}
                                        onChange={(e) => setLocalThresholds({ ...localThresholds, bpSystolicMax: parseInt(e.target.value) })}
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="spo2-min">Min SpO2 (%)</Label>
                                    <Input
                                        id="spo2-min"
                                        type="number"
                                        value={localThresholds.spO2Min}
                                        onChange={(e) => setLocalThresholds({ ...localThresholds, spO2Min: parseInt(e.target.value) })}
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="temp-max">Max Temperature (°C)</Label>
                                    <Input
                                        id="temp-max"
                                        type="number"
                                        step="0.1"
                                        value={localThresholds.tempMax}
                                        onChange={(e) => setLocalThresholds({ ...localThresholds, tempMax: parseFloat(e.target.value) })}
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="temp-min">Min Temperature (°C)</Label>
                                    <Input
                                        id="temp-min"
                                        type="number"
                                        step="0.1"
                                        value={localThresholds.tempMin}
                                        onChange={(e) => setLocalThresholds({ ...localThresholds, tempMin: parseFloat(e.target.value) })}
                                    />
                                </div>
                            </div>
                            <Button onClick={handleSaveThresholds} className="gap-2">
                                <Save className="h-4 w-4" />
                                Update Thresholds
                            </Button>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Data Management</CardTitle>
                            <CardDescription>Export or clear your health data</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex gap-4">
                                <Button onClick={exportData} variant="outline" className="gap-2" disabled={history.length === 0}>
                                    <Download className="h-4 w-4" />
                                    Export Data ({history.length} records)
                                </Button>
                                <Button onClick={handleClearHistory} variant="destructive" className="gap-2" disabled={history.length === 0}>
                                    <Trash2 className="h-4 w-4" />
                                    Clear History
                                </Button>
                            </div>
                            <p className="text-sm text-muted-foreground">
                                Export your health data as JSON for backup or analysis. Clear history will remove all stored vitals data permanently.
                            </p>
                        </CardContent>
                    </Card>
                </div>
            </ClientOnly>
        </DashboardLayout>
    );
}
