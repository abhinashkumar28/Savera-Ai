import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Zap, AlertCircle } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      await login(email, password);
      navigate("/dashboard");
    } catch (err: any) {
      setError(err.message || "Login failed. Please check your credentials.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-savera-bg flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2.5 mb-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-savera-rose/20 border border-savera-rose/30">
              <Zap className="h-6 w-6 text-savera-rose" />
            </div>
            <span className="text-xl font-semibold text-white tracking-tight">
              Savera<span className="text-savera-rose">AI</span>
            </span>
          </Link>
          <h1 className="text-2xl font-bold text-white mt-4">Welcome Back</h1>
          <p className="text-savera-text-dim mt-2">Sign in to access your energy dashboard</p>
        </div>

        {/* Login Form */}
        <div className="bg-savera-card border border-savera-border rounded-xl p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="flex items-start gap-2 p-3 rounded-lg bg-savera-danger/10 border border-savera-danger/30">
                <AlertCircle className="h-4 w-4 text-savera-danger flex-shrink-0 mt-0.5" />
                <p className="text-xs text-savera-danger">{error}</p>
              </div>
            )}

            <div>
              <label className="block text-xs font-medium text-savera-text-dim mb-1.5">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full rounded-lg border border-savera-border bg-savera-surface px-3 py-2.5 text-sm text-white placeholder:text-savera-text-dim focus:outline-none focus:border-savera-amber/50"
                placeholder="admin@savera.ai"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-savera-text-dim mb-1.5">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full rounded-lg border border-savera-border bg-savera-surface px-3 py-2.5 text-sm text-white placeholder:text-savera-text-dim focus:outline-none focus:border-savera-amber/50"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full rounded-lg bg-savera-rose px-4 py-2.5 text-sm font-semibold text-white hover:bg-savera-rose-light transition-colors disabled:opacity-50"
            >
              {isLoading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          {/* Demo credentials */}
          <div className="mt-6 pt-6 border-t border-savera-border">
            <p className="text-xs text-savera-text-dim mb-3">Demo credentials:</p>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-savera-text-dim">Admin:</span>
                <code className="text-savera-rose">admin@savera.ai / admin123</code>
              </div>
              <div className="flex justify-between">
                <span className="text-savera-text-dim">Manager:</span>
                <code className="text-savera-rose">rajesh@savera.ai / manager123</code>
              </div>
            </div>
          </div>
        </div>

        <p className="text-center text-xs text-savera-text-dim mt-6">
          Don't have an account? Contact your administrator.
        </p>
      </div>
    </div>
  );
}
