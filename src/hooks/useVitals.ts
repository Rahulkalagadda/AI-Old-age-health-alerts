"use client";

import { useState, useEffect } from "react";

export interface VitalSign {
    name: string;
    value: number;
    unit: string;
    status: "normal" | "warning" | "critical";
    trend?: "up" | "down" | "stable";
}

export interface VitalsHistory {
    time: string;
    timestamp: number;
    heartRate: number;
    systolicBP: number;
    diastolicBP: number;
    spO2: number;
    temperature: number;
}

interface VitalsState {
    heartRate: VitalSign;
    bp: { systolic: number; diastolic: number; status: "normal" | "warning" | "critical" };
    spO2: VitalSign;
    temperature: VitalSign;
}

interface Thresholds {
    heartRateMax: number;
    heartRateMin: number;
    bpSystolicMax: number;
    spO2Min: number;
    tempMax: number;
    tempMin: number;
}

const DEFAULT_THRESHOLDS: Thresholds = {
    heartRateMax: 100,
    heartRateMin: 60,
    bpSystolicMax: 140,
    spO2Min: 95,
    tempMax: 37.5,
    tempMin: 36.0,
};

export function useVitals() {
    const [vitals, setVitals] = useState<VitalsState>({
        heartRate: { name: "Heart Rate", value: 72, unit: "bpm", status: "normal", trend: "stable" },
        bp: { systolic: 120, diastolic: 80, status: "normal" },
        spO2: { name: "SpO2", value: 98, unit: "%", status: "normal", trend: "stable" },
        temperature: { name: "Temperature", value: 36.6, unit: "°C", status: "normal", trend: "stable" },
    });

    const [isConnected, setIsConnected] = useState(false);
    const [history, setHistory] = useState<VitalsHistory[]>([]);
    const [thresholds, setThresholds] = useState<Thresholds>(DEFAULT_THRESHOLDS);

    // Load history and thresholds from localStorage on mount
    useEffect(() => {
        const savedHistory = localStorage.getItem("vitals_history");
        const savedThresholds = localStorage.getItem("vitals_thresholds");

        if (savedHistory) {
            try {
                setHistory(JSON.parse(savedHistory));
            } catch (e) {
                console.error("Failed to load history", e);
            }
        }

        if (savedThresholds) {
            try {
                setThresholds(JSON.parse(savedThresholds));
            } catch (e) {
                console.error("Failed to load thresholds", e);
            }
        }
    }, []);

    // Save history to localStorage whenever it changes
    useEffect(() => {
        if (history.length > 0) {
            localStorage.setItem("vitals_history", JSON.stringify(history));
        }
    }, [history]);

    const connect = () => setIsConnected(true);
    const disconnect = () => {
        setIsConnected(false);
        setHistory([]); // Clear history on disconnect
        localStorage.removeItem("vitals_history");
    };

    const updateThresholds = (newThresholds: Partial<Thresholds>) => {
        const updated = { ...thresholds, ...newThresholds };
        setThresholds(updated);
        localStorage.setItem("vitals_thresholds", JSON.stringify(updated));
    };

    const checkVitalStatus = (value: number, min: number, max: number): "normal" | "warning" | "critical" => {
        if (value < min * 0.85 || value > max * 1.15) return "critical";
        if (value < min || value > max) return "warning";
        return "normal";
    };

    const addManualReading = (reading: Partial<VitalsHistory>) => {
        const now = new Date();
        const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });

        const newEntry: VitalsHistory = {
            time: timeStr,
            timestamp: now.getTime(),
            heartRate: reading.heartRate || vitals.heartRate.value,
            systolicBP: reading.systolicBP || vitals.bp.systolic,
            diastolicBP: reading.diastolicBP || vitals.bp.diastolic,
            spO2: reading.spO2 || vitals.spO2.value,
            temperature: reading.temperature || vitals.temperature.value,
        };

        // Update current vitals
        setVitals({
            heartRate: {
                ...vitals.heartRate,
                value: newEntry.heartRate,
                status: checkVitalStatus(newEntry.heartRate, thresholds.heartRateMin, thresholds.heartRateMax),
            },
            bp: {
                systolic: newEntry.systolicBP,
                diastolic: newEntry.diastolicBP,
                status: checkVitalStatus(newEntry.systolicBP, 90, thresholds.bpSystolicMax),
            },
            spO2: {
                ...vitals.spO2,
                value: newEntry.spO2,
                status: newEntry.spO2 < thresholds.spO2Min ? "warning" : "normal",
            },
            temperature: {
                ...vitals.temperature,
                value: newEntry.temperature,
                status: checkVitalStatus(newEntry.temperature, thresholds.tempMin, thresholds.tempMax),
            },
        });

        // Add to history
        setHistory((prev) => {
            const newHistory = [...prev, newEntry];
            if (newHistory.length > 100) newHistory.shift();
            return newHistory;
        });
    };

    // Simulation effect
    useEffect(() => {
        if (!isConnected) return;

        const interval = setInterval(() => {
            const now = new Date();
            const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });

            // Simulate realistic fluctuations
            const newHeartRate = Math.floor(65 + Math.random() * 30);
            const newSystolic = Math.floor(115 + Math.random() * 25);
            const newDiastolic = Math.floor(75 + Math.random() * 15);
            const newSpO2 = Math.floor(96 + Math.random() * 4);
            const newTemp = parseFloat((36.4 + Math.random() * 0.6).toFixed(1));

            setVitals((prev) => ({
                heartRate: {
                    ...prev.heartRate,
                    value: newHeartRate,
                    status: checkVitalStatus(newHeartRate, thresholds.heartRateMin, thresholds.heartRateMax),
                    trend: newHeartRate > prev.heartRate.value ? "up" : newHeartRate < prev.heartRate.value ? "down" : "stable",
                },
                bp: {
                    systolic: newSystolic,
                    diastolic: newDiastolic,
                    status: checkVitalStatus(newSystolic, 90, thresholds.bpSystolicMax),
                },
                spO2: {
                    ...prev.spO2,
                    value: newSpO2,
                    status: newSpO2 < thresholds.spO2Min ? "warning" : "normal",
                    trend: newSpO2 > prev.spO2.value ? "up" : newSpO2 < prev.spO2.value ? "down" : "stable",
                },
                temperature: {
                    ...prev.temperature,
                    value: newTemp,
                    status: checkVitalStatus(newTemp, thresholds.tempMin, thresholds.tempMax),
                    trend: newTemp > prev.temperature.value ? "up" : newTemp < prev.temperature.value ? "down" : "stable",
                },
            }));

            setHistory((prev) => {
                const newEntry: VitalsHistory = {
                    time: timeStr,
                    timestamp: now.getTime(),
                    heartRate: newHeartRate,
                    systolicBP: newSystolic,
                    diastolicBP: newDiastolic,
                    spO2: newSpO2,
                    temperature: newTemp,
                };
                const newHistory = [...prev, newEntry];
                if (newHistory.length > 100) newHistory.shift();
                return newHistory;
            });
        }, 3000);

        return () => clearInterval(interval);
    }, [isConnected, thresholds]);

    const exportData = () => {
        const dataStr = JSON.stringify(history, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `health-data-${new Date().toISOString()}.json`;
        link.click();
        URL.revokeObjectURL(url);
    };

    return {
        vitals,
        history,
        isConnected,
        thresholds,
        connect,
        disconnect,
        addManualReading,
        updateThresholds,
        exportData,
    };
}
