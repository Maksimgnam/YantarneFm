import { cookies } from "next/headers";
import Auth from "@/components/Auth";

export const metadata = {
  title: "YantarneFM | Auth",
  description: "YantarneFM | Auth",
};

export default function Page() {
  const cookieStore = cookies();
  const dealerCookie = cookieStore.get("dealer");

  const isDealer = dealerCookie?.value === "dealer";

  if (!isDealer) {
    return (
      <main className="w-full h-svh flex items-center justify-center">
        <h1 className="text-5xl text-center font-bold text-red-500">404 | Page Not Found</h1>
      </main>
    );
  }

  return (
    <main className="w-full h-svh">
      <Auth />
    </main>
  );
}
