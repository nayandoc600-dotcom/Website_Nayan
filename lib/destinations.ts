export type Destination = {
  slug: string;
  name: string;
  tagline: string;
  flag: string;
  /** ISO 3166-1 alpha-2 code (lowercase) for flag images via flagcdn.com */
  code: string;
  /** Hero/card photo in /public. Optional — falls back to a gradient. */
  image?: string;
  highlights: string[];
  description: string;
};

export const DESTINATIONS: Destination[] = [
  {
    slug: "australia",
    name: "Australia",
    flag: "🇦🇺",
    code: "au",
    image: "/australia.jpg",
    tagline: "World-class education with post-study work rights up to 6 years.",
    highlights: [
      "Post-study work visa up to 6 years",
      "70,000+ Nepalese students",
      "Scholarships & part-time work",
    ],
    description:
      "Australia is one of the top study destinations for Nepalese students, with over 70,000 currently enrolled. It offers a world-class education system, a strong support network for international students, and a multicultural society that makes it easy to adapt. With a post-study work visa of up to six years, generous scholarships, part-time work opportunities, and a safe living environment, Australia is a top choice for quality education and global exposure.",
  },
  {
    slug: "united-kingdom",
    name: "United Kingdom",
    flag: "🇬🇧",
    code: "gb",
    image: "/uk.jpg",
    tagline: "Globally recognised degrees and shorter, faster courses.",
    highlights: [
      "World-class universities — Oxford, Cambridge",
      "Shorter degrees — 3-year BA, 1-year MA",
      "Post-study work visa up to 2 years",
    ],
    description:
      "The UK is known for its prestigious education system and globally recognised degrees. Nepalese students benefit from shorter course durations — three years for a bachelor's degree and one year for a master's — saving both time and money. With world-class universities like Oxford and Cambridge, a strong job market, and a post-study work visa of up to two years, the UK remains a leading choice.",
  },
  {
    slug: "new-zealand",
    name: "New Zealand",
    flag: "🇳🇿",
    code: "nz",
    image: "/newzealand.jpg",
    tagline: "Practical, research-led education in a stable, welcoming country.",
    highlights: [
      "Research & practice-oriented learning",
      "Low cost of living",
      "Stable economy & government",
    ],
    description:
      "New Zealand is best known for its research- and practice-oriented education system. With an incredibly stable economy, a low cost of living, and a stable government, it is a safe and welcoming destination for international students. The academic year runs from February to November, with a long summer break and most universities operating on a two-semester system.",
  },
  {
    slug: "usa",
    name: "USA",
    flag: "🇺🇸",
    code: "us",
    image: "/usa.jpg",
    tagline: "The world's largest, most flexible higher-education system.",
    highlights: [
      "4,000+ universities incl. Ivy League",
      "Flexible majors & course choice",
      "STEM graduates work up to 3 years on OPT",
    ],
    description:
      "The United States has the world's largest higher education system, offering flexibility in choosing majors and courses tailored to individual interests. Nepalese students gain access to cutting-edge research, technological advancement, and high-paying job opportunities. With over 4,000 universities — including Ivy League institutions — and STEM graduates able to work up to three years under OPT, the U.S. is a global innovation hub.",
  },
  {
    slug: "canada",
    name: "Canada",
    flag: "🇨🇦",
    code: "ca",
    image: "/canada.jpg",
    tagline: "Affordable study with a clear pathway to permanent residency.",
    highlights: [
      "Work 20 hrs/week (40 in breaks)",
      "PR pathway via PGWP",
      "Safe & multicultural",
    ],
    description:
      "Canada is highly attractive to Nepalese students due to its affordable tuition fees, high standard of living, and student-friendly policies. Known for its safety, welcoming environment, and strong economy, Canada offers excellent opportunities for students looking to build a secure future — including up to 20 hours of work per week during studies (40 during breaks) and a clear PR pathway through the Post-Graduation Work Permit (PGWP).",
  },
  {
    slug: "malta",
    name: "Malta",
    flag: "🇲🇹",
    code: "mt",
    image: "/malta.jpg",
    tagline: "English-speaking EU island with affordable, quality education.",
    highlights: [
      "English-speaking EU country",
      "Affordable tuition & living",
      "Schengen access & work rights",
    ],
    description:
      "Malta is an increasingly popular destination for Nepalese students, combining English-medium education with the advantages of EU membership. As an English-speaking country, students adapt quickly without a language barrier, while affordable tuition and a lower cost of living make it a budget-friendly choice. With Schengen access, a safe Mediterranean lifestyle, and part-time work opportunities alongside studies, Malta offers a well-rounded pathway to a European education.",
  },
  {
    slug: "japan",
    name: "Japan",
    flag: "🇯🇵",
    code: "jp",
    image: "/japan.jpg",
    tagline: "Advanced, safe, and full of scholarships — study and earn in Japan.",
    highlights: [
      "60,000+ Nepalese students",
      "Government & university scholarships",
      "Learn & earn — part-time work",
    ],
    description:
      "With its advanced infrastructure, disciplined work culture, and safe living environment, Japan is an excellent choice for Nepalese students seeking quality education and job prospects. A growing community of over 60,000 Nepalese students, high scholarship availability from both government and universities, and strong demand for IT, Engineering, and Business graduates make Japan especially attractive — with the chance to work part-time while studying.",
  },
  {
    slug: "europe",
    name: "Europe",
    flag: "🇪🇺",
    code: "eu",
    image: "/europe.jpg",
    tagline: "Affordable or tuition-free degrees across Germany, France & more.",
    highlights: [
      "Affordable or tuition-free public universities",
      "Engineering, Business, IT & Hospitality",
      "Post-study work & residency pathways",
    ],
    description:
      "Several European countries — including Germany, France, the Netherlands, Finland, and Norway — have become popular among Nepalese students. Many public universities offer affordable or even tuition-free education, making Europe a cost-effective study destination. Students can explore specialised programs in Engineering, Business, IT, and Hospitality, with access to research-intensive courses. Many European nations also provide post-study work opportunities and pathways to residency.",
  },
];

export function getDestination(slug: string): Destination | undefined {
  return DESTINATIONS.find((d) => d.slug === slug);
}
