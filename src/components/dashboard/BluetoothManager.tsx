"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Bluetooth, RefreshCw, Smartphone } from "lucide-react";
import { toast } from "sonner";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";

interface BluetoothManagerProps {
    isConnected: boolean;
    onConnect: () => void;
    onDisconnect: () => void;
}

export function BluetoothManager({ isConnected, onConnect, onDisconnect }: BluetoothManagerProps) {
    const [isConnecting, setIsConnecting] = useState(false);
    const [deviceName, setDeviceName] = useState<string | null>(null);

    const connectToDevice = async () => {
        setIsConnecting(true);
        try {
            if (!navigator.bluetooth) {
                throw new Error("Web Bluetooth is not supported in this browser.");
            }

            const device = await navigator.bluetooth.requestDevice({
                filters: [{ services: ["heart_rate"] }],
                optionalServices: ["battery_service"],
            });

            if (device) {
                const server = await device.gatt?.connect();
                setDeviceName(device.name || "Unknown Device");
                onConnect();
                toast.success(`Connected to ${device.name}`);
            }
        } catch (error: any) {
            console.error(error);
            if (error.name !== "NotFoundError") {
                toast.error("Failed to connect: " + error.message);
            }
        } finally {
            setIsConnecting(false);
        }
    };

    const simulateConnection = () => {
        setIsConnecting(true);
        setTimeout(() => {
            onConnect();
            setDeviceName("Simulated HealthBand X1");
            setIsConnecting(false);
            toast.success("Connected to Simulated Device");
        }, 1500);
    };

    const handleDisconnect = () => {
        onDisconnect();
        setDeviceName(null);
        toast.info("Device disconnected");
    };

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant={isConnected ? "default" : "outline"} className="gap-2">
                    <Bluetooth className={`h-4 w-4 ${isConnected ? "text-white" : "text-blue-500"}`} />
                    {isConnected ? deviceName : "Connect Device"}
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Device Connection</DialogTitle>
                    <DialogDescription>
                        Pair your health monitoring device via Bluetooth.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    {!isConnected ? (
                        <div className="flex flex-col gap-3">
                            <Button onClick={connectToDevice} disabled={isConnecting}>
                                {isConnecting ? (
                                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                                ) : (
                                    <Bluetooth className="mr-2 h-4 w-4" />
                                )}
                                Scan for Devices
                            </Button>
                            <div className="relative">
                                <div className="absolute inset-0 flex items-center">
                                    <span className="w-full border-t" />
                                </div>
                                <div className="relative flex justify-center text-xs uppercase">
                                    <span className="bg-background px-2 text-muted-foreground">
                                        Or
                                    </span>
                                </div>
                            </div>
                            <Button variant="secondary" onClick={simulateConnection} disabled={isConnecting}>
                                <Smartphone className="mr-2 h-4 w-4" />
                                Simulate Device (Demo)
                            </Button>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center gap-4 py-4">
                            <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center">
                                <Bluetooth className="h-8 w-8 text-green-600" />
                            </div>
                            <div className="text-center">
                                <h3 className="font-medium text-lg">{deviceName}</h3>
                                <p className="text-sm text-muted-foreground">Status: Connected & Syncing</p>
                            </div>
                            <Button variant="destructive" onClick={handleDisconnect} className="w-full">
                                Disconnect
                            </Button>
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}
