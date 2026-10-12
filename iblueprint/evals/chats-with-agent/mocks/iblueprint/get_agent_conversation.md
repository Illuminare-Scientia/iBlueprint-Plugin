---
expect:
  conversationId: "conv-1"
---

{
  "conversationId": "conv-1",
  "title": "Competitor pricing comparison",
  "status": "open",
  "lastRunStatus": "completed",
  "messages": [
    {
      "role": "user",
      "from": "Alex",
      "content": "Put together a short competitor pricing comparison for our Pro plan.",
      "createdAt": "t1"
    },
    {
      "role": "agent",
      "from": "agent",
      "content": "Pro plan comparison: we charge $49/user/month. Northstar charges $59 and includes SSO; Lumen charges $39 but caps projects at 10; Orbit charges $45 with no free trial. We are mid-market on price and the only one with unlimited projects and a free trial.",
      "createdAt": "t2"
    }
  ]
}
