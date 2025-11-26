"use client";

import { useState } from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { ClientOnly } from "@/components/common/ClientOnly";
import { useVitals } from "@/hooks/useVitals";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Download, Search, TrendingUp, TrendingDown, Activity } from "lucide-react";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

export default function HistoryPage() {
    const { history, exportData } = useVitals();
    const [searchFilter, setSearchFilter] = useState("");
    const [dateFilter, setDateFilter] = useState("");

    // Filter history based on search
    const filteredHistory = history.filter((entry) => {
        const matchesSearch = searchFilter
            ? entry.time.toLowerCase().includes(searchFilter.toLowerCase())
            : true;
        return matchesSearch;
    });

    // Calculate statistics
    const stats = {
        avgHeartRate: history.length
            ? (history.reduce((sum, h) => sum + h.heartRate, 0) / history.length).toFixed(1)
            : "0",
        avgSpO2: history.length
            ? (history.reduce((sum, h) => sum + h.spO2, 0) / history.length).toFixed(1)
            : "0",
        avgSystolic: history.length
            ? (history.reduce((sum, h) => sum + h.systolicBP, 0) / history.length).toFixed(1)
            : "0",
        totalReadings: history.length,
    };

    // Get last 20 readings for mini charts
    const recentData = history.slice(-20);

    return (
        <DashboardLayout>
            <ClientOnly>
                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight">Health History</h1>
                            <p className="text-muted-foreground">
                                Comprehensive view of your vital sign readings and trends
                            </p>
                        </div>
                        <Button onClick={exportData} disabled={history.length === 0} className="gap-2">
                            <Download className="h-4 w-4" />
                            Export Data
                        </Button>
                    </div>

                    {/* Statistics Cards */}
                    <div className="grid gap-4 md:grid-cols-4">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Avg Heart Rate</CardTitle>
                                <Activity className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{stats.avgHeartRate} bpm</div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Avg SpO2</CardTitle>
                                <TrendingUp className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{stats.avgSpO2}%</div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Avg Systolic BP</CardTitle>
                                <TrendingDown className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{stats.avgSystolic} mmHg</div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Total Readings</CardTitle>
                                <Activity className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{stats.totalReadings}</div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Mini Trend Charts */}
                    <div className="grid gap-4 md:grid-cols-2">
                        <Card>
                            <CardHeader>
                                <CardTitle>Heart Rate Trend</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ResponsiveContainer width="100%" height={200}>
                                    <LineChart data={recentData}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="time" fontSize={10} />
                                        <YAxis fontSize={10} />
                                        <Tooltip />
                                        <Line type="monotone" dataKey="heartRate" stroke="#ef4444" strokeWidth={2} />
                                    </LineChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader>
                                <CardTitle>SpO2 Trend</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ResponsiveContainer width="100%" height={200}>
                                    <LineChart data={recentData}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="time" fontSize={10} />
                                        <YAxis fontSize={10} domain={[90, 100]} />
                                        <Tooltip />
                                        <Line type="monotone" dataKey="spO2" stroke="#3b82f6" strokeWidth={2} />
                                    </LineChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Search and Filter */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Reading History</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="mb-4">
                                <div className="relative">
                                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        placeholder="Search by time..."
                                        value={searchFilter}
                                        onChange={(e) => setSearchFilter(e.target.value)}
                                        className="pl-10"
                                    />
                                </div>
                            </div>

                            {filteredHistory.length === 0 ? (
                                <div className="text-center py-12 text-muted-foreground">
                                    <p>No history available yet.</p>
                                    <p className="text-sm mt-2">Connect a device or add manual readings to see data here.</p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    <div className="overflow-x-auto">
                                        <table className="w-full">
                                            <thead>
                                                <tr className="border-b">
                                                    <th className="text-left p-2 font-medium">Time</th>
                                                    <th className="text-left p-2 font-medium">Heart Rate</th>
                                                    <th className="text-left p-2 font-medium">Blood Pressure</th>
                                                    <th className="text-left p-2 font-medium">SpO2</th>
                                                    <th className="text-left p-2 font-medium">Temperature</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {filteredHistory.slice().reverse().map((entry, index) => (
                                                    <tr key={index} className="border-b hover:bg-muted/50 transition-colors">
                                                        <td className="p-2 text-sm">{entry.time}</td>
                                                        <td className="p-2 text-sm">
                                                            <span className={entry.heartRate > 100 || entry.heartRate < 60 ? "text-yellow-600 font-semibold" : ""}>
                                                                {entry.heartRate} bpm
                                                            </span>
                                                        </td>
                                                        <td className="p-2 text-sm">
                                                            <span className={entry.systolicBP > 140 ? "text-yellow-600 font-semibold" : ""}>
                                                                {entry.systolicBP}/{entry.diastolicBP} mmHg
                                                            </span>
                                                        </td>
                                                        <td className="p-2 text-sm">
                                                            <span className={entry.spO2 < 95 ? "text-yellow-600 font-semibold" : ""}>
                                                                {entry.spO2}%
                                                            </span>
                                                        </td>
                                                        <td className="p-2 text-sm">
                                                            {entry.temperature?.toFixed(1) || "N/A"}°C
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                    <div className="text-sm text-muted-foreground text-right">
                                        Showing {filteredHistory.length} of {history.length} readings
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </ClientOnly>
        </DashboardLayout>
    );
}
