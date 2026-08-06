// src/app/login/page.tsx
import { signIn } from "@/auth";

export default function LoginPage() {
  return (
    <div style={{ display: "flex", justifyContent: "center", marginTop: "4rem" }}>
      <form
        action={async () => {
          "use server";
          await signIn("github", { redirectTo: "/dashboard" });
        }}
      >
        <button type="submit">Sign in with GitHub</button>
      </form>
    </div>
  );
}