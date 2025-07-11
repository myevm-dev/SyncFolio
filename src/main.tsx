// src/main.tsx
import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThirdwebProvider } from "thirdweb/react";
import "./index.css";
import { AuthGate } from "./components/AuthGate"; // now exists

import DebugDashboard from "./pages/DebugDashboard";
import App from "./App";
import ProfilePage from "./pages/ProfilePage";
import UserProfilePage from "./pages/UserProfilePage";
import BuyPage from "./pages/BuyPage";
import SellPage from "./pages/SellPage";
import AboutPage from "./pages/AboutPage";
import FeaturePage from "./pages/FeaturePage";

import Layout from "./components/Layout";
import BuyboxDirectoryPage from "./pages/BuyboxDirectory";
import AnalyticsPage from "./pages/AnalyticsPage";
import BuyingCenterPage from "./pages/BuyingCenterPage";
import SellingCenterPage from "./pages/SellingCenterPage";
import ContractStatusPage from "./pages/ContractStatusPage";
import YieldPage from "./pages/YieldPage";

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ThirdwebProvider>
      <AuthGate /> {/* ✅ Ensures Firebase Auth is ready for Firestore rules */}
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<App />} />
            <Route path="/buy" element={<BuyPage />} />
            <Route path="/sell" element={<SellPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/buybox-directory" element={<BuyboxDirectoryPage />} />
            <Route path="/analytics" element={<AnalyticsPage />} />
            <Route path="/buying-center" element={<BuyingCenterPage />} />
            <Route path="/selling-center" element={<SellingCenterPage />} />
            <Route path="/contracts/:id" element={<ContractStatusPage />} />
            <Route path="/yield" element={<YieldPage />} />
            <Route path="/profile/:id" element={<UserProfilePage />} />
            <Route path="/debug-backfill" element={<DebugDashboard />} />
            <Route path="/features/:slug" element={<FeaturePage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ThirdwebProvider>
  </React.StrictMode>
);
