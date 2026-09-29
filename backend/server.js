const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());


// ================================
// TEST ROUTE
// ================================

app.get("/", (req, res) => {

    res.json({
        message: "AI Resume Analyser Backend is running!"
    });

});


// ================================
// RESUME ANALYSIS ROUTE
// ================================

app.post("/analyse", (req, res) => {

    const resumeText = req.body.resumeText || "";

    // Check if resume is empty
    if (resumeText.trim() === "") {

        return res.status(400).json({
            success: false,
            message: "Resume text is required"
        });

    }


    // Count words
    const wordCount =
        resumeText.trim().split(/\s+/).length;


    // Simple backend score
    let score = 0;


    // Resume length score
    if (wordCount >= 100) {

        score += 20;

    }
    else if (wordCount >= 50) {

        score += 10;

    }


    // Check important sections
    const text = resumeText.toLowerCase();


    if (
        text.includes("education") ||
        text.includes("qualification")
    ) {

        score += 20;

    }


    if (
        text.includes("experience") ||
        text.includes("internship")
    ) {

        score += 20;

    }


    if (
        text.includes("project") ||
        text.includes("projects")
    ) {

        score += 20;

    }


    // Check skills
    const skills = [
        "python",
        "java",
        "javascript",
        "html",
        "css",
        "react",
        "node.js",
        "sql",
        "mongodb",
        "git",
        "github",
        "docker",
        "aws",
        "machine learning",
        "data science"
    ];


    let skillsFound = [];


    skills.forEach((skill) => {

        if (text.includes(skill)) {

            skillsFound.push(skill);

        }

    });


    // Skill score
    score += Math.min(skillsFound.length * 2, 20);


    // Maximum score = 100
    score = Math.min(score, 100);


    // Send result back to frontend
    res.json({

        success: true,

        message: "Resume analysed successfully!",

        resumeLength: resumeText.length,

        wordCount: wordCount,

        score: score,

        skillsFound: skillsFound

    });

});


// ================================
// START SERVER
// ================================

const PORT = 5000;

app.listen(PORT, () => {

    console.log(
        `Server running at http://localhost:${PORT}`
    );

});