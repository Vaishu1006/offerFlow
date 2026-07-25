// pages/auth/Login.jsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  
  const handleSubmit = async (e) => {
  e.preventDefault();
  setError("");
  setLoading(true);

  try {
    const res = await login(formData);
    if (res.success) {
      if (res.user.role === "admin") {
        navigate("/admin/dashboard");
      } else {
        navigate("/dashboard");
      }
    } else {
      setError(res.message || "Invalid credentials");
    }
  } catch (err) {
    setError(err?.response?.data?.message || "Login failed. Try again.");
  } finally {
    setLoading(false);
  }
};

  return (
    <>
      {/* Logo / Tagline */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold">
          <span className="text-text">Offer</span>
          <span className="text-gold">Flow</span>
        </h1>
        <p className="text-muted text-sm mt-2">
          Track every application, interview, and offer in one place.
        </p>
      </div>

      {/* Card */}
      <div className="w-full max-w-md bg-panel border border-border rounded-2xl p-8 shadow-xl">
        <h2 className="text-xl font-bold text-text mb-6">Welcome back</h2>

        {error && (
          <div className="mb-4 text-sm text-coral bg-coral/10 border border-coral/30 rounded-lg px-3 py-2">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm text-muted mb-1.5">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full bg-panel-2 border border-border focus:border-gold rounded-lg px-4 py-2.5 text-text placeholder-muted outline-none focus:ring-2 focus:ring-gold/30 transition"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm text-muted mb-1.5">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full bg-panel-2 border border-border focus:border-gold rounded-lg px-4 py-2.5 text-text placeholder-muted outline-none focus:ring-2 focus:ring-gold/30 transition"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gold hover:opacity-90 disabled:opacity-60 disabled:cursor-not-allowed text-gold-ink font-semibold rounded-lg py-2.5 transition"
          >
            {loading ? "Logging in..." : "Log in"}
          </button>
        </form>
      </div>

      {/* Footer link */}
      <p className="text-muted text-sm mt-6">
        Don't have an account?{" "}
        <Link to="/register" className="text-gold font-medium hover:underline">
          Register
        </Link>
      </p>
    </>
  );
}