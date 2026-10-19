# BHH Pharmacy Digital Hub

Responsive static portal for the pharmacy department of Bangkok Hospital Hatyai. Easy to host on GitHub Pages; no database, build framework, or API keys required.

## Features

- Beautiful, responsive desktop/mobile portal (navy/blue hospital-inspired design).
- 10 application links organized into Clinical, Operations, Resources, and Administration.
- Instant Thai/English search, category filters, keyboard shortcut `/` or `Ctrl/⌘ + K`.
- Favorites saved only in the current browser via localStorage.
- External apps open in a new browser tab.
- PediDose Admin opens a token-entry dialog. **No administrator token is embedded in this repository or saved in browser storage.**
- Works as plain HTML/CSS/JavaScript without dependencies or a build step.

## Applications

| App | Description | URL |
| --- | --- | --- |
| PediDose TH | ค้นหาและคำนวณขนาดยา | https://pedidose-th.bhh-infirmary-sandbox.workers.dev/ |
| PediDose Admin | จัดการยาและสูตรคำนวณ (requires private token) | https://pedidose-th.bhh-infirmary-sandbox.workers.dev/admin |
| Prescribing Error | ระบบความคลาดเคลื่อนการสั่งยา | https://juipharm.github.io/BHH_Prescribing_Error/ |
| Pharmacist Leave | ระบบจัดการวันลาเภสัชกร | https://juipharm.github.io/BHH_Pharmacist_Leave/ |
| Drug Price | ระบบค้นหาราคายา | https://juipharm.github.io/drug_price_app/ |
| Drug Formulary Admin | ระบบจัดการแบบฟอร์มบัญชียา | https://juipharm.github.io/BHH_drug-formulary-form-app/admin/ |
| Drug Formulary Form | แบบฟอร์มด้านบัญชียา | https://juipharm.github.io/BHH_drug-formulary-form-app/ |
| Vaccine Advisor | ระบบแนะนำวัคซีน | https://juipharm.github.io/Vaccine/ |
| NLEMz Explorer | สำรวจข้อมูลบัญชียาหลักแห่งชาติ | https://juipharm.github.io/NLEMz_Explorer/ |
| File & Image Hosting | จัดการไฟล์และรูปภาพ | https://juipharm.github.io/files-images_hosting/ |

> The request's item **11** did not include an URL, so no placeholder service was published.

## Deploy to GitHub Pages

The repository includes `.github/workflows/deploy.yml`. To activate Pages on a new repository:

1. Open **Settings → Pages** in GitHub.
2. Under **Build and deployment → Source**, choose **GitHub Actions**.
3. Open **Actions → Deploy BHH Pharmacy Portal → Run workflow**, or push a new commit to `main`.
4. Once the workflow reports success, browse **https://juipharm.github.io/Portal_App/**.

Later pushes to `main` will automatically deploy the site. The website must be publicly hosted only if the repository owner permits it.

## Edit or add apps

Modify the `APPS` array in `app.js`. Every item has `id`, `name`, `subtitle`, `description`, `category`, `icon`, `tone`, and `url`. Allowed categories: `clinical`, `operations`, `resources`, `admin`. For PediDose Admin use `restricted: true` (and **do not embed the administrator token**). You can edit headings and layout in `index.html` and styles in `styles.css`.

Locally preview via `python -m http.server 8000` then navigate to `http://localhost:8000/`. Check JS syntax with `node --check app.js`.

## Security & clinical note

This public portal links to third-party or independently maintained apps. Portal filters and the token dialog are **not** server-side authorization. Access to each administrator app must be protected at its own backend. PediDose's current admin integration passes the entered token to the destination via a URL query parameter, which may be exposed to browser history, logs, or copied links. The recommended longer-term approach is server-side login/session authentication in PediDose. Because a token was included in the original request, rotate that credential if it has been shared beyond intended administrators.

Any dosage, vaccine, or clinical guidance from the linked apps should be verified against current sources and local clinical policies before patient care.
