// src/main.tsx
import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThirdwebProvider } from "thirdweb/react";
import "./index.css";
import { AuthGate } from "./components/AuthGate";

import App from "./App";
import Layout from "./components/Layout";

import DealFlowPage from "./pages/DealFlowPage";
import ProfilePage from "./pages/ProfilePage";
import UserProfilePage from "./pages/UserProfilePage";
import BuyPage from "./pages/BuyPage";
import SellPage from "./pages/SellPage";
import AboutPage from "./pages/AboutPage";
import FeaturePage from "./pages/FeaturePage";
import BuyboxDirectoryPage from "./pages/BuyboxDirectory";
import AnalyticsPage from "./pages/AnalyticsPage";
import BuyingCenterPage from "./pages/BuyingCenterPage";
import SellingCenterPage from "./pages/SellingCenterPage";
import ContractStatusPage from "./pages/ContractStatusPage";
import EarnPage from "./pages/EarnPage";
import InstantOfferPage from "./pages/InstantOffersPage";

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ThirdwebProvider>
      <AuthGate />
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
            <Route path="/earn" element={<EarnPage />} />
            <Route path="/profile/:id" element={<UserProfilePage />} />
            <Route path="/turfwars" element={<DealFlowPage />} />
            <Route path="/features/:slug" element={<FeaturePage />} />
            <Route path="/instant-offer" element={<InstantOfferPage />} /> {/* ✅ New route */}
          </Route>
        </Routes>
      </BrowserRouter>
    </ThirdwebProvider>
  </React.StrictMode>
);
