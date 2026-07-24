const express = require('express');
const router = express.Router();
const { isAuthenticated } = require('../middleware/auth');

// AI Chat Assistant response simulation & OpenAI/Gemini RAG pipeline ready
router.post('/chat', async (req, res) => {
    try {
        const { message, contextPaperId, conversationHistory } = req.body;
        const queryLower = (message || '').toLowerCase();

        let replyText = "";
        let structuredTable = null;
        let suggestionChips = [
            "Explain Stack",
            "Applications of Stack",
            "Stack vs Queue",
            "Important Questions"
        ];

        if (queryLower.includes('stack') && queryLower.includes('queue')) {
            replyText = "Here is a detailed comparison between Stack and Queue with comparison table.";
            structuredTable = {
                headers: ["Feature", "Stack", "Queue"],
                rows: [
                    ["Order", "LIFO (Last In First Out)", "FIFO (First In First Out)"],
                    ["Insertion", "At Top (Push)", "At Rear (Enqueue)"],
                    ["Deletion", "At Top (Pop)", "At Front (Dequeue)"],
                    ["Example", "Function Call Stack", "Printer Queue"]
                ]
            };
        } else if (queryLower.includes('predict') || queryLower.includes('important')) {
            replyText = "Based on analysis of 10 years of question papers for Data Structures (SPPU):\n1. Implementation of Stack using Arrays/Linked List (High Probability - 92%)\n2. Infix to Postfix conversion using Stack (High Probability - 88%)\n3. Binary Tree Traversal (Inorder, Preorder, Postorder) (85%)\n4. Dijkstra Shortest Path Algorithm (78%)";
        } else if (queryLower.includes('explain')) {
            replyText = "A Stack is a linear data structure that follows the LIFO (Last-In-First-Out) principle. Operations include Push (inserting element at top), Pop (removing top element), and Peek (viewing top element without removing).";
        } else {
            replyText = `PaperVault AI Assistant response for: "${message}"\n\nTo excel in your upcoming exam, focus on core concepts in Unit 3 (Stacks & Queues) and Unit 5 (Trees). Practice previous year 7-mark and 10-mark numerical questions.`;
        }

        res.json({
            success: true,
            reply: replyText,
            table: structuredTable,
            suggestions: suggestionChips,
            timestamp: new Date()
        });
    } catch (error) {
        res.status(500).json({ message: 'Error processing AI Chat query' });
    }
});

// AI Study Planner Generator
router.post('/study-plan', async (req, res) => {
    try {
        const { examDate, subjects, hoursPerDay } = req.body;

        const generatedPlan = {
            examDate: examDate || '2024-12-25',
            hoursPerDay: hoursPerDay || 6,
            subjects: subjects || ['Data Structures', 'Operating System', 'DBMS'],
            days: [
                {
                    day: "Day 1 - 18 Dec",
                    subject: "Data Structures",
                    units: "Unit 1, 2",
                    duration: "3 Hours",
                    status: "unlocked",
                    completed: true,
                    topics: ["Array representations", "Pointers and memory allocation", "Linked lists operations"]
                },
                {
                    day: "Day 2 - 19 Dec",
                    subject: "Data Structures",
                    units: "Unit 3, 4",
                    duration: "3 Hours",
                    status: "unlocked",
                    completed: false,
                    topics: ["Stack LIFO operations", "Infix to Postfix conversion", "Queue FIFO operations"]
                },
                {
                    day: "Day 3 - 20 Dec",
                    subject: "Operating System",
                    units: "Unit 1",
                    duration: "3 Hours",
                    status: "locked",
                    completed: false,
                    topics: ["Process states & PCB", "CPU Scheduling algorithms", "Context switching"]
                },
                {
                    day: "Day 4 - 21 Dec",
                    subject: "Operating System",
                    units: "Unit 2, 3",
                    duration: "4 Hours",
                    status: "locked",
                    completed: false,
                    topics: ["Memory Management & Paging", "Virtual Memory & Page Replacement", "Deadlocks"]
                },
                {
                    day: "Day 5 - 22 Dec",
                    subject: "DBMS",
                    units: "Unit 1, 2",
                    duration: "4 Hours",
                    status: "locked",
                    completed: false,
                    topics: ["ER Model & Relational Algebra", "SQL Queries & Joins", "Normalization 1NF, 2NF, 3NF, BCNF"]
                }
            ]
        };

        res.json({
            success: true,
            plan: generatedPlan
        });
    } catch (error) {
        res.status(500).json({ message: 'Error generating study plan' });
    }
});

// Simulated OCR Text Extraction
router.post('/ocr-extract', async (req, res) => {
    try {
        const sampleExtractedText = `PUNE UNIVERSITY (SPPU)
SEMESTER 3 EXAMINATION - 2024
SUBJECT: DATA STRUCTURES (CS301)
TIME: 3 HOURS | MAX MARKS: 70

Q1. (a) Define Stack. Explain its operations with array implementation. (5)
    (b) Convert the following infix expression to postfix: A+B*(C-D). (5)
Q2. (a) Explain Applications of Queue in OS process management. (5)
    (b) Write a function to reverse a singly linked list. (5)`;

        res.json({
            success: true,
            extractedText: sampleExtractedText,
            detectedSubject: "Data Structures",
            detectedSemester: 3,
            detectedYear: 2024,
            detectedExamType: "End Semester",
            tags: ["SPPU", "Data Structures", "Stack", "Queue", "Linked List"]
        });
    } catch (error) {
        res.status(500).json({ message: 'OCR process failed' });
    }
});

module.exports = router;
