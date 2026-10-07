# LegalEase — Implementation & Design Plan

## Product scope
LegalEase is a premium legal-tech workspace for generating, editing, organizing, branding, and exporting professional legal document drafts. The first release is fully usable without an API key through realistic local template generation, while keeping a clean service boundary for a future FastAPI/Gemini endpoint. The UI clearly states that generated content is a starting point and not legal advice.

## Design direction

- **Design movement:** editorial legal-tech / quiet luxury SaaS — an off-white paper canvas, ink-black typography, and a signature oxidized-copper accent that feels precise, credible, and human rather than “AI neon”.
- **Core principles:** 1) make the next action obvious, 2) treat documents as crafted objects, 3) show confidence without overclaiming legal authority, 4) keep dense information calm through generous spacing and clear hierarchy.
- **Color philosophy:** bone (#F4F0E9) is the document surface; ink (#18211F) is the trust anchor; slate (#6F7A76) is used for metadata; copper (#B76E4C) is the ownable LegalEase signal for actions, highlights, and completion states; moss (#8EA58B) supports positive status without feeling corporate.
- **Layout paradigm:** a persistent left rail anchors navigation and identity while the main workspace behaves like a paper desk: an editorial hero, a template strip, then a split “brief on the left / document object on the right” composition. On mobile the rail collapses into a compact header and the desk becomes a vertical sequence.
- **Signature elements:** a copper “seal” mark built from an L-shaped monogram and corner brackets; notebook-like document cards with ruled details; soft grain/noise and hairline rules used sparingly to make surfaces feel tactile.
- **Interaction philosophy:** actions are direct and reversible. Buttons use explicit verbs (“Generate draft”, “Open editor”, “Save changes”). Form feedback appears near the field, generated states use calm progress cues, and every destructive/clearing action has a clear affordance.
- **Animation:** 180–240ms ease-out transitions for panel/hover states; a subtle 1.8s sweep for generation progress; document cards lift by 2px on hover; no perpetual motion except the loading shimmer while generation is active.
- **Typography system:** `DM Sans` for interface and data, `Fraunces` for editorial headings and the document title. Headings are tight and slightly oversized; metadata is uppercase with 0.12em tracking; document body uses a readable 15px/1.75 measure.
- **Brand essence:** “Professional legal drafts, without the legal learning curve.” Personality: **considered, capable, reassuring**.
- **Brand voice:** headlines are short and specific; CTAs sound like a trusted operator. Example lines: “Turn a brief into a first draft.” / “Keep the language yours. We’ll keep the structure sharp.”
- **Wordmark & logo:** the LegalEase wordmark is paired with an outlined copper seal containing a right-angle L monogram and two document corner marks; the mark is used independently in the rail, favicon, and completion state.
- **Signature brand color:** oxidized copper `#B76E4C`, used only for LegalEase actions, seals, active states, and key document highlights.

## Implementation approach

- Use a lightweight React + TypeScript + Vite application with CSS variables and no component framework, keeping the UI easy to hand off.
- Organize by UI surface and service boundary: `src/components`, `src/data`, `src/services`, and `src/types`.
- Implement a local `DocumentGenerationService` that returns template-specific, populated drafts from the intake form. The function signature is intentionally API-shaped so it can later be swapped for `/api/generate` backed by FastAPI/Gemini without changing the UI.
- Keep recent documents and branding preferences in `localStorage`; all changes are client-side and survive refreshes.
- Implement downloads with browser-safe equivalents: plain text as `.txt`, styled HTML/Word-compatible content as `.doc` with an explanatory label for Word, and a generated minimal PDF byte stream with the document text. Also provide a print action for full-fidelity browser PDF output.
- Include a static `public/manus-routes.json` manifest with the single SPA route `/`.

## Project structure

```text
legalease/
├── public/
│   ├── legalease-mark.svg
│   └── manus-routes.json
├── src/
│   ├── components/
│   │   ├── BrandMark.tsx
│   │   ├── Sidebar.tsx
│   │   ├── Dashboard.tsx
│   │   ├── TemplateCard.tsx
│   │   ├── SetupPanel.tsx
│   │   ├── DraftPreview.tsx
│   │   ├── RecentDocuments.tsx
│   │   ├── BrandSettings.tsx
│   │   └── Toast.tsx
│   ├── data/templates.ts
│   ├── services/documentGenerator.ts
│   ├── styles/global.css
│   ├── types/index.ts
│   ├── App.tsx
│   └── main.tsx
├── app.config.ts
├── index.html
├── package.json
└── vite.config.ts
```

## Runtime and serving

- Preview runs on the configured port 3000 and binds to `0.0.0.0`.
- Vite serves the SPA and the static route manifest. No authentication or database is required for this first release.
- The server capability is enabled for future FastAPI/Gemini integration, but the delivered UI remains functional using the local generator fallback.
