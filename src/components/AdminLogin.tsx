import { useEffect, useState, type FormEvent } from "react";
import { LockKeyhole } from "lucide-react";

interface AdminLoginProps {
  onAuthenticated: (token: string) => void;
}

export default function AdminLogin({ onAuthenticated }: AdminLoginProps) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    let active = true;
    const token = sessionStorage.getItem("pamlicious-admin-session");
    if (!token) {
      setIsChecking(false);
      return () => { active = false; };
    }

    fetch("/.netlify/functions/admin-auth", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((response) => {
        if (!response.ok) throw new Error("Session expired");
        if (active) onAuthenticated(token);
      })
      .catch(() => sessionStorage.removeItem("pamlicious-admin-session"))
      .finally(() => { if (active) setIsChecking(false); });

    return () => { active = false; };
  }, [onAuthenticated]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);
    try {
      const response = await fetch("/.netlify/functions/admin-auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const result = await response.json();
      if (!response.ok || !result.token) throw new Error(result.error || "Admin sign-in failed.");
      sessionStorage.setItem("pamlicious-admin-session", result.token);
      onAuthenticated(result.token);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Admin sign-in failed.");
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isChecking) {
    return <main className="min-h-[70vh] grid place-items-center font-['Outfit'] text-sm text-[#7A6960]">Checking admin session...</main>;
  }

  return (
    <main className="min-h-[70vh] flex items-center justify-center px-4 py-16">
      <form onSubmit={handleSubmit} className="w-full max-w-sm rounded-xl border border-[#E8D5CC] bg-white p-7 shadow-sm">
        <div className="mb-6 flex h-11 w-11 items-center justify-center rounded-full bg-[#FFF0F5] text-[#9B1C2E]">
          <LockKeyhole size={20} />
        </div>
        <h1 className="font-['Playfair_Display'] text-2xl font-bold text-[#2C2C2C]">Admin sign in</h1>
        <p className="mt-1 font-['Outfit'] text-sm text-[#7A6960]">Enter the dashboard password to continue.</p>
        <label htmlFor="admin-password" className="mt-6 mb-1 block font-['Outfit'] text-xs font-semibold uppercase tracking-wide text-[#7A6960]">
          Password
        </label>
        <input
          id="admin-password"
          type="password"
          autoComplete="current-password"
          required
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          className="w-full rounded-lg border border-[#E8D5CC] px-3 py-2.5 font-['Outfit'] text-sm text-[#2C2C2C] focus:border-[#9B1C2E] focus:outline-none focus:ring-2 focus:ring-[#9B1C2E]/20"
        />
        {error && <p role="alert" className="mt-3 font-['Outfit'] text-sm text-red-700">{error}</p>}
        <button
          type="submit"
          disabled={isSubmitting}
          className="mt-5 w-full rounded-full bg-[#9B1C2E] py-3 font-['Outfit'] text-sm font-semibold text-white transition hover:bg-[#7d1624] disabled:opacity-60"
        >
          {isSubmitting ? "Signing in..." : "Sign in"}
        </button>
      </form>
    </main>
  );
}