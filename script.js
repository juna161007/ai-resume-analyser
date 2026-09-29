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
fetch("http://localhost:5000/analyse", {
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