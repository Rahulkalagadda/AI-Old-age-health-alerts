"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Heart, Activity, Bell, Users, BarChart3, Shield } from "lucide-react";
import { NavbarControls } from "@/components/common/NavbarControls";
import { useLanguage } from "@/contexts/LanguageContext";
import { motion } from "framer-motion";

export default function Home() {
  const { t } = useLanguage();

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 transition-colors duration-300">
      <div className="absolute top-4 right-4 z-50">
        <NavbarControls />
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16 pt-10"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            className="flex items-center justify-center gap-2 mb-4"
          >
            <Heart className="h-16 w-16 text-red-500 animate-pulse" />
          </motion.div>
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent dark:from-blue-400 dark:to-purple-400">
            {t("heroTitle")}
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8 dark:text-gray-400">
            {t("heroSubtitle")}
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/dashboard">
              <Button size="lg" className="gap-2 text-lg h-12 px-8 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1">
                <Users className="h-5 w-5" />
                {t("imSenior")}
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button size="lg" variant="outline" className="gap-2 text-lg h-12 px-8 shadow-sm hover:shadow-md transition-all hover:-translate-y-1 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm">
                <Shield className="h-5 w-5" />
                {t("imCaregiver")}
              </Button>
            </Link>
          </div>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto mb-12"
        >
          <motion.div variants={item}>
            <Card className="h-full hover:shadow-lg transition-shadow border-blue-100 dark:border-blue-900 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm">
              <CardHeader>
                <div className="h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mb-4">
                  <Activity className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <CardTitle>{t("realTimeMonitoring")}</CardTitle>
                <CardDescription>
                  {t("realTimeDesc")}
                </CardDescription>
              </CardHeader>
            </Card>
          </motion.div>

          <motion.div variants={item}>
            <Card className="h-full hover:shadow-lg transition-shadow border-red-100 dark:border-red-900 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm">
              <CardHeader>
                <div className="h-12 w-12 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mb-4">
                  <Bell className="h-6 w-6 text-red-600 dark:text-red-400" />
                </div>
                <CardTitle>{t("smartAlerts")}</CardTitle>
                <CardDescription>
                  {t("smartAlertsDesc")}
                </CardDescription>
              </CardHeader>
            </Card>
          </motion.div>

          <motion.div variants={item}>
            <Card className="h-full hover:shadow-lg transition-shadow border-green-100 dark:border-green-900 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm">
              <CardHeader>
                <div className="h-12 w-12 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mb-4">
                  <BarChart3 className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
                <CardTitle>{t("healthTrends")}</CardTitle>
                <CardDescription>
                  {t("healthTrendsDesc")}
                </CardDescription>
              </CardHeader>
            </Card>
          </motion.div>
        </motion.div>

        {/* How It Works */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto"
        >
          <h2 className="text-3xl font-bold text-center mb-12 dark:text-white">{t("howItWorks")}</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center relative">
              <div className="h-20 w-20 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mx-auto mb-4 shadow-inner">
                <span className="text-3xl font-bold text-blue-600 dark:text-blue-400">1</span>
              </div>
              <h3 className="font-semibold mb-2 text-lg dark:text-gray-200">{t("connectDevice")}</h3>
              <p className="text-sm text-muted-foreground dark:text-gray-400">
                {t("connectDeviceDesc")}
              </p>
            </div>
            <div className="text-center relative">
              <div className="h-20 w-20 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center mx-auto mb-4 shadow-inner">
                <span className="text-3xl font-bold text-purple-600 dark:text-purple-400">2</span>
              </div>
              <h3 className="font-semibold mb-2 text-lg dark:text-gray-200">{t("monitorRealTime")}</h3>
              <p className="text-sm text-muted-foreground dark:text-gray-400">
                {t("monitorRealTimeDesc")}
              </p>
            </div>
            <div className="text-center relative">
              <div className="h-20 w-20 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto mb-4 shadow-inner">
                <span className="text-3xl font-bold text-green-600 dark:text-green-400">3</span>
              </div>
              <h3 className="font-semibold mb-2 text-lg dark:text-gray-200">{t("getAIInsights")}</h3>
              <p className="text-sm text-muted-foreground dark:text-gray-400">
                {t("getAIInsightsDesc")}
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
