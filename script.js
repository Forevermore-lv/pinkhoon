/* 1. FIX REFRESH: Balik ke Hello & Sembunyikan Pict */
window.onload = () => {
    document.querySelectorAll('.page').forEach(p => {
        p.classList.remove('active');
        p.style.display = 'none';
    });

const hello = document.getElementById('page-hello');
    if (hello) {
        hello.classList.add('active');
        hello.style.display = 'flex';
        startHearts();
    }
    window.scrollTo(0, 0);
};

/* 2. NAVIGASI BERSIH */
function goPage(pageId) {
    clearInterval(typingInterval);
    clearInterval(noteTypingInterval);

    document.querySelectorAll('.page').forEach(p => {
        p.classList.remove('active');
        p.style.display = 'none';
    });

    const target = document.getElementById(pageId);
    if (target) {
        target.classList.add('active');
        target.style.display = 'flex';
        
        if(pageId === 'page-menu') setTimeout(startTyping, 150);
        if(pageId === 'page-note') setTimeout(startNoteTyping, 150);
    }

    if (pageId === 'page-hello' || pageId === 'page-note' || pageId === 'page-pict' || pageId === 'page-carousel' || pageId === 'page-kaseta') {
        startHearts();
    } else {
        stopHearts();
    }
}

function closeKaseta() {
    goPage('page-menu');
}

/* 3. SPOTIFY LOGIC (Untuk CD) */
function openSpotify() {
const modal = document.getElementById('spotifyModal');
    if (modal) {
        modal.classList.add('active');
        const playerImg = document.getElementById('playerImg');
        playerImg.style.display = 'block';
        playerImg.classList.remove('spinning');
        document.getElementById('spotifyPlayer').style.display = 'none';
        document.getElementById('equalizer').style.display = 'none';
    }
}

function closeSpotify() {
    document.getElementById('spotifyModal').classList.remove('active');
    const iframe = document.getElementById('spotifyPlayer');
    iframe.src = '';
    iframe.style.display = 'none';
    
    // Matikan putaran saat ditutup
    document.getElementById('playerImg').classList.remove('spinning');
}

function playSong(el, id) {
    // 1. Highlight list lagu
    document.querySelectorAll('.song-list li').forEach(li => li.classList.remove('active'));
    el.classList.add('active');

    // 2. Tampilkan Gambar & Jalankan Animasi Muter (PENTING)
    const playerImg = document.getElementById('playerImg');
    playerImg.style.display = 'block'; 
    
    // Trik restart animasi agar mulai muter dari awal tiap ganti lagu
    playerImg.classList.remove('spinning');
    void playerImg.offsetWidth;
    playerImg.classList.add('spinning');

    // 3. Tampilkan Equalizer
    const equalizer = document.getElementById('equalizer');
    if (equalizer) equalizer.style.display = 'flex';

    // 4. Atur Iframe (Player kecil di bawah gambar)
    const iframe = document.getElementById('spotifyPlayer');
    iframe.style.display = 'block';
    iframe.src = `https://open.spotify.com/embed/track/${id}?utm_source=generator&autoplay=1`;
}

function animateAlbum() {
    const grid = document.getElementById('photoGrid');
    const containers = grid.querySelectorAll('.photo-container');
    
    grid.scrollTop = 0;
    
    containers.forEach(c => {
        c.style.opacity = '0';
        c.style.transform = 'scale(0) rotate(-10deg)';
    });

    // Munculkan satu per satu dengan delay
    containers.forEach((c, i) => {
        setTimeout(() => {
            c.style.transition = "all 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275)"; // Efek bouncy
            c.style.opacity = '1';
            // Kembalikan ke rotasi asal sesuai CSS (--r)
            const rotation = i % 2 === 0 ? '-2deg' : '2deg';
            c.style.transform = `scale(1) rotate(${rotation})`;
        }, i * 150);
    });
}

let typingInterval; // Taruh di paling luar/atas

function startTyping() {
    const el = document.getElementById('typingText');
    if (!el) return;

    // WAJIB: Hentikan interval lama sebelum mulai yang baru
    clearInterval(typingInterval); 

    const text = el.dataset.text;
    el.textContent = ''; // Reset teks jadi kosong
    let i = 0;

    typingInterval = setInterval(() => {
        if (i < text.length) {
            el.textContent += text.charAt(i);
            i++;
        } else {
            clearInterval(typingInterval);
        }
    }, 35);
}

let noteTypingInterval;
function startNoteTyping() {
    const el = document.getElementById('noteTyping');
    if (!el) return;
    clearInterval(noteTypingInterval);
    el.innerHTML = '';
    const text = el.dataset.text;
    let i = 0;
    noteTypingInterval = setInterval(() => {
        el.innerHTML += text[i] === '\n' ? '<br>' : text[i];
        i++;
        if (i >= text.length) clearInterval(noteTypingInterval);
    }, 35);
}

function addScore(el) {
    el.style.transform = 'scale(1.35)';
    el.style.color = ['#ff4f8b','#ff9bb3','#ffc0d4'][Math.floor(Math.random()*3)];
    setTimeout(() => el.style.transform = 'scale(1)', 200);
}

/* ================= CAROUSEL LOGIC (FIXED) ================= */
const myPhotos = [ 
    'photo1.jpg', 
    'photo2.jpg',
    'photo3.jpg',
    'photo4.jpg'
];

const myCaptions = [
    "captured with love",
    "first sweet memory ✨",
    "special day with you 🌸",
    "happiest moment! ✦"
];

let currentSlideIdx = 0;

function changeSlide(direction) {
    const slideImg = document.getElementById('mainSlide');
    const descText = document.getElementById('photo-desc');
    
    // 1. Mulai Animasi Keluar (Fade & Scale)
    slideImg.style.opacity = '0';
    slideImg.style.transform = 'scale(0.95)';
    
    setTimeout(() => {
        // 2. Hitung index baru
        currentSlideIdx += direction;
        
        // Looping index
        if (currentSlideIdx >= myPhotos.length) currentSlideIdx = 0;
        if (currentSlideIdx < 0) currentSlideIdx = myPhotos.length - 1;
        
        // 3. Ganti Sumber Gambar & Caption
        slideImg.src = myPhotos[currentSlideIdx];
        if (descText) {
            descText.innerText = myCaptions[currentSlideIdx];
        }
        
        // 4. Mulai Animasi Masuk
        slideImg.style.opacity = '1';
        slideImg.style.transform = 'scale(1)';
        
        // Tambahkan class khusus untuk trigger keyframe CSS jika ada
        slideImg.classList.remove('slide-fade');
        void slideImg.offsetWidth; // Force reflow
        slideImg.classList.add('slide-fade');
        
    }, 300); 
}

/* Kerangka Fungsi Init */
function initCarousel() {
    const slideImg = document.getElementById('mainSlide');
    const descText = document.getElementById('photo-desc');
    if (slideImg) {
        slideImg.src = myPhotos[0]; 
        slideImg.style.opacity = '1';
    }
    if (descText) {
        descText.innerText = myCaptions[0]; 
    }
}

initCarousel();




function createHeart() {
    const heartContainer = document.querySelector('.falling-hearts');
    if (!heartContainer) return;

    const heart = document.createElement('div');
    heart.classList.add('heart-drop');
    heart.innerHTML = '❤︎'; 
    
    // Setting Random Posisi & Ukuran
    heart.style.left = Math.random() * 100 + "vw";
    heart.style.animationDuration = Math.random() * 3 + 2 + "s"; 
    heart.style.opacity = Math.random() * 0.5 + 0.5;
    heart.style.fontSize = Math.random() * 15 + 10 + "px";

    heartContainer.appendChild(heart);

    // Hapus elemen setelah jatuh biar gak berat
    setTimeout(() => {
        heart.remove();
    }, 5000);
}

let heartInterval;

function startHearts() {
    if (!heartInterval) heartInterval = setInterval(createHeart, 300);
}

function stopHearts() {
    clearInterval(heartInterval);
    heartInterval = null;
}