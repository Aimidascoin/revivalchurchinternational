import React from 'react';
import { HeroSection } from './HeroSection';
import { EventsSection } from './EventsSection';
import { TestimoniesSection } from './TestimoniesSection';
import { AppPage } from './Navbar';
import {
  Users,
  Compass,
  Radio,
  Sparkles,
  MapPin,
  ArrowRight,
  Flame,
} from 'lucide-react';

interface HomePageProps {
  onNavigate: (page: AppPage) => void;
  onOpenLive: () => void;
  onOpenVisit: () => void;
  onOpenPrayer: () => void;
  onOpenGive: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  onNavigate,
  onOpenLive,
  onOpenVisit,
  onOpenPrayer,
  onOpenGive,
}) => {
  const exploreCards: {
    page: AppPage;
    index: string;
    title: string;
    subtitle: string;
    desc: string;
    kicker: string;
    image: string;
    imageAlt: string;
    imagePosition: string;
    icon: React.ComponentType<{ className?: string }>;
  }[] = [
    {
      page: 'connect',
      index: '01',
      title: 'Connect & Community',
      subtitle: 'About & Groups',
      desc: 'Discover our apostolic vision, meet Senior Leaders Prophet Herbert & Pastor Shelma Mulondo, and find weekly mid-week home hubs and virtual eGroups.',
      kicker: 'About & Leaders',
      image: 'assets/aistudio/11_b3147462.jpg',
      imageAlt: 'Smiling members of Revival Church International gathered in covenant fellowship',
      imagePosition: 'object-[center_20%]',
      icon: Users,
    },
    {
      page: 'membership',
      index: '02',
      title: 'Discipleship Pathway',
      subtitle: 'Next Steps & V-Team',
      desc: 'Our structured 6-step journey from first-time guest to empowered kingdom leader, including Foundations 101 and covenant induction.',
      kicker: '6-Week Roadmap',
      image: 'assets/aistudio/6_b0df8f03.jpg',
      imageAlt: 'Believers writing sermon notes during teaching at Revival Church International',
      imagePosition: 'object-[center_25%]',
      icon: Compass,
    },
    {
      page: 'watch',
      index: '03',
      title: 'Watch & Sermons',
      subtitle: '4K Live Stream & Archive',
      desc: 'Join our weekly global encounter broadcasts, interact in real-time fellowship chat, and explore hundreds of anointed teachings.',
      kicker: 'Live & On-Demand',
      image: 'assets/aistudio/502585865_1308573501273922_829689343425601845_n_514c130e.jpg',
      imageAlt: 'Prophet Herbert Mulondo ministering in the midst of the congregation',
      imagePosition: 'object-[center_20%]',
      icon: Radio,
    },
    {
      page: 'care',
      index: '04',
      title: 'Pastoral Care & Prayer',
      subtitle: '24/7 Prayer Altar',
      desc: 'Submit your urgent prayer petitions before our intercessory altar, request pastoral visitation, and support Revival Hope relief.',
      kicker: 'Always Here for You',
      image: 'assets/aistudio/14_e00e6246.jpg',
      imageAlt: 'Congregation lifting hands in worship and earnest prayer',
      imagePosition: 'object-[center_25%]',
      icon: Sparkles,
    },
    {
      page: 'ministries',
      index: '05',
      title: 'Specialized Ministries',
      subtitle: 'Men, Women, Youth & Kidz',
      desc: 'Dedicated spiritual homes tailored for Knight Men, Queen Reigning Women, Unstoppablegenr, Children Church, and Revival Worship.',
      kicker: 'All Generations',
      image: 'assets/aistudio/10_a37bb766.jpg',
      imageAlt: 'Women and young adults praising God with joyful raised hands',
      imagePosition: 'object-[center_20%]',
      icon: Flame,
    },
    {
      page: 'campuses',
      index: '06',
      title: 'Campuses & Times',
      subtitle: 'Physical & Digital Assemblies',
      desc: 'Locate assembly times and directions for Sandton (Johannesburg HQ), Cape Town, Ballito, London UK, and Atlanta USA, or worship online.',
      kicker: 'Global Footprint',
      image: 'assets/aistudio/18_88f34ce9.jpg',
      imageAlt: 'Filled Revival Church International sanctuary auditorium during Sunday service',
      imagePosition: 'object-center',
      icon: MapPin,
    },
  ];

  return (
    <div className="space-y-20">
      {/* 1. Top Headline + Dominant HD Hero Showcase */}
      <HeroSection
        onOpenLive={onOpenLive}
        onOpenVisit={onOpenVisit}
        onOpenPrayer={onOpenPrayer}
      />

      {/* 2. Welcome & Page Portals Gateway Grid (6 Unique HD Images) */}
      <section className="relative py-6 overflow-hidden">
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="text-xs font-semibold tracking-wide text-blue-400">
              Welcome to Revival Church
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-1.5 tracking-tight text-balance">
              Explore the Heart of Our Church
            </h2>
            <p className="text-slate-300 text-sm sm:text-base mt-2.5 leading-relaxed">
              Every section of our church family has its own dedicated portal. Choose a pathway below to get connected.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {exploreCards.map((card) => {
              const Icon = card.icon;
              return (
                <article
                  key={card.page}
                  className="overflow-hidden bg-slate-900 border border-slate-800 rounded-3xl hover:border-blue-500/50 transition-all flex flex-col justify-between group shadow-xl"
                >
                  <div>
                    {/* Edge-to-edge HD Card Photography */}
                    <div className="aspect-[16/9] w-full overflow-hidden bg-slate-950 relative border-b border-slate-800/80">
                      <img
                        src={card.image}
                        alt={card.imageAlt}
                        referrerPolicy="no-referrer"
                        className={`w-full h-full object-cover ${card.imagePosition} group-hover:scale-[1.04] transition-transform duration-500`}
                      />
                    </div>

                    <div className="p-6 pb-4 space-y-3">
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2 text-xs text-slate-400 font-medium">
                          <span className="font-mono text-blue-400 font-semibold tabular-nums">
                            {card.index}
                          </span>
                          <span aria-hidden="true">·</span>
                          <span>{card.kicker}</span>
                        </div>
                        <div className="w-8 h-8 rounded-xl bg-blue-600/15 text-blue-400 flex items-center justify-center shrink-0">
                          <Icon className="w-4 h-4" />
                        </div>
                      </div>

                      <div>
                        <h3 className="text-xl font-bold text-white group-hover:text-blue-300 transition-colors">
                          {card.title}
                        </h3>
                        <div className="text-xs text-blue-400 font-medium mt-0.5">
                          {card.subtitle}
                        </div>
                      </div>

                      <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                        {card.desc}
                      </p>
                    </div>
                  </div>

                  <div className="px-6 pb-6 pt-3 border-t border-slate-800/80 mt-2">
                    <button
                      type="button"
                      onClick={() => onNavigate(card.page)}
                      className="w-full py-2.5 px-4 rounded-xl bg-slate-950/90 hover:bg-blue-600 text-slate-200 hover:text-white font-bold text-xs flex items-center justify-between transition-colors cursor-pointer whitespace-nowrap"
                    >
                      <span>Open {card.title}</span>
                      <ArrowRight className="w-4 h-4 shrink-0" />
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* 3. Senior Leaders Showcase */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-black border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl space-y-8">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div className="max-w-3xl space-y-3">
              <div>
                <span className="text-xs font-mono font-bold tracking-wider uppercase text-amber-400">
                  SENIOR LEADERS
                </span>
                <h2 className="text-3xl sm:text-4xl font-black text-white mt-1.5 tracking-tight text-balance">
                  Meet our Senior Leaders
                </h2>
                <p className="text-blue-300 font-semibold text-sm sm:text-base mt-2">
                  Led by Prophet Herbert &amp; Pastor Shelma Mulondo
                </p>
              </div>

              <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                Together, Prophet Herbert &amp; Pastor Shelma Mulondo carry a prophetic mandate of healing, sound Word, and unconditional family love — raising believers who walk in supernatural testimony across South Africa and the nations.
              </p>
            </div>

            <div className="shrink-0">
              <button
                type="button"
                onClick={() => onNavigate('connect')}
                className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm inline-flex items-center gap-2 transition-all shadow-lg shadow-blue-600/25 cursor-pointer whitespace-nowrap"
              >
                <span>Connect With Our Leaders</span>
                <ArrowRight className="w-4 h-4 shrink-0" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
            <div className="relative aspect-[3/4] rounded-2xl overflow-hidden border border-white/15 shadow-2xl bg-black group">
              <img
                src="assets/aistudio/image_2_6cfe55f4.jfif"
                alt="Prophet Herbert Mulondo preaching at Revival Church International"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-[46%_top] group-hover:scale-[1.03] transition-transform duration-700"
              />
              <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/95 via-black/55 to-transparent pointer-events-none" />
              <div className="absolute bottom-5 left-5 right-5">
                <div className="text-xs font-mono uppercase tracking-wider text-amber-300 font-bold">
                  Senior Leader · Founder
                </div>
                <div className="text-xl sm:text-2xl font-bold text-white mt-1">
                  Prophet Herbert Mulondo
                </div>
              </div>
            </div>

            <div className="relative aspect-[3/4] rounded-2xl overflow-hidden border border-white/15 shadow-2xl bg-black group">
              <img
                src="assets/aistudio/image3_1d7e9e76.jfif"
                alt="Pastor Shelma Mulondo ministering at Revival Church International"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-[28%_top] group-hover:scale-[1.03] transition-transform duration-700"
              />
              <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/95 via-black/55 to-transparent pointer-events-none" />
              <div className="absolute bottom-5 left-5 right-5">
                <div className="text-xs font-mono uppercase tracking-wider text-blue-300 font-bold">
                  Senior Leader · Co-Founder
                </div>
                <div className="text-xl sm:text-2xl font-bold text-white mt-1">
                  Pastor Shelma Mulondo
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Asymmetric Editorial Bento Showcase: Worship, Word & Covenant Family (4 Remaining HD Images) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div className="max-w-2xl">
            <div className="text-xs font-semibold tracking-wide text-yellow-300 mb-1.5">
              Life Inside the House
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight text-balance">
              Worship, Word &amp; Covenant Family
            </h2>
            <p className="mt-2 text-slate-300 text-sm sm:text-base leading-relaxed">
              Every Sunday and midweek gathering is marked by expectant praise, grounded biblical teaching, and genuine family warmth.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={onOpenVisit}
              className="self-start md:self-auto px-5 py-2.5 text-xs sm:text-sm font-bold text-slate-950 bg-yellow-300 hover:bg-yellow-200 rounded-xl transition-colors inline-flex items-center gap-2 cursor-pointer whitespace-nowrap shrink-0"
            >
              <span>Join Us This Sunday</span>
              <ArrowRight className="w-4 h-4 shrink-0" />
            </button>
            <button
              type="button"
              onClick={onOpenGive}
              className="self-start md:self-auto px-5 py-2.5 text-xs sm:text-sm font-bold text-amber-300 border border-amber-400/40 hover:bg-amber-400/10 rounded-xl transition-colors inline-flex items-center gap-2 cursor-pointer whitespace-nowrap shrink-0"
            >
              <span>Partner With RCI</span>
            </button>
          </div>
        </div>

        <div className="space-y-6">
          {/* Bento Row 1: Wide Panorama + Feature Tile */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            <figure className="lg:col-span-7 relative aspect-[16/9] lg:aspect-auto lg:h-[400px] rounded-3xl overflow-hidden border border-white/10 bg-slate-950 shadow-2xl group">
              <img
                src="assets/aistudio/17jpg_cf5cc1f1.jpg"
                alt="Congregation gathered inside the main sanctuary facing the altar"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-center group-hover:scale-[1.03] transition-transform duration-700"
              />
              <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/90 via-black/45 to-transparent pointer-events-none" />
              <figcaption className="absolute bottom-5 left-6 right-6">
                <div className="text-xs font-medium text-blue-300">Sunday Assembly · Sanctuary</div>
                <div className="text-xl font-bold text-white mt-0.5">Gathered in His Presence</div>
                <p className="text-xs sm:text-sm text-slate-200 mt-1">
                  Hearts united in faith and expectation across every row of the auditorium.
                </p>
              </figcaption>
            </figure>

            <figure className="lg:col-span-5 relative aspect-[3/2] lg:aspect-auto lg:h-[400px] rounded-3xl overflow-hidden border border-white/10 bg-slate-950 shadow-2xl group">
              <img
                src="assets/aistudio/21_eb16dab7.jpg"
                alt="Joyful church members applauding and celebrating during worship"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-[center_20%] group-hover:scale-[1.03] transition-transform duration-700"
              />
              <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/90 via-black/45 to-transparent pointer-events-none" />
              <figcaption className="absolute bottom-5 left-6 right-6">
                <div className="text-xs font-medium text-yellow-300">Praise &amp; Fellowship</div>
                <div className="text-xl font-bold text-white mt-0.5">Joy &amp; Celebration</div>
                <p className="text-xs sm:text-sm text-slate-200 mt-1">
                  A joyful family rejoicing together in grace and living testimonies.
                </p>
              </figcaption>
            </figure>
          </div>

          {/* Bento Row 2: Two Balanced Feature Frames */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <figure className="relative aspect-[16/10] rounded-3xl overflow-hidden border border-white/10 bg-slate-950 shadow-2xl group">
              <img
                src="assets/aistudio/13_658df435.jpg"
                alt="Elders and youth seated side by side listening attentively to the Word"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-[center_20%] group-hover:scale-[1.03] transition-transform duration-700"
              />
              <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/90 via-black/45 to-transparent pointer-events-none" />
              <figcaption className="absolute bottom-5 left-6 right-6">
                <div className="text-xs font-medium text-blue-300">Multi-Generational Family</div>
                <div className="text-xl font-bold text-white mt-0.5">Every Generation Together</div>
                <p className="text-xs sm:text-sm text-slate-200 mt-1">
                  Fathers, mothers, and young adults growing side by side in covenant love.
                </p>
              </figcaption>
            </figure>

            <figure className="relative aspect-[16/10] rounded-3xl overflow-hidden border border-white/10 bg-slate-950 shadow-2xl group">
              <img
                src="assets/aistudio/15_5dd492fb.jpg"
                alt="Church family attentively taking notes during a prophetic teaching"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-[center_20%] group-hover:scale-[1.03] transition-transform duration-700"
              />
              <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/90 via-black/45 to-transparent pointer-events-none" />
              <figcaption className="absolute bottom-5 left-6 right-6">
                <div className="text-xs font-medium text-yellow-300">Discipleship &amp; Truth</div>
                <div className="text-xl font-bold text-white mt-0.5">Hungry for the Word</div>
                <p className="text-xs sm:text-sm text-slate-200 mt-1">
                  Equipping believers through sound Scripture that builds unshakeable faith.
                </p>
              </figcaption>
            </figure>
          </div>
        </div>
      </section>

      {/* 5. Upcoming Major Gatherings & Fire Conferences */}
      <EventsSection />

      {/* 6. Living Testimonies of Supernatural Breakthrough */}
      <TestimoniesSection />
    </div>
  );
};
