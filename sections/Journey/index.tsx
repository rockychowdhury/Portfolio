import { getJourney } from "@/lib/db/data/journey";
import JourneyClient from "./JourneyClient";

export default async function JourneySection() {
  const data = await getJourney();
  return <JourneyClient initialData={data as any[]} />;
}
