const express = require("express");
const cors = require("cors");
const OpenAI = require("openai");

const app = express();

app.use(cors());
app.use(express.json());


// =====================================
// OPENAI CLIENT
// =====================================

const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});


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
// AI ASSISTANT - REAL AI
// =====================================

app.post("/ai-assistant", async (req, res) => {

    const question = req.body.question;

    if (!question) {

        return res.status(400).json({
            message: "Question is required"
        });

    }

    try {

        const response = await client.responses.create({

            model: "gpt-6-luna",

            instructions:
                "You are a helpful, intelligent and friendly AI assistant. " +
                "You can answer general questions as well as questions about " +
                "resumes, careers, interviews, programming, education, " +
                "technology, projects and professional development. " +
                "Give clear, accurate and useful answers. " +
                "If the user asks a technical question, explain it simply " +
                "when appropriate. " +
                "If the user asks about improving a resume, give practical " +
                "professional suggestions. " +
                "Do not say that you can only answer resume questions.",

            input: question

        });


        res.json({

            answer: response.output_text

        });

    }

    catch (error) {

        console.error(
            "AI Assistant Error:",
            error
        );

        res.status(500).json({

            message:
                "Unable to get an AI response right now."

        });

    }

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

            message:
                "Resume text is required"

        });

    }


    // Check languages

    if (!sourceLanguage || !targetLanguage) {

        return res.status(400).json({

            message:
                "Source and target languages are required"

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


    // Check supported languages

    if (!sourceCode || !targetCode) {

        return res.status(400).json({

            message:
                "Unsupported language"

        });

    }


    try {

        // =====================================
        // SPLIT LONG RESUME
        // =====================================

        const chunks = [];

        let remaining = text;


        while (remaining.length > 0) {

            let chunk =
                remaining.substring(0, 400);


            if (remaining.length > 400) {

                const lastSpace =
                    chunk.lastIndexOf(" ");


                if (lastSpace > 0) {

                    chunk =
                        chunk.substring(
                            0,
                            lastSpace
                        );

                }

            }


            chunks.push(chunk);


            remaining =
                remaining
                    .substring(chunk.length)
                    .trim();

        }


        // =====================================
        // TRANSLATE EACH CHUNK
        // =====================================

        const translatedChunks = [];


        for (const chunk of chunks) {

            const url =
                "https://translate.googleapis.com/translate_a/single" +
                "?client=gtx" +
                "&sl=" + sourceCode +
                "&tl=" + targetCode +
                "&dt=t" +
                "&q=" +
                encodeURIComponent(chunk);


            const response =
                await fetch(url);


            if (!response.ok) {

                throw new Error(
                    "Translation API failed"
                );

            }


            const data =
                await response.json();


            let translated = "";


            if (data && data[0]) {

                for (const part of data[0]) {

                    if (part[0]) {

                        translated += part[0];

                    }

                }

            }


            if (!translated) {

                throw new Error(
                    "No translation received"
                );

            }


            translatedChunks.push(
                translated
            );

        }


        // =====================================
        // SEND RESULT
        // =====================================

        res.json({

            translation:
                translatedChunks.join("\n\n")

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

const PORT =
    process.env.PORT || 5000;


app.listen(
    PORT,
    "0.0.0.0",
    () => {

        console.log(
            `Server running at http://localhost:${PORT}`
        );

    }
);
