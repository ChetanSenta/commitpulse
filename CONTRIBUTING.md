# 🤝 Contributing to CommitPulse

> **CommitPulse is built by the open-source community, for the open-source community.**
> Whether you're a first-year developer from India shipping your first PR, or a senior engineer with 10 years of SVG experience — you belong here. The only requirement is that you care about quality.

---

## 📋 Table of Contents

- [The Standard We Hold](#-the-standard-we-hold)
- [Local Setup](#-local-setup)
- [What to Contribute](#-what-to-contribute)
- [Automated Issue Management & Claiming](#-automated-issue-management--claiming)
- [Branch & Commit Conventions](#-branch--commit-conventions)
- [Opening a Pull Request](#-opening-a-pull-request)
- [Code Style & Quality Gates](#-code-style--quality-gates)
- [Community Guidelines](#-community-guidelines)

---

## 🏆 The Standard We Hold

CommitPulse is not a generic badge generator. It is a **premium, high-fidelity data visualization tool** with a distinct aesthetic identity.

Every contribution must uphold this standard. Before you open a PR, ask yourself:

> _"Does this look like something you'd find in a Dribbble showcase or a polished SaaS product — or does it look like a placeholder?"_

**If the answer is the latter, it's not ready yet.** This is not gatekeeping — it's respect for the developers who embed CommitPulse in their public profiles.

### What "Premium Quality" Means in Practice

- ✅ SVGs must use curated, harmonious color palettes — not arbitrary hex codes
- ✅ Animations must be smooth and purposeful — not distracting or janky
- ✅ Typography must match the `Syncopate` / `Space Grotesk` design system
- ✅ New themes must feel cohesive — every `bg`, `accent`, and `text` value must work _together_
- ❌ No raw, unstyled `<rect>` or `<text>` elements without intentional styling
- ❌ No flat, MS-Paint-level color combinations
- ❌ No breaking changes to the public API without a migration path

---

## 🛠️ Local Setup

Get CommitPulse running on your machine in under 5 minutes.

### Prerequisites

- **Node.js** `v18+`
- **npm** `v9+`
- A **GitHub Personal Access Token** — [generate one here](https://github.com/settings/tokens/new) with the `read:user` scope

### Step-by-Step

```bash
# Step 1 — Clone the repository
git clone https://github.com/JhaSourav07/commitpulse.git
cd commitpulse

# Step 2 — Install dependencies
npm install

# Step 3 — Create your local environment file
# Create a file named .env.local in the project root:
touch .env.local   # On Windows: New-Item .env.local
```

Open `.env.local` and add your token:

```env
GITHUB_TOKEN=ghp_your_personal_access_token_here
```

> **Why is this required?** The GitHub GraphQL API requires authentication. Without a valid `GITHUB_TOKEN`, every request to `/api/streak` will return a `401 Unauthorized` error and the badge will not render.

**Generating a Personal Access Token (classic):**
Go to **GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)** and click **Generate new token (classic)**. Enable the `read:user` scope, set an expiry, and copy the generated token into your `.env.local`.

```bash
# Step 4 — Start the dev server
npm run dev
```

Open your browser and test your changes:

```
http://localhost:3000/api/streak?user=YOUR_GITHUB_USERNAME
```

> **⚠️ Important:** Never commit your `.env.local` file or expose your `GITHUB_TOKEN`. It is already in `.gitignore`.

---

## 🎯 What to Contribute

We welcome contributions in three focused pillars. Staying within these areas ensures every PR adds clear, compounding value.

### 🎨 Pillar 1 — New Theme Design

Themes live in `lib/svg/themes.ts`. A theme is three properties: `bg`, `text`, and `accent` — but the _feeling_ a well-crafted theme creates is worth far more than the 3 lines of code.

**What makes a great theme:**

| Property | Guidance                                                                                                          |
| -------- | ----------------------------------------------------------------------------------------------------------------- |
| `bg`     | Should be dark (for the isometric glow to land) or intentionally light with high contrast. Avoid mid-range grays. |
| `accent` | This is the tower and glow color. It defines the entire personality of the card. Use saturated, vivid hues.       |
| `text`   | Must be readable against `bg` at small sizes. Test at `11px` (the label size).                                    |

**Theme checklist before submitting:**

- [ ] Tested against all 5 label/stat text sizes in the SVG
- [ ] Looks correct in both GitHub's Dark and Light browser modes
- [ ] Has a meaningful, memorable name (e.g., `aurora`, `synthwave`, `obsidian`)
- [ ] Added to the theme table in `README.md`

### 📐 Pillar 2 — Geometric SVG Improvements

The isometric renderer lives in `lib/svg/generator.ts`. This is where the 3D tower geometry, glow filters, and animations are built.

**Ideas we actively want:**

- More sophisticated `<feGaussianBlur>` filter chains for per-tower glow depth
- A radar/sonar ring animation layered over the monolith grid
- Height scaling improvements — the current `Math.min(count * 5, 50)` linear scale could be logarithmic for high contributors
- Responsive viewBox adjustments for different aspect ratios

**Rules for SVG changes:**

- All SVG must be **pure, self-contained** — no external image dependencies
- Animations use native SVG `<animate>` — do **not** introduce JavaScript-driven animations
- Test the output SVG in [SVG Viewer](https://www.svgviewer.dev/) before submitting
- Do not increase the `width`/`height` attributes beyond `600x420` without a strong reason
- All new visual data elements **must include a descriptive `<title>` tag** — accessibility (a11y) is non-negotiable for an elite builder community

### 🕐 Pillar 3 — Timezone Logic Optimization

The accuracy engine lives in `utils/time.ts` and `lib/calculate.ts`.

**Problems worth solving:**

- User-configurable timezone offsets (e.g., `?tz=Asia/Kolkata`) so the "today" boundary reflects the user's local day, not UTC
- Edge case: contributors who span the UTC midnight window and see their streak reset prematurely
- The grace period logic in `calculate.ts` could be extended to be configurable (e.g., `?grace=2` for 2-day grace)

**Rules for logic changes:**

- All logic changes must be backward-compatible (no breaking the default behavior)
- Include a code comment explaining _why_ the logic works, not just _what_ it does
- If you add a new URL parameter, document it in `README.md`'s parameter table

---

## 🤖 Automated Issue Management & Claiming

CommitPulse uses a custom, lightweight **GitHub Actions** automation system to manage issues fairly. This ensures that everyone (especially during events like **GSSoC**) gets a chance to contribute and prevents "issue hoarding".

> [!IMPORTANT]
> **The Golden Rule:** You can only be assigned to **ONE** open issue at a time. Finish it or unassign yourself before claiming another.

### 🎮 Available Commands

Our automation runs entirely through issue comments. Here is how you interact with it:

| Command                       | Who Can Use It?      | What It Does                                              |
| ----------------------------- | -------------------- | --------------------------------------------------------- |
| `/claim`                      | **Anyone**           | Self-assigns the issue to you.                            |
| `/addlabel <label1> <label2>` | **Anyone**           | Adds labels to the issue (e.g. `/addlabel frontend bug`). |
| `/unassign @username`         | **Maintainers Only** | Removes the assignee from an issue.                       |
| `/assign @username`           | **Maintainers Only** | Manually assigns someone to an issue.                     |

### ⏳ The Inactivity Policy (Assignment Expiry)

To keep the project moving, assignments are not permanent.

- **The 3-Day Rule:** If an issue has an assignee but sees **no activity for 3 days**, our automated background job will remove the assignment.
- **What counts as activity?** Posting a comment, opening a linked PR, or a maintainer adding a label.
- **Why?** It frees up stale issues so other active contributors can pick them up. If your issue expires, you can always `/claim` it again if it's still available!

### 💡 GSSoC Contributor Flow

1. Find an unassigned open issue you want to work on.
2. Comment `/claim` to lock it in.
3. Need labels? Comment `/addlabel good-first-issue` (labels must already exist in the repo).
4. Work on your code and submit a PR within 3 days to avoid expiry.
5. Once your PR is merged and the issue is closed, you can `/claim` your next one!

### 🆘 Troubleshooting & Edge Cases

If the bot rejects your command, check these common scenarios:

- **"Commands cannot be used on closed issues"**: You cannot claim, assign, or unassign on closed issues. Find an open one!
- **"You already have an active assigned issue"**: You must finish your current task. If you're stuck, ask a maintainer to `/unassign` you from the old one.
- **"This issue is already assigned to @username"**: Be faster next time! Look for issues without assignees.
- **"The following label(s) do not exist"**: You can only add existing repo labels. The bot will reply with a list of valid labels you can use.
- **"You don't have permission"**: You tried to use `/assign` or `/unassign`. Please use `/claim` instead.

---

## 🌿 Branch & Commit Conventions

### Branch Naming

Use the following format: `type/short-description`

| Branch Type     | Example                      |
| --------------- | ---------------------------- |
| New theme       | `feat/theme-aurora`          |
| SVG improvement | `feat/tower-glow-filter`     |
| Bug fix         | `fix/streak-grace-period`    |
| Timezone work   | `fix/utc-midnight-edge-case` |
| Documentation   | `docs/readme-update`         |
| Refactor        | `refactor/generator-cleanup` |

### Commit Messages

Write **atomic commits** — one logical change per commit. Follow the [Conventional Commits](https://www.conventionalcommits.org) standard:

```
type(scope): short description in lowercase

# Examples:
feat(themes): add aurora preset with teal-pink palette
fix(calculate): handle grace period when today has zero contributions
docs(readme): add aurora theme to parameter table
refactor(generator): extract tower path builder into helper function
```

**Types:** `feat`, `fix`, `docs`, `refactor`, `chore`, `test`

> **One commit should do one thing.** A PR with 15 commits that all say "update" will be asked to be squashed before merging.

---

## 🔁 Opening a Pull Request

1. **Fork** and **Star** the repository and create your branch off `main`
2. **Make your changes** following the pillar guidelines above
3. **Test locally** — verify the SVG renders correctly at `localhost:3000/api/streak?user=YOUR_USERNAME`
4. **Open a PR** with the following template filled out:

```md
## Description

Fixes # (issue number)

## Pillar

- [ ] 🎨 Pillar 1 — New Theme Design
- [ ] 📐 Pillar 2 — Geometric SVG Improvement
- [ ] 🕐 Pillar 3 — Timezone Logic Optimization
- [ ] 🛠️ Other (Bug fix, refactoring, docs)

## Visual Preview

## Checklist before requesting a review:

- [ ] I have read the `CONTRIBUTING.md` file.
- [ ] I have tested these changes locally (`localhost:3000/api/streak?user=YOUR_USERNAME`).
- [ ] I have run `npm run format` and `npm run lint` locally and resolved all errors (CI will fail otherwise).
- [ ] My commits follow the Conventional Commits format (e.g., `feat(themes): ...`, `fix(calculate): ...`).
- [ ] I have updated `README.md` if I added a new theme or URL parameter.
- [ ] I have started the repo.
- [ ] I have made sure that i have only one commit to merge in this PR.
- [ ] The SVG output matches the CommitPulse "premium quality" aesthetic standard (no raw elements, smooth animations, correct fonts).
- [ ] (Recommended) I joined the CommitPulse Discord server for faster collaboration, mentorship, and PR support.
```

[![Join CommitPulse Discord](https://img.shields.io/badge/Join-CommitPulse%20Discord-5865F2?style=for-the-badge&logo=discord&logoColor=white)](https://discord.gg/Cb73bS79j)

> **PRs without a visual preview for any SVG-touching changes will be asked for one before review.**

---

## 🧹 Code Style, Testing & Quality Gates

CommitPulse enforces code quality using **ESLint** (correctness & TypeScript rules), **Prettier** (consistent formatting), and **Vitest** (unit and integration testing). All of these run automatically in CI on every PR — there are no exceptions.

### Before Every Commit

Run these three commands locally before you open a PR:

```bash
# 1. Auto-format all files to match the project's Prettier config
npm run format

# 2. Check for any remaining linting errors
npm run lint

# 3. Ensure all tests pass
npm run test
```

Fix every error before pushing. If you add new logic or features, you are expected to write tests for them.

### Testing Guidelines

We use **Vitest** alongside **React Testing Library** for our test suite.

- **File Naming:** Test files must be co-located with the code they test and end in `.test.ts` or `.test.tsx` (e.g., `lib/calculate.test.ts`).
- **Unit Tests:** All core utility and calculation functions (like streak counting or timezone logic) must have exhaustive unit tests covering edge cases (zero contributions, grace periods, leap years).
- **Component Tests:** UI components must verify correct rendering, prop handling, and accessibility. We mock animation libraries (like `framer-motion`) to keep DOM tests stable.
- **API Tests:** API routes must be tested to ensure correct status codes, caching headers, and parameter validation. External network calls (like the GitHub GraphQL API) must be mocked using `vi.spyOn(global, 'fetch')` so tests are fast, deterministic, and run offline.
- **Humanic Comments:** Comments in test files should explain _why_ a test exists or what specific edge-case it covers, rather than just repeating what the code does line-by-line.

> **🚨 GitHub Actions CI Gate**
> Our CI pipeline runs `npm run lint`, `npm run format --check`, and `npm run test` automatically on **every pull request**. If your code fails any check, **the PR will be blocked from merging** until the issues are resolved. There is no way to bypass this gate — so run the commands locally first and save yourself the round-trip.

**Key style rules:**

- All functions must have **explicit TypeScript return types**
- Use the `BadgeParams`, `StreakStats`, and `BadgeTheme` interfaces from `types/index.ts` — **never use `any`**; create a typed interface for the data shape instead
- SVG strings in `generator.ts` should remain readable — don't minify or compress them inline
- Comments should explain _intent_, not repeat the code. `// Calculate streak` is useless. `// Grace period: a streak survives a missed day to handle timezones` is valuable.

---

## 🌍 Community Guidelines

CommitPulse is a project built by a first-year developer for the **Web3 and open-source community**. That means this is a space where learning is celebrated, not hidden.

- **Ask questions freely.** Open a GitHub Discussion or comment on an Issue.
- **Teach, don't gatekeep.** If you see a mistake in someone's PR, explain why it's wrong and how to fix it.
- **Ship complete work.** Half-done PRs stall. If you start something, try to bring it to a mergeable state.
- **Credit others.** If your implementation is inspired by another project, say so in your PR description or code comment.

---

## ❓ Not Sure Where to Start?

Check the open issues tagged:

- [`good first issue`](https://github.com/JhaSourav07/commitpulse/issues?q=is%3Aissue+is%3Aopen+label%3A%22good+first+issue%22) — Beginner-friendly
- [`theme-request`](https://github.com/JhaSourav07/commitpulse/issues?q=is%3Aissue+is%3Aopen+label%3Atheme-request) — Design contributions
- [`svg-enhancement`](https://github.com/JhaSourav07/commitpulse/issues?q=is%3Aissue+is%3Aopen+label%3Asvg-enhancement) — Geometric improvements

---

<div align="center">

_Thank you for contributing. Every PR — no matter the size — makes CommitPulse better for every developer who uses it._

**— Sourav Jha, Maintainer**

</div>
