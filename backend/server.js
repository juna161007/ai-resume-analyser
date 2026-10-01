const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());


// =====================================
// TEST ROUTE
// =====================================

app.get("/", (req, res) => {

    res.json({
        message: "AI Resume Analyser Backend is running!"
    });

});


// =====================================
// RESUME ANALYSIS ROUTE
// =====================================

app.post("/analyse", (req, res) => {

    const resumeText = req.body.resumeText;

    if (!resumeText) {

        return res.status(400).json({
            message: "Resume text is required"
        });

    }

    res.json({

        message: "Resume received successfully!",

        resumeLength: resumeText.length

    });

});


// =====================================
// AI ASSISTANT
// =====================================

app.post("/ai-assistant", (req, res) => {

    const question = req.body.question;

    if (!question) {

        return res.status(400).json({
            message: "Question is required"
        });

    }

    const lowerQuestion = question.toLowerCase();

    let answer;


    // Resume improvement
    if (
        lowerQuestion.includes("resume") ||
        lowerQuestion.includes("improve")
    ) {

        answer =
            "To improve your resume, use a clear professional summary, " +
            "highlight relevant technical skills, add measurable project " +
            "achievements, and keep the formatting simple and readable.";

    }


    // Skills
    else if (
        lowerQuestion.includes("skill") ||
        lowerQuestion.includes("learn")
    ) {

        answer =
            "Useful career skills include programming, data structures, " +
            "databases, Git, web development and problem-solving.";

    }


    // Interview
    else if (
        lowerQuestion.includes("interview")
    ) {

        answer =
            "For interviews, prepare your self-introduction, resume projects, " +
            "technical fundamentals, programming questions and common HR questions.";

    }


    // Python
    else if (
        lowerQuestion.includes("python")
    ) {

        answer =
            "For Python interviews, prepare variables, data types, loops, " +
            "functions, lists, dictionaries, OOP, exception handling and modules.";

    }


    // Java
    else if (
        lowerQuestion.includes("java")
    ) {

        answer =
            "For Java interviews, prepare OOP, classes, objects, inheritance, " +
            "polymorphism, abstraction, interfaces, collections and exception handling.";

    }


    // Projects
    else if (
        lowerQuestion.includes("project")
    ) {

        answer =
            "Projects make your resume stronger. Explain the problem, technology " +
            "used, your contribution and the result of each project.";

    }


    // Career / Job
    else if (
        lowerQuestion.includes("career") ||
        lowerQuestion.includes("job")
    ) {

        answer =
            "Build strong technical skills, create practical projects, maintain " +
            "a good resume, improve communication skills and practice interviews.";

    }


    // Default
    else {

        answer =
            "I can help you with resume improvement, career skills, " +
            "interview preparation, programming, projects and professional development.";

    }


    res.json({
        answer: answer
    });

});


// =====================================
// RESUME TRANSLATOR
// =====================================

app.post("/translate", async (req, res) => {

    const text = req.body.text;

    const sourceLanguage =
        req.body.sourceLanguage;

    const targetLanguage =
        req.body.targetLanguage;


    // Check resume text
    if (!text) {

        return res.status(400).json({
            message: "Resume text is required"
        });

    }


    // Check languages
    if (!sourceLanguage || !targetLanguage) {

        return res.status(400).json({
            message: "Source and target languages are required"
        });

    }


    // Same language
    if (sourceLanguage === targetLanguage) {

        return res.json({
            translation: text
        });

    }


    // =====================================
    // LANGUAGE CODES
    // =====================================

    const languageCodes = {

        English: "en",

        Tamil: "ta",

        Malayalam: "ml",

        Hindi: "hi",

        Korean: "ko",

        Japanese: "ja",

        French: "fr",

        German: "de",

        Spanish: "es",

        Arabic: "ar"

    };


    const sourceCode =
        languageCodes[sourceLanguage];

    const targetCode =
        languageCodes[targetLanguage];


    // Check supported language
    if (!sourceCode || !targetCode) {

        return res.status(400).json({
            message: "Unsupported language."
        });

    }


    // =====================================
    // SPLIT RESUME INTO SMALL CHUNKS
    // =====================================

    const chunks = [];

    let remainingText = text;


    while (remainingText.length > 0) {

        let chunk =
            remainingText.slice(0, 450);


        // Try to stop at a space
        // instead of cutting a word
        if (remainingText.length > 450) {

            const lastSpace =
                chunk.lastIndexOf(" ");


            if (lastSpace > 0) {

                chunk =
                    chunk.slice(0, lastSpace);

            }

        }


        chunks.push(chunk.trim());


        remainingText =
            remainingText
                .slice(chunk.length)
                .trim();

    }


    // =====================================
    // TRANSLATE EACH CHUNK
    // =====================================

    try {

        const translatedChunks = [];


        for (const chunk of chunks) {

            const url =
                "https://api.mymemory.translated.net/get" +
                "?q=" +
                encodeURIComponent(chunk) +
                "&langpair=" +
                sourceCode +
                "|" +
                targetCode;


            const response =
                await fetch(url);


            if (!response.ok) {

                throw new Error(
                    "Translation service error"
                );

            }


            const data =
                await response.json();


            if (
                !data.responseData ||
                !data.responseData.translatedText
            ) {

                throw new Error(
                    "Translation was not returned"
                );

            }


            translatedChunks.push(
                data.responseData.translatedText
            );

        }


        // Combine all translated chunks
        const finalTranslation =
            translatedChunks.join("\n\n");


        res.json({

            translation:
                finalTranslation

        });

    }


    catch (error) {

        console.error(
            "Translation Error:",
            error
        );


        res.status(500).json({

            message:
                "Unable to translate the resume right now."

        });

    }

});


// =====================================
// START SERVER
// =====================================

const PORT = 5000;


app.listen(PORT, () => {

    console.log(
        `Server running at http://localhost:${PORT}`
    );

});