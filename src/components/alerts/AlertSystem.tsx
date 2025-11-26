"use client";

import { useEffect, useRef } from "react";
import { toast } from "sonner";
import { useVitals } from "@/hooks/useVitals";
import { analyzeVitals } from "@/lib/gemini";

export function AlertSystem() {
    const { vitals } = useVitals();
    const lastAlertTime = useRef<number>(0);

    useEffect(() => {
        const now = Date.now();
        // Prevent alert spam (10 seconds cooldown)
        if (now - lastAlertTime.current < 10000) return;

        const checkAndAlert = async () => {
            let critical = false;
            let message = "";

            if (vitals.heartRate.status === "critical") {
                critical = true;
                message = `CRITICAL: Heart Rate is ${vitals.heartRate.value} bpm!`;
            } else if (vitals.spO2.status === "critical") {
                critical = true;
                message = `CRITICAL: SpO2 is low (${vitals.spO2.value}%)!`;
            }

            if (critical) {
                lastAlertTime.current = now;

                // Trigger basic alert immediately
                toast.error(message, {
                    duration: 10000,
                    action: {
                        label: "Call SOS",
                        onClick: () => console.log("SOS Triggered"),
                    },
                });

                // Trigger AI Analysis
                toast.promise(analyzeVitals(vitals), {
                    loading: "AI is analyzing health risks...",
                    success: (data) => `AI Insight: ${data}`,
                    error: "AI Analysis failed",
                });
            }
        };

        checkAndAlert();
    }, [vitals]);

    return null;
}
