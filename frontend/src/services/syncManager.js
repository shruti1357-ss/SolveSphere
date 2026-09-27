import { getAll, put, STORES } from "./indexedDBService";
import { getPendingReports, removeQueuedReport, updateQueuedReport } from "./offlineQueue";

const listeners = new Set();
let isSyncing = false;
let initialized = false;
let retryTimer = null;

const notify = async (status, error = null) => {
  const pendingCount = (await getPendingReports()).length;
  listeners.forEach((listener) => listener({ status, error, pendingCount }));
};

function scheduleRetry(attempts) {
  if (retryTimer || !navigator.onLine) return;
  // Exponential backoff (capped) is friendlier to unreliable rural connections.
  const delay = Math.min(60_000, 1_000 * 2 ** Math.min(attempts, 6));
  retryTimer = window.setTimeout(() => {
    retryTimer = null;
    syncPendingReports();
  }, delay);
}

// The idempotency key ensures a retry cannot create a duplicate server record.
async function submitToServer(report) {
  const token =
    localStorage.getItem("solvesphere_access_token") ||
    localStorage.getItem("solvesphere_auth_token") ||
    localStorage.getItem("authToken") ||
    localStorage.getItem("token");

  const headers = {
    "Content-Type": "application/json",
    "Idempotency-Key": report.id || `RPT-${Date.now()}`,
  };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const endpoint = import.meta.env.VITE_REPORT_SUBMIT_URL || "/api/challenges/";
  const payload = report.backendPayload || report.payload || report;
  const response = await fetch(endpoint, {
    method: "POST",
    headers,
    credentials: "include",
    body: JSON.stringify(payload),
  });
  if (!response.ok) throw new Error(`Report sync failed (${response.status})`);
  return response.status === 204 ? null : response.json().catch(() => null);
}

export async function syncPendingReports() {
  if (isSyncing || !navigator.onLine) return;
  isSyncing = true;
  const syncedIds = [];
  await notify("syncing");
  try {
    const reports = await getPendingReports();
    for (const report of reports) {
      try {
        await updateQueuedReport(report, { status: "syncing" });
        await submitToServer(report);
        await removeQueuedReport(report.id);
        syncedIds.push(report.id);
      } catch (error) {
        const attempts = (report.attempts || 0) + 1;
        await updateQueuedReport(report, {
          status: attempts >= 3 ? "failed" : "pending",
          attempts,
          lastError: error.message || "Sync failed",
          lastAttemptAt: new Date().toISOString(),
        });
        await put(STORES.SYNC_METADATA, { key: "lastSyncError", value: error.message, updatedAt: new Date().toISOString() });
        if (attempts >= 3) {
          await removeQueuedReport(report.id);
        } else {
          await notify("failed", error.message);
          scheduleRetry(attempts);
          break;
        }
      }
    }
    const remaining = await getPendingReports();
    if (remaining.length === 0) {
      await put(STORES.SYNC_METADATA, { key: "lastSuccessfulSync", value: new Date().toISOString() });
      await notify("synced");
    }
  } finally {
    isSyncing = false;
  }
  return syncedIds;
}

export function subscribeToSyncStatus(listener) {
  listeners.add(listener);
  getPendingReports().then((reports) => listener({ status: "idle", pendingCount: reports.length }));
  return () => listeners.delete(listener);
}

export function initializeSyncManager() {
  if (initialized || typeof window === "undefined") return;
  initialized = true;
  const trySync = () => syncPendingReports();
  window.addEventListener("online", trySync);
  window.addEventListener("focus", trySync);
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "visible") trySync();
  });
  // Start-up sync covers reopened browsers and normal revisits.
  trySync();
}
