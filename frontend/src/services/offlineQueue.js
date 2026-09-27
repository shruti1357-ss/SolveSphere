import { getAll, put, remove, STORES } from "./indexedDBService";

const now = () => new Date().toISOString();

export async function enqueueReport(report) {
  const item = {
    ...report,
    id: report.id || crypto.randomUUID(),
    status: "pending",
    attempts: 0,
    createdAt: report.createdAt || now(),
    updatedAt: now(),
    lastError: null,
  };
  await put(STORES.PENDING_REPORTS, item);
  return item;
}

export async function getPendingReports() {
  const reports = await getAll(STORES.PENDING_REPORTS);
  return reports.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
}

export async function updateQueuedReport(report, updates) {
  const next = { ...report, ...updates, updatedAt: now() };
  await put(STORES.PENDING_REPORTS, next);
  return next;
}

export const removeQueuedReport = (id) => remove(STORES.PENDING_REPORTS, id);

export async function pendingReportCount() {
  return (await getPendingReports()).length;
}
