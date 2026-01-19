// ==========================================
// 1. KONFIGURASI SUPABASE
// ==========================================
const SUPABASE_URL = "https://aqkvfqciqqxsbfcsuwau.supabase.co";
const SUPABASE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFxa3ZmcWNpcXF4c2JmY3N1d2F1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg4MDM1ODYsImV4cCI6MjA4NDM3OTU4Nn0.n1OOP3l6wLLzu7uvlhzIOPAH9xpQLjlGsCaCCxEV_Ho";
const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// ==========================================
// 2. NAMA TAMU DARI URL
// ==========================================
const params = new URLSearchParams(window.location.search);
const guest = params.get("to");

if (guest) {
  const namaTamu = guest.replace(/\+/g, " ");
  const guestNameElem = document.getElementById("guestName");
  if (guestNameElem) guestNameElem.textContent = namaTamu;

  const rsvpNama = document.getElementById("nama");
  if (rsvpNama) rsvpNama.value = namaTamu;

  const komentarNama = document.getElementById("namaKomentar");
  if (komentarNama) komentarNama.value = namaTamu;
}

// ==========================================
// 3. FUNGSI LOAD KOMENTAR (DARI TABEL COMMENTS)
// ==========================================
async function loadComments() {
  const commentsList = document.getElementById("commentsList");
  if (!commentsList) return;

  try {
    const { data, error } = await supabaseClient
      .from("comments") // Mengambil dari tabel baru
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;

    commentsList.innerHTML = "";
    data.forEach((item) => {
      if (item.pesan && item.pesan.trim() !== "") {
        const div = document.createElement("div");
        div.className = "comment-item";
        div.innerHTML = `<h4>${item.nama}</h4><p>${item.pesan}</p>`;
        commentsList.appendChild(div);
      }
    });
  } catch (err) {
    console.error("Gagal memuat komentar:", err);
  }
}

// ==========================================
// 4. RSVP FORM (KE TABEL RSVP)
// ==========================================
const rsvpForm = document.getElementById("rsvp-form");
if (rsvpForm) {
  rsvpForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const nama = document.getElementById("nama").value;
    const jumlah = document.getElementById("jumlah").value;
    const status = document.getElementById("status").value;

    try {
      const { error } = await supabaseClient.from("rsvp").insert([
        {
          nama: nama,
          jumlah: parseInt(jumlah) || 1,
          status_kehadiran: status,
        },
      ]);

      if (error) throw error;
      alert("✅ Konfirmasi kehadiran berhasil dikirim");
      rsvpForm.reset();
    } catch (err) {
      console.error(err);
      alert("❌ Gagal mengirim konfirmasi");
    }
  });
}

// ==========================================
// 5. KOMENTAR FORM (KE TABEL COMMENTS)
// ==========================================
const formKomentar = document.getElementById("formKomentar");

function showKomentarAlert(text, type) {
  const statusKomentar = document.getElementById("statusKomentar");
  if (statusKomentar) {
    statusKomentar.textContent = text;
    statusKomentar.className = `status ${type}`;
    statusKomentar.style.display = "block";
    setTimeout(() => {
      statusKomentar.style.display = "none";
    }, 3000);
  }
}

if (formKomentar) {
  formKomentar.addEventListener("submit", async (e) => {
    e.preventDefault();
    const nama = document.getElementById("namaKomentar").value;
    const pesan = document.getElementById("pesanKomentar").value;

    try {
      const { error } = await supabaseClient
        .from("comments") // Simpan ke tabel comments
        .insert([{ nama: nama, pesan: pesan }]);

      if (error) throw error;
      showKomentarAlert("✅ Pesan berhasil dikirim", "success");
      formKomentar.reset();
      loadComments(); // Refresh daftar komentar
    } catch (err) {
      console.error(err);
      showKomentarAlert("❌ Gagal mengirim pesan", "error");
    }
  });
}

// ==========================================
// 6. FITUR UI (MUSIC, SLIDER, COUNTDOWN, COPY)
// ==========================================

// Open Undangan & Music
const openBtn = document.getElementById("openBtn");
const music = document.getElementById("bg-music");
const musicBtn = document.getElementById("musicControl");
let isPlaying = false;

if (openBtn) {
  openBtn.addEventListener("click", () => {
    document.body.classList.add("open");
    history.pushState({}, "", location.pathname);
    if (music) {
      music.play();
      isPlaying = true;
      musicBtn.style.display = "flex";
      musicBtn.innerHTML = '<i class="fa-solid fa-pause"></i>';
    }
  });
}

if (musicBtn) {
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
}

// Background Slider
const backgrounds = ["img/a1.png", "img/t1.png", "img/asepdanwindy.png"];
let current = 0;
const bg = document.querySelector(".bg-slider");
if (bg) {
  setInterval(() => {
    bg.style.opacity = 0;
    setTimeout(() => {
      current = (current + 1) % backgrounds.length;
      bg.style.backgroundImage = `url(${backgrounds[current]})`;
      bg.style.opacity = 1;
    }, 1000);
  }, 5000);
}

// Countdown
const targetDate = new Date("2026-05-18T07:00:00").getTime();
function updateCountdown() {
  const now = new Date().getTime();
  const diff = targetDate - now;
  if (diff <= 0) return;

  const d = document.getElementById("days");
  const h = document.getElementById("hours");
  const m = document.getElementById("minutes");
  const s = document.getElementById("seconds");

  if (d) d.innerHTML = Math.floor(diff / (1000 * 60 * 60 * 24));
  if (h) h.innerHTML = Math.floor((diff / (1000 * 60 * 60)) % 24);
  if (m) m.innerHTML = Math.floor((diff / (1000 * 60)) % 60);
  if (s) s.innerHTML = Math.floor((diff / 1000) % 60);
}
setInterval(updateCountdown, 1000);
updateCountdown();

// Salin Rekening
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

// Load komentar pertama kali
loadComments();
