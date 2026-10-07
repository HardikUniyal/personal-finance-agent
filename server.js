require("dotenv").config();

const Groq = require("groq-sdk");

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY
});


// ============================================================
// TOOL 1: GET BALANCE
// ============================================================

function getBalance(accountId) {
    return {
        accountId: accountId,
        balance: 12500
    };
}


// ============================================================
// TRANSACTION DATA
// ============================================================

const transactions = [

    // Original demo transactions

    {
        txnId: "txn001",
        accountId: "acc123",
        amount: 450,
        type: "debit",
        category: "food",
        merchant: "Dominos",
        date: "2026-10-01"
    },

    {
        txnId: "txn002",
        accountId: "acc123",
        amount: 1200,
        type: "debit",
        category: "shopping",
        merchant: "Amazon",
        date: "2026-10-02"
    },

    {
        txnId: "txn003",
        accountId: "acc123",
        amount: 300,
        type: "debit",
        category: "travel",
        merchant: "Uber",
        date: "2026-10-03"
    },

    {
        txnId: "txn004",
        accountId: "acc123",
        amount: 800,
        type: "debit",
        category: "bills",
        merchant: "Electricity",
        date: "2026-10-04"
    },

    {
        txnId: "txn005",
        accountId: "acc123",
        amount: 250,
        type: "debit",
        category: "food",
        merchant: "Cafe Coffee Day",
        date: "2026-10-05"
    },

    {
        txnId: "txn006",
        accountId: "acc123",
        amount: 700,
        type: "debit",
        category: "food",
        merchant: "Swiggy",
        date: "2026-10-06"
    },

    {
        txnId: "txn007",
        accountId: "acc123",
        amount: 500,
        type: "credit",
        category: "food",
        merchant: "Refund",
        date: "2026-10-06"
    }
];


// ============================================================
// GENERATE 193 MORE TRANSACTIONS
// TOTAL = 200
// ============================================================

const categories = [
    "food",
    "shopping",
    "travel",
    "bills"
];

const merchants = {
    food: [
        "Swiggy",
        "Zomato",
        "Dominos",
        "Cafe Coffee Day",
        "McDonalds"
    ],

    shopping: [
        "Amazon",
        "Flipkart",
        "Myntra",
        "Ajio"
    ],

    travel: [
        "Uber",
        "Ola",
        "Rapido",
        "Metro"
    ],

    bills: [
        "Electricity",
        "Airtel",
        "Jio",
        "Water Bill"
    ]
};


for (let i = 8; i <= 200; i++) {

    const category =
        categories[(i - 8) % categories.length];

    const merchantList =
        merchants[category];

    const merchant =
        merchantList[i % merchantList.length];


    // Spread transactions across September and October

    const day =
        ((i - 8) % 30) + 1;

    const month =
        i <= 103 ? "09" : "10";

    const date =
        `2026-${month}-${String(day).padStart(2, "0")}`;


    let amount;


    if (category === "food") {

        amount =
            200 + (i % 6) * 100;

    }

    else if (category === "shopping") {

        amount =
            500 + (i % 6) * 150;

    }

    else if (category === "travel") {

        amount =
            150 + (i % 5) * 100;

    }

    else {

        amount =
            400 + (i % 5) * 100;

    }


    transactions.push({

        txnId:
            `txn${String(i).padStart(3, "0")}`,

        accountId:
            "acc123",

        amount:
            amount,

        type:
            "debit",

        category:
            category,

        merchant:
            merchant,

        date:
            date
    });
}


// ============================================================
// TOOL 2: GET TRANSACTIONS
// ============================================================

function getTransactions(
    accountId,
    category,
    fromDate,
    toDate
) {

    let results =
        transactions.filter(
            transaction =>
                transaction.accountId === accountId
        );


    if (category) {

        results =
            results.filter(
                transaction =>
                    transaction.category === category
            );
    }


    if (fromDate) {

        results =
            results.filter(
                transaction =>
                    transaction.date >= fromDate
            );
    }


    if (toDate) {

        results =
            results.filter(
                transaction =>
                    transaction.date <= toDate
            );
    }


    // Sort newest first and return maximum 10

    results =
        results
            .sort(
                (a, b) =>
                    b.date.localeCompare(a.date)
            )
            .slice(0, 10);


    return results;
}


// ============================================================
// TOOL 3: GET SPENDING SUMMARY
// ============================================================

function getSpendingSummary(
    accountId,
    month
) {

    let results =
        transactions.filter(
            transaction =>
                transaction.accountId === accountId
        );


    results =
        results.filter(
            transaction =>
                transaction.date.startsWith(month)
        );


    // Only debit transactions count as spending

    results =
        results.filter(
            transaction =>
                transaction.type === "debit"
        );


    const spending = {};


    for (const transaction of results) {

        const category =
            transaction.category;


        if (!spending[category]) {

            spending[category] = 0;
        }


        spending[category] +=
            transaction.amount;
    }


    // Biggest spending first

    const sortedCategories =
        Object.entries(spending)
            .sort(
                (a, b) =>
                    b[1] - a[1]
            );


    const totalSpent =
        results.reduce(
            (total, transaction) =>
                total + transaction.amount,
            0
        );


    return {

        month: month,

        totalSpent: totalSpent,

        categories:
            sortedCategories.map(
                ([category, amount]) => ({

                    category: category,

                    amount: amount
                })
            )
    };
}


// ============================================================
// BUDGET DATA
// ============================================================

const budgets = [];


// ============================================================
// TOOL 4: SET BUDGET
// ============================================================

function setBudget(
    userId,
    category,
    limit
) {

    const month = "2026-10";


    const existingBudget =
        budgets.find(
            budget =>
                budget.userId === userId &&
                budget.category === category &&
                budget.month === month
        );


    if (existingBudget) {

        existingBudget.monthlyLimit =
            limit;

        return existingBudget;
    }


    const newBudget = {

        userId: userId,

        category: category,

        monthlyLimit: limit,

        month: month
    };


    budgets.push(newBudget);


    return newBudget;
}


// ============================================================
// TOOL 5: CHECK BUDGET STATUS
// ============================================================

function checkBudgetStatus(
    userId,
    category
) {

    const month = "2026-10";


    const budget =
        budgets.find(
            item =>
                item.userId === userId &&
                item.category === category &&
                item.month === month
        );


    if (!budget) {

        return {

            error:
                "No budget found for this category."
        };
    }


    const spending =
        getSpendingSummary(
            "acc123",
            month
        );


    const categoryData =
        spending.categories.find(
            item =>
                item.category === category
        );


    const spent =
        categoryData
            ? categoryData.amount
            : 0;


    const remaining =
        budget.monthlyLimit - spent;


    return {

        category: category,

        limit:
            budget.monthlyLimit,

        spent:
            spent,

        remaining:
            remaining,

        overBudget:
            remaining < 0
    };
}


// ============================================================
// ALL GROQ TOOL DEFINITIONS
// ============================================================

const tools = [

    // TOOL 1

    {
        type: "function",

        function: {

            name: "getBalance",

            description:
                "Get the current balance of a bank account.",

            parameters: {

                type: "object",

                properties: {

                    accountId: {

                        type: "string",

                        description:
                            "The user's bank account ID"
                    }
                },

                required: [
                    "accountId"
                ]
            }
        }
    },


    // TOOL 2

    {
        type: "function",

        function: {

            name: "getTransactions",

            description:
                "Get a filtered list of transactions for a bank account. Never returns more than 10 transactions.",

            parameters: {

                type: "object",

                properties: {

                    accountId: {

                        type: "string",

                        description:
                            "The bank account ID"
                    },

                    category: {

                        type: "string",

                        enum: [
                            "food",
                            "travel",
                            "shopping",
                            "bills"
                        ],

                        description:
                            "Optional spending category"
                    },

                    fromDate: {

                        type: "string",

                        description:
                            "Optional starting date in YYYY-MM-DD format"
                    },

                    toDate: {

                        type: "string",

                        description:
                            "Optional ending date in YYYY-MM-DD format"
                    }
                },

                required: [
                    "accountId"
                ]
            }
        }
    },


    // TOOL 3

    {
        type: "function",

        function: {

            name: "getSpendingSummary",

            description:
                "Calculate total spending grouped by category for a specific account and month. Only debit transactions count as spending.",

            parameters: {

                type: "object",

                properties: {

                    accountId: {

                        type: "string",

                        description:
                            "The bank account ID"
                    },

                    month: {

                        type: "string",

                        description:
                            "Month to analyze in YYYY-MM format, for example 2026-10"
                    }
                },

                required: [
                    "accountId",
                    "month"
                ]
            }
        }
    },


    // TOOL 4

    {
        type: "function",

        function: {

            name: "setBudget",

            description:
                "Set or update a monthly spending limit for a category.",

            parameters: {

                type: "object",

                properties: {

                    userId: {

                        type: "string",

                        description:
                            "The user's ID"
                    },

                    category: {

                        type: "string",

                        enum: [
                            "food",
                            "travel",
                            "shopping",
                            "bills"
                        ],

                        description:
                            "The spending category"
                    },

                    limit: {

                        type: "number",

                        description:
                            "Monthly spending limit in rupees"
                    }
                },

                required: [
                    "userId",
                    "category",
                    "limit"
                ]
            }
        }
    },


    // TOOL 5

    {
        type: "function",

        function: {

            name: "checkBudgetStatus",

            description:
                "Check spending against the monthly budget for a category.",

            parameters: {

                type: "object",

                properties: {

                    userId: {

                        type: "string",

                        description:
                            "The user's ID"
                    },

                    category: {

                        type: "string",

                        enum: [
                            "food",
                            "travel",
                            "shopping",
                            "bills"
                        ],

                        description:
                            "The spending category"
                    }
                },

                required: [
                    "userId",
                    "category"
                ]
            }
        }
    }

];


// ============================================================
// MAIN AI FUNCTION
// ============================================================

async function main() {

    const messages = [

        {

            role: "system",

            content:
                "You are a helpful personal finance assistant. " +
                "Use the available tools when necessary. " +
                "For this demo, the user's userId is user123 and their accountId is acc123. " +
                "Always use these IDs when a tool requires them."
        },

        {

            role: "user",

            content:
                "Show me all my transactions."
        }
    ];


    // ========================================================
    // MULTI-STEP TOOL CALLING LOOP
    // ========================================================

    let response;


    while (true) {

        response =
            await groq.chat.completions.create({

                model:
                    "openai/gpt-oss-20b",

                messages:
                    messages,

                tools:
                    tools,

                tool_choice:
                    "auto"
            });


        const assistantMessage =
            response.choices[0].message;


        // ====================================================
        // NO MORE TOOLS = FINAL ANSWER
        // ====================================================

        if (
            !assistantMessage.tool_calls ||
            assistantMessage.tool_calls.length === 0
        ) {

            console.log(
                "\n🤖 Final answer:\n"
            );


            console.log(
                assistantMessage.content
            );


            break;
        }


        // ====================================================
        // GROQ REQUESTED TOOL
        // ====================================================

        console.log(
            "\n🤖 Groq requested a tool\n"
        );


        messages.push(
            assistantMessage
        );


        // ====================================================
        // EXECUTE TOOLS
        // ====================================================

        for (
            const toolCall
            of assistantMessage.tool_calls
        ) {

            const toolName =
                toolCall.function.name;


            const args =
                JSON.parse(
                    toolCall.function.arguments
                );


            console.log(
                "Tool:",
                toolName
            );


            console.log(
                "Arguments:",
                args
            );


            let result;


            // =================================================
            // TOOL 1
            // =================================================

            if (
                toolName ===
                "getBalance"
            ) {

                result =
                    getBalance(
                        args.accountId
                    );
            }


            // =================================================
            // TOOL 2
            // =================================================

            else if (
                toolName ===
                "getTransactions"
            ) {

                result =
                    getTransactions(

                        args.accountId,

                        args.category,

                        args.fromDate,

                        args.toDate
                    );
            }


            // =================================================
            // TOOL 3
            // =================================================

            else if (
                toolName ===
                "getSpendingSummary"
            ) {

                result =
                    getSpendingSummary(

                        args.accountId,

                        args.month
                    );
            }


            // =================================================
            // TOOL 4
            // =================================================

            else if (
                toolName ===
                "setBudget"
            ) {

                result =
                    setBudget(

                        args.userId,

                        args.category,

                        args.limit
                    );
            }


            // =================================================
            // TOOL 5
            // =================================================

            else if (
                toolName ===
                "checkBudgetStatus"
            ) {

                result =
                    checkBudgetStatus(

                        args.userId,

                        args.category
                    );
            }


            // =================================================
            // UNKNOWN TOOL
            // =================================================

            else {

                result = {

                    error:
                        `Unknown tool: ${toolName}`
                };
            }


            console.log(
                "\nTool result:"
            );


            console.log(
                result
            );


            // =================================================
            // SEND RESULT BACK TO GROQ
            // =================================================

            messages.push({

                role: "tool",

                tool_call_id:
                    toolCall.id,

                content:
                    JSON.stringify(
                        result
                    )
            });
        }

        // Loop continues.
        // Groq can request another tool.
    }
}


// ============================================================
// START PROGRAM
// ============================================================

main();