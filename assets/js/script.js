const modal = document.getElementById("modal");
const openLetter = document.getElementById("openLetter");
const closeModal = document.getElementById("closeModal");
const closeModal2 = document.getElementById("closeModal2");
const capsuleModal = document.getElementById("capsuleModal");
const openCapsule = document.getElementById("openCapsule");
const closeCapsule = document.getElementById("closeCapsule");
const capsulePhoto = document.querySelector(".capsule-photo");
const capsulePrev = document.getElementById("capsulePrev");
const capsuleNext = document.getElementById("capsuleNext");

const toggleMusicBtn = document.getElementById("toggleMusic");
const bgMusic = document.getElementById("bgMusic");
const musicSlider = document.getElementById("musicSlider");
const musicCurrent = document.getElementById("musicCurrent");
const musicDuration = document.getElementById("musicDuration");

const hearts = document.getElementById("hearts");
const confettiBtn = document.getElementById("confetti");

let musicPlaying = false;

// Modal open/close
openLetter.addEventListener("click", () => {
  modal.classList.add("show");
});

function closeIt(){
  modal.classList.remove("show");
}
closeModal.addEventListener("click", closeIt);
closeModal2.addEventListener("click", closeIt);

modal.addEventListener("click", (e) => {
  if (e.target === modal) closeIt();
});

if (openCapsule && capsuleModal && closeCapsule) {
  openCapsule.addEventListener("click", () => {
    capsuleModal.classList.add("show");
  });

  function closeCapsuleIt() {
    capsuleModal.classList.remove("show");
  }

  closeCapsule.addEventListener("click", closeCapsuleIt);
  capsuleModal.addEventListener("click", (e) => {
    if (e.target === capsuleModal) closeCapsuleIt();
  });
}

const capsuleFrames = document.querySelectorAll(".capsule-frame");
let capsuleIndex = 0;

function showCapsuleFrame(index, direction) {
  if (!capsuleFrames.length) return;
  capsuleFrames.forEach((frame, i) => {
    const isActive = i === index;
    frame.classList.toggle("active", isActive);
    frame.classList.remove("slide-next", "slide-prev");
    if (isActive && direction) {
      frame.classList.add(direction);
    }
  });
}

if (capsuleFrames.length) {
  showCapsuleFrame(capsuleIndex);
}

function goCapsulePrev() {
  capsuleIndex = (capsuleIndex - 1 + capsuleFrames.length) % capsuleFrames.length;
  showCapsuleFrame(capsuleIndex, "slide-prev");
}

function goCapsuleNext() {
  capsuleIndex = (capsuleIndex + 1) % capsuleFrames.length;
  showCapsuleFrame(capsuleIndex, "slide-next");
}

if (capsulePrev && capsuleFrames.length) {
  capsulePrev.addEventListener("click", goCapsulePrev);
}

if (capsuleNext && capsuleFrames.length) {
  capsuleNext.addEventListener("click", goCapsuleNext);
}

// Music toggle
async function handleMusicToggle() {
  try {
    if (!musicPlaying) {
      if (bgMusic.readyState === 0) {
        bgMusic.load();
      }
      await bgMusic.play();
      musicPlaying = true;
      toggleMusicBtn.textContent = "? Pause Musik";
    } else {
      bgMusic.pause();
      musicPlaying = false;
      toggleMusicBtn.textContent = "?? Putar Musik";
    }
  } catch (err) {
    alert("Autoplay diblokir browser. Klik tombol musik sekali lagi ya ??");
  }
}

if (toggleMusicBtn && bgMusic) {
  toggleMusicBtn.addEventListener("click", handleMusicToggle);
  toggleMusicBtn.addEventListener(
    "touchstart",
    (e) => {
      e.preventDefault();
      handleMusicToggle();
    },
    { passive: false }
  );

  bgMusic.addEventListener("error", () => {
    alert("File musik tidak bisa diputar. Cek nama file di folder assets/music.");
  });
}

if (musicSlider) {
  let isScrubbing = false;

  function formatTime(totalSeconds) {
    const safe = Number.isFinite(totalSeconds) ? totalSeconds : 0;
    const minutes = Math.floor(safe / 60);
    const seconds = Math.floor(safe % 60);
    return `${minutes}:${String(seconds).padStart(2, "0")}`;
  }

  function updateSliderFill() {
    const max = Number(musicSlider.max) || 0;
    const value = Number(musicSlider.value) || 0;
    const percent = max ? (value / max) * 100 : 0;
    musicSlider.style.setProperty("--progress", `${percent}%`);
  }

  bgMusic.addEventListener("loadedmetadata", () => {
    if (!Number.isNaN(bgMusic.duration)) {
      musicSlider.max = Math.floor(bgMusic.duration);
      updateSliderFill();
      if (musicDuration) {
        musicDuration.textContent = formatTime(bgMusic.duration);
      }
    }
  });

  bgMusic.addEventListener("timeupdate", () => {
    if (!isScrubbing) {
      musicSlider.value = Math.floor(bgMusic.currentTime);
      updateSliderFill();
    }
    if (musicCurrent) {
      musicCurrent.textContent = formatTime(bgMusic.currentTime);
    }
  });

  musicSlider.addEventListener("input", () => {
    isScrubbing = true;
    bgMusic.currentTime = Number(musicSlider.value);
    updateSliderFill();
    if (musicCurrent) {
      musicCurrent.textContent = formatTime(bgMusic.currentTime);
    }
  });

  musicSlider.addEventListener("change", () => {
    isScrubbing = false;
    updateSliderFill();
  });
}

// Floating hearts
function spawnHeart() {
  const el = document.createElement("div");
  el.className = "heart";

  const emojis = ["💗","💖","💘","❤️","💕"];
  el.textContent = emojis[Math.floor(Math.random() * emojis.length)];

  el.style.left = Math.random() * 100 + "vw";
  el.style.top = 110 + "vh";
  el.style.fontSize = (14 + Math.random() * 22) + "px";

  const duration = 4 + Math.random() * 4;
  el.style.animationDuration = duration + "s";

  hearts.appendChild(el);

  setTimeout(() => el.remove(), duration * 1000);
}
setInterval(spawnHeart, 450);

// Confetti simple
confettiBtn.addEventListener("click", () => {
  for (let i = 0; i < 90; i++) {
    const dot = document.createElement("div");
    dot.style.position = "fixed";
    dot.style.left = Math.random() * 100 + "vw";
    dot.style.top = "-10px";
    dot.style.width = "10px";
    dot.style.height = "10px";
    dot.style.borderRadius = "50%";
    dot.style.background = `hsl(${Math.random() * 360}, 90%, 60%)`;
    dot.style.zIndex = "10";
    dot.style.opacity = "0.95";

    document.body.appendChild(dot);

    const fall = 160 + Math.random() * 700;
    const time = 1200 + Math.random() * 1400;

    dot.animate(
      [
        { transform: "translateY(0px) rotate(0deg)" },
        { transform: `translateY(${fall}px) rotate(${Math.random() * 360}deg)` }
      ],
      { duration: time, easing: "cubic-bezier(.21,.61,.35,1)", fill: "forwards" }
    );

    setTimeout(() => dot.remove(), time);
  }
});
// Random romantic message button (SAFE VERSION)
document.addEventListener("DOMContentLoaded", () => {
  const randomMsgBtn = document.getElementById("randomMsg");
  const toast = document.getElementById("toast");
  const toastText = document.getElementById("toastText");

  const messages = [
    "Aku bersyukur banget punya kamu ",
    "Kalau kamu capek, sini aku peluk",
    "Kamu itu tempat pulang paling nyaman buat aku",
    "Senyum kamu tuh favorit aku ",
    "Aku mau rayain ulang tahun kamu tiap tahun, bareng aku terus ya ??",
    "Aku bangga sama kamu, selalu ",
    "Kamu cantik banget hari ini. kayak biasanya sih ",
    "Makasih udah bertahan sejauh ini. Aku di sini buat kamu ",
    "Satu hal yang pasti: aku sayang kamu, banget ",
    "Kalau ada lomba paling aku sayang, kamu juara 1 ",
  ];

  let toastTimer = null;

  function showToast(text) {
    if (!toast || !toastText) return;

    toastText.textContent = text;
    toast.classList.add("show");

    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toast.classList.remove("show");
    }, 3200);
  }

  if (!randomMsgBtn) {
    console.log("Tombol #randomMsg tidak ditemukan di HTML");
    return;
  }

  randomMsgBtn.addEventListener("click", () => {
    const msg = messages[Math.floor(Math.random() * messages.length)];
    showToast(msg);
  });
});



