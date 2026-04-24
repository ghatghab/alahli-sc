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
  ClubPage, MatchCenterPage, SchedulePage,
  TicketsPage, AcademyPage, ContactPage,
} from "./pages/Generic";
import ClubLayout from "./pages/club/ClubLayout";
import TeamsLayout from "./pages/teams/TeamsLayout";
import FootballLayout from "./pages/teams/FootballLayout";
import MensFirstLayout from "./pages/teams/MensFirstLayout";
import FirstTeamPage from "./pages/teams/FirstTeamPage";
import FormationPage from "./pages/teams/FormationPage";
import SportLayout from "./pages/teams/SportLayout";
import RubricPage from "./pages/teams/RubricPage";
import TeamsHome from "./pages/teams/TeamsHome";
import { Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import Auth from "./pages/Auth";
import { NewsList } from "./pages/news/NewsList";
import { NewsArticle } from "./pages/news/NewsArticle";
import MatchDetail from "./pages/MatchDetail";
import MatchCenter from "./pages/MatchCenter";
import Standings from "./pages/Standings";
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
              <Route path="/club" element={<ClubLayout />}>
                <Route index element={<ClubPage />} />
                <Route path="history" element={<ClubPage />} />
                <Route path="identity" element={<ClubPage />} />
                <Route path="leadership" element={<ClubPage />} />
                <Route path="partners" element={<ClubPage />} />
                <Route path="sustainability" element={<ClubPage />} />
                <Route path="museum" element={<ClubPage />} />
              </Route>
              <Route path="/teams" element={<TeamsLayout />}>
                <Route index element={<TeamsHome />} />
                <Route path="football" element={<FootballLayout />}>
                  <Route index element={<Navigate to="/teams/football/first-team" replace />} />
                  <Route path="first-team" element={<MensFirstLayout />}>
                    <Route index element={<FirstTeamPage />} />
                    <Route path="squad" element={<RubricPage titleKey="teamsNav.squad" />} />
                    <Route path="staff" element={<RubricPage titleKey="teamsNav.staff" />} />
                    <Route path="schedule" element={<RubricPage titleKey="teamsNav.schedule" />} />
                    <Route path="standings" element={<RubricPage titleKey="teamsNav.standings" />} />
                    <Route path="honours" element={<RubricPage titleKey="teamsNav.honours" />} />
                  </Route>
                  <Route path="mens-first/*" element={<Navigate to="/teams/football/first-team" replace />} />
                  <Route path="formation" element={<FormationPage />} />
                </Route>
                <Route path=":sport" element={<SportLayout />}>
                  <Route index element={<Navigate to="squad" replace />} />
                  <Route path="squad" element={<RubricPage titleKey="teamsNav.squad" />} />
                  <Route path="staff" element={<RubricPage titleKey="teamsNav.staff" />} />
                  <Route path="schedule" element={<RubricPage titleKey="teamsNav.schedule" />} />
                  <Route path="standings" element={<RubricPage titleKey="teamsNav.standings" />} />
                  <Route path="honours" element={<RubricPage titleKey="teamsNav.honours" />} />
                </Route>
              </Route>
              <Route path="/news" element={<NewsList />} />
              <Route path="/news/:year/:month" element={<NewsList />} />
              <Route path="/news/:year/:month/:slug" element={<NewsArticle />} />
              <Route path="/match-center" element={<MatchCenter />} />
              <Route path="/match/:id" element={<MatchDetail />} />
              <Route path="/standings" element={<Standings />} />
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
