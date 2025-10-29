import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route } from "react-router-dom";
import ScrollToTop from "components/ScrollToTop";
import ErrorBoundary from "components/ErrorBoundary";

import Login from "pages/login";
import Register from "pages/register";
import AccountSettings from "pages/account-settings";
import SongResearchResults from "pages/song-research-results";
import ResearchDashboard from "pages/research-dashboard";
import NotFound from "pages/NotFound";

const Routes = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
        <ScrollToTop />
        <RouterRoutes>
          <Route path="/" element={<ResearchDashboard />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/account-settings" element={<AccountSettings />} />
          <Route path="/song-research-results" element={<SongResearchResults />} />
          <Route path="/research-dashboard" element={<ResearchDashboard />} />
          <Route path="*" element={<NotFound />} />
        </RouterRoutes>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;
