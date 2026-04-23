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
  ClubPage, TeamsPage, MatchCenterPage, SchedulePage,
  TicketsPage, AcademyPage, ContactPage,
} from "./pages/Generic";
import { AuthProvider } from "./contexts/AuthContext";
import Auth from "./pages/Auth";
import { NewsList } from "./pages/news/NewsList";
import { NewsArticle } from "./pages/news/NewsArticle";
import MatchDetail from "./pages/MatchDetail";
import Schedule from "./pages/Schedule";
import { ProtectedAdmin } from "./components/admin/ProtectedAdmin";
import AdminLayout from "./pages/admin/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminArticles from "./pages/admin/AdminArticles";
import AdminArticleEdit from "./pages/admin/AdminArticleEdit";
import AdminCategories from "./pages/admin/AdminCategories";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/auth" element={<Auth />} />
            <Route
              path="/admin"
              element={
                <ProtectedAdmin>
                  <AdminLayout />
                </ProtectedAdmin>
              }
            >
              <Route index element={<AdminDashboard />} />
              <Route path="articles" element={<AdminArticles />} />
              <Route path="articles/new" element={<AdminArticleEdit />} />
              <Route path="articles/:id" element={<AdminArticleEdit />} />
              <Route path="categories" element={<AdminCategories />} />
            </Route>
            <Route element={<Layout />}>
              <Route path="/" element={<Index />} />
              <Route path="/club" element={<ClubPage />} />
              <Route path="/teams" element={<TeamsPage />} />
              <Route path="/news" element={<NewsList />} />
              <Route path="/news/:year/:month" element={<NewsList />} />
              <Route path="/news/:year/:month/:slug" element={<NewsArticle />} />
              <Route path="/match-center" element={<MatchCenterPage />} />
              <Route path="/match/:id" element={<MatchDetail />} />
              <Route path="/schedule" element={<Schedule />} />
              <Route path="/tickets" element={<TicketsPage />} />
              <Route path="/academy" element={<AcademyPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
