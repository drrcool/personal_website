import { redirect } from "next/navigation";

export default function HelplineHome() {
  // Automatically redirect anyone that lands on the helpline page to calls
  redirect("/helpline/calls");
}
