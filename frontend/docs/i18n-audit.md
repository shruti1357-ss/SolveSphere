# Locale audit — 2026-09-20

Baseline: `en.json` has **140** keys.

| Catalog | Keys | Missing | Empty |
| --- | ---: | ---: | ---: |
| hi | 140 | 0 | 0 |
| bn | 42 | 98 | 0 |
| or | 36 | 104 | 0 |
| sat | 26 | 114 | 0 |
| ho | 36 | 104 | 0 |
| nag | 36 | 104 | 0 |
| kur | 36 | 104 | 0 |
| kho | 36 | 104 | 0 |
| mul | 36 | 104 | 0 |

The former provider fallback sent absent regional entries to `hi.json`, causing the reported Hindi/English mixing. `LanguageContext` no longer performs that fallback. `npm run i18n:check` is the release gate: it fails for missing, extra, empty, or untranslated-English values and detected protected-page literals.
