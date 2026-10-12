{
  "title": "Invoice Parser",
  "nodeCount": 3,
  "nodes": [
    {
      "id": "fetch-invoices",
      "type": "api",
      "title": "Fetch invoices",
      "next": [
        {
          "target": "extract",
          "connectionType": "next"
        }
      ]
    },
    {
      "id": "extract",
      "type": "prompt",
      "title": "Extract line items",
      "next": [
        {
          "target": "save",
          "connectionType": "next"
        }
      ]
    },
    {
      "id": "save",
      "type": "api",
      "title": "Save to ledger",
      "next": []
    }
  ]
}
