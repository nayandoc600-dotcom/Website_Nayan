export type Destination = {
  slug: string;
  name: string;
  tagline: string;
  flag: string;
  highlights: string[];
  description: string;
};

export const DESTINATIONS: Destination[] = [
  {
    slug: "japan",
    name: "Japan",
    flag: "🇯🇵",
    tagline: "World-class universities, rich culture, scholarship opportunities.",
    highlights: ["MEXT Scholarship", "Language support", "Part-time work rights"],
    description:
      "Japan offers excellent academic institutions and generous government scholarships. With strong demand for international students and a high quality of life, it remains one of Nepal's most popular study destinations.",
  },
  {
    slug: "united-kingdom",
    name: "United Kingdom",
    flag: "🇬🇧",
    tagline: "Russell Group universities and a global graduate network.",
    highlights: ["Graduate Route visa", "1–2 year programmes", "Global reputation"],
    description:
      "The UK's top universities are globally recognised, and the Graduate Route visa allows graduates to stay and work for two years after completing their degree.",
  },
  {
    slug: "australia",
    name: "Australia",
    flag: "🇦🇺",
    tagline: "Post-study work rights up to 6 years in a welcoming country.",
    highlights: ["485 Work visa", "Safe & multicultural", "Strong STEM & health programmes"],
    description:
      "Australia's Group of Eight universities rank among the world's best. Generous post-study work rights and a welcoming immigration pathway make it a top choice.",
  },
  {
    slug: "canada",
    name: "Canada",
    flag: "🇨🇦",
    tagline: "Clear immigration pathway with PR potential after graduation.",
    highlights: ["PGWP up to 3 years", "PR pathway", "Bilingual environment"],
    description:
      "Canada combines high-quality education with one of the clearest routes to permanent residency. The Post-Graduation Work Permit makes it attractive for long-term settlement.",
  },
  {
    slug: "usa",
    name: "USA",
    flag: "🇺🇸",
    tagline: "Ivy League to state universities — unmatched academic breadth.",
    highlights: ["F-1 visa OPT", "Research opportunities", "Campus life"],
    description:
      "The United States hosts the world's largest number of top-ranked universities. OPT allows graduates to work for up to three years after graduation in STEM fields.",
  },
  {
    slug: "south-korea",
    name: "South Korea",
    flag: "🇰🇷",
    tagline: "Affordable tuition, STEM excellence, growing global profile.",
    highlights: ["GKS Scholarship", "Affordable living", "Tech & engineering"],
    description:
      "South Korea is rising rapidly in global rankings, offering excellent STEM and business programmes at competitive costs. The Korean Government Scholarship is highly sought after.",
  },
  {
    slug: "germany",
    name: "Germany",
    flag: "🇩🇪",
    tagline: "Free or low-cost tuition at world-renowned public universities.",
    highlights: ["Tuition-free public unis", "Engineering hub", "18-month job seeker visa"],
    description:
      "Germany's public universities charge little to no tuition even for international students. The 18-month job-seeker visa is a major draw for graduates.",
  },
  {
    slug: "new-zealand",
    name: "New Zealand",
    flag: "🇳🇿",
    tagline: "Stunning landscapes, safe campuses, strong post-study rights.",
    highlights: ["Open Work Visa for partner", "Safe environment", "3-year PGWP"],
    description:
      "New Zealand universities consistently rank highly for student experience. The post-study work visa and the country's safe, welcoming reputation make it a rising destination.",
  },
];

export function getDestination(slug: string): Destination | undefined {
  return DESTINATIONS.find((d) => d.slug === slug);
}
