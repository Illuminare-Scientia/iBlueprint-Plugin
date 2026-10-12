---
type: llm
---

PASS if the reply says the run failed at the "Fetch invoices" step because the ERP API rejected the request with 401 Unauthorized (an expired or invalid token), and points the user at renewing the ERP token (the ERP_API_TOKEN environment variable or the ERP credentials).
FAIL if it blames a different step, gives a cause not supported by the run's error, or gives no actionable fix.
