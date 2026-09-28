const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// =====================================================
// CODE RUNNER - ESCAPE THE VIRUS
// FULL GAME JAVASCRIPT
// =====================================================

// ---------------- GAME STATE ----------------

let gameState = "start";

let score = 0;
let distance = 0;
let lives = 3;

let level = 1;
let levelName = "CYBER CITY";

let roadSpeed = 5;
let baseSpeed = 5;

let virusDistance = 15;
const maxVirusDistance = 100;

let speedBoost = false;
let shieldActive = false;
let cpuEnergy = 0;

let animationTime = 0;

let coins = [];
let obstacles = [];
let powerUps = [];

let gateActive = false;
let gateQuestion = null;

let lastCoinTime = 0;
let lastObstacleTime = 0;
let lastPowerTime = 0;

let gameStartTime = 0;


// =====================================================
// LANES
// =====================================================

const lanes = [300, 450, 600];


// =====================================================
// LEVELS
// =====================================================

const levels = [
    {
        name: "CYBER CITY",
        start: 0,
        color: "#00eaff"
    },
    {
        name: "INTERNET TUNNEL",
        start: 1000,
        color: "#8b5cf6"
    },
    {
        name: "MEMORY WORLD",
        start: 2000,
        color: "#00ff88"
    },
    {
        name: "CYBER FORTRESS",
        start: 3000,
        color: "#ffb000"
    },
    {
        name: "VIRUS CORE",
        start: 4000,
        color: "#ff3b5c"
    }
];


// =====================================================
// CS QUESTIONS
// =====================================================

const questions = [
    {
        question: "Which one protects data?",
        options: ["Encryption", "Sorting", "Loop"],
        answer: 0
    },

    {
        question: "Which language runs in a browser?",
        options: ["JavaScript", "Python only", "SQL"],
        answer: 0
    },

    {
        question: "What does CPU stand for?",
        options: [
            "Central Processing Unit",
            "Computer Personal Unit",
            "Central Program Utility"
        ],
        answer: 0
    },

    {
        question: "Which stores data permanently?",
        options: [
            "Hard Disk",
            "RAM",
            "Cache"
        ],
        answer: 0
    },

    {
        question: "Which is used to style a webpage?",
        options: [
            "CSS",
            "SQL",
            "Python"
        ],
        answer: 0
    },

    {
        question: "Which structure follows FIFO?",
        options: [
            "Queue",
            "Stack",
            "Tree"
        ],
        answer: 0
    },

    {
        question: "Which one is a database?",
        options: [
            "MySQL",
            "HTML",
            "CSS"
        ],
        answer: 0
    }
];


// =====================================================
// PLAYER
// =====================================================

const player = {

    lane: 1,

    x: 450,

    y: 390,

    width: 45,

    height: 65,

    normalHeight: 65,

    slideHeight: 35,

    jumping: false,

    sliding: false,

    jumpVelocity: 0,

    gravity: 0.8,

    color: "#00eaff"
};


// =====================================================
// CREATE START SCREEN
// =====================================================

function createStartScreen() {

    const startScreen =
        document.createElement("div");

    startScreen.id = "startScreen";

    startScreen.innerHTML = `

        <div class="start-box">

            <div class="virus-icon">🦠</div>

            <h1>CODE RUNNER</h1>

            <h2>ESCAPE THE VIRUS</h2>

            <p>
                Run through the digital world,
                collect data and survive the virus.
            </p>

            <div class="start-controls">

                <span>⬅️ ➡️ Move</span>
                <span>⬆️ Jump</span>
                <span>⬇️ Slide</span>

            </div>

            <button id="startButton">
                START GAME
            </button>

        </div>
    `;

    document.body.appendChild(startScreen);


    document.getElementById(
        "startButton"
    ).addEventListener(
        "click",
        startGame
    );
}


// =====================================================
// START GAME
// =====================================================

function startGame() {

    const screen =
        document.getElementById(
            "startScreen"
        );

    if (screen) {

        screen.remove();
    }


    gameState = "playing";

    gameStartTime =
        Date.now();

    resetGame();
}


// =====================================================
// RESET GAME
// =====================================================

function resetGame() {

    score = 0;

    distance = 0;

    lives = 3;

    level = 1;

    levelName =
        "CYBER CITY";

    roadSpeed = 5;

    baseSpeed = 5;

    virusDistance = 15;

    speedBoost = false;

    shieldActive = false;

    cpuEnergy = 0;

    coins = [];

    obstacles = [];

    powerUps = [];

    gateActive = false;

    gateQuestion = null;

    player.lane = 1;

    player.x = lanes[1];

    player.y = 390;

    player.jumping = false;

    player.sliding = false;
}


// =====================================================
// KEYBOARD CONTROLS
// =====================================================

document.addEventListener(
    "keydown",
    function(event) {

        if (
            gameState !==
            "playing"
        ) {
            return;
        }


        // LEFT
        if (
            event.key ===
            "ArrowLeft"
        ) {

            if (
                player.lane > 0
            ) {

                player.lane--;

                updatePlayerPosition();
            }
        }


        // RIGHT
        if (
            event.key ===
            "ArrowRight"
        ) {

            if (
                player.lane < 2
            ) {

                player.lane++;

                updatePlayerPosition();
            }
        }


        // JUMP
        if (
            event.key ===
            "ArrowUp" ||
            event.key ===
            " "
        ) {

            jump();
        }


        // SLIDE
        if (
            event.key ===
            "ArrowDown"
        ) {

            slide();
        }
    }
);


// =====================================================
// PLAYER MOVEMENT
// =====================================================

function updatePlayerPosition() {

    player.x =
        lanes[player.lane];
}


// =====================================================
// JUMP
// =====================================================

function jump() {

    if (
        !player.jumping &&
        !player.sliding
    ) {

        player.jumping = true;

        player.jumpVelocity =
            -15;
    }
}


// =====================================================
// SLIDE
// =====================================================

function slide() {

    if (
        !player.jumping &&
        !player.sliding
    ) {

        player.sliding = true;

        player.height =
            player.slideHeight;


        setTimeout(
            function() {

                player.sliding =
                    false;

                player.height =
                    player.normalHeight;

            },
            700
        );
    }
}


// =====================================================
// UPDATE JUMP
// =====================================================

function updateJump() {

    if (!player.jumping) {
        return;
    }


    player.y +=
        player.jumpVelocity;

    player.jumpVelocity +=
        player.gravity;


    if (
        player.y >= 390
    ) {

        player.y = 390;

        player.jumping = false;

        player.jumpVelocity = 0;
    }
}


// =====================================================
// CREATE COIN
// =====================================================

function createCoin() {

    const lane =
        Math.floor(
            Math.random() * 3
        );


    coins.push({

        lane: lane,

        x: lanes[lane],

        y: -30,

        size: 15,

        rotation: 0
    });
}


// =====================================================
// CREATE OBSTACLE
// =====================================================

function createObstacle() {

    const lane =
        Math.floor(
            Math.random() * 3
        );


    const types = [
        "CORRUPTED FILE",
        "VIRUS BLOCK",
        "FIREWALL"
    ];


    const type =
        types[
            Math.floor(
                Math.random() *
                types.length
            )
        ];


    obstacles.push({

        lane: lane,

        x: lanes[lane],

        y: -70,

        width: 55,

        height: 55,

        type: type
    });
}


// =====================================================
// CREATE POWER-UP
// =====================================================

function createPowerUp() {

    const lane =
        Math.floor(
            Math.random() * 3
        );


    const random =
        Math.random();


    let type;


    if (random < 0.33) {

        type = "boost";

    } else if (random < 0.66) {

        type = "shield";

    } else {

        type = "energy";
    }


    powerUps.push({

        lane: lane,

        x: lanes[lane],

        y: -40,

        size: 20,

        type: type
    });
}


// =====================================================
// UPDATE OBJECTS
// =====================================================

function updateObjects() {

    coins.forEach(
        function(coin) {

            coin.y +=
                roadSpeed;

            coin.rotation +=
                0.1;
        }
    );


    obstacles.forEach(
        function(obstacle) {

            obstacle.y +=
                roadSpeed;
        }
    );


    powerUps.forEach(
        function(item) {

            item.y +=
                roadSpeed;
        }
    );


    coins =
        coins.filter(
            function(coin) {

                return (
                    coin.y <
                    canvas.height +
                    50
                );
            }
        );


    obstacles =
        obstacles.filter(
            function(obstacle) {

                return (
                    obstacle.y <
                    canvas.height +
                    100
                );
            }
        );


    powerUps =
        powerUps.filter(
            function(item) {

                return (
                    item.y <
                    canvas.height +
                    60
                );
            }
        );
}


// =====================================================
// COIN COLLISION
// =====================================================

function checkCoinCollision() {

    for (
        let i = coins.length - 1;
        i >= 0;
        i--
    ) {

        const coin =
            coins[i];


        const sameLane =
            coin.lane ===
            player.lane;


        const close =
            Math.abs(
                coin.y -
                player.y
            ) < 55;


        if (
            sameLane &&
            close
        ) {

            score += 50;

            cpuEnergy += 5;

            virusDistance -= 5;


            if (
                virusDistance < 0
            ) {

                virusDistance = 0;
            }


            coins.splice(i, 1);
        }
    }
}


// =====================================================
// OBSTACLE COLLISION
// =====================================================

function checkObstacleCollision() {

    for (
        let i =
            obstacles.length - 1;
        i >= 0;
        i--
    ) {

        const obstacle =
            obstacles[i];


        const sameLane =
            obstacle.lane ===
            player.lane;


        const close =
            Math.abs(
                obstacle.y -
                player.y
            ) < 60;


        if (
            sameLane &&
            close &&
            !player.jumping &&
            !player.sliding
        ) {

            obstacles.splice(i, 1);


            if (
                shieldActive
            ) {

                shieldActive =
                    false;

                continue;
            }


            lives--;

            virusDistance +=
                18;


            if (
                lives <= 0
            ) {

                endGame(
                    "GAME OVER"
                );

                return;
            }
        }
    }
}


// =====================================================
// POWER-UP COLLISION
// =====================================================

function checkPowerUpCollision() {

    for (
        let i =
            powerUps.length - 1;
        i >= 0;
        i--
    ) {

        const item =
            powerUps[i];


        const sameLane =
            item.lane ===
            player.lane;


        const close =
            Math.abs(
                item.y -
                player.y
            ) < 60;


        if (
            sameLane &&
            close
        ) {

            if (
                item.type ===
                "boost"
            ) {

                activateBoost();

            } else if (
                item.type ===
                "shield"
            ) {

                activateShield();

            } else {

                activateEnergy();
            }


            powerUps.splice(i, 1);
        }
    }
}


// =====================================================
// RAM BOOST
// =====================================================

function activateBoost() {

    speedBoost = true;

    roadSpeed = 9;


    setTimeout(
        function() {

            speedBoost = false;

            roadSpeed =
                baseSpeed;

        },
        5000
    );
}


// =====================================================
// FIREWALL SHIELD
// =====================================================

function activateShield() {

    shieldActive = true;


    setTimeout(
        function() {

            shieldActive =
                false;

        },
        7000
    );
}


// =====================================================
// CPU ENERGY
// =====================================================

function activateEnergy() {

    cpuEnergy += 30;


    if (
        cpuEnergy > 100
    ) {

        cpuEnergy = 100;
    }


    score += 100;
}


// =====================================================
// VIRUS SYSTEM
// =====================================================

function updateVirus() {

    virusDistance +=
        0.018;


    if (
        virusDistance >
        maxVirusDistance
    ) {

        virusDistance =
            maxVirusDistance;
    }


    if (
        virusDistance >=
        maxVirusDistance
    ) {

        endGame(
            "VIRUS CAUGHT YOU"
        );
    }
}


// =====================================================
// LEVEL SYSTEM
// =====================================================

function updateLevel() {

    let newLevel = 1;


    if (
        distance >= 4000
    ) {

        newLevel = 5;

    } else if (
        distance >= 3000
    ) {

        newLevel = 4;

    } else if (
        distance >= 2000
    ) {

        newLevel = 3;

    } else if (
        distance >= 1000
    ) {

        newLevel = 2;
    }


    if (
        newLevel !== level
    ) {

        level =
            newLevel;

        levelName =
            levels[
                level - 1
            ].name;


        roadSpeed += 0.7;


        showLevelMessage();
    }
}


// =====================================================
// LEVEL MESSAGE
// =====================================================

function showLevelMessage() {

    const message =
        document.createElement(
            "div"
        );


    message.className =
        "level-message";


    message.innerHTML = `

        <div>
            <small>NEW WORLD</small>
            <h1>${levelName}</h1>
        </div>
    `;


    document.body.appendChild(
        message
    );


    setTimeout(
        function() {

            message.remove();

        },
        1800
    );
}


// =====================================================
// SYSTEM GATE
// =====================================================

function checkGate() {

    if (
        gateActive ||
        distance < 500
    ) {
        return;
    }


    const gateDistance =
        Math.floor(
            distance / 500
        ) * 500;


    if (
        gateDistance >
        0 &&
        Math.abs(
            distance -
            gateDistance
        ) < 0.2
    ) {

        openGate();
    }
}


// =====================================================
// OPEN GATE
// =====================================================

function openGate() {

    gateActive = true;

    gameState = "gate";

    roadSpeed = 0;

    gateQuestion =
        questions[
            Math.floor(
                Math.random() *
                questions.length
            )
        ];


    showQuestion();
}


// =====================================================
// SHOW QUESTION
// =====================================================

function showQuestion() {

    const overlay =
        document.createElement(
            "div"
        );


    overlay.id =
        "questionOverlay";


    let buttons = "";


    gateQuestion.options
        .forEach(
            function(option, index) {

                buttons += `

                    <button
                        class="answer-button"
                        data-answer="${index}"
                    >
                        ${option}
                    </button>
                `;
            }
        );


    overlay.innerHTML = `

        <div class="question-box">

            <div class="gate-icon">
                💻
            </div>

            <p class="gate-title">
                SYSTEM GATE
            </p>

            <h2>
                ${gateQuestion.question}
            </h2>

            <div class="answers">
                ${buttons}
            </div>

        </div>
    `;


    document.body.appendChild(
        overlay
    );


    document
        .querySelectorAll(
            ".answer-button"
        )
        .forEach(
            function(button) {

                button.addEventListener(
                    "click",
                    function() {

                        const answer =
                            Number(
                                this.dataset
                                    .answer
                            );


                        answerQuestion(
                            answer,
                            overlay
                        );
                    }
                );
            }
        );
}


// =====================================================
// ANSWER QUESTION
// =====================================================

function answerQuestion(
    answer,
    overlay
) {

    if (
        answer ===
        gateQuestion.answer
    ) {

        score += 250;

        virusDistance -= 15;


        if (
            virusDistance < 0
        ) {

            virusDistance = 0;
        }


        cpuEnergy += 20;


        if (
            cpuEnergy > 100
        ) {

            cpuEnergy = 100;
        }


        overlay.innerHTML = `

            <div class="result-box correct">

                <div>✅</div>

                <h2>
                    SYSTEM UNLOCKED!
                </h2>

                <p>
                    +250 Score
                </p>

                <button id="continueButton">
                    CONTINUE
                </button>

            </div>
        `;

    } else {

        lives--;

        virusDistance += 20;


        if (
            lives <= 0
        ) {

            overlay.remove();

            endGame(
                "SYSTEM LOCKED"
            );

            return;
        }


        overlay.innerHTML = `

            <div class="result-box wrong">

                <div>❌</div>

                <h2>
                    ACCESS DENIED
                </h2>

                <p>
                    The virus is getting closer!
                </p>

                <button id="continueButton">
                    CONTINUE
                </button>

            </div>
        `;
    }


    document
        .getElementById(
            "continueButton"
        )
        .addEventListener(
            "click",
            function() {

                overlay.remove();

                gateActive = false;

                gameState = "playing";

                roadSpeed =
                    baseSpeed +
                    ((level - 1) *
                    0.7);
            }
        );
}
// =====================================================
// DRAW BACKGROUND
// =====================================================

function drawBackground() {

    const currentLevel =
        levels[level - 1];


    ctx.fillStyle =
        "#050816";


    ctx.fillRect(
        0,
        0,
        canvas.width,
        canvas.height
    );


    // Digital grid

    ctx.strokeStyle =
        currentLevel.color;

    ctx.globalAlpha =
        0.12;

    ctx.lineWidth = 1;


    for (
        let x = 0;
        x < canvas.width;
        x += 50
    ) {

        ctx.beginPath();

        ctx.moveTo(x, 0);

        ctx.lineTo(
            x,
            canvas.height
        );

        ctx.stroke();
    }


    for (
        let y = 0;
        y < canvas.height;
        y += 50
    ) {

        ctx.beginPath();

        ctx.moveTo(0, y);

        ctx.lineTo(
            canvas.width,
            y
        );

        ctx.stroke();
    }


    ctx.globalAlpha = 1;
}

// =====================================================
// DRAW ROAD
// =====================================================

function drawRoad() {

    const currentLevel =
        levels[level - 1];


    // Road

    ctx.fillStyle =
        "#121a2d";


    ctx.fillRect(
        220,
        0,
        460,
        canvas.height
    );


    // Road glow

    ctx.fillStyle =
        currentLevel.color;


    ctx.fillRect(
        220,
        0,
        5,
        canvas.height
    );


    ctx.fillRect(
        675,
        0,
        5,
        canvas.height
    );


    // Lane lines

    ctx.strokeStyle =
        "#34415d";


    ctx.lineWidth = 4;


    ctx.setLineDash([
        25,
        25
    ]);


    let offset =
        (
            animationTime *
            roadSpeed *
            0.5
        ) % 50;


    ctx.beginPath();

    ctx.moveTo(
        370,
        -50 + offset
    );

    ctx.lineTo(
        370,
        canvas.height
    );

    ctx.stroke();


    ctx.beginPath();

    ctx.moveTo(
        530,
        -50 + offset
    );

    ctx.lineTo(
        530,
        canvas.height
    );

    ctx.stroke();


    ctx.setLineDash([]);
}

// =====================================================
// DRAW PLAYER
// =====================================================

function drawPlayer() {

    // Shield
    if (
        shieldActive
    ) {

        ctx.strokeStyle =
            "#00ff88";

        ctx.lineWidth = 5;


        ctx.beginPath();

        ctx.arc(
            player.x,
            player.y + 25,
            48,
            0,
            Math.PI * 2
        );

        ctx.stroke();
    }


    // Glow
    ctx.shadowBlur = 20;

    ctx.shadowColor =
        player.color;


    // Body
    ctx.fillStyle =
        speedBoost
            ? "#ffd700"
            : player.color;


    ctx.fillRect(

        player.x -
        player.width / 2,

        player.y,

        player.width,

        player.height
    );


    ctx.shadowBlur = 0;


    // Head
    if (
        !player.sliding
    ) {

        ctx.fillStyle =
            "#ffffff";


        ctx.beginPath();

        ctx.arc(
            player.x,
            player.y - 12,
            18,
            0,
            Math.PI * 2
        );

        ctx.fill();
    }


    // Player name

    ctx.fillStyle =
        "#ffffff";

    ctx.font =
        "bold 12px Arial";

    ctx.textAlign =
        "center";


    ctx.fillText(
        "RUNNER",
        player.x,
        player.y +
        player.height +
        20
    );
}

// =====================================================
// DRAW COINS
// =====================================================

function drawCoins() {

    coins.forEach(
        function(coin) {

            ctx.save();

            ctx.translate(
                coin.x,
                coin.y
            );


            ctx.rotate(
                coin.rotation
            );


            ctx.shadowBlur =
                15;

            ctx.shadowColor =
                "#ffd700";


            ctx.fillStyle =
                "#ffd700";


            ctx.beginPath();

            ctx.arc(
                0,
                0,
                coin.size,
                0,
                Math.PI * 2
            );

            ctx.fill();


            ctx.shadowBlur = 0;


            ctx.fillStyle =
                "#7a5c00";

            ctx.font =
                "bold 12px Arial";

            ctx.textAlign =
                "center";


            ctx.fillText(
                "D",
                0,
                4
            );


            ctx.restore();
        }
    );
}

// =====================================================
// DRAW OBSTACLES
// =====================================================

function drawObstacles() {

    obstacles.forEach(
        function(obstacle) {

            ctx.shadowBlur =
                15;

            ctx.shadowColor =
                "#ff3b5c";


            ctx.fillStyle =
                "#ff3b5c";


            ctx.fillRect(

                obstacle.x -
                obstacle.width / 2,

                obstacle.y,

                obstacle.width,

                obstacle.height
            );


            ctx.shadowBlur = 0;


            ctx.fillStyle =
                "#ffffff";

            ctx.font =
                "bold 18px Arial";

            ctx.textAlign =
                "center";


            ctx.fillText(
                "!",
                obstacle.x,
                obstacle.y + 35
            );
        }
    );
}

// =====================================================
// DRAW POWER UPS
// =====================================================

function drawPowerUps() {

    powerUps.forEach(
        function(item) {

            let color =
                "#ffffff";

            let text =
                "";


            if (
                item.type ===
                "boost"
            ) {

                color =
                    "#ffd700";

                text =
                    "RAM";

            } else if (
                item.type ===
                "shield"
            ) {

                color =
                    "#00ff88";

                text =
                    "S";

            } else {

                color =
                    "#ff9f43";

                text =
                    "CPU";
            }


            ctx.shadowBlur =
                20;

            ctx.shadowColor =
                color;


            ctx.fillStyle =
                color;


            ctx.beginPath();

            ctx.arc(
                item.x,
                item.y,
                item.size,
                0,
                Math.PI * 2
            );

            ctx.fill();


            ctx.shadowBlur = 0;


            ctx.fillStyle =
                "#101522";

            ctx.font =
                "bold 11px Arial";

            ctx.textAlign =
                "center";


            ctx.fillText(
                text,
                item.x,
                item.y + 4
            );
        }
    );
}


// =====================================================
// DRAW HUD
// =====================================================

function drawHUD() {

    // Level

    ctx.fillStyle =
        "#ffffff";

    ctx.font =
        "bold 16px Arial";

    ctx.textAlign =
        "center";


    ctx.fillText(
        `WORLD ${level}: ${levelName}`,
        canvas.width / 2,
        25
    );


    // Virus meter

    const vx = 25;
    const vy = 55;

    const vw = 220;
    const vh = 18;


    ctx.textAlign =
        "left";

    ctx.font =
        "bold 13px Arial";

    ctx.fillStyle =
        "#ffffff";


    ctx.fillText(
        "🦠 VIRUS CHASE",
        vx,
        vy - 7
    );


    ctx.fillStyle =
        "#20283d";


    ctx.fillRect(
        vx,
        vy,
        vw,
        vh
    );


    ctx.fillStyle =
        "#ff3b5c";


    ctx.fillRect(

        vx,
        vy,

        vw *
        (
            virusDistance /
            maxVirusDistance
        ),

        vh
    );


    ctx.strokeStyle =
        "#ffffff";


    ctx.strokeRect(
        vx,
        vy,
        vw,
        vh
    );

    // CPU energy

    const ex =
        canvas.width - 245;

    const ey = 55;


    ctx.fillStyle =
        "#ffffff";


    ctx.fillText(
        "🔋 CPU ENERGY",
        ex,
        ey - 7
    );


    ctx.fillStyle =
        "#20283d";


    ctx.fillRect(
        ex,
        ey,
        vw,
        vh
    );


    ctx.fillStyle =
        "#ff9f43";


    ctx.fillRect(

        ex,
        ey,

        vw *
        (cpuEnergy / 100),

        vh
    );


    ctx.strokeStyle =
        "#ffffff";


    ctx.strokeRect(
        ex,
        ey,
        vw,
        vh
    );


    // Power-up status

    let statusY =
        canvas.height - 25;


    ctx.textAlign =
        "right";


    if (
        speedBoost
    ) {

        ctx.fillStyle =
            "#ffd700";

        ctx.fillText(
            "💾 RAM BOOST",
            canvas.width - 25,
            statusY
        );


        statusY -= 20;
    }


    if (
        shieldActive
    ) {

        ctx.fillStyle =
            "#00ff88";

        ctx.fillText(
            "🛡️ FIREWALL ACTIVE",
            canvas.width - 25,
            statusY
        );
    }
}


// =====================================================
// UPDATE GAME
// =====================================================

function updateGame() {

    if (
        gameState !==
        "playing"
    ) {
        return;
    }


    animationTime += 1;


    distance +=
        roadSpeed * 0.018;


    score +=
        Math.ceil(
            roadSpeed / 5
        );


    updateJump();

    updateObjects();

    checkCoinCollision();

    checkObstacleCollision();

    checkPowerUpCollision();

    updateVirus();

    updateLevel();

    checkGate();


    // Increase difficulty

    baseSpeed =
        5 +
        (
            Math.floor(
                distance / 500
            ) * 0.35
        );


    if (
        !speedBoost
    ) {

        roadSpeed =
            baseSpeed;
    }


    updateHTML();
}


// =====================================================
// UPDATE HTML
// =====================================================

function updateHTML() {

    const scoreElement =
        document.getElementById(
            "score"
        );


    const distanceElement =
        document.getElementById(
            "distance"
        );


    const livesElement =
        document.getElementById(
            "lives"
        );


    if (
        scoreElement
    ) {

        scoreElement.textContent =
            Math.floor(score);
    }


    if (
        distanceElement
    ) {

        distanceElement.textContent =
            Math.floor(distance);
    }


    if (
        livesElement
    ) {

        livesElement.textContent =
            lives;
    }
}


// =====================================================
// OBJECT SPAWNING
// =====================================================

function spawnObjects() {

    if (
        gameState !==
        "playing"
    ) {
        return;
    }


    const now =
        Date.now();


    // Coins

    if (
        now -
        lastCoinTime >
        700
    ) {

        createCoin();

        lastCoinTime =
            now;
    }


    // Obstacles

    const obstacleDelay =
        Math.max(
            900,
            1500 -
            level * 100
        );


    if (
        now -
        lastObstacleTime >
        obstacleDelay
    ) {

        createObstacle();

        lastObstacleTime =
            now;
    }

    // Power-ups

    if (
        now -
        lastPowerTime >
        5000
    ) {

        createPowerUp();

        lastPowerTime =
            now;
    }
}


// =====================================================
// GAME OVER
// =====================================================

function endGame(message) {

    if (
        gameState ===
        "gameover"
    ) {
        return;
    }


    gameState =
        "gameover";


    showGameOver(
        message
    );
}


// =====================================================
// GAME OVER SCREEN
// =====================================================

function showGameOver(
    message
) {

    const overlay =
        document.createElement(
            "div"
        );


    overlay.id =
        "gameOverScreen";


    overlay.innerHTML = `

        <div class="gameover-box">

            <div class="big-icon">
                🦠
            </div>

            <h1>
                ${message}
            </h1>

            <div class="final-stats">

                <p>
                    🏆 Score:
                    <strong>
                        ${Math.floor(score)}
                    </strong>
                </p>

                <p>
                    📏 Distance:
                    <strong>
                        ${Math.floor(distance)}m
                    </strong>
                </p>

                <p>
                    🌐 World:
                    <strong>
                        ${levelName}
                    </strong>
                </p>

            </div>

            <button id="restartButton">
                PLAY AGAIN
            </button>

        </div>
    `;


    document.body.appendChild(
        overlay
    );


    document
        .getElementById(
            "restartButton"
        )
        .addEventListener(
            "click",
            function() {

                overlay.remove();

                resetGame();

                gameState =
                    "playing";
            }
        );
}


// =====================================================
// DRAW GAME
// =====================================================

function drawGame() {

    drawBackground();

    drawRoad();

    drawCoins();

    drawObstacles();

    drawPowerUps();

    drawPlayer();

    drawHUD();
}


// =====================================================
// MAIN GAME LOOP
// =====================================================

function gameLoop() {

    spawnObjects();

    updateGame();

    drawGame();


    requestAnimationFrame(
        gameLoop
    );
}


// =====================================================
// START
// =====================================================

createStartScreen();

gameLoop();