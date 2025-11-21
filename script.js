// --- CONFIG & STATE ---
const apiKey = ""; // System injects key

const defaultData = {
    totalCoins: 0,
    highScore: 0,
    ownedSkins: ['classic'],
    currentSkinId: 'classic',
    ownedBackgrounds: ['default'],
    currentBgId: 'default'
};

// VERİTABANI
const skinsDB = [
    { id: 'classic', name: 'Klasik Cevahir', color: '#e67e22', price: 0 },
    { id: 'blue', name: 'Buzul', color: '#3498db', price: 50 },
    { id: 'red', name: 'Öfkeli', color: '#e74c3c', price: 100 },
    { id: 'pink', name: 'Şeker', color: '#ff9ff3', price: 150 },
    { id: 'dark', name: 'Ninja', color: '#2c3e50', price: 250 },
    { id: 'gold', name: 'Altın Çocuk', color: '#f1c40f', price: 500 },
    { id: 'hacker', name: 'Matrix', color: '#2ecc71', price: 1000 }
];

const backgroundsDB = [
    { 
        id: 'default', 
        name: 'Okul Defteri', 
        style: 'background-color: #fdfaf1; background-image: linear-gradient(#e1e1e1 1px, transparent 1px), linear-gradient(90deg, #e1e1e1 1px, transparent 1px); background-size: 20px 20px;',
        previewColor: '#fdfaf1',
        price: 0 
    },
    { 
        id: 'night', 
        name: 'Gece Modu', 
        style: 'background-color: #2c3e50; background-image: radial-gradient(white 1px, transparent 1px); background-size: 30px 30px;',
        previewColor: '#2c3e50',
        price: 100 
    },
    { 
        id: 'sunset', 
        name: 'Gün Batımı', 
        style: 'background: linear-gradient(to bottom, #ff5f6d, #ffc371);',
        previewColor: '#ff5f6d',
        price: 200 
    },
    { 
        id: 'space', 
        name: 'Derin Uzay', 
        style: 'background-color: #000; background-image: radial-gradient(#ffffff 1px, transparent 1px), radial-gradient(#ffffff 1px, transparent 1px); background-size: 50px 50px; background-position: 0 0, 25px 25px;',
        previewColor: '#000',
        price: 400 
    },
    {
        id: 'forest',
        name: 'Orman',
        style: 'background-color: #a8e6cf; background-image: linear-gradient(135deg, #88d8b0 25%, transparent 25%), linear-gradient(225deg, #88d8b0 25%, transparent 25%); background-size: 20px 20px;',
        previewColor: '#a8e6cf',
        price: 300
    }
];

// Yükleme & Başlatma
let gameData = JSON.parse(localStorage.getItem('zipZipCevahirData')) || defaultData;

// Eksik veri tamamlama (güncelleme sonrası)
if(!gameData.ownedBackgrounds) {
    gameData.ownedBackgrounds = ['default'];
    gameData.currentBgId = 'default';
    gameData.highScore = gameData.highScore || 0;
}

function saveData() {
    localStorage.setItem('zipZipCevahirData', JSON.stringify(gameData));
    updateUI();
}

// --- UI YÖNETİMİ ---
const uiCoinCount = document.getElementById('coin-count');
const uiMarketCoins = document.getElementById('market-coins');
const uiMenuCoins = document.getElementById('menu-coins');
const uiHighScore = document.getElementById('high-score-display');
const gameContainer = document.getElementById('game-container');
let activeTab = 'skins';

function updateUI() {
    uiCoinCount.innerText = gameData.totalCoins;
    uiMarketCoins.innerText = gameData.totalCoins;
    uiMenuCoins.innerText = gameData.totalCoins;
    uiHighScore.innerText = gameData.highScore;
    applyBackground();
}

function applyBackground() {
    const bg = backgroundsDB.find(b => b.id === gameData.currentBgId) || backgroundsDB[0];
    gameContainer.style = bg.style;
}

// --- MARKET MANTIĞI ---
function openMarket() {
    document.getElementById('start-screen').classList.add('hidden');
    document.getElementById('game-over-screen').classList.add('hidden');
    document.getElementById('market-screen').classList.remove('hidden');
    renderMarket();
}

function closeMarket() {
    document.getElementById('market-screen').classList.add('hidden');
    if(isGameOver) {
        document.getElementById('game-over-screen').classList.remove('hidden');
    } else {
        document.getElementById('start-screen').classList.remove('hidden');
    }
}

function switchTab(tab) {
    activeTab = tab;
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    document.getElementById(`tab-${tab}`).classList.add('active');
    renderMarket();
}

function renderMarket() {
    const grid = document.getElementById('market-grid');
    grid.innerHTML = '';

    const items = activeTab === 'skins' ? skinsDB : backgroundsDB;
    const ownedList = activeTab === 'skins' ? gameData.ownedSkins : gameData.ownedBackgrounds;
    const currentId = activeTab === 'skins' ? gameData.currentSkinId : gameData.currentBgId;

    items.forEach(item => {
        const isOwned = ownedList.includes(item.id);
        const isSelected = currentId === item.id;
        
        const card = document.createElement('div');
        card.className = `item-card ${isSelected ? 'selected' : ''} ${!isOwned ? 'locked' : ''}`;
        
        // Preview Element
        let previewHtml = '';
        if (activeTab === 'skins') {
            previewHtml = `<div class="item-preview" style="background-color: ${item.color}"></div>`;
        } else {
            previewHtml = `<div class="item-preview bg-preview" style="${item.style}"></div>`;
        }

        // Button Logic
        let btnHtml = '';
        if (isSelected) {
            btnHtml = `<button class="item-btn btn-equipped">SEÇİLİ</button>`;
        } else if (isOwned) {
            btnHtml = `<button class="item-btn btn-equip" onclick="equipItem('${item.id}')">SEÇ</button>`;
        } else {
            btnHtml = `<button class="item-btn btn-buy" onclick="buyItem('${item.id}', ${item.price})">${item.price} 🪙 AL</button>`;
        }

        card.innerHTML = `
            ${previewHtml}
            <div class="item-name">${item.name}</div>
            ${btnHtml}
        `;
        
        grid.appendChild(card);
    });
}

function buyItem(id, price) {
    if (gameData.totalCoins >= price) {
        gameData.totalCoins -= price;
        if (activeTab === 'skins') {
            gameData.ownedSkins.push(id);
            gameData.currentSkinId = id;
        } else {
            gameData.ownedBackgrounds.push(id);
            gameData.currentBgId = id;
        }
        saveData();
        renderMarket();
    } else {
        alert("Yetersiz bakiye! Biraz daha oyna.");
    }
}

function equipItem(id) {
    if (activeTab === 'skins') {
        gameData.currentSkinId = id;
    } else {
        gameData.currentBgId = id;
    }
    saveData();
    renderMarket();
}

// --- GEMINI API ---
async function getAIComment(score, coins) {
    const el = document.getElementById('ai-comment');
    el.innerHTML = '<div class="spinner"></div> Cevahir yorumluyor...';
    
    const prompt = `
        Oyun: Zıp Zıp Cevahir.
        Skor: ${score}.
        Toplanan Para: ${coins}.
        Karakter: Türkçe konuşan, hafif fırlama bir sokak karakteri.
        
        Görev: Oyuncuya tek cümlelik, emojili, komik bir tepki ver. 
        Kötüyse dalga geç, iyiyse abartılı öv.
    `;

    try {
        const model = "gemini-2.5-flash-preview-09-2025";
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
        });
        const data = await response.json();
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
        el.innerText = text || "Güzel denemeydi!";
    } catch (e) {
        el.innerText = "Bağlantı koptu ama iyi yarıştın!";
    }
}

// --- OYUN MOTORU ---
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

let gameWidth, gameHeight;
let score = 0;
let sessionCoins = 0;
let gameLoopId;
let isGameOver = false;
const gravity = 0.4;

const doodler = {
    x: 0, y: 0, width: 50, height: 50,
    vx: 0, vy: 0, 
    speed: 9, 
    jumpStrength: -11, 
    superJumpStrength: -22, 
    direction: 'right'
};

let platforms = [];
const platformWidth = 70;
const platformHeight = 15;
const platformCount = 7;
let keys = { ArrowLeft: false, ArrowRight: false };

function resizeCanvas() {
    gameWidth = gameContainer.offsetWidth;
    gameHeight = gameContainer.offsetHeight;
    canvas.width = gameWidth;
    canvas.height = gameHeight;
    if(!gameLoopId && !isGameOver) {
        doodler.x = gameWidth / 2 - doodler.width / 2;
        doodler.y = gameHeight / 2;
        draw();
    }
}
window.addEventListener('resize', resizeCanvas);

// Kontroller
window.addEventListener('keydown', (e) => {
    if(e.code === 'ArrowLeft' || e.code === 'KeyA') keys.ArrowLeft = true;
    if(e.code === 'ArrowRight' || e.code === 'KeyD') keys.ArrowRight = true;
});
window.addEventListener('keyup', (e) => {
    if(e.code === 'ArrowLeft' || e.code === 'KeyA') keys.ArrowLeft = false;
    if(e.code === 'ArrowRight' || e.code === 'KeyD') keys.ArrowRight = false;
});

canvas.addEventListener('touchstart', (e) => {
    e.preventDefault();
    const touchX = e.touches[0].clientX;
    const rect = canvas.getBoundingClientRect();
    if (touchX - rect.left < gameWidth / 2) {
        keys.ArrowLeft = true; keys.ArrowRight = false;
    } else {
        keys.ArrowRight = true; keys.ArrowLeft = false;
    }
}, {passive: false});

canvas.addEventListener('touchend', (e) => {
    e.preventDefault();
    keys.ArrowLeft = false; keys.ArrowRight = false;
});

function startGame() {
    document.getElementById('start-screen').classList.add('hidden');
    document.getElementById('game-over-screen').classList.add('hidden');
    resetVariables();
    gameLoop();
}

function resetGame() {
    startGame();
}

function resetVariables() {
    isGameOver = false;
    score = 0;
    sessionCoins = 0;
    document.getElementById('score-board').innerText = score;
    
    doodler.x = gameWidth / 2 - doodler.width / 2;
    doodler.y = gameHeight / 2;
    doodler.vx = 0;
    doodler.vy = -5;

    platforms = [];
    platforms.push({
        x: gameWidth / 2 - platformWidth / 2,
        y: gameHeight - 100,
        hasSpring: false,
        hasCoin: false
    });

    for (let i = 1; i < platformCount; i++) {
        generatePlatform(gameHeight - 100 - i * (gameHeight / platformCount));
    }
}

function generatePlatform(yPos) {
    let xPos = Math.random() * (gameWidth - platformWidth);
    let hasSpring = Math.random() < 0.1;
    let hasCoin = !hasSpring && Math.random() < 0.3; 
    platforms.push({ x: xPos, y: yPos, hasSpring: hasSpring, hasCoin: hasCoin });
}

function update() {
    if (isGameOver) return;

    if (keys.ArrowLeft) { doodler.vx = -doodler.speed; doodler.direction = 'left'; }
    else if (keys.ArrowRight) { doodler.vx = doodler.speed; doodler.direction = 'right'; }
    else { doodler.vx = 0; }

    doodler.x += doodler.vx;
    if (doodler.x + doodler.width < 0) doodler.x = gameWidth;
    else if (doodler.x > gameWidth) doodler.x = -doodler.width;

    doodler.vy += gravity;
    doodler.y += doodler.vy;

    if (doodler.vy > 0) {
        platforms.forEach(p => {
            if (
                doodler.x + doodler.width * 0.7 > p.x &&
                doodler.x + doodler.width * 0.3 < p.x + platformWidth &&
                doodler.y + doodler.height > p.y &&
                doodler.y + doodler.height < p.y + platformHeight + doodler.vy
            ) {
                doodler.vy = p.hasSpring ? doodler.superJumpStrength : doodler.jumpStrength;
            }
            
            if (p.hasCoin) {
                let coinX = p.x + platformWidth / 2;
                let coinY = p.y - 20;
                let doodleX = doodler.x + doodler.width / 2;
                let doodleY = doodler.y + doodler.height / 2;
                let dist = Math.sqrt((coinX - doodleX)**2 + (coinY - doodleY)**2);
                
                if (dist < 45) { 
                    p.hasCoin = false;
                    sessionCoins++;
                    gameData.totalCoins++;
                    updateUI();
                }
            }
        });
    }

    if (doodler.y < gameHeight / 2) {
        let diff = (gameHeight / 2) - doodler.y;
        doodler.y = gameHeight / 2;
        score += Math.floor(diff);
        document.getElementById('score-board').innerText = score;
        
        platforms.forEach(p => { p.y += diff; });
        platforms = platforms.filter(p => p.y < gameHeight);
        while (platforms.length < platformCount) {
            let highestY = Math.min(...platforms.map(p => p.y));
            let gap = 80 + Math.random() * 60; 
            generatePlatform(highestY - gap);
        }
    }

    if (doodler.y > gameHeight) {
        gameOver();
    }
}

function gameOver() {
    isGameOver = true;
    if(score > gameData.highScore) {
        gameData.highScore = score;
    }
    saveData();
    
    document.getElementById('final-score').innerText = score;
    document.getElementById('collected-coins').innerText = sessionCoins;
    document.getElementById('game-over-screen').classList.remove('hidden');
    
    cancelAnimationFrame(gameLoopId);
    getAIComment(score, sessionCoins);
}

function draw() {
    ctx.clearRect(0, 0, gameWidth, gameHeight);

    // Platformlar
    platforms.forEach(p => {
        ctx.fillStyle = '#27ae60';
        ctx.beginPath();
        ctx.roundRect(p.x, p.y, platformWidth, platformHeight, 5);
        ctx.fill();
        
        if (p.hasSpring) {
            ctx.fillStyle = '#e74c3c';
            ctx.beginPath();
            ctx.roundRect(p.x + platformWidth/2 - 10, p.y - 8, 20, 8, 2);
            ctx.fill();
        }

        if (p.hasCoin) {
            let cx = p.x + platformWidth / 2;
            let cy = p.y - 25;
            
            ctx.beginPath();
            ctx.fillStyle = '#f1c40f';
            ctx.arc(cx, cy, 12, 0, Math.PI * 2);
            ctx.fill();
            ctx.lineWidth = 2;
            ctx.strokeStyle = '#d35400';
            ctx.stroke();

            ctx.beginPath();
            ctx.fillStyle = '#f39c12';
            ctx.arc(cx, cy, 8, 0, Math.PI * 2);
            ctx.fill();
            
            ctx.fillStyle = '#fff';
            ctx.font = 'bold 14px Arial';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText('C', cx, cy + 1);
        }
    });

    drawDoodler(doodler.x, doodler.y, doodler.width, doodler.height);
}

function drawDoodler(x, y, w, h) {
    const activeSkin = skinsDB.find(s => s.id === gameData.currentSkinId) || skinsDB[0];
    
    ctx.fillStyle = activeSkin.color;
    ctx.beginPath();
    ctx.roundRect(x, y, w, h, 10);
    ctx.fill();

    ctx.fillStyle = 'white';
    ctx.beginPath();
    let eyeOffset = doodler.direction === 'right' ? 4 : -4;
    
    ctx.arc(x + w/2 - 10 + eyeOffset, y + 15, 8, 0, Math.PI * 2); 
    ctx.arc(x + w/2 + 10 + eyeOffset, y + 15, 8, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = 'black';
    ctx.beginPath();
    ctx.arc(x + w/2 - 10 + eyeOffset, y + 15, 3, 0, Math.PI * 2);
    ctx.arc(x + w/2 + 10 + eyeOffset, y + 15, 3, 0, Math.PI * 2);
    ctx.fill();

    ctx.beginPath();
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 2;
    if (doodler.vy < -12) {
         ctx.arc(x + w/2 + eyeOffset, y + 35, 6, 0, Math.PI * 2, false);
    } else {
         ctx.arc(x + w/2 + eyeOffset, y + 30, 8, 0, Math.PI, false);
    }
    ctx.stroke();

    ctx.fillStyle = 'rgba(0,0,0,0.2)';
    ctx.fillRect(x + w/2 - 15, y + 15, 30, 20);
}

if (!CanvasRenderingContext2D.prototype.roundRect) {
    CanvasRenderingContext2D.prototype.roundRect = function (x, y, w, h, r) {
        if (w < 2 * r) r = w / 2;
        if (h < 2 * r) r = h / 2;
        this.beginPath();
        this.moveTo(x + r, y);
        this.arcTo(x + w, y, x + w, y + h, r);
        this.arcTo(x + w, y + h, x, y + h, r);
        this.arcTo(x, y + h, x, y, r);
        this.arcTo(x, y, x + w, y, r);
        this.closePath();
        return this;
    }
}

function gameLoop() {
    if (!isGameOver) {
        update();
        draw();
        gameLoopId = requestAnimationFrame(gameLoop);
    }
}

// Başlangıç
updateUI();
resizeCanvas();
draw();
