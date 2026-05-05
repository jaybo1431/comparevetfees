import { getAllPractices } from "@/lib/practices";
import HomePageClient from "@/components/HomePageClient";

export const revalidate = 60; // ISR — revalidate every 60 seconds

export default async function HomePage() {
  const practices = await getAllPractices();
  return <HomePageClient practices={practices} />;
}
