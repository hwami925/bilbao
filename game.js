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

    // 시작 화면의 기존 「도망쳐.」 제목을 작품명으로 변경
    const startTitle = startScreen.querySelector("h1, h2");
    if (startTitle) startTitle.textContent = "BILBAO";

    // 비주얼 노벨 UI
    const storyPanel = document.getElementById("game-story");
    const storyDialogue = document.getElementById("story-dialogue");
    const storySpeaker = document.getElementById("story-speaker-name");
    const storyText = document.getElementById("story-dialogue-text");
    const storyNext = document.getElementById("story-next-indicator");
    const storyLeftImage = document.getElementById("story-character-left-image");
    const storyRightImage = document.getElementById("story-character-right-image");
   // 캐릭터 이미지 경로
const CHARACTER_IMAGES = {
    revoli: "./images/game/character/revoli_normal.png",
    bilbao: "./images/game/character/bilbao_normal.png"
};

// 이미지 등록
storyLeftImage.src = CHARACTER_IMAGES.revoli;
storyRightImage.src = CHARACTER_IMAGES.bilbao;
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
    // 1차: 고철산 / 2차: 빌바오 추격
    const STAGE_SETTINGS = {
        1: { goal: 1200, baseSpeed: 6, maxSpeed: 10, minSpawn: 95, maxSpawn: 135 },
        2: { goal: 1500, baseSpeed: 9, maxSpeed: 16, minSpawn: 52, maxSpawn: 80 }
    };

    // 졸업전시용 최종 프롤로그 원문을 대사창 길이에 맞게 분리
    const STORY_SCENES = {
        intro: [
            { speaker: "", text: "노을 빛으로 붉게 물든 8월 하늘에 매캐한 연기가 솟아오르더니 점차 흩어져 사라져갔다." },
            { speaker: "", text: "연기를 따라 시선을 옮기자 하얀 글씨로 013이라 적혀 있는 빨간 기둥이 눈에 들어왔다." },
            { speaker: "", text: "그러고 시선을 완전히 내리자 산처럼 쌓인 고철들이 보이기 시작했다." },
            { speaker: "", text: "나는 손을 뻗어 눈에 들어온 고철을 하나 집어 들었다." },
            { speaker: "", text: "형체를 알아볼 수 없이 찌그러진 그것을 한참 동안 보던 나는 주위에 던져 버리고는 고개를 돌려 다시 고철들을 훑어보기 시작했다." },
            { speaker: "", text: "방금까지 고철이 타들어가는 연기를 보았는지라 고철들을 찾아내는 속도가 더 빨라졌다." },
            { speaker: "", text: "쓸만한 고철을 하나 집어 들었을 때쯤 저 멀리서 종소리가 이 일대를 가득 채웠다." },
            { speaker: "레볼리", text: "흐음… 오늘은 여기까진가." },
            { speaker: "", text: "선별한 고철을 넣어둔 가방을 챙겨 아래로 내려가는 도중, 한 고철산이 눈에 들어왔다." },
            { speaker: "", text: "왠지 모르게 그곳에서 알 수 없는 끌림이 느껴졌다." },
            { speaker: "", text: "그와 동시에 출구 쪽의 종소리가 더 크게 울려 퍼졌고, 쉽게 결정을 내리지 못한 나는 고철산과 출구 쪽을 반복해서 바라보았다." },
            { speaker: "레볼리", text: "쓸만한게 있을지 모르니 저곳까지만 들르도록 할까?" },
            { speaker: "", text: "작게 중얼거린 나는 가방을 고쳐 메며 고철산을 오르기 시작했다." },
        ],
        encounter: [
            { speaker: "", text: "이곳에서 쓸만한 부품을 모아 여러 기계를 고치거나 만든 지도 어연 5년이라는 시간이 흘렀기 때문에 어렵지 않게 고철더미를 오를 수 있었다." },
            { speaker: "", text: "고철산을 거의 다 올라왔을 때쯤, 사람의 형태를 한 무언가가 눈에 들어오기 시작했다." },
            { speaker: "", text: "그리고 고철산을 다 올라가자 눈 앞에 펼쳐진 것은 고철더미 위에 앉아 멍하니 하늘을 올려다보고 있는 어린 소녀의 모습이었다." },
            { speaker: "", text: "소녀는 퍼석한 머리에 빛바랜 베레모와 상처투성이의 몸에 이곳저곳이 찢어지고 누런 원피스를 입고 있었지만 주변 고철에 노을빛이 반사되면서 나도 모르게 고철 위에 피어난 꽃을 떠올리게 되었다." },
            { speaker: "", text: "생각치 못한 장면에 멍하니 소녀를 바라보고 있자 나의 시선을 눈치챘는지 소녀가 고개를 돌려 나를 빤히 쳐다보았다." },
            { speaker: "", text: "그렇게 얼마나 흘렀을까…" },
            { speaker: "", text: "다시 들려온 종소리에 정신을 차린 나는 조심스레 말을 꺼냈다." },
            { speaker: "레볼리", text: "거기, 이쪽에서 일할 것처럼 보이지는 않는데… 무슨 일로 찾아왔어? 혹시 길을 잃은 거라면…" },
            { speaker: "", text: "말을 이어나가며 천천히 소녀에게 다가가자 소녀의 눈이 점점 커지더니 자리를 박차고 일어나 서둘러 고철산 아래로 도망치듯 내달리기 시작했다." },
        ],
        ending: [
            { speaker: "", text: "소녀는 얼마안가 어딘가에 걸려 넘어져서는 주변 고철들과 함께 굴러 떨어졌다." },
            { speaker: "", text: "그러고는 다시 내 쪽을 쳐다보더니 몸을 떨며 다시 일어나려 했다." },
            { speaker: "", text: "갑작스러운 상황에 무슨 일이 일어난 건지 파악이 되지 않은 나는 제자리에서 소녀를 바라보다가 정신을 차려 허둥지둥 소녀에게 달려갔다." },
            { speaker: "레볼리", text: "이봐, 아무리 놀랐다고 해도 이런 곳에서 그렇게 도망가다가 넘어지면 몸이 부서질 수도 있다고." },
            { speaker: "", text: "소녀의 바로 앞까지 도달한 나는 몸을 숙여 그녀와 눈높이를 맞추었다. 그리고는 땅을 짚고 계속해서 일어서려는 그녀를 저지한 뒤, 넘어지며 부딪혔을 다리부터 살폈다." },
            { speaker: "레볼리", text: "왠만한 상처는 내가 고쳐줄 수 있으니까 나만 믿고…?!" },
            { speaker: "", text: "다리를 살펴보다 상처에서 나오는 붉은 액체를 발견한 나는 눈을 감았다 떴다를 반복하며 수차례 다리를 보았다." },
            { speaker: "", text: "하지만 많아지면 더 많아졌지, 붉은 액체가 없어지는 일은 일어나지 않았다." },
            { speaker: "레볼리", text: "너, 설마…" },
            { speaker: "???", text: "사, 살려주세요…" },
            { speaker: "레볼리", text: "……?" },
            { speaker: "", text: "소녀의 뜬금없는 말에 말문이 막힌 나는 나를 보고 울먹이는 소녀를 빤히 바라보았다. 그런 시선이 부담스러웠는지 소녀는 고개를 돌려 시선을 회피하였다." },
            { speaker: "", text: "아차, 이럴 때가 아니지." },
            { speaker: "", text: "다시 상처로 시선을 옮기자 아까 본 것이 잘못 본 것이었다는 나의 조그만 희망이 저만치 사라졌다는 사실을 확인할 수 있었다." },
            { speaker: "레볼리", text: "으음…" },
            { speaker: "", text: "인간이다… 다리의 상처에서 나오는 붉은 액체, 전자음 하나 섞이지 않은 목소리, 눈가에서 흘러나오는 액체… 모두 여태껏 잊고 있었던 인간의 모습이었다." },
            { speaker: "", text: "하지만 인간은 센터에서 노예로 생활하고 있을텐데… 설마, 반란군의 자식인가?" },
            { speaker: "레볼리", text: "으… 이거, 귀찮은 일에 말려든 것 같은데…" },
            { speaker: "???", text: "흐윽, 살려, 흑, 주세요." },
            { speaker: "레볼리", text: "이 봐. 너… 설마, 반란군의 자식이냐? 아니면 도망쳐온 노예라든가." },
            { speaker: "???", text: "살려…주세요. 흐윽." },
            { speaker: "레볼리", text: "이거 얘기하기는 글렀구만. 분명 인간 아이는 한 번 울면 울음을 잘 안 그친다고 했던 것 같은데. 그리고 다시 그치려면 단 음식을 주거나 칭찬을 해줘야 한다고 했었지. 단 음식은 지금 없고…" },
            { speaker: "", text: "소녀 쪽으로 시선을 돌리자 흐르는 눈물을 연신 닦아내며 나를 올려다보던 소녀와 눈이 마주쳤다." },
            { speaker: "", text: "묘한 긴장감이 흐르는 분위기, 나는 연신 헛기침을 하며 소녀의 베레모 위에 떨리는 손을 얹혔다;" },
            { speaker: "레볼리", text: "으음… 아까, 예쁘더라." },
            { speaker: "", text: "음, 완벽하군." },
            { speaker: "", text: "이 정도면 대화를 할 수 있겠지." },
            { speaker: "", text: "그렇게 대화를 하려는 순간 나의 예상과는 다르게 소녀는 나에게서 완전히 등을 뒤돌린 상태였다." },
            { speaker: "", text: "이것도 실패인 건가?!" },
            { speaker: "", text: "그, 그렇다면 마지막, 이 방법 밖에 없는 건가." },
            { speaker: "", text: "나는 주변을 훑어보고는 고철을 몇 개 주운 뒤, 가방에서 드라이브를 꺼내서 고철에 손을 대기 시작했다." },
            { speaker: "", text: "그렇게 1분 채 지나지 않아 손에는 작은 토끼 로봇이 만들어져 있었다." },
            { speaker: "", text: "완성된 장난감을 소녀의 어깨 건너로 건네 주자 소녀는 눈가에서 흐르는 눈물을 닦아내고는 장난감을 물끄러미 바라보다가 다시 나를 바라보았다." },
            { speaker: "레볼리", text: "너, 주는 거니까 가져도 된다. 나는 있어봤자 짐만 되니까." },
            { speaker: "", text: "소녀는 잠시 머뭇거리는 듯하더니 장난감을 집어 자신의 품에 안았다." },
            { speaker: "", text: "이 틈에 나는 다시 소녀의 모습을 찬찬히 살펴보았다." },
            { speaker: "", text: "옷차림을 보아하니 반란군은 아닌데… 그럼 도망친 노예인가?" },
            { speaker: "", text: "근데 노예라고 하면 센터에서 이미 수배령을 내렸을 텐데 말이지." },
            { speaker: "", text: "어차피 다시 대화를 하려고 한들 할 것 같진 않으니…" },
            { speaker: "레볼리", text: "하루 정도는 괜찮겠지." },
            { speaker: "", text: "내 목소리에 화들짝 놀란 소녀는 토끼로봇을 품에 꼭 안고는 나를 올려다보았다." },
            { speaker: "레볼리", text: "저기, 오늘은 우리 집에서 지내기 않을래? 좀 있으면 이곳 직원들이 찾아올 테니까 네가 그들에게 잡히는 건 순식간일걸. 그리고 그 상처도 치료해야 되고 말이야." },
            { speaker: "", text: "소녀는 잠시 생각하는 듯하더니 의심의 눈초리로 나를 바라보았다." },
            { speaker: "", text: "뭐, 의심하는 게 당연하려나." },
            { speaker: "레볼리", text: "나는 널 알릴 이유가 없어. 별로 알리고 싶지도 않고. 평소에 인간과 교유는 하고 싶었으니까. 뭐, 싫다면 어쩔 수 없지만." },
            { speaker: "???", text: "……빌바오." },
            { speaker: "레볼리", text: "응?" },
            { speaker: "빌바오", text: "내 이름." },
            { speaker: "레볼리", text: "좋은 이름이군. 내 이름은 레볼리라고 한다. 우리 팀에 온 것을 환영하지." },
            { speaker: "빌바오", text: "팀…?" },
            { speaker: "레볼리", text: "아, 미안. 습관이 되어서." },
            { speaker: "", text: "내가 머리를 긁적이며 사과하자 소녀는 토끼 로봇을 품에 꼭 안았다." },
            { speaker: "빌바오", text: "이상한 아저씨…" },
        ],
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
        // 스토리 구간에서는 러너 스프라이트를 그리지 않습니다.
        // 직전 달리기 프레임을 지워 공중에 멈춘 레볼리가 남지 않도록 합니다.
        drawBackground();
        showStoryLine();
    }

    function showStoryLine() {
        stopTyping();
        const line = storyLines[storyIndex];
        storySpeaker.textContent = line.speaker || "";
        storySpeaker.hidden = !line.speaker;
        currentFullText = line.text;
        storyText.textContent = "";
        storyNext.style.visibility = "hidden";
        typingFinished = false;
        // 캐릭터 반신 일러스트는 추후 파일을 연결할 예정
        // 캐릭터 표시 설정
const currentScene = Object.keys(STORY_SCENES).find(
    key => STORY_SCENES[key] === storyLines
);

// 도입부에서는 레볼리만 표시
if (currentScene === "intro") {
    storyLeftImage.hidden = false;
    storyRightImage.hidden = true;
}

// 빌바오를 만난 이후에는 두 캐릭터 표시
else if (currentScene === "encounter" || currentScene === "ending") {
    storyLeftImage.hidden = false;
    storyRightImage.hidden = false;
}

// 그 외에는 숨김
else {
    storyLeftImage.hidden = true;
    storyRightImage.hidden = true;
}
        // 말하는 캐릭터 강조
storyLeft.classList.toggle(
    "is-speaking",
    line.speaker === "레볼리"
);

storyRight.classList.toggle(
    "is-speaking",
    line.speaker === "빌바오" || line.speaker === "???"
);
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
        speed = STAGE_SETTINGS[runStage].baseSpeed;
        frame = 0;

        obstacles = [];
        particles = [];

        spawnTimer = 0;
        nextSpawn = STAGE_SETTINGS[runStage].maxSpawn;

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
            const config = STAGE_SETTINGS[runStage];
            nextSpawn = Math.floor(random(config.minSpawn, config.maxSpawn));
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

    // 마지막 대사 이후 암전 → 타이틀 → 완료 화면
    function showFinalTitle() {
        gameState = "ending";
        statusText.textContent = "COMPLETE";
        showScreen(null);

        const screen = document.querySelector(".game-screen");
        const titleCard = document.createElement("div");
        titleCard.setAttribute("aria-label", "빌바오 고철 위에 피어난 꽃");
        titleCard.style.cssText = `position:absolute;inset:0;z-index:20;background:#080808;
            display:flex;flex-direction:column;align-items:center;justify-content:center;
            text-align:center;color:#fff;opacity:0;transition:opacity 1.5s ease;
            pointer-events:auto;padding:20px;`;
        const title = document.createElement("h2");
        title.textContent = "BILBAO";
        title.style.cssText = "font-size:clamp(36px,8vw,76px);letter-spacing:0.16em;margin:0 0 16px;";
        const subtitle = document.createElement("p");
        subtitle.textContent = "고철 위에 피어난 꽃";
        subtitle.style.cssText = "font-size:clamp(14px,2.5vw,23px);letter-spacing:0.14em;color:#ddd;margin:0;";
        titleCard.append(title, subtitle);
        screen.appendChild(titleCard);
        requestAnimationFrame(() => { titleCard.style.opacity = "1"; });
        setTimeout(() => {
            titleCard.style.opacity = "0";
            setTimeout(() => {
                titleCard.remove();
                // 기존 엔딩 오버레이의 문구도 최종 엔딩에 맞게 변경
                const heading = endingScreen.querySelector("h2");
                const desc = endingScreen.querySelector(".game-overlay-description");
                if (heading) heading.textContent = "고철 위에 피어난 꽃";
                if (desc) desc.textContent = "PROLOGUE COMPLETE — 두 사람의 이야기가 시작된다.";
                showScreen(endingScreen);
            }, 1500);
        }, 4200);
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
                showFinalTitle();
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
        const config = STAGE_SETTINGS[runStage];
        speed = Math.min(
            config.maxSpeed,
            config.baseSpeed + distance / (runStage === 2 ? 105 : 700)
        );

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
            distance >= STAGE_SETTINGS[runStage].goal
        ) {
            gameEnding();
        }

        drawBackground();
        if (gameState === "playing") {
            drawParticles();
            drawObstacles();
            drawPlayer();
        }

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
