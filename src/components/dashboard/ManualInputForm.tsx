"use client";

import { useState } from "react";
import { useVitals } from "@/hooks/useVitals";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Plus } from "lucide-react";

export function ManualInputForm() {
    const { addManualReading } = useVitals();
    const [open, setOpen] = useState(false);
    const [values, setValues] = useState({
        systolic: "",
        diastolic: "",
        heartRate: "",
        spO2: "",
        temperature: "",
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const reading = {
            systolicBP: parseInt(values.systolic) || undefined,
            diastolicBP: parseInt(values.diastolic) || undefined,
            heartRate: parseInt(values.heartRate) || undefined,
            spO2: parseInt(values.spO2) || undefined,
            temperature: parseFloat(values.temperature) || undefined,
        };

        // Validate at least one value is provided
        if (!reading.systolicBP && !reading.heartRate && !reading.spO2 && !reading.temperature) {
            toast.error("Please enter at least one vital sign");
            return;
        }

        addManualReading(reading);
        toast.success("Vitals recorded successfully");

        // Reset form
        setValues({
            systolic: "",
            diastolic: "",
            heartRate: "",
            spO2: "",
            temperature: "",
        });
        setOpen(false);
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" className="gap-2">
                    <Plus className="h-4 w-4" />
                    Add Vitals
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Manual Vital Input</DialogTitle>
                    <DialogDescription>
                        Enter your vital signs manually. Leave empty fields for auto-fill.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="systolic">Systolic BP</Label>
                            <Input
                                id="systolic"
                                type="number"
                                placeholder="120"
                                value={values.systolic}
                                onChange={(e) => setValues({ ...values, systolic: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="diastolic">Diastolic BP</Label>
                            <Input
                                id="diastolic"
                                type="number"
                                placeholder="80"
                                value={values.diastolic}
                                onChange={(e) => setValues({ ...values, diastolic: e.target.value })}
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="heartRate">Heart Rate (bpm)</Label>
                        <Input
                            id="heartRate"
                            type="number"
                            placeholder="72"
                            value={values.heartRate}
                            onChange={(e) => setValues({ ...values, heartRate: e.target.value })}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="spO2">SpO2 (%)</Label>
                        <Input
                            id="spO2"
                            type="number"
                            placeholder="98"
                            min="0"
                            max="100"
                            value={values.spO2}
                            onChange={(e) => setValues({ ...values, spO2: e.target.value })}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="temperature">Temperature (°C)</Label>
                        <Input
                            id="temperature"
                            type="number"
                            step="0.1"
                            placeholder="36.6"
                            value={values.temperature}
                            onChange={(e) => setValues({ ...values, temperature: e.target.value })}
                        />
                    </div>
                    <div className="flex gap-2">
                        <Button type="submit" className="flex-1">Save Reading</Button>
                        <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                            Cancel
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
