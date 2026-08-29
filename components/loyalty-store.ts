"use client";

export type LoyaltyReward = {
  id: string;
  title: string;
  type: "voucher" | "gift";
  pointsCost: number;
  createdAt: string;
};

type LoyaltyState = {
  points: number;
  rewards: LoyaltyReward[];
};

const STORAGE_KEY = "hoaphuc-loyalty-v1";
const LOYALTY_EVENT = "hoaphuc-loyalty-updated";

function getDefaultState(): LoyaltyState {
  return {
    points: 0,
    rewards: [],
  };
}

function readState(): LoyaltyState {
  if (typeof window === "undefined") return getDefaultState();
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return getDefaultState();
    const parsed = JSON.parse(raw) as LoyaltyState;
    return {
      points: Number.isFinite(parsed?.points) ? Math.max(0, Math.floor(parsed.points)) : 0,
      rewards: Array.isArray(parsed?.rewards) ? parsed.rewards : [],
    };
  } catch {
    return getDefaultState();
  }
}

function writeState(state: LoyaltyState) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  window.dispatchEvent(new Event(LOYALTY_EVENT));
}

export function readLoyaltyPoints() {
  return readState().points;
}

export function readLoyaltyRewards() {
  return readState().rewards;
}

export function subscribeLoyalty(listener: () => void) {
  window.addEventListener("storage", listener);
  window.addEventListener(LOYALTY_EVENT, listener);
  return () => {
    window.removeEventListener("storage", listener);
    window.removeEventListener(LOYALTY_EVENT, listener);
  };
}

export function addLoyaltyPoints(points: number) {
  const current = readState();
  const next = {
    ...current,
    points: Math.max(0, current.points + Math.floor(points)),
  };
  writeState(next);
  return next.points;
}

export function canRedeem(pointsCost: number) {
  return readState().points >= pointsCost;
}

export function redeemLoyaltyReward(input: { title: string; type: LoyaltyReward["type"]; pointsCost: number }) {
  const current = readState();
  if (current.points < input.pointsCost) return null;

  const reward: LoyaltyReward = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    title: input.title,
    type: input.type,
    pointsCost: input.pointsCost,
    createdAt: new Date().toISOString(),
  };

  const next = {
    points: current.points - input.pointsCost,
    rewards: [reward, ...current.rewards],
  };

  writeState(next);
  return reward;
}

export function resetLoyaltyState() {
  writeState(getDefaultState());
}
