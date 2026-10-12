import { Suspense } from 'react';
import Navbar from '@/components/Navbar';
import HeroBanner from '@/components/HeroBanner';
import SponsorBar from '@/components/SponsorBar';
import LatestGamesGrid from '@/components/LatestGamesGrid';
import NewsList from '@/components/NewsList';
import SidebarTopRated from '@/components/SidebarTopRated';
import SidebarFeatured from '@/components/SidebarFeatured';
import BlogSection from '@/components/BlogSection';
import ForumSection from '@/components/ForumSection';
import Footer from '@/components/Footer';
import Skeleton from '@/components/ui/Skeleton';
import {
  getFeaturedGame,
  getForumThreads,
  getLatestGames,
  getSponsors,
  getTopReviewers,
} from '@/lib/cms';

export const instant = false; // Allows dynamic database queries on the homepage

/*
 * Loaders keep the presentational components prop-driven. The await lives here,
 * inside <Suspense>, so a future CMS/API fetch streams in instead of blocking
 * the static shell (required by cacheComponents).
 */
async function SponsorsLoader() {
  return <SponsorBar sponsors={await getSponsors()} />;
}
async function GamesLoader() {
  return <LatestGamesGrid title="Latest games" games={await getLatestGames()} />;
}
async function TopRatedLoader() {
  return <SidebarTopRated reviewers={await getTopReviewers()} />;
}
async function FeaturedLoader() {
  return <SidebarFeatured game={await getFeaturedGame()} />;
}
async function ForumLoader() {
  return <ForumSection threads={await getForumThreads()} />;
}

export default function HomePage(props: PageProps<'/'>) {
  return (
    <>
      <Navbar />

      <main>
        <div className="mx-auto w-full max-w-[1170px] space-y-8 px-4 py-6">
          <Suspense fallback={<Skeleton className="h-[380px]" />}>
            <HeroBanner />
          </Suspense>

          <Suspense fallback={<Skeleton className="h-16" />}>
            <SponsorsLoader />
          </Suspense>

          <Suspense fallback={<Skeleton className="h-64" />}>
            <GamesLoader />
          </Suspense>

          <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_300px]">
            <Suspense fallback={<Skeleton className="h-[520px]" />}>
              {/* searchParams is request-time data, so it's passed down un-awaited */}
              <NewsList searchParams={props.searchParams} />
            </Suspense>

            <aside className="space-y-6">
              <Suspense fallback={<Skeleton className="h-72" />}>
                <TopRatedLoader />
              </Suspense>
              <Suspense fallback={<Skeleton className="h-32" />}>
                <FeaturedLoader />
              </Suspense>
            </aside>
          </div>
        </div>

        {/* Dark blog + forum band */}
        <section className="bg-night text-white">
          <div className="mx-auto grid w-full max-w-[1170px] gap-10 px-4 py-12 lg:grid-cols-[minmax(0,1fr)_380px]">
            <Suspense fallback={<Skeleton className="h-96 bg-white/10" />}>
              <BlogSection />
            </Suspense>
            <Suspense fallback={<Skeleton className="h-96 bg-white/10" />}>
              <ForumLoader />
            </Suspense>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}