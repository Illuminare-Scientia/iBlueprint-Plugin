{
  "id": "5d0e7b2c-1a3f-4e5d-9c8b-7a6f5e4d3c21",
  "status": "completed",
  "progress": 100,
  "totalSteps": 3,
  "completedSteps": 3,
  "failedSteps": 0,
  "blockingReason": null,
  "awaitingInput": null,
  "steps": [
    {
      "nodeId": "fetch",
      "nodeName": "Fetch sales",
      "nodeType": "api",
      "status": "completed",
      "output": "{\"rows\": 1843}"
    },
    {
      "nodeId": "analyze",
      "nodeName": "Analyze",
      "nodeType": "prompt",
      "status": "completed",
      "output": "Computed weekly totals."
    },
    {
      "nodeId": "summary",
      "nodeName": "Write summary",
      "nodeType": "prompt",
      "status": "completed",
      "output": "EMEA revenue was $4.2M last week, up 6% week over week. Top product: Atlas Pro. Germany grew fastest (+11%)."
    }
  ],
  "recentLogs": []
}
