import { redirect } from "next/navigation";

export default function Page({ params }: { params: { status: string } }) {
  redirect("/dashboard");
}
