import { Hero } from "@/components/home/Hero";
import { NextMatch } from "@/components/home/NextMatch";
import { LatestNews } from "@/components/home/LatestNews";
import { TeamsGrid } from "@/components/home/TeamsGrid";
import { Honours } from "@/components/home/Honours";
import { StadiumSection } from "@/components/home/StadiumSection";
import { JoinCTA } from "@/components/home/JoinCTA";

const Index = () => (
  <>
    <Hero />
    <NextMatch />
    <LatestNews />
    <TeamsGrid />
    <Honours />
    <StadiumSection />
    <JoinCTA />
  </>
);

export default Index;
