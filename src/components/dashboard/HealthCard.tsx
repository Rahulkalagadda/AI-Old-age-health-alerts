"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface HealthCardProps {
    title: string;
    value: string | number;
    unit: string;
    icon: LucideIcon;
    status: "normal" | "warning" | "critical";
    trend?: "up" | "down" | "stable";
}

export function HealthCard({
    title,
    value,
    unit,
    icon: Icon,
    status,
    trend,
}: HealthCardProps) {
    const statusColor = {
        normal: "text-green-500",
        warning: "text-yellow-500",
        critical: "text-red-500",
    };

    const borderColor = {
        normal: "border-green-200",
        warning: "border-yellow-200",
        critical: "border-red-200",
    };

    return (
        <Card className={cn("transition-all hover:shadow-md", borderColor[status])}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{title}</CardTitle>
                <Icon className={cn("h-4 w-4", statusColor[status])} />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">
                    {value} <span className="text-sm text-muted-foreground">{unit}</span>
                </div>
                {trend && (
                    <p className="text-xs text-muted-foreground mt-1">
                        Trend: {trend === "up" ? "↑" : trend === "down" ? "↓" : "→"}
                    </p>
                )}
            </CardContent>
        </Card>
    );
}
