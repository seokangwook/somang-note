#!/usr/bin/env python3
"""소망노트 i18n 11개국 일괄 번역 — Gemini API"""

import json
import urllib.request
import urllib.error
import sys
import time
from pathlib import Path

sys.stdout.reconfigure(encoding="utf-8")
sys.stderr.reconfigure(encoding="utf-8")

API_KEY = Path("PINO_API/gemini_api_key.txt").read_text().strip() if Path("PINO_API/gemini_api_key.txt").exists() else Path("../PINO_API/gemini_api_key.txt").read_text().strip()
MODEL = "gemini-2.5-flash-lite"
URL = f"https://generativelanguage.googleapis.com/v1beta/models/{MODEL}:generateContent?key={API_KEY}"

ROOT = Path(__file__).resolve().parents[1]
KO_PATH = ROOT / "messages" / "ko.json"
KO = json.loads(KO_PATH.read_text(encoding="utf-8"))

TARGETS = {
    "es":    "Spanish (Español)",
    "pt-BR": "Brazilian Portuguese",
    "fr":    "French (Français)",
    "de":    "German (Deutsch)",
    "it":    "Italian (Italiano)",
    "ru":    "Russian (Русский)",
    "ar":    "Arabic (العربية)",
    "id":    "Indonesian (Bahasa Indonesia)",
    "hi":    "Hindi (हिन्दी)",
    "vi":    "Vietnamese (Tiếng Việt)",
    "th":    "Thai (ไทย)",
}

PROMPT_TMPL = """You are a localization expert. Translate the following Korean app strings JSON into {lang_name}.

CRITICAL:
- Output ONLY valid JSON (no markdown, no commentary).
- Preserve the exact JSON structure (keys, nesting).
- Keep brand name "소망노트" as a *localized* name if natural in that culture; otherwise use a clean transliteration or "Somang Note".
- "operated_by" must always remain "Operated by Revely" (literal English).
- Currency in "donate.silver" / "donate.gold" — convert ₩1,000 / ₩3,000 to the natural local equivalent (e.g. $0.99 / $2.99 for en, €0.99 / €2.99 for de). Keep the "실버 응원" / "골드 응원" wording style locally.
- Tone: warm, encouraging, not corporate. Match Korean source's gentle present-tense feel.
- Do not invent extra keys.

Source (Korean):
{source_json}

Now output the translated JSON."""

def call_gemini(prompt: str) -> str:
    body = {
        "contents": [{"role": "user", "parts": [{"text": prompt}]}],
        "generationConfig": {
            "temperature": 0.5,
            "maxOutputTokens": 4096,
            "responseMimeType": "application/json",
        },
        "safetySettings": [
            {"category": "HARM_CATEGORY_HARASSMENT", "threshold": "BLOCK_NONE"},
            {"category": "HARM_CATEGORY_HATE_SPEECH", "threshold": "BLOCK_NONE"},
            {"category": "HARM_CATEGORY_SEXUALLY_EXPLICIT", "threshold": "BLOCK_NONE"},
            {"category": "HARM_CATEGORY_DANGEROUS_CONTENT", "threshold": "BLOCK_NONE"},
        ],
    }
    req = urllib.request.Request(
        URL,
        data=json.dumps(body).encode("utf-8"),
        headers={"Content-Type": "application/json"},
    )
    with urllib.request.urlopen(req, timeout=90) as r:
        data = json.loads(r.read().decode("utf-8"))
    parts = data["candidates"][0]["content"]["parts"]
    return "".join(p.get("text", "") for p in parts)

source_json = json.dumps(KO, ensure_ascii=False, indent=2)

for code, name in TARGETS.items():
    out = ROOT / "messages" / f"{code}.json"
    print(f"[{code}] translating to {name}…", flush=True)
    prompt = PROMPT_TMPL.format(lang_name=name, source_json=source_json)
    try:
        raw = call_gemini(prompt)
        # strip code fences just in case
        raw = raw.strip().lstrip("```json").lstrip("```").rstrip("```").strip()
        parsed = json.loads(raw)
        # sanity: must have top-level keys
        if not all(k in parsed for k in ("common", "home", "wish", "tree", "share", "errors", "ads", "auth", "donate")):
            print(f"  [{code}] missing keys — skipped", flush=True)
            continue
        out.write_text(json.dumps(parsed, ensure_ascii=False, indent=2), encoding="utf-8")
        print(f"  [{code}] OK -> {out.relative_to(ROOT)}", flush=True)
    except urllib.error.HTTPError as e:
        body = e.read().decode("utf-8", errors="ignore")[:200]
        print(f"  [{code}] HTTP {e.code}: {body}", flush=True)
        if e.code == 429:
            print("  [stop] quota exhausted — remaining locales fall back to en", flush=True)
            break
    except Exception as e:
        print(f"  [{code}] error: {e}", flush=True)
    time.sleep(1.2)

print("done.")
