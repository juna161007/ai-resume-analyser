
const express = require("express");
const cors = require("cors");
const OpenAI = require("openai");

const app = express();

app.use(cors());
app.use(express.json({ limit: "1mb" }));

// =====================================
// OPENAI CLIENT
// =====================================

const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

// =====================================
// HOME / TEST ROUTE
// =====================================

app.get("/", (req, res) => {
    res.json({
        message: "AI Resume Analyser Backend is running!"
    });
});

// =====================================
// RESUME ANALYSIS
// =====================================

app.post("/analyse", (req, res) => {
    const { resumeText } = req.body;

    if (
        typeof resumeText !== "string" ||
        !resumeText.trim()
    ) {
        return res.status(400).json({
            message: "Resume text is required."
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
    const { question } = req.body;

    if (
        typeof question !== "string" ||
        !question.trim()
    ) {
        return res.status(400).json({
            message: "Question is required."
        });
    }

    try {
        const response = await client.responses.create({
            model: "gpt-6-luna",
            instructions:
                "You are a helpful AI assistant. Answer questions " +
                "about resumes, careers, interviews, programming, " +
                "education, technology and professional development. " +
                "Give clear and practical answers.",
            input: question
        });

        res.json({
            answer: response.output_text
        });
    } catch (error) {
        console.error("AI Assistant Error:", error.message);

        res.status(500).json({
            message: "Unable to get an AI response right now."
        });
    }
});

// =====================================
// RESUME TRANSLATOR
// =====================================

app.post("/translate", async (req, res) => {
    const {
        text,
        sourceLanguage,
        targetLanguage
    } = req.body;

    if (
        typeof text !== "string" ||
        !text.trim() ||
        !sourceLanguage ||
        !targetLanguage
    ) {
        return res.status(400).json({
            message:
                "Text, source language and target language are required."
        });
    }

    if (sourceLanguage === targetLanguage) {
        return res.json({
            translation: text
        });
    }

    try {
        const response = await client.responses.create({
            model: "gpt-6-luna",
            instructions:
                "Translate the supplied text from the specified " +
                "source language to the specified target language. " +
                "Preserve the meaning, headings, bullet points, " +
                "names, technical terms, email addresses and numbers. " +
                "Return only the translated text.",
            input:
                "Source language: " + sourceLanguage +
                "\nTarget language: " + targetLanguage +
                "\n\nText:\n" + text
        });

        res.json({
            translation: response.output_text
        });
    } catch (error) {
        console.error("Translation Error:", error.message);

        res.status(500).json({
            message: "Unable to translate the text right now."
        });
    }
});

// =====================================
// USER FEEDBACK API
// =====================================

app.post("/feedback", (req, res) => {
    try {
        const {
            name,
            role,
            rating,
            feedback
        } = req.body;

        // Validate the required fields
        if (
            typeof name !== "string" ||
            !name.trim() ||
            typeof role !== "string" ||
            !role.trim() ||
            rating === undefined ||
            typeof feedback !== "string" ||
            !feedback.trim()
        ) {
            return res.status(400).json({
                message:
                    "Name, role, rating and feedback are required."
            });
        }

        const numericRating = Number(rating);

        if (
            !Number.isInteger(numericRating) ||
            numericRating < 1 ||
            numericRating > 5
        ) {
            return res.status(400).json({
                message: "Rating must be a number from 1 to 5."
            });
        }

        // Display feedback in Render Logs
        console.log("========== NEW USER FEEDBACK ==========");
        console.log("Name:", name.trim());
        console.log("Role:", role.trim());
        console.log("Rating:", numericRating, "/ 5");
        console.log("Feedback:", feedback.trim());
        console.log("Date:", new Date().toISOString());
        console.log("=======================================");

        res.status(200).json({
            success: true,
            message: "Feedback submitted successfully."
        });
    } catch (error) {
        console.error("Feedback Error:", error.message);

        res.status(500).json({
            success: false,
            message: "Unable to submit feedback."
        });
    }
});

// =====================================
// START SERVER
// =====================================

const PORT = process.env.PORT || 5000;

app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
});

