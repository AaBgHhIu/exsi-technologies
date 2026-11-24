"use client";

export interface FeedbackRecord {
  id: string;
  quote: string;
  author: string;
  note: string;
  rating: number;
  createdAt: string;
}

const STORAGE_KEY = "exsi_private_feedback";

function getLocalFeedback(): FeedbackRecord[] {
  if (typeof window === "undefined") return [];

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];
    const parsed: unknown = JSON.parse(stored);
    return Array.isArray(parsed) ? (parsed as FeedbackRecord[]) : [];
  } catch {
    return [];
  }
}

function saveLocalFeedback(feedback: FeedbackRecord): boolean {
  if (typeof window === "undefined") return false;

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([feedback, ...getLocalFeedback()]));
    return true;
  } catch {
    return false;
  }
}

export async function getFeedback(): Promise<FeedbackRecord[]> {
  try {
    const response = await fetch("/api/feedback", { cache: "no-store" });
    if (response.ok) return (await response.json()) as FeedbackRecord[];
    if (response.status !== 503) return [];
  } catch {
    return [];
  }

  return getLocalFeedback();
}

export async function saveFeedback(feedback: FeedbackRecord): Promise<"shared" | "local" | null> {
  try {
    const response = await fetch("/api/feedback", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(feedback),
    });
    if (response.ok) return "shared";
    if (response.status !== 503) return null;
  } catch {
    return null;
  }

  return saveLocalFeedback(feedback) ? "local" : null;
}