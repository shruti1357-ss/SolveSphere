import { useEffect, useRef } from "react";
import { translations } from "../../i18n/translations";
import { useLanguage } from "../../context/LanguageContext";

// Compatibility bridge for legacy components while their literals are migrated to t().
// It only translates exact, known UI labels and never touches fields, code, or user data.
const legacyKeys = {
  "Dashboard": "common.dashboard", "Profile": "common.profile", "Settings": "common.settings",
  "Notifications": "common.notifications", "Help Center": "common.help", "Analytics": "common.analytics",
  "Reports": "common.reports", "Search": "common.search", "Save": "common.save", "Cancel": "common.cancel",
  "Submit": "common.submit", "Loading...": "common.loading", "Online": "common.online", "Offline": "common.offline",
  "Pending": "common.pending", "Monitoring": "common.monitoring", "Projects": "common.projects", "Map": "common.map",
  "Back": "common.back", "Next": "common.next", "Close": "common.close", "Report Problem": "nav.report",
  "Challenges": "nav.challenges", "Log In": "nav.login", "Sign Up": "nav.signup", "Logout": "nav.logout",
  "Government": "module.government", "Industry": "module.industry", "University": "module.university",
  "Citizen": "module.citizen", "Innovation Challenges": "module.innovationChallenges",
  "Startup Collaboration": "module.startupCollaboration", "Project Tracking": "module.projectTracking",
  "Research Projects": "module.researchProjects", "Student Participation": "module.studentParticipation",
  "Innovation Submissions": "module.innovationSubmissions", "Problem Management": "module.problemManagement",
  "Department Assignment": "module.departmentAssignment", "Resolution Tracking": "module.resolutionTracking",
};

export default function LegacyTextTranslator() {
  const { language } = useLanguage();
  const originals = useRef(new WeakMap());

  useEffect(() => {
    if (!language) return undefined;
    const translateNode = (node) => {
      const parent = node.parentElement;
      if (!parent || ["SCRIPT", "STYLE", "TEXTAREA", "OPTION"].includes(parent.tagName)) return;
      const original = originals.current.get(node) || node.nodeValue;
      const key = legacyKeys[original?.trim()];
      if (!key) return;
      originals.current.set(node, original);
      node.nodeValue = original.replace(original.trim(), translations[language]?.[key] || original.trim());
    };
    const translateTree = (root = document.body) => {
      const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
      let node;
      while ((node = walker.nextNode())) translateNode(node);
    };
    translateTree();
    const observer = new MutationObserver((mutations) => mutations.forEach((mutation) => {
      mutation.addedNodes.forEach((node) => {
        if (node.nodeType === Node.TEXT_NODE) translateNode(node);
        else if (node.nodeType === Node.ELEMENT_NODE) translateTree(node);
      });
    }));
    observer.observe(document.body, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, [language]);
  return null;
}
