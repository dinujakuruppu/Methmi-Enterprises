import type { Tour } from "@/types/tour";
import type { Vehicle } from "@/types/vehicle";

export const BACKEND_URL =
  process.env.BACKEND_INTERNAL_URL ||
  process.env.BACKEND_URL ||
  "http://localhost:4000";

async function get<T>(path: string): Promise<T> {
  const response = await fetch(new URL(path, BACKEND_URL), {
    cache: "no-store",
    headers: { Accept: "application/json" },
  });

  if (!response.ok) {
    throw new Error(`Backend request failed: ${response.status}`);
  }

  return response.json();
}

export async function getAllTours() {
  return (await get<{ tours: Tour[] }>("/api/tours")).tours;
}

export async function getAllVehicles() {
  return (await get<{ vehicles: Vehicle[] }>("/api/vehicles")).vehicles;
}
