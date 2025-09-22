import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AppLayout } from "./components/layout/AppLayout";
import Dashboard from "./pages/Dashboard";
import Partners from "./pages/Partners";
import PartnersNew from "./pages/PartnersNew";
import PartnersEdit from "./pages/PartnersEdit";
import PartnersApprovals from "./pages/PartnersApprovals";
import PartnersKyc from "./pages/PartnersKyc";
import Affiliates from "./pages/Affiliates";
import AffiliatesNew from "./pages/AffiliatesNew";
import AffiliatesEdit from "./pages/AffiliatesEdit";
import AffiliatesApprovals from "./pages/AffiliatesApprovals";
import NotFound from "./pages/NotFound";
import OperationsCollections from "./pages/OperationsCollections";
import OperationsRates from "./pages/OperationsRates";
import OperationsSettlements from "./pages/OperationsSettlements";
import OperationsReconciliation from "./pages/OperationsReconciliation";
import AdvancesRequests from "./pages/AdvancesRequests";
import AdvancesApprovals from "./pages/AdvancesApprovals";
import AdvancesSettlements from "./pages/AdvancesSettlements";
import Agendas from "./pages/Agendas";
import Reports from "./pages/Reports";
import Notifications from "./pages/Notifications";
import InvoicesApprovals from "./pages/InvoicesApprovals";
import Login from "./pages/Login";
import Advances from "./pages/Advances";
import { AuthProvider, useAuth } from "./contexts/AuthContext";

const queryClient = new QueryClient();

function RequireAuth({ children }: { children: JSX.Element }) {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return children;
}

function RequireRole({ role, children }: { role: "nel3" | "hospital"; children: JSX.Element }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== role) return <Navigate to="/" replace />;
  return children;
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <div className="dark">
        <Toaster />
        <Sonner />
        <AuthProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route
                path="*"
                element={
                  <RequireAuth>
                    <AppLayout>
                      <Routes>
                        <Route path="/" element={<Dashboard />} />
                        {/* NEL3 routes */}
                        <Route path="/partners" element={<RequireRole role="nel3"><Partners /></RequireRole>} />
                        <Route path="/partners/new" element={<RequireRole role="nel3"><PartnersNew /></RequireRole>} />
                        <Route path="/partners/edit/:id" element={<RequireRole role="nel3"><PartnersEdit /></RequireRole>} />
                        <Route path="/partners/approvals" element={<RequireRole role="nel3"><PartnersApprovals /></RequireRole>} />
                        <Route path="/partners/kyc" element={<RequireRole role="nel3"><PartnersKyc /></RequireRole>} />
                        <Route path="/operations/collections" element={<RequireRole role="nel3"><OperationsCollections /></RequireRole>} />
                        <Route path="/operations/rates" element={<RequireRole role="nel3"><OperationsRates /></RequireRole>} />
                        <Route path="/operations/settlements" element={<RequireRole role="nel3"><OperationsSettlements /></RequireRole>} />
                        <Route path="/operations/reconciliation" element={<RequireRole role="nel3"><OperationsReconciliation /></RequireRole>} />
                        <Route path="/advances" element={<RequireRole role="nel3"><Advances /></RequireRole>} />
                        <Route path="/advances/requests" element={<RequireRole role="nel3"><AdvancesRequests /></RequireRole>} />
                        <Route path="/advances/approvals" element={<RequireRole role="nel3"><AdvancesApprovals /></RequireRole>} />
                        <Route path="/advances/settlements" element={<RequireRole role="nel3"><AdvancesSettlements /></RequireRole>} />
                        <Route path="/reports" element={<RequireRole role="nel3"><Reports /></RequireRole>} />
                        <Route path="/reports/financial" element={<RequireRole role="nel3"><Reports /></RequireRole>} />
                        <Route path="/reports/operational" element={<RequireRole role="nel3"><Reports /></RequireRole>} />
                        <Route path="/reports/kyc" element={<RequireRole role="nel3"><Reports /></RequireRole>} />
                        <Route path="/notifications" element={<RequireRole role="nel3"><Notifications /></RequireRole>} />
                        {/* Shared (NEL3 + Hospital) */}
                        <Route path="/affiliates" element={<Affiliates />} />
                        <Route path="/affiliates/new" element={<AffiliatesNew />} />
                        <Route path="/affiliates/edit/:id" element={<AffiliatesEdit />} />
                        <Route path="/affiliates/approvals" element={<AffiliatesApprovals />} />
                        {/* Hospital specific */}
                        <Route path="/invoices/approvals" element={<RequireRole role="hospital"><InvoicesApprovals /></RequireRole>} />
                        <Route path="/agendas" element={<RequireRole role="nel3"><Agendas /></RequireRole>} />
                        {/* Catch-all */}
                        <Route path="*" element={<NotFound />} />
                      </Routes>
                    </AppLayout>
                  </RequireAuth>
                }
              />
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </div>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
