/* =====================================
   AI RESUME ANALYSER
===================================== */


/* List of skills to search */

const skillsList = [
    "python",
    "java",
    "javascript",
    "html",
    "css",
    "react",
    "node.js",
    "node",
    "sql",
    "mongodb",
    "git",
    "github",
    "docker",
    "aws",
    "c++",
    "c",
    "machine learning",
    "data science",
    "flask",
    "django",
    "php",
    "mysql",
    "typescript",
    "angular",
    "vue"
];


/* =====================================
   FILE UPLOAD
===================================== */

document
    .getElementById("resumeFile")
    .addEventListener("change", function () {

        const file = this.files[0];

        if (!file) {
            return;
        }

        /* Check file type */

        if (!file.name.toLowerCase().endsWith(".txt")) {

            alert("Please upload a .txt resume file.");

            this.value = "";

            return;
        }


        /* Read file */

        const reader = new FileReader();

        reader.onload = function (event) {

            document.getElementById("resumeText").value =
                event.target.result;

        };

        reader.readAsText(file);

    });


/* =====================================
   ANALYSE RESUME
===================================== */

async function analyseResume() {

    const resumeText =
        document
            .getElementById("resumeText")
            .value
            .toLowerCase()
            .trim();


    /* Check empty resume */

    if (resumeText === "") {

        alert(
            "Please upload a resume or paste your resume text first."
        );

        return;
    }
// Send resume to backend
fetch("https://ai-resume-analyser-1cpz.onrender.com/analyse", {
    method: "POST",
    headers: {
        "Content-Type": "application/json"
    },
    body: JSON.stringify({
        resumeText: resumeText
    })
})
.then(response => response.json())
.then(data => {
    console.log("Backend response:", data);
})
.catch(error => {
    console.log("Backend connection error:", error);
});

    /* =====================================
       FIND SKILLS
    ===================================== */

    let foundSkills = [];


    skillsList.forEach(function (skill) {

        if (resumeText.includes(skill)) {

            foundSkills.push(skill);

        }

    });


    /* Remove duplicate skills */

    foundSkills = [...new Set(foundSkills)];


    /* =====================================
       SCORE CALCULATION
    ===================================== */

    let score = 0;


    /* Skills score */

    score += Math.min(foundSkills.length * 5, 40);


    /* Resume length */

    const wordCount =
        resumeText.split(/\s+/).filter(Boolean).length;


    if (wordCount >= 100) {

        score += 20;

    }
    else if (wordCount >= 50) {

        score += 10;

    }


    /* Important sections */

    if (
        resumeText.includes("education") ||
        resumeText.includes("qualification")
    ) {

        score += 10;

    }


    if (
        resumeText.includes("experience") ||
        resumeText.includes("internship")
    ) {

        score += 10;

    }


    if (
        resumeText.includes("project") ||
        resumeText.includes("projects")
    ) {

        score += 10;

    }


    /* Maximum score */

    score = Math.min(score, 100);


    /* =====================================
       DISPLAY SCORE
    ===================================== */

    document.getElementById("score").textContent =
        score;


    /* Score message */

    let scoreMessage = "";


    if (score >= 80) {

        scoreMessage =
            "Excellent! Your resume contains strong information.";

    }
    else if (score >= 60) {

        scoreMessage =
            "Good resume. A few improvements can make it stronger.";

    }
    else if (score >= 40) {

        scoreMessage =
            "Your resume has potential. Consider adding more details.";

    }
    else {

        scoreMessage =
            "Your resume needs improvement. Add more relevant information.";

    }


    document.getElementById("scoreMessage").textContent =
        scoreMessage;


    /* =====================================
       DISPLAY SKILLS
    ===================================== */

    const skillsContainer =
        document.getElementById("skills");


    skillsContainer.innerHTML = "";


    if (foundSkills.length === 0) {

        skillsContainer.innerHTML =
            "<p>No predefined skills detected.</p>";

    }
    else {

        foundSkills.forEach(function (skill) {

            const skillElement =
                document.createElement("span");

            skillElement.className = "skill";

            skillElement.textContent =
                skill;

            skillsContainer.appendChild(
                skillElement
            );

        });

    }


    /* =====================================
       STRENGTHS
    ===================================== */

    const strengths =
        document.getElementById("strengths");


    strengths.innerHTML = "";


    if (foundSkills.length >= 5) {

        addListItem(
            strengths,
            "Good range of technical skills."
        );

    }
    else if (foundSkills.length > 0) {

        addListItem(
            strengths,
            "Some technical skills are clearly mentioned."
        );

    }
    else {

        addListItem(
            strengths,
            "Resume content is available for analysis."
        );

    }


    if (
        resumeText.includes("project") ||
        resumeText.includes("projects")
    ) {

        addListItem(
            strengths,
            "Projects are included in the resume."
        );

    }


    if (
        resumeText.includes("experience") ||
        resumeText.includes("internship")
    ) {

        addListItem(
            strengths,
            "Experience or internship information is included."
        );

    }


    /* =====================================
       AREAS TO IMPROVE
    ===================================== */

    const weaknesses =
        document.getElementById("weaknesses");


    weaknesses.innerHTML = "";


    if (foundSkills.length < 5) {

        addListItem(
            weaknesses,
            "Add more relevant technical skills."
        );

    }


    if (
        !resumeText.includes("education") &&
        !resumeText.includes("qualification")
    ) {

        addListItem(
            weaknesses,
            "Add an Education section."
        );

    }


    if (
        !resumeText.includes("experience") &&
        !resumeText.includes("internship")
    ) {

        addListItem(
            weaknesses,
            "Add internship or work experience if available."
        );

    }


    if (
        !resumeText.includes("project") &&
        !resumeText.includes("projects")
    ) {

        addListItem(
            weaknesses,
            "Add project details."
        );

    }


    if (wordCount < 50) {

        addListItem(
            weaknesses,
            "Your resume appears too short. Add more relevant details."
        );

    }


    /* =====================================
       SUGGESTIONS
    ===================================== */

    const suggestions =
        document.getElementById("suggestions");


    suggestions.innerHTML = "";


    addListItem(
        suggestions,
        "Use clear headings such as Skills, Education, Projects and Experience."
    );


    addListItem(
        suggestions,
        "Include technical skills relevant to your target job."
    );


    addListItem(
        suggestions,
        "Mention projects and explain your contribution."
    );


    addListItem(
        suggestions,
        "Keep the resume clear, concise and easy to read."
    );


    /* =====================================
       SHOW RESULTS
    ===================================== */

    const results =
        document.getElementById("results");


    results.style.display = "block";


    /* Scroll to results */

    results.scrollIntoView({
        behavior: "smooth"
    });

}


/* =====================================
   ADD LIST ITEM FUNCTION
===================================== */

function addListItem(list, text) {

    const li =
        document.createElement("li");

    li.textContent = text;

    list.appendChild(li);

}


/* =====================================
   DOWNLOAD REPORT
===================================== */

function downloadReport() {

    const score =
        document.getElementById("score").innerText;


    const scoreMessage =
        document.getElementById("scoreMessage").innerText;


    const skills =
        document.getElementById("skills").innerText;


    const strengths =
        document.getElementById("strengths").innerText;


    const weaknesses =
        document.getElementById("weaknesses").innerText;


    const suggestions =
        document.getElementById("suggestions").innerText;


    const report =
`
AI RESUME ANALYSER
==============================

RESUME SCORE
${score}/100

${scoreMessage}


SKILLS FOUND
${skills}


STRENGTHS
${strengths}


AREAS TO IMPROVE
${weaknesses}


SUGGESTIONS
${suggestions}


==============================
AI Resume Analyser
`;


    const file =
        new Blob([report], {
            type: "text/plain"
        });


    const link =
        document.createElement("a");


    link.href =
        URL.createObjectURL(file);


    link.download =
        "Resume-Analysis-Report.txt";


    link.click();

}
// ===============================
// RESUME TEMPLATE SELECTION
// ===============================

// ===============================
// RESUME TEMPLATE SELECTION
// ===============================

let selectedTemplate = "Professional";

function selectTemplate(templateName) {

    selectedTemplate = templateName;

    // Scroll to Resume Builder
    document.getElementById("builder").scrollIntoView({
        behavior: "smooth"
    });

}


// ===============================
// GENERATE RESUME
// ===============================

function generateResume() {

    const name = document.getElementById("builderName").value;
    const title = document.getElementById("builderTitle").value;
    const email = document.getElementById("builderEmail").value;
    const phone = document.getElementById("builderPhone").value;
    const education = document.getElementById("builderEducation").value;
    const skills = document.getElementById("builderSkills").value;
    const projects = document.getElementById("builderProjects").value;
    const experience = document.getElementById("builderExperience").value;
    const certifications = document.getElementById("builderCertifications").value;
    const linkedin = document.getElementById("builderLinkedIn").value;
    const github = document.getElementById("builderGithub").value;


    if (!name || !title || !email) {

        alert("Please enter your Name, Job Title and Email.");

        return;
    }


    const resumeWindow = window.open("", "_blank");


    resumeWindow.document.write(`

        <!DOCTYPE html>

        <html>

        <head>

            <title>${name} - Resume</title>

            <style>

                body {
                    font-family: Arial, sans-serif;
                    margin: 0;
                    padding: 40px;
                    background: white;
                    color: #222;
                }

                .resume {
                    max-width: 850px;
                    margin: auto;
                }

                .header {
                    text-align: center;
                    border-bottom: 3px solid #00a8cc;
                    padding-bottom: 20px;
                }

                .header h1 {
                    margin: 0;
                    font-size: 34px;
                }

                .header h2 {
                    margin: 8px 0;
                    color: #00a8cc;
                }

                .contact {
                    font-size: 14px;
                    color: #555;
                }

                .section {
                    margin-top: 25px;
                }

                .section h3 {
                    color: #00a8cc;
                    border-bottom: 1px solid #ddd;
                    padding-bottom: 5px;
                }

                .section p {
                    white-space: pre-line;
                    line-height: 1.6;
                }

                .template-name {
                    text-align: right;
                    font-size: 11px;
                    color: #999;
                    margin-bottom: 10px;
                }

                .download {
                    text-align: center;
                    margin-top: 35px;
                }

                .download button {
                    padding: 12px 25px;
                    background: #00a8cc;
                    color: white;
                    border: none;
                    border-radius: 6px;
                    cursor: pointer;
                    font-weight: bold;
                }

                @media print {

                    .download {
                        display: none;
                    }

                }

            </style>

        </head>


        <body>

            <div class="resume">

                <div class="template-name">
                    Template: ${selectedTemplate}
                </div>


                <div class="header">

                    <h1>${name}</h1>

                    <h2>${title}</h2>

                    <div class="contact">

                        ${email}
                        ${phone ? " | " + phone : ""}

                    </div>

                </div>


                <div class="section">

                    <h3>EDUCATION</h3>

                    <p>${education || "Not provided"}</p>

                </div>


                <div class="section">

                    <h3>SKILLS</h3>

                    <p>${skills || "Not provided"}</p>

                </div>


                <div class="section">

                    <h3>PROJECTS</h3>

                    <p>${projects || "Not provided"}</p>

                </div>


                <div class="section">

                    <h3>EXPERIENCE</h3>

                    <p>${experience || "Not provided"}</p>

                </div>


                <div class="section">

                    <h3>CERTIFICATIONS</h3>

                    <p>${certifications || "Not provided"}</p>

                </div>


                <div class="section">

                    <h3>LINKEDIN</h3>

                    <p>${linkedin || "Not provided"}</p>

                </div>


                <div class="section">

                    <h3>GITHUB</h3>

                    <p>${github || "Not provided"}</p>

                </div>


                <div class="download">

                    <button onclick="window.print()">
                        📥 Print / Save as PDF
                    </button>

                </div>

            </div>

        </body>

        </html>

    `);


    resumeWindow.document.close();

}
// ===============================
// AI ASSISTANT
// ===============================

async function askAI() {

    const questionInput = document.getElementById("aiQuestion");
    const chatMessages = document.getElementById("chatMessages");

    const question = questionInput.value.trim();

    if (!question) {
        alert("Please enter a question.");
        return;
    }


    // Show user's question
    const userMessage = document.createElement("div");

    userMessage.className = "user-message";

    userMessage.textContent = question;

    chatMessages.appendChild(userMessage);


    // Clear input
    questionInput.value = "";


    // Show temporary message
    const aiMessage = document.createElement("div");

    aiMessage.className = "ai-message";

    aiMessage.textContent = "Thinking...";

    chatMessages.appendChild(aiMessage);


    try {

        const response = await fetch(
       "https://ai-resume-analyser-1cpz.onrender.com/translate",
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    question: question
                })
            }
        );


        const data = await response.json();


        if (response.ok) {

            aiMessage.textContent = data.answer;

        } else {

            aiMessage.textContent =
                data.message || "Something went wrong.";

        }


    } catch (error) {

        console.error("AI Assistant Error:", error);

        aiMessage.textContent =
            "Unable to connect to the AI Assistant.";

    }


    // Scroll to latest message
    chatMessages.scrollTop = chatMessages.scrollHeight;

}
// =====================================
// RESUME TRANSLATOR
// =====================================

async function translateResume() {

    const text =
        document.getElementById("translatorText").value.trim();

    const sourceLanguage =
        document.getElementById("sourceLanguage").value;

    const targetLanguage =
        document.getElementById("targetLanguage").value;

    const translatedText =
        document.getElementById("translatedText");


    // Check empty text
    if (!text) {

        alert("Please enter your resume text.");

        return;
    }


    // Same language
    if (sourceLanguage === targetLanguage) {

        translatedText.value = text;

        return;
    }


    // Show loading
    translatedText.value = "Translating...";


    try {

        const response = await fetch(
         "https://ai-resume-analyser-1cpz.onrender.com/ai-assistant",
            {

                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({

                    text: text,

                    sourceLanguage: sourceLanguage,

                    targetLanguage: targetLanguage

                })

            }
        );


        const data = await response.json();


        if (response.ok) {

            translatedText.value =
                data.translation;

        }

        else {

            translatedText.value =
                data.message ||
                "Translation failed.";

        }

    }

    catch (error) {

        console.error(
            "Translation Error:",
            error
        );

        translatedText.value =
            "Unable to connect to the translation service.";

    }

}