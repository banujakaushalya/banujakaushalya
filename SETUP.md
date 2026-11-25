# GitHub Profile Repository Setup

This repository powers the adaptive dark/light **Linear / Vercel Bento** profile for **[@banujakaushalya](https://github.com/banujakaushalya)**.

---

## 1. Update Your Social Links

Open [`README.md`](./README.md) and replace the three placeholders in the **Let's Connect** section:

- `https://linkedin.com/in/YOUR_LINKEDIN`
- `https://YOUR_PORTFOLIO_URL`
- `mailto:YOUR_EMAIL@example.com`

(Optional) You can also update the **POS System SaaS** and **Learn2Earn** project card links in `README.md` once their repositories are public or live.

---

## 2. Push to Your Profile Repository

Push all files in this directory (`README.md`, `SETUP.md`, `assets/`, and `.github/`) to the `main` branch of your special profile repository:

`https://github.com/banujakaushalya/banujakaushalya`

---

## 3. Enable Actions & Run Initial Live Sync

1. On GitHub, open **Settings → Actions → General**.
2. Under **Workflow permissions**, select **Read and write permissions** and click **Save**.
3. Open the **Actions** tab, select **Update Profile Analytics & Snake**, and click **Run workflow**.

Once complete, the workflow automatically commits fresh `assets/stats-*.svg` analytics and live `assets/snake-*.svg` contribution animations daily at `00:30 UTC`.

---

## 4. Optional: Include Private Repository Stats

By default, the workflow uses `GITHUB_TOKEN`, which indexes public contributions and public repository languages. To include **private repository commits and languages**:

1. Create a GitHub Personal Access Token (`read:user` + `repo` scopes).
2. Add it under **Settings → Secrets and variables → Actions** as `GH_METRICS_TOKEN`.
3. Re-run **Update Profile Analytics & Snake**.

---

## 5. Customize Cards & Tech Stack

All copy, featured projects, terminal lines, and tech stack badges are defined in [`.github/scripts/profile.config.mjs`](./.github/scripts/profile.config.mjs). After editing, regenerate all dark & light SVGs locally:

```bash
node .github/scripts/build_static_assets.mjs
node .github/scripts/generate_stats.mjs --seed
```
