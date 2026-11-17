# Release notes: claim attachments (photos and documents)

Tracking issue: [#38](https://github.com/thequantexplorer/claims-portal/issues/38)

> **Rollout status: PENDING.** This feature is not available yet. It ships only after
> both the claims-service attachment API PR and the claims-portal upload UI PR are
> merged and deployed. Do not publish these notes to customers until both are live.

## What's new (customer-facing)

You can attach photos and documents, such as damage photos and receipts, to an open
claim from the portal.

- **Supported file types:** JPEG (`.jpg`, `.jpeg`), PNG (`.png`) and PDF (`.pdf`).
- **File size:** up to 10 MB per file.
- **Number of files:** up to 20 files per claim.
- **Which claims:** only claims with the status **Received** (`SUBMITTED`) or
  **In review** (`IN_REVIEW`). Claims that are Approved, Not approved or Paid do not
  accept new files.
- **View and download:** you can see the list of files attached to your claim and
  download them.
- **Removing files:** not available in this release. Files cannot be deleted or
  replaced from the portal once attached.

### Receipts and other sensitive documents

Receipts, invoices and similar documents can contain personal or payment details.
Attachments are shown only to people who can already see the claim. Before uploading,
consider covering details the claim does not need, such as full card numbers.

## Rollout notes (internal)

| Step | Owner | Status |
| --- | --- | --- |
| claims-service attachment API (upload, list, download) merged and deployed | claims-service | Pending |
| claims-portal upload UI merged and deployed | claims-portal | Pending |
| Customer help article published | claims-portal | Pending |
| These release notes published | claims-portal | Pending, after the steps above |

Before publishing, confirm that the deployed behaviour matches the limits above:

- Uploads of other file types, files over 10 MB, or a 21st file on a claim are rejected.
- Uploads to claims in `APPROVED`, `DENIED` or `PAID` are rejected.
- A customer can list and download only attachments on their own claims.
- No delete or replace control is exposed in the portal.

If any of these differ in the shipped PRs, update this file before release.
