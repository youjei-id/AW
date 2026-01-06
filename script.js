// AMBIL NAMA TAMU DARI URL
const params = new URLSearchParams(window.location.search);
const guest = params.get("to");

if (guest) {
  document.getElementById("guestName").textContent = guest.replace(/\+/g, " ");
}

// OPEN INVITATION
document.getElementById("openBtn").addEventListener("click", () => {
  document.body.classList.add("open");

  // optional: ubah URL tanpa reload
  history.pushState({}, "", location.pathname);
});

// =======================
// DATA FOTO (DISIMPAN DI JS)
// =======================
const backgrounds = [
  "img/a1.png",
  "img/t1.png",
  "img/asepdanwindy.png"
];

const duration = 5000; // 5 detik
let current = 0;

const bg = document.querySelector(".bg-slider");

// set background awal
bg.style.backgroundImage = `url(${backgrounds[current]})`;

// slideshow
setInterval(() => {
  bg.style.opacity = 0;

  setTimeout(() => {
    current = (current + 1) % backgrounds.length;
    bg.style.backgroundImage = `url(${backgrounds[current]})`;
    bg.style.opacity = 1;
  }, 1000); // waktu fade
}, duration);
// stop slide saat belum kklik buka undangan
let slider = setInterval(slideBg, duration);

document.getElementById("openBtn").addEventListener("click", () => {
  clearInterval(slider);
});

// coundown
const targetDate = new Date("June 4, 2026 07:00:00").getTime();

setInterval(() => {
  const now = new Date().getTime();
  const diff = targetDate - now;

  document.getElementById("days").innerHTML = Math.floor(
    diff / (1000 * 60 * 60 * 24)
  );
  document.getElementById("hours").innerHTML = Math.floor(
    (diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
  );
  document.getElementById("minutes").innerHTML = Math.floor(
    (diff % (1000 * 60 * 60)) / (1000 * 60)
  );
  document.getElementById("seconds").innerHTML = Math.floor(
    (diff % (1000 * 60)) / 1000
  );
}, 1000);
