import type { Metadata } from "next";
import LoginForm from "./LoginForm";

export const metadata: Metadata = { title: "Admin Login" };

export default function LoginPage() {
  return <LoginForm />;
}
