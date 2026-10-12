{
  "node": {
    "id": "fetch-invoices",
    "type": "api",
    "title": "Fetch invoices",
    "config": {
      "method": "GET",
      "url": "https://erp.acme.test/api/invoices?since={{date.yesterday}}",
      "headers": {
        "Authorization": "Bearer {{env.ERP_API_TOKEN}}"
      }
    }
  },
  "incoming": [],
  "outgoing": [
    {
      "target": "extract",
      "connectionType": "next"
    }
  ]
}
