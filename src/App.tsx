import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index.tsx";
import NotFound from "./pages/NotFound.tsx";
import "./i18n";
import { Layout } from "./components/layout/Layout";
import {
  ClubPage, TeamsPage, NewsPage, MatchCenterPage, SchedulePage,
  TicketsPage, AcademyPage, ContactPage,
} from "./pages/Generic";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Index />} />
            <Route path="/club" element={<ClubPage />} />
            <Route path="/teams" element={<TeamsPage />} />
            <Route path="/news" element={<NewsPage />} />
            <Route path="/match-center" element={<MatchCenterPage />} />
            <Route path="/schedule" element={<SchedulePage />} />
            <Route path="/tickets" element={<TicketsPage />} />
            <Route path="/academy" element={<AcademyPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
