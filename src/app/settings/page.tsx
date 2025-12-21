"use client";

import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { User, Bell, Shield, Moon, LogOut, ChevronRight } from "lucide-react";

export default function SettingsPage() {
    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <h1 className="text-3xl font-bold text-text-primary tracking-tight">Settings</h1>

            {/* Account Section */}
            <section className="space-y-4">
                <h2 className="text-sm font-bold text-text-secondary uppercase tracking-wider px-1">Account</h2>
                <Card className="p-0 overflow-hidden divide-y divide-border">
                    <button className="w-full flex items-center gap-4 p-4 hover:bg-slate-50 transition-colors text-left">
                        <div className="p-2.5 bg-blue-100 rounded-lg text-blue-600">
                            <User className="h-5 w-5" />
                        </div>
                        <div className="flex-1">
                            <p className="font-medium text-text-primary">Profile Information</p>
                            <p className="text-sm text-text-tertiary">Update your photo and details</p>
                        </div>
                        <ChevronRight className="h-5 w-5 text-text-tertiary" />
                    </button>
                    <button className="w-full flex items-center gap-4 p-4 hover:bg-slate-50 transition-colors text-left">
                        <div className="p-2.5 bg-emerald-100 rounded-lg text-emerald-600">
                            <Shield className="h-5 w-5" />
                        </div>
                        <div className="flex-1">
                            <p className="font-medium text-text-primary">Security</p>
                            <p className="text-sm text-text-tertiary">Password and 2FA</p>
                        </div>
                        <ChevronRight className="h-5 w-5 text-text-tertiary" />
                    </button>
                </Card>
            </section>

            {/* Application Section */}
            <section className="space-y-4">
                <h2 className="text-sm font-bold text-text-secondary uppercase tracking-wider px-1">Application</h2>
                <Card className="p-0 overflow-hidden divide-y divide-border">
                    <div className="flex items-center justify-between p-4">
                        <div className="flex items-center gap-4">
                            <div className="p-2.5 bg-orange-100 rounded-lg text-orange-600">
                                <Bell className="h-5 w-5" />
                            </div>
                            <div className="flex-1">
                                <p className="font-medium text-text-primary">Notifications</p>
                                <p className="text-sm text-text-tertiary">Manage alerts and emails</p>
                            </div>
                        </div>
                        <div className="relative inline-block w-12 h-6 rounded-full bg-slate-200 cursor-pointer">
                            <span className="absolute left-1 top-1 bg-white w-4 h-4 rounded-full shadow-sm transition-transform translate-x-6 bg-primary-600" />
                        </div>
                    </div>
                    <div className="flex items-center justify-between p-4">
                        <div className="flex items-center gap-4">
                            <div className="p-2.5 bg-purple-100 rounded-lg text-purple-600">
                                <Moon className="h-5 w-5" />
                            </div>
                            <div className="flex-1">
                                <p className="font-medium text-text-primary">Dark Mode</p>
                                <p className="text-sm text-text-tertiary">Toggle app theme</p>
                            </div>
                        </div>
                        <div className="relative inline-block w-12 h-6 rounded-full bg-slate-200 cursor-pointer">
                            <span className="absolute left-1 top-1 bg-white w-4 h-4 rounded-full shadow-sm transition-transform" />
                        </div>
                    </div>
                </Card>
            </section>

            {/* Danger Zone */}
            <section className="pt-8">
                <Button variant="danger" fullWidth className="h-12">
                    <LogOut className="h-5 w-5 mr-2" />
                    Sign Out
                </Button>
            </section>
        </div>
    );
}
