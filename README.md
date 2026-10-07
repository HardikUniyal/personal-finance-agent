# Personal Finance AI Agent

An AI-powered personal finance assistant built with Node.js and Groq tool calling.

## What It Does

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

## How It Works

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
```

The LLM understands the user's request and selects the required tool. The backend performs the actual financial calculations and data processing.

## Current Implementation

The project structure has been organized into separate files for the server, tools, database connection, models, and seed data.

For the current working demo, the complete functional implementation is intentionally kept in `server.js`. This is a deliberate choice for the current demo and not an unfinished implementation.

The modular structure is prepared for separating the logic into individual modules in the next stage.

## Modules

The project uses the **CommonJS module system** with `require()`.

Example:

```javascript
const Groq = require("groq-sdk");
require("dotenv").config();
```

## Available Tools

### `getBalance(accountId)`

Returns the current account balance.

### `getTransactions(accountId, category, fromDate, toDate)`

Retrieves transactions using optional filters and returns a maximum of 10 latest transactions.

### `getSpendingSummary(accountId, month)`

Calculates total spending and spending by category for a given month.

### `setBudget(userId, category, limit)`

Creates or updates a monthly budget for a category.

### `checkBudgetStatus(userId, category)`

Checks spending against the configured monthly budget.

## Multi-Step Tool Calling
The application supports multiple tool calls for a single user request.

For example:

```text
User Request
  ↓
getSpendingSummary
  ↓
Find biggest spending category
  ↓
checkBudgetStatus
  ↓
Final response 
```

The Node.js application continues the tool-calling loop until the LLM returns a final answer.

## Transaction Dataset

The demo contains exactly **200 transaction records**.

The transactions are generated programmatically using JavaScript with different:

- Transaction IDs
- Amounts
- Categories
- Merchants
- Dates
- Transaction types

When the user asks to see transactions, the backend returns only the latest 10 transactions instead of sending all 200 records to the LLM.

## Project Structure

```text
finance/
├── server.js
├── tools/
│   └── financeTools.js
├── models/
│   ├── Account.js
│   ├── Transaction.js
│   └── Budget.js
├── db/
│   └── connect.js
├── seed.js
├── package.json
├── package-lock.json
├── .env
└── .gitignore
```
## Database Status

The current working demo uses in-memory data.

The MongoDB connection and model files are prepared as part of the project structure for future persistent database integration, but MongoDB is not currently used by the running demo.

## Example Questions

```text
What is my balance?

How much did I spend on food this month?

What is my biggest spending category, and am I over budget there?

Set a 5000 rupee monthly limit on shopping.

Show me all my transactions.
```

## Tech Stack

- Node.js
- JavaScript
- Groq API
- Groq Tool Calling
- CommonJS Modules
- MongoDB/Mongoose structure prepared for future integration

## Run

```bash
npm install
node server.js
```
