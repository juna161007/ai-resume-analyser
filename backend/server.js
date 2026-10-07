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
// AI ASSISTANT
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


    // =====================================
    // CHECK INPUT
    // =====================================

    if (!text) {

        return res.status(400).json({

            message:
                "Resume text is required"

        });

    }


    if (!sourceLanguage || !targetLanguage) {

        return res.status(400).json({

            message:
                "Source and target languages are required"

        });

    }


    // =====================================
    // SAME LANGUAGE
    // =====================================

    if (sourceLanguage === targetLanguage) {

        return res.json({

            translation: text

        });

    }


    try {

        // =====================================
        // TRANSLATION USING OPENAI
        // =====================================

        const response = await client.responses.create({

            model: "gpt-6-luna",

            instructions:
                "You are a professional resume translator. " +
                "Translate the user's text from the specified source language " +
                "to the specified target language. " +
                "Preserve the original meaning, formatting, headings, " +
                "bullet points, names, technical terms, company names, " +
                "email addresses, URLs and numbers. " +
                "Do not add explanations, comments or extra information. " +
                "Return only the translated text.",

            input:
                "Source language: " +
                sourceLanguage +
                "\nTarget language: " +
                targetLanguage +
                "\n\nText to translate:\n" +
                text

        });


        // =====================================
        // SEND TRANSLATION
        // =====================================

        res.json({

            translation:
                response.output_text

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
