// =======================
// NAMA TAMU DARI URL
// =======================
const params = new URLSearchParams(window.location.search);
const guest = params.get("to");

if (guest) {
  const namaTamu = guest.replace(/\+/g, " ");
  document.getElementById("guestName").textContent = namaTamu;

  const rsvpNama = document.getElementById("nama");
  if (rsvpNama) rsvpNama.value = namaTamu;

  const komentarNama = document.getElementById("namaKomentar");
  if (komentarNama) komentarNama.value = namaTamu;
}

// =======================
// OPEN UNDANGAN
// =======================
const openBtn = document.getElementById("openBtn");

openBtn.addEventListener("click", () => {
  document.body.classList.add("open");
  history.pushState({}, "", location.pathname);
});

// =======================
// BACKGROUND SLIDER
// =======================
const backgrounds = ["img/a1.png", "img/t1.png", "img/asepdanwindy.png"];
let current = 0;
const bg = document.querySelector(".bg-slider");

bg.style.backgroundImage = `url(${backgrounds[current]})`;

setInterval(() => {
  bg.style.opacity = 0;
  setTimeout(() => {
    current = (current + 1) % backgrounds.length;
    bg.style.backgroundImage = `url(${backgrounds[current]})`;
    bg.style.opacity = 1;
  }, 1000);
}, 5000);

// =======================
// COUNTDOWN
// =======================
const targetDate = new Date("2026-05-18T07:00:00").getTime();

function updateCountdown() {
  const now = new Date().getTime();
  const diff = targetDate - now;

  if (diff <= 0) return;

  document.getElementById("days").innerHTML = Math.floor(
    diff / (1000 * 60 * 60 * 24)
  );
  document.getElementById("hours").innerHTML = Math.floor(
    (diff / (1000 * 60 * 60)) % 24
  );
  document.getElementById("minutes").innerHTML = Math.floor(
    (diff / (1000 * 60)) % 60
  );
  document.getElementById("seconds").innerHTML = Math.floor((diff / 1000) % 60);
}

setInterval(updateCountdown, 1000);
updateCountdown();

// =======================
// RSVP
// =======================
const rsvpForm = document.getElementById("rsvp-form");

rsvpForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  try {
    await fetch(
      "https://script.google.com/macros/s/AKfycbxnSTNlCty7sZ2PPm92PYa8RVS0YLRfGfJ6NS8ZgQ3pV5Zb6TdY2oMTmrNxMMXcYxSl/exec",
      {
        method: "POST",
        body: new FormData(rsvpForm),
      }
    );

    alert("✅ Konfirmasi kehadiran berhasil dikirim");
    rsvpForm.reset();
  } catch {
    alert("❌ Gagal mengirim konfirmasi");
  }
});

// =======================
// KOMENTAR
// =======================
const API_URL =
  "https://script.google.com/macros/s/AKfycbwNTjwaVZzSmOC0fGxYcCfR1O47tyz-_QMnKnZv-NSAjJUNVzml690WqMIJqdGvRDZE/exec";

const formKomentar = document.getElementById("formKomentar");
const statusKomentar = document.getElementById("statusKomentar");
const commentsList = document.getElementById("commentsList");

function showKomentarAlert(text, type) {
  statusKomentar.textContent = text;
  statusKomentar.className = `status ${type}`;
  setTimeout(() => (statusKomentar.className = "status"), 3000);
}

formKomentar.addEventListener("submit", async (e) => {
  e.preventDefault();

  const data = new FormData(formKomentar);

  try {
    await fetch(API_URL, { method: "POST", body: data });
    showKomentarAlert("✅ Pesan berhasil dikirim", "success");
    formKomentar.reset();
    loadComments();
  } catch {
    showKomentarAlert("❌ Gagal mengirim pesan", "error");
  }
});

async function loadComments() {
  const res = await fetch(API_URL);
  const data = await res.json();

  commentsList.innerHTML = "";
  data.reverse().forEach((item) => {
    const div = document.createElement("div");
    div.className = "comment-item";
    div.innerHTML = `<h4>${item.nama}</h4><p>${item.pesan}</p>`;
    commentsList.appendChild(div);
  });
}

loadComments();
setInterval(loadComments, 5000);

// =======================
// MUSIC
// =======================
const music = document.getElementById("bg-music");
const musicBtn = document.getElementById("musicControl");
let isPlaying = false;

openBtn.addEventListener("click", () => {
  music.play();
  isPlaying = true;
  musicBtn.style.display = "flex";
  musicBtn.innerHTML = '<i class="fa-solid fa-pause"></i>';
});

musicBtn.addEventListener("click", () => {
  if (isPlaying) {
    music.pause();
    musicBtn.innerHTML = '<i class="fa-solid fa-music"></i>';
  } else {
    music.play();
    musicBtn.innerHTML = '<i class="fa-solid fa-pause"></i>';
  }
  isPlaying = !isPlaying;
});

// ==================
// salin no rek
// ==================
document.querySelectorAll(".btn-copy").forEach((btn) => {
  btn.addEventListener("click", async () => {
    const rek = btn.dataset.rek;

    try {
      await navigator.clipboard.writeText(rek);
      btn.textContent = "Tersalin ✔";

      setTimeout(() => {
        btn.textContent = "Salin Nomor";
      }, 2000);
    } catch {
      alert("❌ Gagal menyalin nomor");
    }
  });
});

// animasi saat scroll
/*

const items = document.querySelectorAll("body > *");

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("active");
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.15 }
);
items.forEach((item) => observer.observe(item));

*/