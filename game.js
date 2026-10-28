/* ========================================
   BILBAO : PROLOGUE
   2D RUNNER GAME
======================================== */

document.addEventListener("DOMContentLoaded", () => {

    /* ========================================
       HTML ELEMENTS
    ======================================== */

    const canvas = document.getElementById("game-canvas");
    const ctx = canvas.getContext("2d");

    const distanceText = document.getElementById("game-distance");
    const statusText = document.getElementById("game-status");
    const finalDistanceText = document.getElementById("game-final-distance");

    const startScreen = document.getElementById("game-start-screen");
    const overScreen = document.getElementById("game-over-screen");
    const endingScreen = document.getElementById("game-ending-screen");

    const startButton = document.getElementById("game-start-button");
    const restartButton = document.getElementById("game-restart-button");
    const endingRestartButton = document.getElementById("game-ending-restart");

    // 비주얼 노벨 UI
    const storyPanel = document.getElementById("game-story");
    const storyDialogue = document.getElementById("story-dialogue");
    const storySpeaker = document.getElementById("story-speaker-name");
    const storyText = document.getElementById("story-dialogue-text");
    const storyNext = document.getElementById("story-next-indicator");
    const storyLeftImage = document.getElementById("story-character-left-image");
    const storyRightImage = document.getElementById("story-character-right-image");
    const storyLeft = document.getElementById("story-character-left");
    const storyRight = document.getElementById("story-character-right");

    /* ========================================
       REVOLI SPRITES
    ======================================== */

    const revoliRunImages = [
        "./images/game/revoli/run_01.png",
        "./images/game/revoli/run_02.png",
        "./images/game/revoli/run_03.png",
        "./images/game/revoli/run_04.png"
    ].map(src => {
        const img = new Image();
        img.src = src;
        return img;
    });

    const revoliJumpImage = new Image();
    revoliJumpImage.src = "./images/game/revoli/jump.png";

    let runFrame = 0;
    let runAnimationTimer = 0;

    const RUN_ANIMATION_SPEED = 7;

    /* ========================================
       GAME SETTINGS
    ======================================== */

    const WIDTH = canvas.width;
    const HEIGHT = canvas.height;

    const GROUND_Y = 340;
    // 1차 달리기와 2차 추격전 각각의 목표 거리
    const GOAL_DISTANCE = 1200;

    // 원작 대사를 아직 전달받지 않아 아래는 임시 연출 문구입니다.
    // 소설 원문으로 바꿀 때 STORY_SCENES만 수정하면 됩니다.
    const STORY_SCENES = {
        intro: [
            { speaker: "", text: "3010년, 부산. 고철이 산처럼 쌓인 도시." },
            { speaker: "", text: "붉게 물든 하늘 아래, 레볼리는 오늘도 고철산을 오른다." },
            { speaker: "레볼리", text: "……이제 조금만 더 가면 돼." }
        ],
        encounter: [
            { speaker: "", text: "언덕 끝에서, 레볼리는 낯선 소녀를 발견했다." },
            { speaker: "레볼리", text: "어……? 잠깐!" },
            { speaker: "", text: "소녀는 레볼리를 보자마자 몸을 돌려 달아났다." },
            { speaker: "레볼리", text: "기다려!" }
        ],
        ending: [
            { speaker: "", text: "숨 가쁜 추격 끝에, 두 사람의 거리가 좁혀졌다." },
            { speaker: "", text: "이 만남은 레볼리의 운명을 바꾸게 된다." }
        ]
    };

    let runStage = 1;
    let storyLines = [];
    let storyIndex = 0;
    let storyAfter = null;
    let typingTimer = null;
    let typingFinished = true;
    let currentFullText = "";

    const GRAVITY = 0.85;
    const JUMP_POWER = -16;

    let gameState = "standby";

    let distance = 0;
    let speed = 6;
    let frame = 0;

    let obstacles = [];
    let particles = [];

    let spawnTimer = 0;
    let nextSpawn = 90;

    let animationId = null;

    /* ========================================
       PLAYER
    ======================================== */

    const player = {
        x: 130,
        y: GROUND_Y - 65,
        width: 48,
        height: 65,
        velocityY: 0,
        jumping: false
    };

    /* ========================================
       UTILITY
    ======================================== */

    function random(min, max) {
        return Math.random() * (max - min) + min;
    }

    function updateHUD() {
        distanceText.textContent =
            String(Math.floor(distance)).padStart(4, "0") + " M";
    }

    function showScreen(screen) {
        startScreen.hidden = true;
        overScreen.hidden = true;
        endingScreen.hidden = true;

        if (screen) {
            screen.hidden = false;
        }
    }

    /* ========================================
       STORY SYSTEM
    ======================================== */

    function stopTyping() {
        if (typingTimer !== null) {
            clearInterval(typingTimer);
            typingTimer = null;
        }
    }

    function hideStory() {
        stopTyping();
        storyPanel.hidden = true;
    }

    function showStory(sceneName, afterStory) {
        if (animationId !== null) {
            cancelAnimationFrame(animationId);
            animationId = null;
        }
        gameState = "story";
        statusText.textContent = "STORY";
        showScreen(null);
        storyLines = STORY_SCENES[sceneName];
        storyIndex = 0;
        storyAfter = afterStory;
        storyPanel.hidden = false;
        drawBackground();
        drawPlayer();
        showStoryLine();
    }

    function showStoryLine() {
        stopTyping();
        const line = storyLines[storyIndex];
        storySpeaker.textContent = line.speaker || "NARRATION";
        currentFullText = line.text;
        storyText.textContent = "";
        storyNext.style.visibility = "hidden";
        typingFinished = false;
        // 캐릭터 반신 일러스트는 추후 파일을 연결할 예정
        storyLeftImage.hidden = true;
        storyRightImage.hidden = true;
        storyLeft.classList.toggle("is-speaking", line.speaker === "레볼리");
        storyRight.classList.toggle("is-speaking", line.speaker === "빌바오");
        let index = 0;
        typingTimer = setInterval(() => {
            index++;
            storyText.textContent = currentFullText.slice(0, index);
            if (index >= currentFullText.length) {
                finishTyping();
            }
        }, 32);
    }

    function finishTyping() {
        stopTyping();
        storyText.textContent = currentFullText;
        typingFinished = true;
        storyNext.style.visibility = "visible";
    }

    function advanceStory() {
        if (gameState !== "story") return;
        if (!typingFinished) {
            finishTyping();
            return;
        }
        storyIndex++;
        if (storyIndex < storyLines.length) {
            showStoryLine();
            return;
        }
        const callback = storyAfter;
        hideStory();
        if (callback) callback();
    }

    /* ========================================
       RESET GAME
    ======================================== */

    function resetGame() {
        distance = 0;
        speed = 6;
        frame = 0;

        obstacles = [];
        particles = [];

        spawnTimer = 0;
        nextSpawn = 90;

        player.y = GROUND_Y - player.height;
        player.velocityY = 0;
        player.jumping = false;

        runFrame = 0;
        runAnimationTimer = 0;

        updateHUD();
    }

    /* ========================================
       START GAME
    ======================================== */

    function startGame() {
        if (animationId !== null) {
            cancelAnimationFrame(animationId);
            animationId = null;
        }

        hideStory();
        resetGame();

        gameState = "playing";
        statusText.textContent = "RUNNING";

        showScreen(null);

        animationId = requestAnimationFrame(gameLoop);
    }

    /* ========================================
       JUMP
    ======================================== */

    function jump() {
        if (gameState !== "playing") return;
        if (player.jumping) return;

        player.velocityY = JUMP_POWER;
        player.jumping = true;
    }

    /* ========================================
       OBSTACLES
    ======================================== */

    function createObstacle() {
        const types = [
            {
                type: "scrap",
                width: 48,
                height: 48
            },
            {
                type: "metal",
                width: 35,
                height: 70
            },
            {
                type: "machine",
                width: 60,
                height: 42
            }
        ];

        const selected = types[
            Math.floor(Math.random() * types.length)
        ];

        obstacles.push({
            x: WIDTH + 30,
            y: GROUND_Y - selected.height,
            width: selected.width,
            height: selected.height,
            type: selected.type
        });
    }

    /* ========================================
       PARTICLES
    ======================================== */

    function createDust() {
        particles.push({
            x: WIDTH,
            y: random(60, GROUND_Y),
            size: random(1, 3),
            speed: random(0.5, 2),
            alpha: random(0.1, 0.5)
        });
    }

    /* ========================================
       UPDATE PLAYER
    ======================================== */

    function updatePlayer() {
        player.velocityY += GRAVITY;
        player.y += player.velocityY;

        if (player.y >= GROUND_Y - player.height) {
            player.y = GROUND_Y - player.height;
            player.velocityY = 0;
            player.jumping = false;
        }
    }

    /* ========================================
       UPDATE OBSTACLES
    ======================================== */

    function updateObstacles() {
        spawnTimer++;

        if (spawnTimer >= nextSpawn) {
            createObstacle();

            spawnTimer = 0;
            nextSpawn = Math.floor(random(75, 120));
        }

        obstacles.forEach(obstacle => {
            obstacle.x -= speed;
        });

        obstacles = obstacles.filter(obstacle => {
            return obstacle.x + obstacle.width > -20;
        });
    }

    /* ========================================
       COLLISION
    ======================================== */

    function checkCollision() {
        const margin = 8;

        for (const obstacle of obstacles) {
            if (
                player.x + margin <
                obstacle.x + obstacle.width - margin &&

                player.x + player.width - margin >
                obstacle.x + margin &&

                player.y + margin <
                obstacle.y + obstacle.height - margin &&

                player.y + player.height - margin >
                obstacle.y + margin
            ) {
                gameOver();
                return;
            }
        }
    }

    /* ========================================
       GAME OVER
    ======================================== */

    function gameOver() {
        gameState = "over";

        statusText.textContent = "SIGNAL LOST";

        finalDistanceText.textContent =
            String(Math.floor(distance)).padStart(4, "0") + " M";

        showScreen(overScreen);
    }

    /* ========================================
       ENDING
    ======================================== */

    function gameEnding() {
        if (runStage === 1) {
            runStage = 2;
            showStory("encounter", startGame);
        } else {
            showStory("ending", () => {
                gameState = "ending";
                statusText.textContent = "COMPLETE";
                showScreen(endingScreen);
            });
        }
    }

    /* ========================================
       BACKGROUND
    ======================================== */
// =====================================
// 빌바오 배경 이미지
// =====================================

const backgroundImages = {};

const backgroundFiles = {
    city: "./images/game/background/city.png",
    scrapyard: "./images/game/background/scrapyard.png",
    foreground: "./images/game/background/foreground.png",
    ground: "./images/game/background/ground.png"
};

for (const name in backgroundFiles) {
    const img = new Image();
    img.src = backgroundFiles[name];
    backgroundImages[name] = img;
}

// 배경 이미지 반복 스크롤
function drawScrollingBackground(image, scrollSpeed, y, drawHeight) {

    if (!image || !image.complete || image.naturalWidth === 0) {
        return;
    }

    // 원본 비율 유지
    const drawWidth = image.naturalWidth * (drawHeight / image.naturalHeight);

    const offset = ((frame * speed * scrollSpeed) % drawWidth + drawWidth) % drawWidth;

    for (let x = -offset; x < WIDTH; x += drawWidth) {
        ctx.drawImage(image, x, y, drawWidth, drawHeight);
    }
}
   function drawBackground() {

    // =====================================
    // 1. 하늘
    // =====================================

    const sky = ctx.createLinearGradient(0, 0, 0, HEIGHT);

    sky.addColorStop(0, "#282b30");
    sky.addColorStop(0.6, "#55565a");
    sky.addColorStop(1, "#7b6661");

    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, WIDTH, HEIGHT);

    // =====================================
    // 2. 붉은 태양
    // =====================================

    ctx.fillStyle = "rgba(180, 75, 65, 0.45)";

    ctx.beginPath();
    ctx.arc(750, 125, 65, 0, Math.PI * 2);
    ctx.fill();

    // =====================================
    // 3. 먼 도시
    // =====================================

    drawScrollingBackground(
        backgroundImages.city,
        0.08,
        0,
        HEIGHT
    );

    // =====================================
    // 4. 고철산
    // =====================================

    drawScrollingBackground(
        backgroundImages.scrapyard,
        0.2,
        0,
        HEIGHT
    );

    // =====================================
    // 5. 가까운 고철
    // =====================================

    drawScrollingBackground(
        backgroundImages.foreground,
        0.45,
        GROUND_Y - 145,
        145
    );

    // =====================================
    // 6. 바닥
    // =====================================

    ctx.fillStyle = "#191a1c";
    ctx.fillRect(0, GROUND_Y, WIDTH, HEIGHT - GROUND_Y);

    drawScrollingBackground(
        backgroundImages.ground,
        1,
        GROUND_Y,
        HEIGHT - GROUND_Y
    );
}

    /* ========================================
       DRAW PLAYER
    ======================================== */

    function drawPlayer() {

        // 레볼리 이미지 표시 크기
        const spriteSize = 120;

        // 기존 충돌 판정 영역 중심에 이미지 배치
        const spriteX =
            player.x + player.width / 2 - spriteSize / 2;

        const spriteY =
            player.y + player.height - spriteSize;

        // 점프 중에는 점프 이미지 표시
        const currentImage = player.jumping
            ? revoliJumpImage
            : revoliRunImages[runFrame];

        ctx.save();

        // 바닥 그림자
        ctx.fillStyle = "rgba(0,0,0,0.3)";

        ctx.beginPath();
        ctx.ellipse(
            player.x + player.width / 2,
            GROUND_Y + 5,
            30,
            6,
            0,
            0,
            Math.PI * 2
        );
        ctx.fill();

        // 레볼리 이미지 그리기
        if (
            currentImage.complete &&
            currentImage.naturalWidth > 0
        ) {
            ctx.drawImage(
                currentImage,
                spriteX,
                spriteY,
                spriteSize,
                spriteSize
            );
        } else {
            // 이미지 로딩 중 임시 표시
            ctx.fillStyle = "#eeeeee";
            ctx.fillRect(
                player.x,
                player.y,
                player.width,
                player.height
            );
        }

        ctx.restore();
    }

    /* ========================================
       DRAW OBSTACLES
    ======================================== */

    function drawObstacles() {
        obstacles.forEach(obstacle => {

            ctx.save();

            if (obstacle.type === "scrap") {
                ctx.fillStyle = "#777777";
            } else if (obstacle.type === "metal") {
                ctx.fillStyle = "#4b4b4b";
            } else {
                ctx.fillStyle = "#625c59";
            }

            ctx.fillRect(
                obstacle.x,
                obstacle.y,
                obstacle.width,
                obstacle.height
            );

            // 금속 테두리
            ctx.strokeStyle = "#242424";
            ctx.lineWidth = 3;

            ctx.strokeRect(
                obstacle.x,
                obstacle.y,
                obstacle.width,
                obstacle.height
            );

            // 위험 표시
            ctx.fillStyle = "#b44b4b";

            ctx.fillRect(
                obstacle.x + 5,
                obstacle.y + 8,
                obstacle.width - 10,
                5
            );

            ctx.restore();
        });
    }

    /* ========================================
       DRAW PARTICLES
    ======================================== */

    function drawParticles() {
        particles.forEach(particle => {

            ctx.fillStyle =
                `rgba(210, 190, 170, ${particle.alpha})`;

            ctx.beginPath();
            ctx.arc(
                particle.x,
                particle.y,
                particle.size,
                0,
                Math.PI * 2
            );
            ctx.fill();
        });
    }

    /* ========================================
       UPDATE PARTICLES
    ======================================== */

    function updateParticles() {
        if (frame % 12 === 0) {
            createDust();
        }

        particles.forEach(particle => {
            particle.x -= particle.speed + speed * 0.3;
        });

        particles = particles.filter(particle => {
            return particle.x > -10;
        });
    }

    /* ========================================
       GAME LOOP
    ======================================== */

    function gameLoop() {

        if (gameState !== "playing") {
            animationId = null;
            return;
        }

        frame++;

        // 이동 거리
        distance += speed * 0.12;

        // 점점 빨라지는 게임
        speed = Math.min(12, 6 + distance / 700);

        updatePlayer();

        // 달리기 애니메이션
        if (!player.jumping) {
            runAnimationTimer++;

            if (runAnimationTimer >= RUN_ANIMATION_SPEED) {
                runAnimationTimer = 0;

                runFrame =
                    (runFrame + 1) % revoliRunImages.length;
            }
        }

        updateObstacles();
        updateParticles();

        checkCollision();

        if (
            gameState === "playing" &&
            distance >= GOAL_DISTANCE
        ) {
            gameEnding();
        }

        drawBackground();
        drawParticles();
        drawObstacles();
        drawPlayer();

        updateHUD();

        if (gameState === "playing") {
            animationId = requestAnimationFrame(gameLoop);
        } else {
            animationId = null;
        }
    }

    /* ========================================
       CONTROLS
       PC + MOBILE
    ======================================== */

    // PC 키보드
    document.addEventListener("keydown", (event) => {

        if (gameState === "story" &&
            (event.code === "Space" || event.code === "Enter")) {
            event.preventDefault();
            if (!event.repeat) advanceStory();
            return;
        }

        if (
            event.code === "Space" ||
            event.code === "ArrowUp"
        ) {
            event.preventDefault();

            if (!event.repeat) {
                jump();
            }
        }
    });

    // PC 마우스 클릭 + 모바일 터치
    canvas.addEventListener("pointerdown", (event) => {

        if (
            event.pointerType === "mouse" &&
            event.button !== 0
        ) {
            return;
        }

        if (gameState === "playing") {
            event.preventDefault();
            jump();
        }
    });

    /* ========================================
       BUTTON EVENTS
    ======================================== */

    storyDialogue.addEventListener("click", advanceStory);
    storyDialogue.addEventListener("keydown", event => {
        // Enter/Space는 위의 document 핸들러에서 한 번만 처리
        if (event.code === "Space" || event.code === "Enter") event.preventDefault();
    });

    function startPrologue() {
        runStage = 1;
        resetGame();
        showStory("intro", startGame);
    }

    startButton.addEventListener("click", startPrologue);
    restartButton.addEventListener("click", startGame);
    endingRestartButton.addEventListener("click", startPrologue);

    /* ========================================
       INITIAL SCREEN
    ======================================== */

    resetGame();
    drawBackground();
    drawPlayer();

});
