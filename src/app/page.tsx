import { Hero } from "@/components/hero";
import { FeatureSection } from "@/components/feature-section";
import { CategoryGrid } from "@/components/category-grid";

export default function Home() {
  return (
    <>
      <Hero />

      <FeatureSection
        eyebrow="Wallpapers"
        title="Backgrounds with depth."
        description="Hand-picked, high-resolution wallpapers for phone and desktop — from moody and cinematic to bright and minimal. Free to download, forever."
        href="/wallpapers"
        cta="Browse wallpapers"
        video="/video/wallpapers.mp4"
        poster="/video/wallpapers.jpg"
        align="left"
      />

      <FeatureSection
        eyebrow="Ringtones & Notifications"
        title="Sounds you actually want to hear."
        description="Distinctive ringtones and clean notification tones — preview them instantly, then download in a tap. No accounts, no noise."
        href="/ringtones"
        cta="Explore sounds"
        video="/video/sounds.mp4"
        poster="/video/sounds.jpg"
        align="center"
      />

      <CategoryGrid />
    </>
  );
}
