import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { AuthCard } from "@/features/auth/AuthCard";
import { useAuthStore } from "@/store/useAuthStore";
import { authService } from "@/services/auth.service";

export function LoginForm() {
  const navigate = useNavigate();
  const setUser = useAuthStore((state) => state.setUser);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (email.trim() === "" || password.trim() === "") {
      setError("Please enter both email and password.");
      return;
    }

    setError(null);
    setIsSubmitting(true);

    try {
      const { user } = await authService.login(email, password);
      setUser(user);
      navigate("/");
    } catch (err) {
      setError("Invalid email or password.");
    } finally {
      setIsSubmitting(false);
    }
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