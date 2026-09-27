"""
Shared prompt + category list, used by both AI classification tiers
so the two providers behave identically and you only tune this in one place.

SolveSphere uses exactly 7 categories (do not add/remove without also updating
university_matcher.py, which maps each of these to real Jharkhand institutions).
"""

CATEGORIES = [
    "Water Management",
    "Agriculture & FoodTech",
    "Health & MedTech",
    "Sanitation & Waste",
    "Rural Infrastructure",
    "Smart Education",
    "Clean Energy",
]

ANALYSIS_PROMPT = """You are the AI triage engine for SolveSphere, a civic problem-reporting platform
for Jharkhand, India. A citizen has submitted the following problem report. Analyze it and return
ONLY a valid JSON object (no markdown, no commentary, no code fences) with exactly these fields:

{{
  "category": one of {categories},
  "severity_score": a float from 0.0 to 10.0 (higher = more urgent; weigh number of people affected,
      public safety risk, and how long the issue has persisted),
  "priority_score": integer from 1 to 100 (derived urgency ranking used for queue ordering),
  "summary": a 1-2 sentence neutral summary written for a government reviewer,
  "required_skills": array of 2-5 short skill/domain tags needed to solve this
      (e.g. "civil engineering", "water resource management", "agronomy"),
  "reasoning": one short sentence explaining the severity/priority you assigned
}}

Title: {title}
Description: {description}
Location: {location}
Evidence notes: {evidence}

Return ONLY the JSON object.
"""


def build_prompt(title, description, location, evidence):
    evidence_text = "; ".join(evidence) if evidence else "None provided"
    return ANALYSIS_PROMPT.format(
        categories=CATEGORIES,
        title=title,
        description=description,
        location=location,
        evidence=evidence_text,
    )
