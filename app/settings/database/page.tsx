"use client";

import { MySQLConfigComponent } from "@/components/mysql-config";

export default function DatabaseSettingsPage() {
  return (
    <div className="container py-8">
      <h1 className="text-2xl font-bold mb-6">Database Settings</h1>
      <MySQLConfigComponent />
    </div>
  );
} 