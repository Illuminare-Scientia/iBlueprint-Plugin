{
  "node": {
    "id": "fetch-invoices",
    "type": "api",
    "title": "Fetch invoices",
    "config": {
      "method": "GET",
      "url": "https://erp.acme.test/api/invoices?since={{date.yesterday}}",
      "connection": "Acme ERP service account"
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
