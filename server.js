require("dotenv").config();

const Groq = require("groq-sdk");

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY
});


// ==========================================
// TOOL 1: GET BALANCE
// ==========================================

function getBalance(accountId) {

    return {
        accountId: accountId,
        balance: 12500
    };

}


// ==========================================
// FAKE TRANSACTION DATA
// ==========================================

const transactions = [

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


// ==========================================
// TOOL 2: GET TRANSACTIONS
// ==========================================

function getTransactions(
    accountId,
    category,
    fromDate,
    toDate
) {

    // Start with transactions belonging
    // to the requested account

    let results = transactions.filter(
        transaction =>
            transaction.accountId === accountId
    );


    // Filter by category

    if (category) {

        results = results.filter(
            transaction =>
                transaction.category === category
        );

    }


    // Filter by starting date

    if (fromDate) {

        results = results.filter(
            transaction =>
                transaction.date >= fromDate
        );

    }


    // Filter by ending date

    if (toDate) {

        results = results.filter(
            transaction =>
                transaction.date <= toDate
        );

    }


    // IMPORTANT:
    // Never return more than 10 transactions

    results = results.slice(0, 10);


    return results;

}


// ==========================================
// MAIN AI FUNCTION
// ==========================================

async function main() {


    // ==========================================
    // CONVERSATION
    // ==========================================

    const messages = [

        {
            role: "system",

            content:
                "You are a helpful personal finance assistant. " +
                "Use the available tools when necessary."
        },


        {
            role: "user",

            content:
                "Show me my food transactions. " +
                "Use account ID acc123."
        }

    ];


    // ==========================================
    // FIRST GROQ REQUEST
    // ==========================================

    const response =
        await groq.chat.completions.create({

            model: "openai/gpt-oss-20b",

            messages: messages,


            // ==========================================
            // TOOLS AVAILABLE TO GROQ
            // ==========================================

            tools: [

                // ------------------------------------------
                // GET BALANCE
                // ------------------------------------------

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


                // ------------------------------------------
                // GET TRANSACTIONS
                // ------------------------------------------

                {
                    type: "function",

                    function: {

                        name: "getTransactions",

                        description:
                            "Get a filtered list of transactions for a bank account. " +
                            "Never returns more than 10 transactions.",

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

                }

            ],


            tool_choice: "auto"

        });


    // ==========================================
    // GET GROQ MESSAGE
    // ==========================================

    const assistantMessage =
        response.choices[0].message;


    // ==========================================
    // CHECK IF GROQ WANTS TO USE A TOOL
    // ==========================================

    if (assistantMessage.tool_calls) {

        console.log(
            "\n🤖 Groq requested a tool\n"
        );


        // Add Groq's message to conversation

        messages.push(assistantMessage);


        // ==========================================
        // EXECUTE EACH TOOL
        // ==========================================

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


            // ==========================================
            // EXECUTE GET BALANCE
            // ==========================================

            if (toolName === "getBalance") {

                result =
                    getBalance(
                        args.accountId
                    );

            }


            // ==========================================
            // EXECUTE GET TRANSACTIONS
            // ==========================================

            else if (
                toolName === "getTransactions"
            ) {

                result =
                    getTransactions(

                        args.accountId,

                        args.category,

                        args.fromDate,

                        args.toDate

                    );

            }


            // ==========================================
            // SHOW TOOL RESULT
            // ==========================================

            console.log(
                "\nTool result:"
            );

            console.log(result);


            // ==========================================
            // SEND TOOL RESULT BACK TO GROQ
            // ==========================================

            messages.push({

                role: "tool",

                tool_call_id:
                    toolCall.id,

                content:
                    JSON.stringify(result)

            });

        }


        // ==========================================
        // SECOND GROQ REQUEST
        // GET FINAL HUMAN ANSWER
        // ==========================================

        const finalResponse =
            await groq.chat.completions.create({

                model:
                    "openai/gpt-oss-20b",

                messages:
                    messages

            });


        // ==========================================
        // FINAL ANSWER
        // ==========================================

        console.log(
            "\n🤖 Final answer:\n"
        );


        console.log(
            finalResponse
                .choices[0]
                .message
                .content
        );

    }


    // ==========================================
    // NO TOOL NEEDED
    // ==========================================

    else {

        console.log(
            "\n🤖 Groq final answer:\n"
        );

        console.log(
            assistantMessage.content
        );

    }

}


// ==========================================
// START PROGRAM
// ==========================================

main();