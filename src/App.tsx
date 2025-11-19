import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ClientProvider } from "@/contexts/ClientContext";
import { AppLayout } from "@/components/AppLayout";
import Index from "./pages/Index";
import AddClientPage from "./pages/AddClientPage";
import ManageClientsPage from "./pages/ManageClientsPage";
import EditClientPage from "./pages/EditClientPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ClientProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route element={<AppLayout />}>
              <Route path="/" element={<Index />} />
              <Route path="/add-client" element={<AddClientPage />} />
              <Route path="/manage-clients" element={<ManageClientsPage />} />
              <Route path="/client/:id/edit" element={<EditClientPage />} />
            </Route>
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </ClientProvider>
  </QueryClientProvider>
);

export default App;
