{
  "title": "Support Triage",
  "nodeCount": 3,
  "nodes": [
    {
      "id": "classify",
      "type": "prompt",
      "title": "Classify ticket",
      "next": [
        {
          "target": "draft-reply",
          "connectionType": "next"
        }
      ]
    },
    {
      "id": "draft-reply",
      "type": "prompt",
      "title": "Draft reply",
      "next": [
        {
          "target": "send",
          "connectionType": "next"
        }
      ]
    },
    {
      "id": "send",
      "type": "api",
      "title": "Send reply",
      "next": []
    }
  ]
}
