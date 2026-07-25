// components/ai/MatchScoreCard.jsx
import { useEffect, useState } from "react";
import { analyzeApplication, getAnalysisByApplication } from "../../api/aiApi";

const LEVEL_COLOR_MAP = {
  gold: "text-gold border-gold/40 bg-gold/10",
  teal: "text-teal border-teal/40 bg-teal/10",
  coral: "text-coral border-coral/40 bg-coral/10",
};

// Placeholder generator — replace with real AI call once aiService.js is built.
// Produces a plausible-looking score + skill gaps based on the role name,
// just so the UI has something believable to render for now.
const SKILL_POOL = [
  "System Design", "Data Structures & Algorithms", "REST API Design",
  "Docker", "Unit Testing", "CI/CD", "SQL Optimization", "Cloud (AWS/GCP)",
  "TypeScript", "GraphQL", "Redis Caching", "Microservices",
];

function generateMockAnalysis() {
  const score = Math.floor(Math.random() * 46) + 50; // 50–95
  const shuffled = [...SKILL_POOL].sort(() => Math.random() - 0.5);
  const missingCount = score >= 75 ? 1 : score >= 50 ? 3 : 5;
  return {
    match_score: score,
    missing_skills: shuffled.slice(0, missingCount),
  };
}

export default function MatchScoreCard({ applicationId }) {
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    load();
  }, [applicationId]);

  async function load() {
    try {
      setLoading(true);
      const res = await getAnalysisByApplication(applicationId);
      if (res.success) {
        setAnalysis(res.analysis);
      }
    } catch (err) {
      // 404 is expected if no analysis exists yet — not a real error
      if (err?.response?.status !== 404) {
        setError(err?.response?.data?.message || "Failed to load analysis");
      }
    } finally {
      setLoading(false);
    }
  }

  async function handleAnalyze() {
    setError("");
    setAnalyzing(true);
    try {
      const mock = generateMockAnalysis();
      const res = await analyzeApplication({
        application_id: applicationId,
        ...mock,
      });
      if (res.success) {
        setAnalysis(res.analysis);
      } else {
        setError(res.message || "Failed to analyze");
      }
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to analyze");
    } finally {
      setAnalyzing(false);
    }
  }

  if (loading) {
    return (
      <div className="bg-panel border border-border rounded-2xl p-6">
        <p className="text-muted text-sm">Loading match analysis...</p>
      </div>
    );
  }

  return (
    <div className="bg-panel border border-border rounded-2xl p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-text font-semibold">AI Resume Match</h2>
        <button
          onClick={handleAnalyze}
          disabled={analyzing}
          className="text-gold text-xs font-semibold hover:underline disabled:opacity-50"
        >
          {analyzing ? "Analyzing..." : analysis ? "Re-analyze" : "Analyze Resume Match"}
        </button>
      </div>

      {error && <p className="text-coral text-xs mb-3">{error}</p>}

      {!analysis ? (
        <p className="text-muted text-sm">
          No analysis yet — click "Analyze Resume Match" to see how well your resume fits this role.
        </p>
      ) : (
        <div>
          <div className="flex items-center gap-4 mb-4">
            <div className="relative w-16 h-16 flex-shrink-0">
              <svg viewBox="0 0 64 64" className="w-16 h-16 -rotate-90">
                <circle cx="32" cy="32" r="26" fill="none" stroke="var(--color-border)" strokeWidth="6" />
                <circle
                  cx="32"
                  cy="32"
                  r="26"
                  fill="none"
                  stroke={
                    analysis.level_color === "gold"
                      ? "var(--color-gold)"
                      : analysis.level_color === "teal"
                      ? "var(--color-teal)"
                      : "var(--color-coral)"
                  }
                  strokeWidth="6"
                  strokeLinecap="round"
                  strokeDasharray={`${(analysis.match_score / 100) * (2 * Math.PI * 26)} ${2 * Math.PI * 26}`}
                />
              </svg>
              <span className="absolute inset-0 flex items-center justify-center text-text text-sm font-bold">
                {analysis.match_score}%
              </span>
            </div>

            <span
              className={`text-xs font-bold uppercase tracking-wide px-3 py-1.5 rounded-full border ${
                LEVEL_COLOR_MAP[analysis.level_color] ?? "text-muted border-border"
              }`}
            >
              {analysis.match_level}
            </span>
          </div>

          {analysis.missing_skills?.length > 0 && (
            <div>
              <p className="text-muted text-xs font-semibold uppercase tracking-wide mb-2">
                Skills to strengthen
              </p>
              <div className="flex flex-wrap gap-2">
                {analysis.missing_skills.map((skill) => (
                  <span
                    key={skill}
                    className="text-xs text-text bg-panel-2 border border-border rounded-full px-3 py-1"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}