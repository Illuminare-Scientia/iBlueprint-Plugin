{
  "type": "prompt",
  "label": "Prompt",
  "config": {
    "promptText": {
      "type": "string",
      "required": true,
      "description": "Prompt sent to the model. Reference earlier step outputs with {{steps.<nodeId>.output}}."
    },
    "model": {
      "type": "string",
      "required": false,
      "description": "Model id; defaults to the blueprint's AI connection."
    }
  },
  "output": "The model's reply as text."
}
