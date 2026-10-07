# Personal Finance AI Agent 

An AI-powered personal finance assistant built with Node.js and Groq tool calling.

## What it does

The agent understands natural-language finance requests and uses backend tools to perform real financial operations such as:

- Checking account balance
- Retrieving transactions
- Calculating spending by category
- Setting monthly budgets
- Checking whether spending exceeds a budget

## Current Demo Scope

The current version uses an in-memory dataset to demonstrate the AI agent and tool-calling workflow.

For the demo, a default account (`acc123`) and user (`user123`) are used as the active user context.

MongoDB integration is planned as the next stage to provide persistent accounts, transactions, and budgets.

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