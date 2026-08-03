import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { AuthCard } from "@/features/auth/AuthCard";
import { useAuthStore } from "@/store/useAuthStore";

export function LoginForm() {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (email.trim() === "" || password.trim() === "") {
      setError("Please enter both email and password.");
      return;
    }

    setError(null);
    setIsSubmitting(true);

    // Mock login — no real backend/password check until Phase 6.
    // Simulated delay so the loading state is visibly testable.
    setTimeout(() => {
      login(
        { id: "1", name: "John Doe", email, role: "general" },
        "fake-jwt-token",
      );
      setIsSubmitting(false);
      navigate("/");
    }, 600);
  }

  return (
    <AuthCard
      title="Welcome back"
      subtitle="Sign in to FixBot"
      footer={
        <>
          Don't have an account?{" "}
          <Link to="/register" className="text-orange-400">
            Register
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Input
          label="Email"
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Input
          label="Password"
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {error && <p className="text-xs text-red-400">{error}</p>}
        <Button type="submit" variant="primary" disabled={isSubmitting}>
          {isSubmitting ? "Signing in..." : "Sign In"}
        </Button>
      </form>
    </AuthCard>
  );
}