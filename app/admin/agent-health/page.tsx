import { Suspense } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { connection } from "next/server";

import { sanityWriteClient } from "@/lib/sanity/client.server";
import {
  clearAgentSettingsCache,
  loadAgentSettings,
} from "@/lib/whatsapp/agent-settings";
import { runHealthChecks, type HealthStatus } from "@/lib/whatsapp/health";

export const metadata = {
  title: "Santé de l'assistante — Aïssa Events",
  robots: { index: false, follow: false },
};

function statusBadge(status: HealthStatus): { color: string; label: string; bg: string } {
  switch (status) {
    case "ok":
      return { color: "#15803d", label: "✓ OK", bg: "#dcfce7" };
    case "warning":
      return { color: "#a16207", label: "⚠ Attention", bg: "#fef3c7" };
    case "error":
      return { color: "#b91c1c", label: "✗ Erreur", bg: "#fee2e2" };
    case "not_configured":
      return { color: "#525252", label: "○ Non configuré", bg: "#f5f5f5" };
  }
}

async function togglePauseAction(formData: FormData) {
  "use server";
  const action = formData.get("action");
  const pause = action === "pause";
  const reason = (formData.get("reason") as string) ?? "";

  await sanityWriteClient
    .patch("agentSettings")
    .set({
      pauseAgent: pause,
      pauseReason: pause ? reason || "Activé depuis /admin/agent-health" : "",
      lastModifiedAt: new Date().toISOString(),
      lastModifiedBy: "admin-panel",
    })
    .commit();

  clearAgentSettingsCache();
}

interface PageProps {
  searchParams: Promise<{ secret?: string }>;
}

export default function AgentHealthPage({ searchParams }: PageProps) {
  // Cache Components (Next.js 16) : tout ce qui n'est pas mis en cache doit
  // vivre derrière Suspense. La page est statique, le contenu rend au runtime.
  return (
    <Suspense
      fallback={
        <main style={{ padding: 32, fontFamily: "system-ui" }}>
          Chargement…
        </main>
      }
    >
      <AgentHealthContent searchParams={searchParams} />
    </Suspense>
  );
}

async function AgentHealthContent({ searchParams }: PageProps) {
  await connection();
  const requiredSecret = process.env.ADMIN_AGENT_HEALTH_SECRET;
  if (!requiredSecret) {
    return (
      <main style={{ padding: 32, fontFamily: "system-ui", maxWidth: 720, margin: "0 auto" }}>
        <h1>Page non disponible</h1>
        <p>
          Cette page nécessite la variable d&apos;environnement{" "}
          <code>ADMIN_AGENT_HEALTH_SECRET</code>. Configure-la dans Vercel puis
          accède à la page avec <code>?secret=&lt;valeur&gt;</code>.
        </p>
      </main>
    );
  }

  const params = await searchParams;
  if (params.secret !== requiredSecret) {
    notFound();
  }

  const [checks, settings] = await Promise.all([
    runHealthChecks(),
    loadAgentSettings(),
  ]);

  const isPaused = settings.pauseAgent;

  return (
    <main
      style={{
        padding: "24px 16px",
        fontFamily: "system-ui, -apple-system, sans-serif",
        maxWidth: 720,
        margin: "0 auto",
        color: "#1a1a1a",
      }}
    >
      <header style={{ marginBottom: 32 }}>
        <h1 style={{ margin: 0, fontSize: 24 }}>Santé de l&apos;assistante</h1>
        <p style={{ color: "#666", margin: "4px 0 0", fontSize: 14 }}>
          État temps réel des dépendances et contrôle de l&apos;assistante virtuelle WhatsApp / Instagram.
        </p>
      </header>

      {/* Kill switch en premier — accessible en mobilité */}
      <section
        style={{
          background: isPaused ? "#fef3c7" : "#f0fdf4",
          border: `1px solid ${isPaused ? "#fde047" : "#bbf7d0"}`,
          borderRadius: 12,
          padding: 20,
          marginBottom: 32,
        }}
      >
        <h2 style={{ margin: 0, fontSize: 16 }}>
          {isPaused ? "⏸ Assistante en pause" : "🟢 Assistante active"}
        </h2>
        <p style={{ margin: "8px 0 16px", fontSize: 14, color: "#444" }}>
          {isPaused
            ? "L'assistante ne répond plus aux nouveaux messages. Aïssa doit répondre manuellement via WhatsApp Business."
            : "L'assistante répond automatiquement aux messages entrants. Pause-la en cas de dérapage."}
        </p>
        <form action={togglePauseAction}>
          {!isPaused && (
            <div style={{ marginBottom: 12 }}>
              <label style={{ display: "block", fontSize: 13, color: "#666", marginBottom: 4 }}>
                Raison (facultatif)
              </label>
              <input
                type="text"
                name="reason"
                placeholder="Ex: déploiement, problème ponctuel…"
                style={{
                  width: "100%",
                  padding: "8px 12px",
                  borderRadius: 6,
                  border: "1px solid #d4d4d4",
                  fontSize: 14,
                }}
              />
            </div>
          )}
          <button
            type="submit"
            name="action"
            value={isPaused ? "resume" : "pause"}
            style={{
              padding: "10px 20px",
              borderRadius: 6,
              border: "none",
              background: isPaused ? "#15803d" : "#b91c1c",
              color: "white",
              fontWeight: 600,
              fontSize: 14,
              cursor: "pointer",
            }}
          >
            {isPaused ? "▶ Réactiver l'assistante" : "⏸ Mettre en pause"}
          </button>
        </form>
      </section>

      <section>
        <h2 style={{ fontSize: 16, marginBottom: 12 }}>Dépendances externes</h2>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
          <tbody>
            {checks.map((check) => {
              const badge = statusBadge(check.status);
              return (
                <tr
                  key={check.name}
                  style={{ borderBottom: "1px solid #e5e5e5" }}
                >
                  <td style={{ padding: "12px 8px", fontWeight: 500 }}>{check.name}</td>
                  <td style={{ padding: "12px 8px", textAlign: "right" }}>
                    <span
                      style={{
                        display: "inline-block",
                        padding: "4px 10px",
                        borderRadius: 999,
                        background: badge.bg,
                        color: badge.color,
                        fontSize: 12,
                        fontWeight: 600,
                      }}
                    >
                      {badge.label}
                    </span>
                  </td>
                  <td
                    style={{
                      padding: "12px 8px",
                      color: "#666",
                      textAlign: "right",
                      maxWidth: 280,
                    }}
                  >
                    {check.detail}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </section>

      <section style={{ marginTop: 32 }}>
        <h2 style={{ fontSize: 16, marginBottom: 12 }}>Configuration agent</h2>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
          <tbody>
            <tr style={{ borderBottom: "1px solid #e5e5e5" }}>
              <td style={{ padding: "10px 8px", color: "#666" }}>Persona</td>
              <td style={{ padding: "10px 8px", fontWeight: 500 }}>
                {settings.personaName} ({settings.personaTone})
              </td>
            </tr>
            <tr style={{ borderBottom: "1px solid #e5e5e5" }}>
              <td style={{ padding: "10px 8px", color: "#666" }}>
                Triggers handover configurés
              </td>
              <td style={{ padding: "10px 8px" }}>
                {settings.triggersHandover.length || "0 (utilise défauts système)"}
              </td>
            </tr>
            <tr style={{ borderBottom: "1px solid #e5e5e5" }}>
              <td style={{ padding: "10px 8px", color: "#666" }}>FAQ prioritaires</td>
              <td style={{ padding: "10px 8px" }}>
                {settings.faqPrioritaires.length || "Aucune"}
              </td>
            </tr>
            <tr style={{ borderBottom: "1px solid #e5e5e5" }}>
              <td style={{ padding: "10px 8px", color: "#666" }}>
                Fourchettes prix publiques
              </td>
              <td style={{ padding: "10px 8px" }}>
                {settings.fourchettesPublic.length || "Aucune (l'agent évitera de citer des prix)"}
              </td>
            </tr>
            <tr style={{ borderBottom: "1px solid #e5e5e5" }}>
              <td style={{ padding: "10px 8px", color: "#666" }}>SLA heures ouvrées</td>
              <td style={{ padding: "10px 8px" }}>
                {settings.slaHeuresOuvreesMinutes} min
              </td>
            </tr>
            <tr style={{ borderBottom: "1px solid #e5e5e5" }}>
              <td style={{ padding: "10px 8px", color: "#666" }}>SLA hors heures</td>
              <td style={{ padding: "10px 8px" }}>{settings.slaHorsHeuresHours} h</td>
            </tr>
          </tbody>
        </table>
      </section>

      <footer style={{ marginTop: 48, fontSize: 12, color: "#999" }}>
        Pour modifier persona, ton, FAQ ou messages : ouvre{" "}
        <Link href="/studio" style={{ color: "#666" }}>
          Sanity Studio → Assistante virtuelle
        </Link>
        . Cette page est synchronisée toutes les 30 secondes via le cache.
      </footer>
    </main>
  );
}
