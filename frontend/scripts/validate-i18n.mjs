import { readFile, readdir } from "node:fs/promises";
import { resolve } from "node:path";

const localesDirectory = resolve("src/i18n/locales");
const base = JSON.parse(await readFile(resolve(localesDirectory, "en.json"), "utf8"));
const baseKeys = Object.keys(base).sort();
let invalid = false;

console.log(`Base locale (en.json): ${baseKeys.length} keys\n`);

for (const file of (await readdir(localesDirectory)).filter((name) => name.endsWith(".json") && name !== "en.json")) {
  const catalog = JSON.parse(await readFile(resolve(localesDirectory, file), "utf8"));
  const keys = Object.keys(catalog).sort();
  const missing = baseKeys.filter((key) => !(key in catalog) && !key.startsWith("citizen."));
  const extra = keys.filter((key) => !(key in base));
  const empty = keys.filter((key) => !String(catalog[key]).trim());
  const untranslated = keys.filter((key) => key !== "language.name" && !key.startsWith("citizen.") && catalog[key] === base[key]);
  const coverage = ((keys.length / baseKeys.length) * 100).toFixed(1);

  if (missing.length || extra.length || empty.length || untranslated.length) {
    invalid = true;
    console.error(`${file} (${coverage}% coverage)`);
    if (missing.length) console.error(`  missing (${missing.length}): ${missing.join(", ")}`);
    if (extra.length) console.error(`  extra (${extra.length}): ${extra.join(", ")}`);
    if (empty.length) console.error(`  empty (${empty.length}): ${empty.join(", ")}`);
    if (untranslated.length) console.error(`  untranslated English (${untranslated.length}): ${untranslated.join(", ")}`);
  } else {
    console.log(`${file}: ${keys.length} keys — ${coverage}% coverage ✓`);
  }
}

// Landing, citizen signup, and login pages must never reintroduce visible English literals.
const protectedFiles = [
  "src/components/landing/Navbar.jsx",
  "src/components/landing/Hero.jsx",
  "src/components/landing/Stats.jsx",
  "src/components/landing/HowItWorks.jsx",
  "src/components/landing/Features.jsx",
  "src/components/landing/Footer.jsx",
  "src/components/authentication/SignupForm.jsx",
  "src/components/authentication/LoginForm.jsx",
  "src/Pages/admin/GovtLoginPage.jsx",
];
const knownLiterals = [
  "How SolveSphere Works",
  "Platform Capabilities",
  "Problems reported",
  "Full name",
  "Email address",
  "Confirm password",
  "Already have an account?",
  "Welcome back",
  "Login to access your dashboard",
  "Enter your password",
  "Don't have an account?",
  "Government Sign In",
  "Official Access",
  "Enter passkey",
];
for (const file of protectedFiles) {
  const source = await readFile(resolve(file), "utf8");
  const leaked = knownLiterals.filter((literal) => source.includes(`>${literal}<`) || source.includes(`\"${literal}\"`));
  if (leaked.length) {
    invalid = true;
    console.error(`\n${file}\n  hardcoded UI: ${leaked.join(", ")}`);
  }
}

// Verify LegacyTextTranslator does NOT have Hindi fallback
const legacySource = await readFile(resolve("src/components/i18n/LegacyTextTranslator.jsx"), "utf8");
if (legacySource.includes("translations.hi[")) {
  invalid = true;
  console.error("\nLegacyTextTranslator.jsx still contains Hindi fallback (translations.hi[key])!");
}

if (invalid) process.exit(1);
console.log(`\ni18n validation passed: ${baseKeys.length} keys in every locale.`);
