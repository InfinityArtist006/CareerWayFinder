window.addEventListener("scroll", function () {
  let navbar = document.querySelector(".navbar");
  let sidebar = document.querySelector(".sidebar-header");

  navbar.style.borderBottom = "none";
  navbar.style.boxShadow = "none";

  sidebar.style.borderBottom = "none";
  sidebar.style.boxShadow = "none";
});

const searchInput = document.querySelector(".search-input");
const searchBtn = document.querySelector(".search-btn");

searchBtn.addEventListener("click", () => {
  searchInput.classList.toggle("active");
  if (searchInput.classList.contains("active")) {
    searchInput.focus();
  }
});

document.addEventListener("click", (event) => {
  if (
    !searchBtn.contains(event.target) &&
    !searchInput.contains(event.target)
  ) {
    searchInput.classList.remove("active");
  }
});

function toggleMode() {
  let body = document.body;
  let modeIcon = document.getElementById("modeIcon");

  body.classList.toggle("light-mode");

  if (body.classList.contains("light-mode")) {
    localStorage.setItem("darkMode", "disabled");

    body.style.backgroundColor = "white";
    if (modeIcon) modeIcon.src = "IMAGES/dark-main.svg";
  } else {
    localStorage.setItem("darkMode", "enabled");

    body.style.backgroundColor = "black";
    if (modeIcon) modeIcon.src = "IMAGES/light.svg";
  }
}

document.addEventListener("DOMContentLoaded", function () {
  let darkMode = localStorage.getItem("darkMode");
  let modeIcon = document.getElementById("modeIcon");
  if (darkMode === "disabled") {
    document.body.classList.add("light-mode");
    document.body.style.backgroundColor = "white";
    if (modeIcon) modeIcon.src = "IMAGES/dark-main.svg";
  } else {
    let section = document.querySelector("section");

    document.body.classList.remove("light-mode");
    document.section.style.backgroundColor = "black";
    if (modeIcon) modeIcon.src = "IMAGES/light.svg";

    localStorage.setItem("darkMode", "enabled");
  }
});

document
  .getElementById("profileToggle")
  .addEventListener("click", function (event) {
    event.stopPropagation();
    let popup = document.getElementById("profilePopup");

    if (popup.classList.contains("show")) {
      popup.classList.remove("show");
      setTimeout(() => {
        popup.style.display = "none";
      }, 300);
    } else {
      popup.style.display = "block";
      setTimeout(() => {
        popup.classList.add("show");
      }, 10);
    }
  });

document.addEventListener("click", function (event) {
  let popup = document.getElementById("profilePopup");
  let profileBtn = document.getElementById("profileToggle");

  if (!profileBtn.contains(event.target) && !popup.contains(event.target)) {
    popup.classList.remove("show");
    setTimeout(() => {
      popup.style.display = "none";
    }, 300);
  }
});

// first chart
var options1 = {
  series: [
    {
      name: "Users",
      data: [44, 55, 57, 56, 61, 58, 63, 60, 66],
    },
    {
      name: "Roadmap",
      data: [76, 85, 101, 98, 87, 105, 91, 114, 94],
    },
    {
      name: "Review",
      data: [35, 41, 36, 26, 45, 48, 52, 53, 41],
    },
  ],
  chart: {
    type: "bar",
    height: 350,
  },
  plotOptions: {
    bar: {
      horizontal: false,
      columnWidth: "55%",
      borderRadius: 5,
      borderRadiusApplication: "end",
    },
  },
  dataLabels: {
    enabled: false,
  },
  stroke: {
    show: true,
    width: 2,
    colors: ["transparent"],
  },
  xaxis: {
    categories: ["Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct"],
  },
  yaxis: {
    title: {
      text: "$ (thousands)",
    },
  },
  fill: {
    opacity: 1,
  },
  tooltip: {
    y: {
      formatter: function (val) {
        return "$ " + val + " thousands";
      },
    },
  },
};

var chart1 = new ApexCharts(document.querySelector("#chart"), options1);
chart1.render();

var options = {
  chart: {
    type: "area",
    height: 120,
    sparkline: { enabled: true },
  },
  series: [
    {
      data: [12, 18, 10, 25, 14],
    },
  ],
  stroke: { curve: "smooth", width: 2 },
  fill: { opacity: 0.3 },
  tooltip: { enabled: false },
};

var chart = new ApexCharts(document.querySelector("#cardChart1"), options);
chart.render();

var options = {
  chart: {
    type: "area",
    height: 120,
    sparkline: { enabled: true },
  },
  series: [
    {
      data: [12, 18, 10, 25, 14],
    },
  ],
  stroke: { curve: "smooth", width: 2 },
  fill: { opacity: 0.3 },
  tooltip: { enabled: false },
};

var chart = new ApexCharts(document.querySelector("#cardChart2"), options);
chart.render();

var options = {
  chart: {
    type: "area",
    height: 120,
    sparkline: { enabled: true },
  },
  series: [
    {
      data: [12, 18, 10, 25, 14],
    },
  ],
  stroke: { curve: "smooth", width: 2 },
  fill: { opacity: 0.3 },
  tooltip: { enabled: false },
};

var chart = new ApexCharts(document.querySelector("#cardChart3"), options);
chart.render();

var options = {
  chart: {
    type: "area",
    height: 120,
    sparkline: { enabled: true },
  },
  series: [
    {
      data: [12, 18, 10, 25, 14],
    },
  ],
  stroke: { curve: "smooth", width: 2 },
  fill: { opacity: 0.3 },
  tooltip: { enabled: false },
};

var chart = new ApexCharts(document.querySelector("#cardChart4"), options);
chart.render();

var options = {
  chart: {
    type: "pie",
    height: 200,
  },
  series: [25, 25, 25, 25],
  labels: ["A", "B", "C", "D"],
  legend: { show: false },
  tooltip: { enabled: false },
};

var chart = new ApexCharts(document.querySelector("#pieChart"), options);
chart.render();

document.getElementById("sidebarToggle").addEventListener("click", function () {
  const sidebar = document.getElementById("sidebar");
  const navbar = document.querySelector(".navbar");

  sidebar.classList.toggle("d-none");

  if (sidebar.classList.contains("d-none")) {
    navbar.style.left = "0";
    navbar.style.width = "100";
  } else {
    navbar.style.left = "188px";
  }
});

function adjustFooterHeight() {
  const footer = document.getElementById("footer");
  const footerHeight = footer.offsetHeight;

  document.documentElement.style.setProperty(
    "--footer-height",
    `${footerHeight}px`
  );
}

window.onload = adjustFooterHeight;
window.onresize = adjustFooterHeight;


fetch("http://localhost:5000/api/stats")
  .then((response) => response.json())
  .then((data) => {
    if (data && data.data && data.data.totalUsers) {
      document.getElementById("totalUsers").textContent = data.data.totalUsers;
    } else {
      console.error("Total users data not found:", data);
      document.getElementById("totalUsers").textContent = "Error fetching data";
    }

    if (data && data.data && data.data.totalPaths) {
      document.getElementById("totalRoadmaps").textContent =
        data.data.totalPaths;
    } else {
      console.error("Total roadmaps data not found:", data);
      document.getElementById("totalRoadmaps").textContent =
        "Error fetching data";
    }

    fetch("http://localhost:5000/api/reviews/count")
      .then((response) => response.json())
      .then((reviewsData) => {
        if (reviewsData && reviewsData.totalReviews !== undefined) {
          document.getElementById("totalReviews").textContent =
            reviewsData.totalReviews;
        } else {
          console.error("Total reviews data not found:", reviewsData);
          document.getElementById("totalReviews").textContent =
            "Error fetching data";
        }
      })
      .catch((error) => {
        console.error("Error fetching reviews count:", error);
        document.getElementById("totalReviews").textContent =
          "Error fetching data";
      });
  })
  .catch((error) => {
    console.error("Error fetching stats:", error);
    document.getElementById("totalUsers").textContent = "Error fetching data";
    document.getElementById("totalRoadmaps").textContent =
      "Error fetching data";
    document.getElementById("totalReviews").textContent = "Error fetching data";
  });

function fetchReviews() {
  fetch("http://localhost:5000/api/reviews")
    .then((response) => response.json())
    .then((reviews) => {
      console.log("Fetched reviews:", reviews);

      const reviewsContainer = document.getElementById("reviewsContainer");
      reviewsContainer.innerHTML = "";

      if (reviews.length === 0) {
        reviewsContainer.innerHTML =
          '<tr><td colspan="6" class="text-center">No reviews found.</td></tr>';
        return;
      }

      reviews.forEach((review, index) => {
        const row = document.createElement("tr");
        row.innerHTML = `
                    <td>${index + 1}</td>
                    <td>${review.full_name}</td>
                    <td>${review.email}</td>
                    <td>${review.suggestion}</td>
                    <td>${new Date(
                      review.post_time * 1000
                    ).toLocaleString()}</td>
                    <td>
                        <button class="btn btn-sm btn-danger" onclick="deleteReview('${
                          review.RWID
                        }')">Delete</button>
                    </td>
                `;
        reviewsContainer.appendChild(row);
      });
    })
    .catch((error) => {
      console.error("Error fetching reviews:", error);
      document.getElementById("reviewsContainer").innerHTML =
        '<tr><td colspan="6" class="text-center text-danger">Error fetching reviews. Please try again later.</td></tr>';
    });
}

function deleteReview(RWID) {
  fetch(`/api/reviews/${RWID}`, { method: "DELETE" })
    .then((response) => response.json())
    .then((data) => {
      if (data.error) {
        alert("Error: " + data.error);
      } else {
        alert("Review deleted successfully!");
        location.reload();
      }
    })
    .catch((error) => console.error("Error:", error));
}

fetchReviews();

let currentIndex = 0;
const itemsPerPage = 50;

function loadRoadmaps() {
  fetch("http://localhost:5000/api/roadmaps")
    .then((response) => response.json())
    .then((data) => {
      const roadmapTableBody = document.getElementById("roadmapTableBody");
      const showMoreContainer = document.getElementById("showMoreContainer");

      const endIndex = Math.min(currentIndex + itemsPerPage, data.length);

      if (currentIndex === 0) {
        roadmapTableBody.innerHTML = "";
      }

      for (let i = currentIndex; i < endIndex; i++) {
        const roadmap = data[i];
        const row = document.createElement("tr");

        row.innerHTML = `
                                <td>${roadmap.roadmap_id}</td>
                                <td>${roadmap.core_career}</td>
                                <td>${roadmap.academic_stream}</td>
                                <td>${roadmap.career}</td>
                                <td>
                                    <button class="btn btn-sm btn-danger" onclick="deleteRoadmap('${roadmap.roadmap_id}')">Delete</button>
                                </td>
                            `;

        roadmapTableBody.appendChild(row);
      }

      currentIndex = endIndex;

      if (currentIndex >= data.length) {
        showMoreContainer.innerHTML =
          '<p class="text-center">No more roadmaps to show.</p>';
      }
    })
    .catch((error) => {
      console.error("Error fetching roadmaps:", error);
      const roadmapTableBody = document.getElementById("roadmapTableBody");
      roadmapTableBody.innerHTML =
        '<tr><td colspan="5">Failed to load data</td></tr>';
    });
}

function loadMoreRoadmaps() {
  loadRoadmaps();
}

function deleteRoadmap(roadmapId) {
  if (confirm("Are you sure you want to delete this roadmap?")) {
    fetch(`http://localhost:5000/api/roadmaps/${roadmapId}`, {
      method: "DELETE",
    })
      .then((response) => {
        if (response.ok) {
          alert("Roadmap deleted successfully");
          loadRoadmaps();
        } else {
          alert("Error deleting roadmap");
        }
      })
      .catch((error) => {
        console.error("Error deleting roadmap:", error);
        alert("Error deleting roadmap");
      });
  }
}

loadRoadmaps();

const currentMonth = new Date().getMonth(); // 0 - 11 (January - December)
const currentYear = new Date().getFullYear(); // Full year (e.g., 2025)

fetch("http://localhost:5000/api/users")
  .then((response) => response.json())
  .then((users) => {
    const tableBody = document.getElementById("userTableBody");
    tableBody.innerHTML = "";
    users.forEach((user, index) => {
      const userRow = document.createElement("tr");
      const registrationDate = new Date(
        user.creation_date * 1000
      ).toLocaleDateString();
      const userStatusClass = user.user_status === 1 ? "success" : "danger";
      const userStatusText = user.user_status === 1 ? "Active" : "Inactive";
      userRow.innerHTML = `
                        <td data-label="#">${
                          index + 1
                        }</td>                       
                        <td data-label="Name">${user.full_name}</td>
                        <td data-label="Email">${user.email}</td>
                        <td data-label="Registration Date">${registrationDate}</td>
                        <td data-label="Status">
                            <span class="badge badge-${userStatusClass}">${userStatusText}</span>
                        </td>
                        <td data-label="Actions">
                            <button class="btn btn-sm btn-primary">Edit</button>
                            <button class="btn btn-sm btn-danger">Delete</button>
                        </td>
                    `;
      tableBody.appendChild(userRow);
    });
    const newUserTableBody = document.getElementById("newUserTableBody");
    newUserTableBody.innerHTML = "";
    users.forEach((user, index) => {
      const registrationDate = new Date(user.creation_date * 1000);
      const userMonth = registrationDate.getMonth();
      const userYear = registrationDate.getFullYear();
      if (userMonth === currentMonth && userYear === currentYear) {
        const userRow = document.createElement("tr");
        const formattedDate = registrationDate.toLocaleDateString();
        const userStatusClass = user.user_status === 1 ? "success" : "danger";
        const userStatusText = user.user_status === 1 ? "Active" : "Inactive";
        userRow.innerHTML = `
                            <td data-label="#">${
                              index + 1
                            }</td>                           
                            <td data-label="Name">${user.full_name}</td>
                            <td data-label="Email">${
                              user.email
                            }</td>                        
                            <td data-label="Registration Date">${formattedDate}</td>
                            <td data-label="Status">
                                <span class="badge badge-${userStatusClass}">${userStatusText}</span>
                            </td>
                            <td data-label="Actions">
                                <button class="btn btn-sm btn-primary">Edit</button>
                                <button class="btn btn-sm btn-danger">Delete</button>
                            </td>
                        `;
        newUserTableBody.appendChild(userRow);
      }
    });
  })
  .catch((error) => {
    console.error("Error fetching users:", error);
  });


  document.addEventListener('DOMContentLoaded', function () {
    const themeToggleBtn = document.getElementById('theme-toggle');
    const themeIcon = document.getElementById('theme-icon');
    const body = document.body;

    function setTheme(theme) {
        body.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);

        // Toggle theme icon
        if (theme === 'dark') {
            themeIcon.classList.replace('fa-moon', 'fa-sun');
        } else {
            themeIcon.classList.replace('fa-sun', 'fa-moon');
        }
    }

    // Load saved theme
    const savedTheme = localStorage.getItem('theme') || 'light';
    setTheme(savedTheme);

    // Toggle theme on click
    themeToggleBtn?.addEventListener('click', function () {
        const currentTheme = body.getAttribute('data-theme');
        setTheme(currentTheme === 'dark' ? 'light' : 'dark');
    });
});
