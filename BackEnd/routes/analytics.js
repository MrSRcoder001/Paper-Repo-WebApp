const express = require('express');
const router = express.Router();

router.get('/overview', async (req, res) => {
    try {
        const stats = {
            totalPapers: 245678,
            papersGrowth: "+12.5% from last month",
            mostRepeatedQuestions: 15432,
            questionsGrowth: "+8.2% from last month",
            predictedQuestions: 1245,
            predictedProbability: "High probability",
            avgPaperDifficulty: 6.4,
            difficultyRating: "Moderate",
            
            questionFrequency: [
                { unit: "Unit 1", frequency: 210 },
                { unit: "Unit 2", frequency: 285 },
                { unit: "Unit 3", frequency: 340 },
                { unit: "Unit 4", frequency: 260 },
                { unit: "Unit 5", frequency: 295 },
                { unit: "Unit 6", frequency: 240 }
            ],

            difficultyDistribution: {
                easy: 28,
                medium: 46,
                hard: 26
            },

            topRepeatedQuestions: [
                {
                    id: 1,
                    text: "Explain Stack and its operations.",
                    frequencyText: "Asked 8 times",
                    count: 8,
                    subject: "Data Structures"
                },
                {
                    id: 2,
                    text: "Write a note on Infix to Postfix conversion.",
                    frequencyText: "Asked 7 times",
                    count: 7,
                    subject: "Data Structures"
                },
                {
                    id: 3,
                    text: "Implement Stack using array.",
                    frequencyText: "Asked 6 times",
                    count: 6,
                    subject: "Data Structures"
                },
                {
                    id: 4,
                    text: "Explain Process Control Block (PCB) structure.",
                    frequencyText: "Asked 6 times",
                    count: 6,
                    subject: "Operating System"
                },
                {
                    id: 5,
                    text: "Explain 3NF and BCNF normalization with examples.",
                    frequencyText: "Asked 5 times",
                    count: 5,
                    subject: "DBMS"
                }
            ],

            subjectWiseTrend: [
                { year: 2020, DS: 40, OS: 35, DBMS: 45 },
                { year: 2021, DS: 55, OS: 48, DBMS: 50 },
                { year: 2022, DS: 45, OS: 60, DBMS: 52 },
                { year: 2023, DS: 80, OS: 70, DBMS: 65 },
                { year: 2024, DS: 95, OS: 82, DBMS: 88 }
            ]
        };

        res.json(stats);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching analytics overview' });
    }
});

module.exports = router;
