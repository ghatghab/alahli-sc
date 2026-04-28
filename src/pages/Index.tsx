import { Seo } from "@/components/Seo";
import { Hero } from "@/components/home/Hero";
import { NextMatch } from "@/components/home/NextMatch";
import { LatestNews } from "@/components/home/LatestNews";
import { TeamsGrid } from "@/components/home/TeamsGrid";
import { Honours } from "@/components/home/Honours";
import { JoinCTA } from "@/components/home/JoinCTA";
import { AhliTV } from "@/components/home/AhliTV";

const Index = () => (
  <>
    <Seo pageKey="home" />
    <Hero />
    <NextMatch />
    <LatestNews />
    <AhliTV />
    <TeamsGrid />
    <Honours />
    <JoinCTA />
  </>
);

export default Index;
