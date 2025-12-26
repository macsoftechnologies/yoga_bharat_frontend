import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./Layout/Layout";
import ProtectedRoute from "./components/ProtectedRoute";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Yoga from "./pages/Yoga";
import User from "./pages/User";
import Client from "./pages/Client";
import Trainer from "./pages/Trainer";
import Orders from "./pages/Orders";
import SplashScreen from "./pages/SplashScreen";
import HealthPreference from "./pages/HealthPreference";
import ProfessionDetails from "./pages/ProfessionDetails";
import Notifications from "./pages/Notifications";
import AppTutorial from "./pages/AppTutorial";
import CallbackRequest from "./pages/CallbackRequest";
import TermsConditions from "./pages/TermsConditions";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import FeatureBanners from "./pages/FeatureBanners";
import Languages from "./pages/Languages";
import Transactions from "./pages/Transactions";
import AdminForgotPassword from "./pages/AdminForgotPassword";
import Home from "./pages/Home";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* ✅ Public route */}
        <Route path="/" element={<Home />} />
        <Route path="/admin" element={<Login />} />
        <Route path="/admin-forgot-password" element={<AdminForgotPassword />}/>

        {/* ✅ Protected routes */}
          <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/yoga" element={<Yoga />} />
          <Route path="/user" element={<User />} />
          <Route path="/client" element={<Client />} />
          <Route path="/trainer" element={<Trainer />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/splash-screen" element={<SplashScreen />} />
          <Route path="/health-preference" element={<HealthPreference />} />
          <Route path="/profession-details" element={<ProfessionDetails />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/app-tutorial" element={<AppTutorial />} />
          <Route path="/callback-request" element={<CallbackRequest />} />
          <Route path="/terms-conditions" element={<TermsConditions />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/feature-banners" element={<FeatureBanners />} />
          <Route path="/languages" element={<Languages />} />
          <Route path="/transactions" element={<Transactions />} />
        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default App;
