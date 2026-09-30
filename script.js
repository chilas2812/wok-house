const navToggle = document.querySelector(".nav-toggle");
const nav = document.querySelector(".nav");

navToggle.addEventListener("click", () => {
  const open = nav.classList.toggle("open");
  navToggle.setAttribute("aria-expanded", String(open));
});

document.querySelectorAll(".nav a").forEach(link => {
  link.addEventListener("click", () => {
    nav.classList.remove("open");
    navToggle.setAttribute("aria-expanded", "false");
  });
});

// DEMO-PRIS: Ret 69 her, hvis Wok House har en anden grundpris.
const basePrice = 69;
const bread = document.getElementById("bread");
const protein = document.getElementById("protein");
const dressing = document.getElementById("dressing");
const builderPrice = document.getElementById("builderPrice");

function updateBuilderPrice() {
  const total =
    basePrice +
    Number(bread.value) +
    Number(protein.value) +
    Number(dressing.value);

  builderPrice.textContent = `${total} kr.`;
}

[bread, protein, dressing].forEach(select => {
  select.addEventListener("change", updateBuilderPrice);
});

updateBuilderPrice();

// Åbningstider i lokal browser-tid.
// 0 = søndag, 1 = mandag ... 6 = lørdag.
const hours = {
  0: null,
  1: [10, 19],
  2: [10, 19],
  3: [10, 19],
  4: [10, 19],
  5: [10, 19],
  6: [10, 15]
};

const now = new Date();
const day = now.getDay();
const currentHour = now.getHours() + now.getMinutes() / 60;
const today = hours[day];

const openStatus = document.getElementById("openStatus");
const todayHours = document.getElementById("todayHours");

if (!today) {
  openStatus.textContent = "Lukket i dag";
  openStatus.classList.add("closed");
  todayHours.textContent = "Lukket";
} else {
  const [opens, closes] = today;
  todayHours.textContent = `${String(opens).padStart(2, "0")}.00 – ${String(closes).padStart(2, "0")}.00`;

  if (currentHour >= opens && currentHour < closes) {
    openStatus.textContent = `Åben · lukker ${closes}.00`;
  } else {
    openStatus.textContent = `Lukket · åbner ${opens}.00`;
    openStatus.classList.add("closed");
  }
}


// Demo-anmeldelser: gemmes lokalt i besøgendes browser.
// Hvis anmeldelser senere skal deles mellem ALLE besøgende,
// skal siden forbindes til en database/backend.
const reviewForm = document.getElementById("reviewForm");
const reviewList = document.getElementById("reviewList");
const reviewMessage = document.getElementById("reviewMessage");

function escapeHTML(value) {
  return value.replace(/[&<>"']/g, char => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;"
  }[char]));
}

function reviewCard(review) {
  const stars = "★".repeat(review.stars) + "☆".repeat(5 - review.stars);
  const initial = escapeHTML(review.name.trim().charAt(0).toUpperCase() || "G");

  return `
    <article class="review-card user-review">
      <div class="review-top">
        <div class="review-avatar">${initial}</div>
        <div>
          <strong>${escapeHTML(review.name)}</strong>
          <div class="review-stars">${stars}</div>
        </div>
      </div>
      <p>${escapeHTML(review.text)}</p>
    </article>
  `;
}

function loadReviews() {
  const reviews = JSON.parse(localStorage.getItem("wokHouseReviews") || "[]");
  reviews.forEach(review => {
    reviewList.insertAdjacentHTML("afterbegin", reviewCard(review));
  });
}

if (reviewForm) {
  loadReviews();

  reviewForm.addEventListener("submit", event => {
    event.preventDefault();

    const review = {
      name: document.getElementById("reviewName").value.trim(),
      stars: Number(document.getElementById("reviewStars").value),
      text: document.getElementById("reviewText").value.trim()
    };

    if (!review.name || !review.text) return;

    const reviews = JSON.parse(localStorage.getItem("wokHouseReviews") || "[]");
    reviews.push(review);
    localStorage.setItem("wokHouseReviews", JSON.stringify(reviews));

    reviewList.insertAdjacentHTML("afterbegin", reviewCard(review));
    reviewForm.reset();
    reviewMessage.textContent = "Tak! Din anmeldelse er tilføjet.";
  });
}
