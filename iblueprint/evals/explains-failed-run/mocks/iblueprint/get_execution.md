{
  "id": "7c6b5a4f-3e2d-4c1b-8a9f-8e7d6c5b4a3f",
  "status": "failed",
  "progress": 33,
  "totalSteps": 3,
  "completedSteps": 0,
  "failedSteps": 1,
  "blockingReason": "Step \"Fetch invoices\" failed",
  "steps": [
    {
      "nodeId": "fetch-invoices",
      "nodeName": "Fetch invoices",
      "nodeType": "api",
      "status": "failed",
      "error": "HTTP 401 Unauthorized from GET https://erp.acme.test/api/invoices?since=2026-10-07: token expired"
    }
  ],
  "recentLogs": [
    {
      "level": "error",
      "message": "Request failed with status 401: token expired",
      "nodeId": "fetch-invoices"
    }
  ]
}
