import type { RandomUserResponse } from '../types/lion';

const RANDOM_USER_URL = (n: number): string =>
  `https://randomuser.me/api/?results=${encodeURIComponent(n)}&nat=us,gb,ca,au,nz`;

export async function fetchRandomUsers(count: number): Promise<RandomUserResponse> {
  const res = await fetch(RANDOM_USER_URL(count));
  if (!res.ok) {
    throw new Error(`HTTP ${res.status}`);
  }
  return res.json() as Promise<RandomUserResponse>;
}
