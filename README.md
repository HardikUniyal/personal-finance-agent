# Personal Finance AI Agent 

An AI-powered personal finance assistant built with Node.js and Groq tool calling.

## What it does

The agent understands natural-language finance requests and uses backend tools to perform real financial operations such as:

- Checking account balance
- Retrieving transactions
- Calculating spending by category
- Setting monthly budgets
- Checking whether spending exceeds a budget

## How it works

```text
User
  ↓
Groq LLM
  ↓
Selects required tool
  ↓
Node.js executes the tool
  ↓
Tool returns structured data
  ↓
Groq processes the result
  ↓
Final response