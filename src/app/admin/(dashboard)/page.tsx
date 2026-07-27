import Link from "next/link";
import { db } from "@/lib/db";
import { FEATURED_LIMIT } from "@/lib/queries/projects";

export const dynamic = "force-dynamic";

export default async function AdminOverviewPage() {
  const [published, drafts, featured, recent, blocks] = await Promise.all([
    db.project.count({ where: { published: true } }),
    db.project.count({ where: { published: false } }),
    db.project.count({ where: { featured: true } }),
    db.project.findMany({
      orderBy: { updatedAt: "desc" },
      take: 6,
      select: { id: true, title: true, updatedAt: true, published: true, featured: true },
    }),
    db.contentBlock.count(),
  ]);

  const cards = [
    { label: "Published", value: published },
    { label: "Drafts", value: drafts },
    { label: "Featured", value: `${featured} / ${FEATURED_LIMIT}` },
    { label: "Copy blocks", value: blocks },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold">Overview</h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Everything the public site shows is editable from here.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {cards.map((card) => (
          <div
            key={card.label}
            className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900"
          >
            <p className="text-2xl font-semibold tabular-nums">{card.value}</p>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{card.label}</p>
          </div>
        ))}
      </div>

      {featured < FEATURED_LIMIT && (
        <p className="rounded-xl border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-900 dark:border-amber-800 dark:bg-amber-950/40 dark:text-amber-200">
          {FEATURED_LIMIT - featured} homepage slot{FEATURED_LIMIT - featured === 1 ? "" : "s"} still free.{" "}
          <Link href="/admin/projects" className="font-semibold underline">
            Choose which projects fill them
          </Link>
          .
        </p>
      )}

      <section className="rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
        <h2 className="border-b border-slate-200 px-4 py-3 text-sm font-semibold dark:border-slate-800">
          Recently edited
        </h2>
        <ul className="divide-y divide-slate-200 dark:divide-slate-800">
          {recent.map((project) => (
            <li key={project.id} className="flex items-center gap-3 px-4 py-3">
              <Link href={`/admin/projects/${project.id}`} className="min-w-0 flex-1 truncate text-sm hover:underline">
                {project.title}
              </Link>
              {project.featured && <span className="text-xs text-amber-500">{"★"}</span>}
              {!project.published && (
                <span className="rounded bg-slate-200 px-1.5 py-0.5 text-[10px] uppercase tracking-wide text-slate-600 dark:bg-slate-800 dark:text-slate-400">
                  Draft
                </span>
              )}
              <time className="shrink-0 text-xs text-slate-400" dateTime={project.updatedAt.toISOString()}>
                {project.updatedAt.toLocaleDateString("en-GB", { day: "numeric", month: "short" })}
              </time>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
