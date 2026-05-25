import type { Metadata } from "next";
import { ShopFinder } from "@/components/login/ShopFinder";

export const metadata: Metadata = {
  title: "Sign in to your shop — OnFix POS",
  description:
    "Enter your shop ID to continue to your tenant's secure login page.",
};

export default function LoginPage() {
  return (
    <div className="min-h-screen pt-32 pb-24 flex items-center justify-center relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[80vw] h-[80vw] bg-primary/5 rounded-full blur-[150px] mix-blend-multiply dark:mix-blend-screen pointer-events-none" />
      <div className="container mx-auto px-6 max-w-md relative z-10">
        <ShopFinder />
      </div>
    </div>
  );
}
