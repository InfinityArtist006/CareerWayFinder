const searchKeywords = [
  "Doctor",
  "Engineer",
  "Nurse",
  "Teacher",
  "Designer",
  "#Engineering",
];
let index = 0;

const searchInput = document.getElementById("search-input");

function changeProfession() {
  searchInput.placeholder = `Try searching with ${searchKeywords[index]}`;
  index = (index + 1) % searchKeywords.length;
}

setInterval(changeProfession, 2000);

function scrollToNextPage() {
  document.getElementById("nextPage").scrollIntoView({ behavior: "smooth" });
}

//function to download pdf
function downloadPDF() {
  const pdfpage = document.getElementById("pdfpage");
  const roadmap = document.getElementById("roadmap");
  const roadmapPDF = document.getElementById("roadmappdf");

  // Hide roadmap from main page and move it to pdfpage
  roadmap.style.display = "none";
  roadmapPDF.innerHTML = roadmap.innerHTML;

  const permission = document.getElementById("permission");
  permission.style.display = "block";
  pdfpage.style.display = "block";
}
// Add event listeners only once (prevents multiple bindings)
document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("Ok").addEventListener("click", generatePDF);
  document.getElementById("cancel").addEventListener("click", hidePDFPage);
});

function generatePDF() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF({
    orientation: "portrait", // Keep as "landscape" if needed
    unit: "mm",
    format: "a4",
  });

  const pdfpage = document.getElementById("pdfpage");
  pdfpage.style.width = "1000px"; // Force a wider view to match desktop
  pdfpage.style.maxWidth = "none"; // Prevent it from shrinking
  html2canvas(pdfpage, {
    scale: 3, // Increase scale for better resolution
    windowWidth: roadmap.scrollWidth, // Capture full width
    windowHeight: roadmap.scrollHeight, // Capture full height
  }).then((canvas) => {
    const imgData = canvas.toDataURL("image/png");
    const imgWidth = 190;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    doc.addImage(imgData, "PNG", 10, 10, imgWidth, imgHeight);
    doc.save("career_roadmap.pdf");

    // Restore UI after download
    hidePDFPage();
  });
}

function hidePDFPage() {
  document.getElementById("pdfpage").style.display = "none";
  document.getElementById("permission").style.display = "none";

  // Restore roadmap visibility
  document.getElementById("roadmap").style.display = "block";
}

//Responsive header
function toggleMenu() {
  const nav = document.querySelector("nav");
  nav.classList.toggle("active");
}
// Function to encode "<" and ">"
function encodeHTML(str) {
  return str.replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

// Recommended careers (IDs of elements in the HTML)
const recommendedCareers = [
  "rec_career1",
  "rec_career2",
  "rec_career3",
  "rec_career4",
  "rec_career5",
];
let i = null; // Declare i at the top

// Loop through the career elements and add click event listeners
recommendedCareers.forEach((careerId) => {
  const element = document.getElementById(careerId);
  if (element) {
    element.addEventListener("click", (event) => {
      displayRecommendedCareer(event.target);
    });
  } else {
    console.warn(`Element with ID '${careerId}' not found.`);
  }
});

// Function to handle recommended career click
async function displayRecommendedCareer(clickedElement) {
  let career = clickedElement.value;
  career = career.replace(/^"+|"+$/g, ""); // Remove unnecessary quotes
  roadmapHandler({ CareerName: career });
}
//Recommend career roadmap handler
async function recomendationRoadmapHandler(requestData) {
  let i = null;
  try {
    const response = await fetch("/recommendcareer", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(requestData), // Corrected JSON format
    });

    const roadmapContainer = document.getElementById("roadmap");
    const downloadPDFButton = document.getElementById("downloadpdf");
    tableOrGraph();
    if (!roadmapContainer) {
      throw new Error("Roadmap container not found.");
    }

    roadmapContainer.style.display = "block";
    roadmapContainer.innerHTML = ""; // Clear previous content

    if (!response.ok) {
      throw new Error(`Failed to fetch data: ${response.statusText}`);
    }

    const data = await response.json();

    // Ensure roadmap array exists and contains at least one item
    if (
      !data.roadmap ||
      !Array.isArray(data.roadmap) ||
      data.roadmap.length === 0
    ) {
      roadmapContainer.innerHTML = "No roadmap data found.";
      return;
    }

    if (data.roadmap.length === 1 && i === null) {
      i = 0;
      const roadmapData = data.roadmap[i]; // Access roadmap
      generateBox(data.roadmap); // Generate buttons for selection
      roadmapContainer.innerHTML = "Please select one of the given options";
      tableOrGraph();
      const Career =
        document.getElementById("selectTable").addEventListener("click", () => {
          return generateCareerTable(roadmapData, roadmapContainer, "table"); // Create career table
        }) ||
        document.getElementById("selectGraph").addEventListener("click", () => {
          return generateCareerTable(roadmapData, roadmapContainer, "graph"); // Create career graph
        });
      insertRoadmapIdCheck(Career); // Process roadmap ID check

      downloadPDFButton.style.display = "block";
    } else {
      roadmapContainer.innerHTML = `Please select a roadmap from the ${data.roadmap.length} available roadmap(s).`;
      generateBox(data.roadmap);

      const nextPage = document.getElementById("nextPage");
      if (nextPage) {
        nextPage.addEventListener("click", (event) => {
          if (event.target.tagName === "BUTTON") {
            let subCareerVal = event.target.getAttribute("data-sub-career");
            i = parseInt(subCareerVal, 10);

            const roadmapData = data.roadmap[i]; // Access selected roadmap
            roadmapContainer.innerHTML =
              "Please select one of the given options";
            tableOrGraph();
            const Career =
              document
                .getElementById("selectTable")
                .addEventListener("click", () => {
                  return generateCareerTable(
                    roadmapData,
                    roadmapContainer,
                    "table"
                  ); // Create career table
                }) ||
              document
                .getElementById("selectGraph")
                .addEventListener("click", () => {
                  return generateCareerTable(
                    roadmapData,
                    roadmapContainer,
                    "graph"
                  ); // Create career graph
                });
            insertRoadmapIdCheck(Career);
            downloadPDFButton.style.display = "block";
          }
        });
      } else {
        console.warn("Element with ID 'nextPage' not found.");
      }
    }
  } catch (error) {
    console.error("Error fetching data:", error);
    alert(error.message); // Show error to user
  }
}

//Function to limit career name
function limitText(description) {
  const result = [];
  if (description) {
    const words = description.split(" "); // Split the description into words

    // Loop through words and add line break after every 4 words
    for (let i = 0; i < 7; i++) {
      result.push(words[i]);
      if ((i + 1) % 4 === 0) {
        result.push("\n"); // Add line break after every 4 words
      }
    }
  } else {
    return "";
  }

  return result.join(" "); // Join the words back into a string with spaces
}

//Roadmap Handler
async function roadmapHandler(requestData) {
  let i = null;
  try {
    const response = await fetch("/roadmap", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(requestData), // Corrected JSON format
    });

    const roadmapContainer = document.getElementById("roadmap");
    const downloadPDFButton = document.getElementById("downloadpdf");

    if (!roadmapContainer) {
      throw new Error("Roadmap container not found.");
    }

    roadmapContainer.style.display = "block";
    roadmapContainer.innerHTML = ""; // Clear previous content

    if (!response.ok) {
      throw new Error(`Failed to fetch data: ${response.statusText}`);
    }

    const data = await response.json();

    // Ensure roadmap array exists and contains at least one item
    if (
      !data.roadmap ||
      !Array.isArray(data.roadmap) ||
      data.roadmap.length === 0
    ) {
      roadmapContainer.innerHTML = "No roadmap data found.";
      return;
    }

    if (data.roadmap.length === 1 && i === null) {
      i = 0;
      const roadmapData = data.roadmap[i]; // Access roadmap
      roadmapContainer.innerHTML = "Please select one of the given options";
      tableOrGraph();
      generateBox(data.roadmap); // Generate buttons for selection
      const Career =
        document.getElementById("selectTable").addEventListener("click", () => {
          return generateCareerTable(roadmapData, roadmapContainer, "table"); // Create career table
        }) ||
        document.getElementById("selectGraph").addEventListener("click", () => {
          return generateCareerTable(roadmapData, roadmapContainer, "graph"); // Create career graph
        });
      insertRoadmapIdCheck(Career); // Process roadmap ID check

      downloadPDFButton.style.display = "block";
    } else {
      roadmapContainer.innerHTML = `Please select a roadmap from the ${data.roadmap.length} available roadmap(s).`;
      generateBox(data.roadmap);

      const nextPage = document.getElementById("nextPage");
      if (nextPage) {
        nextPage.addEventListener("click", (event) => {
          if (event.target.tagName === "BUTTON") {
            let subCareerVal = event.target.getAttribute("data-sub-career");
            i = parseInt(subCareerVal, 10);

            roadmapContainer.innerHTML = "";
            const roadmapData = data.roadmap[i]; // Access selected roadmap
            roadmapContainer.innerHTML =
              "Please select one of the above options";
            tableOrGraph();
            const Career =
              document
                .getElementById("selectTable")
                .addEventListener("click", () => {
                  return generateCareerTable(
                    roadmapData,
                    roadmapContainer,
                    "table"
                  ); // Create career table
                }) ||
              document
                .getElementById("selectGraph")
                .addEventListener("click", () => {
                  return generateCareerTable(
                    roadmapData,
                    roadmapContainer,
                    "graph"
                  ); // Create career graph
                });
            insertRoadmapIdCheck(Career);
            downloadPDFButton.style.display = "block";
          }
        });
      } else {
        console.warn("Element with ID 'nextPage' not found.");
      }
    }
  } catch (error) {
    console.error("Error fetching data:", error);
    alert(error.message); // Show error to user
  }
}

//Dynamic roadmap
document
  .getElementById("generateTable")
  .addEventListener("submit", async (event) => {
    event.preventDefault(); // Prevent form refresh

    const form = event.target;
    const formData = new FormData(form);
    const requestData = Object.fromEntries(formData.entries());
    // Loop through `requestData` and encode values if necessary
    for (let key in requestData) {
      if (requestData[key].includes("<") || requestData[key].includes(">")) {
        requestData[key] = encodeHTML(requestData[key]);
      }
    }

    scrollToNextPage();

    roadmapHandler(requestData);
  });

//Function to generate table/graph
function generateCareerTable(roadmapData, roadmapContainer, type) {
  let width = window.innerWidth;

  //function to handle nodes content
  function formatList(items) {
    return items.join("\n-");
  }
  function addLineBreaks(description) {
    const words = description.split(" "); // Split the description into words
    const result = [];

    // Loop through words and add line break after every 4 words
    for (let i = 0; i < words.length; i++) {
      result.push(words[i]);
      if ((i + 1) % 4 === 0) {
        result.push("\n"); // Add line break after every 4 words
      }
    }

    return result.join(" "); // Join the words back into a string with spaces
  }
  if (type === "graph") {
    roadmapContainer.innerHTML = "";
    const nodes = new vis.DataSet([
      {
        id: 1,
        label: `Core Career: ${roadmapData.core_career}`,
        shape: "box",
        color: "#ffcccb",
      },
      {
        id: 2,
        label: `Career: ${roadmap.career==""?limitText(roadmap.core_career):limitText(roadmap.career)}`,
        shape: "box",
        color: "#c3e6cb",
      },
      {
        id: 3,
        label: `Academic Stream:\n${roadmapData.academic_stream}`,
        shape: "box",
        color: "#b3cde0",
      },
      {
        id: 4,
        label: `College Course:\n${addLineBreaks(roadmapData.college_course)}`,
        shape: "box",
        color: "#f9e79f",
      },
      {
        id: 5,
        label: `Duration: \n${addLineBreaks(roadmapData.duration)}`,
        shape: "box",
        color: "#d5a6bd",
      },
      {
        id: 8,
        label: `Salary:\nEntry:${roadmapData.salary_range.entry_level}\nExperienced:${roadmapData.salary_range.experienced}`,
        shape: "box",
        color: "#ffeeba",
      },
      { id: 7, label: "Roadmap Steps", shape: "box", color: "#f7cac9" },
      {
        id: 6,
        label: `Subjects:\n-${formatList(roadmapData.subjects)}`,
        shape: "box",
        color: "#2980b9",
      },
      {
        id: 9,
        label: `Institutions:\n-${formatList(roadmapData.institutions)}`,
        shape: "box",
        color: "#27ae60",
      },
      {
        id: 10,
        label: "Professional Community",
        shape: "box",
        color: "#a9bdff",
      },
      { id: 11, label: "Related Books", shape: "box", color: "#7092ff" },
      {
        id: 12,
        label: `Advancement Opportunities:\n-${formatList(
          roadmapData.advancement_opportunities
        )}`,
        shape: "box",
        color: "#f39c12",
      },
      {
        id: 13,
        label: `Related Careers:\n-${formatList(roadmapData.related_careers)}`,
        shape: "box",
        color: "#16a085",
      },
    ]);

    let edges = [
      { from: 1, to: 2, length: 150 },
      { from: 11, to: 1, length: 100 },
      { from: 3, to: 1, length: 150 },
      { from: 4, to: 9, length: 150 },
      { from: 9, to: 3, length: 150 },
      { from: 5, to: 4, length: 150 },
      { from: 2, to: 7, length: 150 },
      { from: 10, to: 1, length: 150 },
      { from: 2, to: 8 },
      { from: 1, to: 6 },
      { from: 6, to: 2 },
      { from: 2, to: 12, length: 150 },
      { from: 1, to: 13, length: 150 },
      { from: 13, to: 2 },
    ];
    function maxNode() {
      let max = 0;
      for (let i = 0; i < edges.length; i++) {
        if (edges[i].to > max) {
          max = edges[i].to;
        } else if (edges[i].from > max) {
          max = edges[i].from;
        }
      }
      return max;
    }

    let nodeId = maxNode() + 1;
    roadmapData.steps.forEach((step) => {
      nodes.add({
        id: nodeId,
        label: `${step.stage}:\n${addLineBreaks(step.description)}`,
        shape: "box",
        color: "#d6eaf8",
      });
      edges.push({ from: 7, to: nodeId, length: 200 });
      nodeId++;
    });

    roadmapData.professional_community.forEach((comu) => {
      nodes.add({
        id: nodeId,
        label: `Name: ${addLineBreaks(comu.name)}\nUrl:${comu.url}\nType:${
          comu.type
        }`,
        shape: "box",
        color: "#85c1e9",
      });
      edges.push({ from: nodeId, to: 10, length: 200 });
      nodeId++;
    });

    roadmapData.related_books.forEach((book) => {
      nodes.add({
        id: nodeId,
        label: `Title:${book.title}\nBy:${book.author}\nIsbn:${book.isbn}`,
        shape: "box",
        color: "#58d68d",
      });
      edges.push({ from: nodeId, to: 11, length: 200 });
      nodeId++;
    });

    const data = { nodes, edges };
    const options = {
      layout: {
        hierarchical: {
          enabled: true,
          direction: "UD",
          sortMethod: "directed",
          nodeSpacing: 700,
          levelSeparation: 250,
          shakeTowards: "roots",
        },
      },
      edges: {
        smooth: { type: "discrete", roundness: 1 },
        color: "white",
        arrows: "to",
        width: 2,
      },
      physics: { enabled: false },
      interaction: { zoomView: true },
      nodes: {
        font: { size: 25, color: "black", align: "left" },
        margin: 10,
      }, // Default font size
    };
    roadmapContainer.style.padding = "0px";
    roadmapContainer.style.height = "600px";
    new vis.Network(roadmapContainer, data, options);
  } else if (width < 619 || type === "table") {
    roadmapContainer.innerHTML = "";
    roadmapContainer.style.padding = "40px";
    roadmapContainer.style.height = "auto";

    const careerTable = document.createElement("table");

    careerTable.className = "careerInfoTable";
    careerTable.innerHTML = `
<tr><td class="left">Core Career</td><td>${
      roadmapData.core_career || "N/A"
    }</td></tr>
<tr><td class="left">Roadmap ID</td><td>${
      roadmapData.roadmap_id || "N/A"
    }</td></tr>
<tr><td class="left">Academic Stream</td><td>${
      roadmapData.academic_stream || "N/A"
    }</td></tr>
<tr><td class="left">Career</td><td>${roadmapData.career || "N/A"}</td></tr>
<tr><td class="left">Description</td><td>${
      roadmapData.description || "N/A"
    }</td></tr>
<tr><td class="left">College Course</td><td>${
      roadmapData.college_course || "N/A"
    }</td></tr>
<tr><td class="left">Duration</td><td>${roadmapData.duration || "N/A"}</td></tr>
<tr><td class="left">Exam Name (Optional)</td><td>${
      roadmapData["exam_name(Optional)"] || "N/A"
    }</td></tr>
<tr><td class="left">Subjects</td><td>${
      Array.isArray(roadmapData.subjects)
        ? roadmapData.subjects.join(", ")
        : "N/A"
    }</td></tr>
<tr><td class="left">Hashtags</td><td>${
      Array.isArray(roadmapData.hashtags)
        ? roadmapData.hashtags.join(" ")
        : "N/A"
    }</td></tr>
<tr><td class="left">Institutions</td><td>${
      Array.isArray(roadmapData.institutions)
        ? roadmapData.institutions.join(", ")
        : "N/A"
    }</td></tr>
<tr><td class="left">Entry Level Salary</td><td>${
      roadmapData.salary_range?.entry_level || "N/A"
    }</td></tr>
<tr><td class="left">Experienced Salary</td><td>${
      roadmapData.salary_range?.experienced || "N/A"
    }</td></tr>
<tr><td class="left">Advancement Opportunities</td><td>${
      Array.isArray(roadmapData.advancement_opportunities)
        ? roadmapData.advancement_opportunities.join(", ")
        : "N/A"
    }</td></tr>
<tr><td class="left">Related Careers</td><td>${
      Array.isArray(roadmapData.related_careers)
        ? roadmapData.related_careers.join(", ")
        : "N/A"
    }</td></tr>
<tr><td class="left">Entry Requirements</td><td>${
      Array.isArray(roadmapData.entry_requirements)
        ? roadmapData.entry_requirements.join(", ")
        : "N/A"
    }</td></tr>
`;

    roadmapContainer.appendChild(careerTable);

    // Create steps table
    if (Array.isArray(roadmapData.steps) && roadmapData.steps.length > 0) {
      const stepsTable = document.createElement("table");
      stepsTable.className = "step_table";
      stepsTable.innerHTML = `<tr><th>Stage</th><th>Description</th></tr>`;

      roadmapData.steps.forEach((step) => {
        const row = document.createElement("tr");
        row.innerHTML = `<td>${step.stage || "N/A"}</td><td>${
          step.description || "N/A"
        }</td>`;
        stepsTable.appendChild(row);
      });

      roadmapContainer.appendChild(stepsTable);
    }
  }
  return roadmapData.roadmap_id;
}
// Function to generate multiple roadmap buttons
function generateBox(Roadmaps) {
  const subCareerList = document.getElementById("nextPage");
  subCareerList.innerHTML = ""; // Clear previous content

  Roadmaps.forEach((roadmap, i) => {
    const subCareer = document.createElement("button");
    subCareer.id = `subCareer${i + 1}`;
    subCareer.setAttribute("data-sub-career", i); // Use data attribute
    subCareer.textContent = limitText(roadmap.career);
    subCareerList.appendChild(subCareer);
  });
}

//Function to add roadmap id to user career maps list
async function insertRoadmapIdCheck(roadmapId) {
  const loginLogoutButton = document.getElementById("login_logout");

  if (loginLogoutButton.textContent !== "Logout") {
    return; // Exit if the user is not logged in
  }

  try {
    const response = await fetch(`/roadmap/add`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ roadmapId }),
    });

    if (!response.ok) {
      throw new Error(
        `HTTP Error: ${response.status} - ${response.statusText}`
      );
    }

    console.log("Roadmap ID inserted successfully");
  } catch (error) {
    console.error("Failed to insert roadmap ID:", error);
  }
}

//Function to choose between table and graph
function tableOrGraph() {
  const typeSelection = document.getElementById("typeSelection");
  typeSelection.style.display = "block";
}
//Handle Logout an login
document.addEventListener("DOMContentLoaded", async () => {
  const loginLogoutButton = document.getElementById("login_logout");
  if (!loginLogoutButton) return; // Prevent errors if button is missing

  try {
    // Check login status from the server (backend should check the cookie)
    const response = await fetch("/auth/status", { credentials: "include" });
    const data = await response.json();

    const isLoggedIn = data.isLoggedIn;
    updateButtonText(isLoggedIn);

    loginLogoutButton.addEventListener("click", async () => {
      if (isLoggedIn) {
        await logoutUser();
      } else {
        window.location.href = "/login"; // Redirect to login
      }
    });
  } catch (error) {
    console.error("Error fetching login status:", error);
  }

  //function to update login/logout button text and create and add account link
  function updateButtonText(status) {
    let navigationBar = document.getElementById("navigationBar");
    let loginLogoutButton = document.getElementById("login_logout");

    if (status) {
      loginLogoutButton.textContent = "Logout";

      // Create the "Account" link only if it doesn't already exist
      if (!document.getElementById("account")) {
        const profileLink = document.createElement("a");
        profileLink.href = "/profile";
        profileLink.textContent = "Account";
        profileLink.id = "account";

        navigationBar.insertBefore(profileLink, navigationBar.lastElementChild);
      }
    } else {
      loginLogoutButton.textContent = "Login";

      // Check if the element exists before removing it
      let accountLink = document.getElementById("account");
      if (accountLink) {
        navigationBar.removeChild(accountLink);
      }
    }
  }

  async function logoutUser() {
    try {
      const response = await fetch("/logout", {
        method: "POST",
        credentials: "include", // Ensure cookies are sent
      });

      if (!response.ok) throw new Error("Logout failed");

      updateButtonText(false);
      window.location.href = "/"; // Redirect to homepage after logout
    } catch (error) {
      console.error("Error during logout:", error);
      alert("Logout failed. Please try again.");
    }
  }

  //Google translation
  async function googleTranslateElementInit() {
    await new google.translate.TranslateElement(
      {
        pageLanguage: "en",
        includedLanguages:
          "as,bn,brx,doi,gu,hi,kn,ks,gom,mai,ml,mni,mr,ne,or,pa,sa,sat,sd,ta,te,ur", // Specify the languages you want to include
        layout: google.translate.TranslateElement.InlineLayout.SIMPLE,
      },
      "google_translate_element"
    );
  }

  //Calling google translation
  googleTranslateElementInit();
});

//Generalization & Personalization
document
  .getElementById("generalization")
  .addEventListener("click", async (event) => {
    const mainContent = document.getElementById("contentholder");
    const buttonSection = document.getElementById("buttonSection");
    let generalButton = document.getElementById("generalization");
    mainContent.innerHTML = "";
    mainContent.innerHTML = `<h1>Career Way Finder</h1>
      <div class="search-bar">
        <form id="generateTable">
          <input
            id="search-input"
            type="text"
            name="CareerName"
            id="CareerTextField"
          />
          <div class="cta">
            <button type="submit">Let's Build Journey&#128293;</button>
          </div>
        </form>
      </div>`;
    mainContent.style.marginTop = "";
    mainContent.style.marginBottom = "";
    buttonSection.style.marginBottom = "0px";
    generalButton.style.borderBottom = "none";
  });

document
  .getElementById("personalization")
  .addEventListener("click", async (event) => {
    let personalButton = document.getElementById("personalization");
    const mainContent = document.getElementById("contentholder");
    const buttonSection = document.getElementById("buttonSection");
    const explorer = document.getElementById("explore");
    const width = window.innerWidth;
    const height = window.innerHeight;
    mainContent.innerHTML = ``;
    mainContent.innerHTML = `<div class="personalityform">
        <h1>Find Your Career Personality!</h1>
        <p class="intro">Take this quick quiz to discover your unique personality and career suggestions tailored just for you!</p>
        <form id="personalityForm">
            <!-- Section 1: Daily Habits -->
            <div class="section-title">1. Daily Habits</div>
            <div class="question">
                <label>How do you usually approach school assignments?</label>
                <input type="range" name="q1" min="1" max="5" value="3">
                <small>1 = Very Spontaneous, 5 = Very Organized</small>
            </div>
            <div class="question">
                <label>How do you like to recharge after school?</label>
                <input type="range" name="q2" min="1" max="5" value="3">
                <small>1 = Socializing with many people, 5 = Quiet time alone</small>
            </div>

            <!-- Section 2: In the Classroom -->
            <div class="section-title">2. In the Classroom</div>
            <div class="question">
                <label>When working on a group project, what’s your role?</label>
                <input type="range" name="q3" min="1" max="5" value="3">
                <small>1 = The Idea Generator, 5 = The Planner and Organizer</small>
            </div>
            <div class="question">
                <label>How do you solve challenging school problems?</label>
                <input type="range" name="q4" min="1" max="5" value="3">
                <small>1 = Creative ideas, 5 = Practical solutions</small>
            </div>

            <!-- Section 3: Personal Values -->
            <div class="section-title">3. Personal Values</div>
            <div class="question">
                <label>What motivates you to do your best?</label>
                <input type="range" name="q5" min="1" max="5" value="3">
                <small>1 = Helping others, 5 = Achieving goals</small>
            </div>
            <div class="question">
                <label>What’s your dream work environment?</label>
                <input type="range" name="q6" min="1" max="5" value="3">
                <small>1 = Dynamic and fast-paced, 5 = Calm and predictable</small>
            </div>

            <!-- Section 4: Interests -->
            <div class="section-title">4. Interests</div>
            <div class="question">
                <label>What are your key interests? (Separate with commas)</label>
                <input type="text" name="interests" placeholder="Technology, Science, Art">
            </div>
            
            <!-- Section 5: Hobbies -->
            <div class="section-title">5. Hobbies</div>
            <div class="question">
                <label>What are your favorite hobbies? (Separate with commas)</label>
                <input type="text" name="hobbies" placeholder="Reading, Coding, Painting">
            </div>

            <div class="submit">
                <button type="submit">See My Results</button>
            </div>
        </form>
        <div id="result"></div>
    </div>`;
    mainContent.style.textAlign = "left";
    mainContent.style.marginTop = "10%";
    mainContent.style.marginBottom = "10%";
    if (width < 989 && width > 779) {
      buttonSection.style.marginBottom = "20%";
      explorer.style.marginTop = "20%";
    } else if (width < 778 && width > 620) {
      buttonSection.style.marginBottom = "30%";
      explorer.style.marginTop = "30%";
    } else if (width < 619) {
      buttonSection.style.marginBottom = "70%";
      explorer.style.marginTop = "70%";
    }
    personalButton.style.borderBottom = "none";
    personalityForm();
  });

function personalityForm() {
  //Personality form
  document
    .getElementById("personalityForm")
    .addEventListener("submit", async (e) => {
      e.preventDefault();
      try {
        // Capture form data
        const formData = new FormData(e.target);
        const responses = {};
        const result = document.getElementById("result");
        for (let [key, value] of formData.entries()) {
          if (key === "interests" || key === "hobbies") {
            responses[key] = value.split(",").map((item) => item.trim()); // Convert to an array
          } else {
            responses[key] = parseInt(value, 10); // Convert to number
          }
        }

        // Personality categories and initial scores
        const categories = {
          planner: 0,
          creative: 0,
          introvert: 0,
          extrovert: 0,
          empathetic: 0,
          ambitious: 0,
        };

        // Map responses to personality categories
        categories.planner += responses.q1 + responses.q3;
        categories.creative += responses.q4;
        categories.introvert += responses.q2 + responses.q6;
        categories.extrovert += 10 - responses.q2 + (10 - responses.q6); // Opposite score for introversion
        categories.empathetic += responses.q5;
        categories.ambitious += 10 - responses.q5; // Opposite score for empathy

        // Determine dominant traits
        const dominantTraits = Object.entries(categories)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 2)
          .map(([trait]) => trait);

        scrollToNextPage();

        recomendationRoadmapHandler({
          personality: dominantTraits,
          interests: responses["interests"],
          hobbies: responses["hobbies"],
        });
      } catch (e) {
        window.console.error(e);
      }
    });
}
