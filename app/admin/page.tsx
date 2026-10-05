import { createServiceClient } from "@/lib/supabase/service";

async function getStats() {
  const supabase = createServiceClient();
  const [
    { count: pendingTestimonials },
    { count: visaApprovals },
    { count: draftNews },
  ] = await Promise.all([
    supabase
      .from("testimonials")
      .select("*", { count: "exact", head: true })
      .eq("approved", false),
    supabase
      .from("visa_approvals")
      .select("*", { count: "exact", head: true }),
    supabase
      .from("news_posts")
      .select("*", { count: "exact", head: true })
      .eq("published", false),
  ]);
  return {
    pendingTestimonials: pendingTestimonials ?? 0,
    visaApprovals: visaApprovals ?? 0,
    draftNews: draftNews ?? 0,
  };
}

export default async function AdminDashboard() {
  const stats = await getStats();

  const CARDS = [
    {
      label: "Testimonials awaiting approval",
      value: stats.pendingTestimonials,
      href: "/admin/testimonials",
      urgent: stats.pendingTestimonials > 0,
    },
    {
      label: "Visa approvals on the website",
      value: stats.visaApprovals,
      href: "/admin/visa-approvals",
      urgent: false,
    },
    {
      label: "News posts in draft",
      value: stats.draftNews,
      href: "/admin/news",
      urgent: false,
    },
  ] as const;

  return (
    <div>
      <h1 className="font-display text-h2 font-semibold text-ink mb-2">
        Dashboard
      </h1>
      <p className="text-slate text-sm mb-8">
        Welcome back. Here&apos;s a quick view of what needs attention.
      </p>

      <div className="grid sm:grid-cols-3 gap-5 mb-10">
        {CARDS.map(({ label, value, href, urgent }) => (
          <a
            key={label}
            href={href}
            className={[
              "block rounded-xl border p-6 hover:shadow-sm transition-shadow",
              urgent ? "border-amber-300 bg-amber-50" : "border-sand bg-sky",
            ].join(" ")}
          >
            <p
              className={[
                "font-display text-4xl font-semibold mb-2",
                urgent ? "text-amber-600" : "text-brass",
              ].join(" ")}
            >
              {value}
            </p>
            <p className="text-sm text-slate">{label}</p>
          </a>
        ))}
      </div>

      <div className="bg-sand rounded-xl p-6">
        <h2 className="font-semibold text-ink text-sm mb-3">Quick links</h2>
        <ul className="text-sm text-brand space-y-2">
          <li>
            <a href="/admin/popup" className="hover:underline">
              Edit popup notice
            </a>
          </li>
          <li>
            <a href="/admin/visa-approvals" className="hover:underline">
              Upload a new visa approval
            </a>
          </li>
          <li>
            <a href="/admin/news" className="hover:underline">
              Write a news post
            </a>
          </li>
          <li>
            <a href="/admin/study-materials" className="hover:underline">
              Upload study material
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
}
