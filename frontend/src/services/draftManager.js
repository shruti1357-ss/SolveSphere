import { get, getAll, put, remove, STORES } from "./indexedDBService";

export const ACTIVE_REPORT_DRAFT_ID = "active-report-draft";

export async function saveDraft({ formData, currentStep, selectedRole, id = ACTIVE_REPORT_DRAFT_ID }) {
  const draft = { id, formData, currentStep, selectedRole, updatedAt: new Date().toISOString() };
  await put(STORES.REPORT_DRAFTS, draft);
  return draft;
}

export const getDraft = (id = ACTIVE_REPORT_DRAFT_ID) => get(STORES.REPORT_DRAFTS, id);
export const clearDraft = (id = ACTIVE_REPORT_DRAFT_ID) => remove(STORES.REPORT_DRAFTS, id);
export const getAllDrafts = () => getAll(STORES.REPORT_DRAFTS);
