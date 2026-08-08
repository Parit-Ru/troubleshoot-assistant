import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { AuthCard } from "@/features/auth/AuthCard";
import { useAuthStore } from "@/store/useAuthStore";
import { authService } from "@/services/auth.service";

export function RegisterForm() {
  const navigate = useNavigate();
  const setUser = useAuthStore((state) => state.setUser);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (name.trim() === "" || email.trim() === "" || password.trim() === "") {
      setError("Please fill in all fields.");
      return;
    }

    setError(null);
    setIsSubmitting(true);

    try {
      const { user } = await authService.register(email, password, name);
      setUser(user);
      navigate("/");
    } catch (err) {
      setError("Registration failed. Email may already be in use.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <AuthCard
      title="Create your account"
      subtitle="Get started with FixBot"
      footer={
        <>
          Already have an account?{" "}
          <Link to="/login" className="text-orange-400">
            Sign In
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Input label="Full Name" placeholder="John Doe" value={name} onChange={(e) => setName(e.target.value)} />
        <Input label="Email" type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
        <Input label="Password" type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} />
        {error && <p className="text-xs text-red-400">{error}</p>}
        <Button type="submit" variant="primary" disabled={isSubmitting}>
          {isSubmitting ? "Creating account..." : "Create Account"}
        </Button>
      </form>
    </AuthCard>
  );
}