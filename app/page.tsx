import { redirect } from "next/navigation";

export default function Home() {
  // Root path redirects to first step route.
  redirect("/upload");
}
