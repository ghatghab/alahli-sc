import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index.tsx";
import NotFound from "./pages/NotFound.tsx";
import "./i18n";
import { Layout } from "./components/layout/Layout";
import { MatchCenterPage, SchedulePage } from "./pages/Generic";
import TicketsPage from "./pages/Tickets";
import AcademyPage from "./pages/Academy";
import ContactPage from "./pages/Contact";
import ClubOverview from "./pages/club/ClubOverview";
import ClubHistory from "./pages/club/ClubHistory";
import ClubIdentity from "./pages/club/ClubIdentity";
import ClubLeadership from "./pages/club/ClubLeadership";
import ClubPartners from "./pages/club/ClubPartners";
import ClubSustainability from "./pages/club/ClubSustainability";
import ClubMuseum from "./pages/club/ClubMuseum";
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
import SportStandingsPage from "./pages/teams/SportStandingsPage";
import SportHonoursPage from "./pages/teams/SportHonoursPage";
import SportSchedulePage from "./pages/teams/SportSchedulePage";
import { ProtectedAdmin } from "./components/admin/ProtectedAdmin";
import AdminLayout from "./pages/admin/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminArticles from "./pages/admin/AdminArticles";
import AdminArticleEdit from "./pages/admin/AdminArticleEdit";
import AdminCategories from "./pages/admin/AdminCategories";
import AdminPlayers from "./pages/admin/AdminPlayers";
import AdminPhotos from "./pages/admin/AdminPhotos";
import AdminSync from "./pages/admin/AdminSync";
import AdminTeams from "./pages/admin/AdminTeams";
import AdminCompetitions from "./pages/admin/AdminCompetitions";
import AdminFixtures from "./pages/admin/AdminFixtures";
import AdminStandings from "./pages/admin/AdminStandings";
import AdminUsers from "./pages/admin/AdminUsers";

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
              <Route path="articles" element={<ProtectedAdmin require="cms"><AdminArticles /></ProtectedAdmin>} />
              <Route path="articles/new" element={<ProtectedAdmin require="cms"><AdminArticleEdit /></ProtectedAdmin>} />
              <Route path="articles/:id" element={<ProtectedAdmin require="cms"><AdminArticleEdit /></ProtectedAdmin>} />
              <Route path="categories" element={<ProtectedAdmin require="cms"><AdminCategories /></ProtectedAdmin>} />
              <Route path="players" element={<ProtectedAdmin require="cms"><AdminPlayers /></ProtectedAdmin>} />
              <Route path="photos" element={<ProtectedAdmin require="cms"><AdminPhotos /></ProtectedAdmin>} />
              <Route path="teams" element={<ProtectedAdmin require="sports"><AdminTeams /></ProtectedAdmin>} />
              <Route path="competitions" element={<ProtectedAdmin require="sports"><AdminCompetitions /></ProtectedAdmin>} />
              <Route path="fixtures" element={<ProtectedAdmin require="sports"><AdminFixtures /></ProtectedAdmin>} />
              <Route path="standings" element={<ProtectedAdmin require="sports"><AdminStandings /></ProtectedAdmin>} />
              <Route path="sync" element={<ProtectedAdmin require="sync"><AdminSync /></ProtectedAdmin>} />
              <Route path="users" element={<ProtectedAdmin require="sync"><AdminUsers /></ProtectedAdmin>} />
            </Route>
            <Route element={<Layout />}>
              <Route path="/" element={<Index />} />
              <Route path="/club" element={<ClubLayout />}>
                <Route index element={<ClubOverview />} />
                <Route path="history" element={<ClubHistory />} />
                <Route path="identity" element={<ClubIdentity />} />
                <Route path="leadership" element={<ClubLeadership />} />
                <Route path="partners" element={<ClubPartners />} />
                <Route path="sustainability" element={<ClubSustainability />} />
                <Route path="museum" element={<ClubMuseum />} />
              </Route>
              <Route path="/teams" element={<TeamsLayout />}>
                <Route index element={<TeamsHome />} />
                <Route path="football" element={<FootballLayout />}>
                  <Route index element={<Navigate to="/teams/football/first-team" replace />} />
                  <Route path="first-team" element={<MensFirstLayout />}>
                    <Route index element={<FirstTeamPage />} />
                    <Route path="squad" element={<RubricPage titleKey="teamsNav.squad" />} />
                    <Route path="staff" element={<RubricPage titleKey="teamsNav.staff" />} />
                    <Route path="schedule" element={<SportSchedulePage />} />
                    <Route path="standings" element={<SportStandingsPage />} />
                    <Route path="honours" element={<SportHonoursPage />} />
                  </Route>
                  <Route path="mens-first/*" element={<Navigate to="/teams/football/first-team" replace />} />
                  <Route path="formation" element={<FormationPage />} />
                </Route>
                <Route path=":sport" element={<SportLayout />}>
                  <Route index element={<Navigate to="squad" replace />} />
                  <Route path="squad" element={<RubricPage titleKey="teamsNav.squad" />} />
                  <Route path="staff" element={<RubricPage titleKey="teamsNav.staff" />} />
                  <Route path="schedule" element={<SportSchedulePage />} />
                  <Route path="standings" element={<SportStandingsPage />} />
                  <Route path="honours" element={<SportHonoursPage />} />
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
