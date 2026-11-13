# Connect the website to Google Sheets (about 10 minutes)

Every visitor registration, stand enquiry, contact message and brochure download is saved in MongoDB first, which is the safe master copy. It is then copied into a Google Sheet the team can work from. Status changes made in the admin panel, and gate check-ins, update the same row.

## 1. Create the sheet
1. Sign in to Google with the account that should own the leads, ideally a shared company account, not a personal one.
2. Create a new Google Sheet named **Nepal Wood 2027 — Leads**.
3. Share it (Viewer or Editor) with the sales team.

## 2. Add the script
1. In the sheet, open **Extensions → Apps Script**.
2. Delete the sample code, then paste in everything from [`Code.gs`](./Code.gs).
3. On the line `const SHARED_SECRET = '...'`, replace the value with a long random password, for example 30+ letters and numbers. Keep it private.
4. Click **Save**.

## 3. Deploy it as a web app
1. Click **Deploy → New deployment → ⚙ → Web app**.
2. Set **Execute as: Me** and **Who has access: Anyone**. "Anyone" is needed so the website server can post to it; the shared secret blocks everyone else.
3. Click **Deploy**, approve the permissions when Google asks (Advanced → Go to project), and copy the **Web app URL** (it ends in `/exec`).
4. Open that URL in a browser. You should see `{"ok":true,...}`.

## 4. Tell the website
Set these two environment variables on the hosting (for example Vercel → Project → Settings → Environment Variables), then redeploy:

```
SHEETS_WEBHOOK_URL=https://script.google.com/macros/s/XXXXXXXX/exec
SHEETS_WEBHOOK_SECRET=the-same-secret-you-put-in-Code.gs
```

## 5. Backfill and check
1. Open `/admin` → Overview, and click **Retry sync now** if it appears. Any leads collected before the sheet was connected will be copied in.
2. Submit a test visitor registration on the site. A **Visitors** tab should appear with the row within a few seconds.

## Tabs and columns
| Tab | One row per | Key column |
|---|---|---|
| Exhibitor enquiries | stand enquiry (status and notes update from the admin panel) | `ID` (EX-XXXXX) |
| Visitors | visitor badge (check-in time fills in at the gate) | `ID` (NW27-XXXXXX) |
| Enquiries | contact or sponsorship message | `ID` (EN-XXXXX) |
| Brochure downloads | brochure lead | `ID` (BR-XXXXX) |

You can add your own columns to the right (for example "Sales owner") and they won't be overwritten. Don't rename or reorder the `ID` column.

## If you change the script later
Use **Deploy → Manage deployments → Edit → Version: New version**. That keeps the same URL. A *new* deployment gets a new URL, and you would have to update `SHEETS_WEBHOOK_URL`.
