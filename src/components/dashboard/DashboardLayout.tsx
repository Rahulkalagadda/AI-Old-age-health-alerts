"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Activity, History, Settings, LayoutDashboard, LogOut } from "lucide-react";
import { NavbarControls } from "@/components/common/NavbarControls";

interface DashboardLayoutProps {
    children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
    const pathname = usePathname();

    const navigation = [
        { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
        { name: "History", href: "/history", icon: History },
        { name: "Settings", href: "/settings", icon: Settings },
    ];

    return (
        <div className="min-h-screen bg-background transition-colors duration-300">
            {/* Sidebar */}
            <div className="hidden md:fixed md:inset-y-0 md:flex md:w-64 md:flex-col">
                <div className="flex min-h-0 flex-1 flex-col border-r bg-card">
                    <div className="flex h-16 flex-shrink-0 items-center px-4 border-b">
                        <Activity className="h-8 w-8 text-primary" />
                        <span className="ml-2 text-xl font-bold">SeniorHealth</span>
                    </div>
                    <div className="flex flex-1 flex-col overflow-y-auto pt-5 pb-4">
                        <nav className="mt-5 flex-1 space-y-1 px-2">
                            {navigation.map((item) => {
                                const isActive = pathname === item.href;
                                return (
                                    <Link
                                        key={item.name}
                                        href={item.href}
                                        className={cn(
                                            isActive
                                                ? "bg-primary/10 text-primary"
                                                : "text-muted-foreground hover:bg-muted hover:text-foreground",
                                            "group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors"
                                        )}
                                    >
                                        <item.icon
                                            className={cn(
                                                isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground",
                                                "mr-3 flex-shrink-0 h-6 w-6 transition-colors"
                                            )}
                                            aria-hidden="true"
                                        />
                                        {item.name}
                                    </Link>
                                );
                            })}
                        </nav>
                    </div>
                    <div className="flex flex-shrink-0 border-t p-4">
                        <Link href="/" className="w-full">
                            <Button variant="ghost" className="w-full justify-start text-muted-foreground hover:text-foreground">
                                <LogOut className="mr-3 h-5 w-5" />
                                Exit Dashboard
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>

            {/* Main content */}
            <div className="flex flex-1 flex-col md:pl-64">
                <div className="sticky top-0 z-10 flex h-16 flex-shrink-0 bg-background border-b shadow-sm md:hidden">
                    <div className="flex flex-1 justify-between px-4">
                        <div className="flex flex-1">
                            <div className="flex items-center md:hidden">
                                <Activity className="h-8 w-8 text-primary" />
                                <span className="ml-2 text-xl font-bold">SeniorHealth</span>
                            </div>
                        </div>
                        <div className="flex items-center">
                            <NavbarControls />
                        </div>
                    </div>
                </div>

                <main className="flex-1">
                    <div className="py-6">
                        <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
                            <div className="hidden md:flex justify-end mb-4">
                                <NavbarControls />
                            </div>
                            {children}
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}
