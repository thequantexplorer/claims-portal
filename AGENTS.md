# Northwind claims-portal: agent instructions

- Customer web portal. Node 22, no build step. `npm test` runs the unit tests. `npm start` serves http://localhost:3000 and proxies `/api` to claims-service (`CLAIMS_API`, default http://localhost:8080).
- Every bug fix ships with a regression test.
