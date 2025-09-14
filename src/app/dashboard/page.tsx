"use client";
import { withAuth } from "@/components/auth/with-auth";
import Dashboard from "@/components/dashboard/dashboard";

function DashboardPage() {
    return <Dashboard />;
}

export default withAuth(DashboardPage);