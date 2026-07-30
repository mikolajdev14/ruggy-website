import type { Metadata } from "next";
import SetPasswordForm from "./set-password-form";

export const metadata: Metadata = {
  title: "Aktywacja konta",
  robots: { index: false, follow: false, noarchive: true },
};

export default function SetPasswordPage() {
  return <SetPasswordForm />;
}
