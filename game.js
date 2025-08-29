document.addEventListener('DOMContentLoaded', () => {
    const startScreen = document.getElementById('start-screen');
    const gameContainer = document.getElementById('game-container');
    const startButton = document.getElementById('start-button');
    const playerNameInput = document.getElementById('player-name');
    const canvas = document.getElementById('game-canvas');
    const ctx = canvas.getContext('2d');
    const highscoreList = document.getElementById('highscore-list');
    const endGameButton = document.getElementById('end-game-button');

    let playerName = '';
    let asteroids = [];
    let enemies = [];
    let bullets = [];
    let explosions = [];
    let score = 0;
    let highscores = [];
    let gameOver = false;
    const maxEnemies = 2;
    let enemyInterval = null;

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    function createExplosion(x, y, size) {
        for (let i = 0; i < size; i++) {
            explosions.push({
                x,
                y,
                vx: Math.random() * 4 - 2,
                vy: Math.random() * 4 - 2,
                size: Math.random() * 2 + 1,
                life: 1,
            });
        }
    }

    function createAsteroids(count) {
        asteroids = [];
        for (let i = 0; i < count; i++) {
            const size = Math.random() * 40 + 20;
            const vertices = [];
            const numVertices = Math.floor(Math.random() * 5) + 7; // 7 to 12 vertices
            for (let j = 0; j < numVertices; j++) {
                const angle = (j / numVertices) * Math.PI * 2;
                const radius = size / 2 + (Math.random() - 0.5) * (size / 4);
                vertices.push({
                    x: Math.cos(angle) * radius,
                    y: Math.sin(angle) * radius,
                });
            }
            asteroids.push({
                x: Math.random() * 2000 - 1000,
                y: Math.random() * 2000 - 1000,
                vx: Math.random() * 2 - 1,
                vy: Math.random() * 2 - 1,
                size: size,
                vertices: vertices,
            });
        }
    }

    function spawnEnemy() {
        if (enemies.length < maxEnemies) {
            enemies.push({
                x: Math.random() * 2000 - 1000,
                y: Math.random() * 2000 - 1000,
                vx: Math.random() * 2 - 1,
                vy: Math.random() * 2 - 1,
                size: 20,
                angle: 0,
            });
        }
    }

    function startGame() {
        playerName = playerNameInput.value || 'Player 1';
        startScreen.style.display = 'none';
        gameContainer.style.display = 'block';
        gameOver = false;
        score = 0;
        player.x = 0;
        player.y = 0;
        player.vx = 0.1;
        player.vy = 0.1;
        enemies = [];
        bullets = [];
        explosions = [];
        resizeCanvas();
        createAsteroids(20);
        if (enemyInterval) clearInterval(enemyInterval);
        enemyInterval = setInterval(spawnEnemy, 5000);
        
        if (!gameLoop.running) {
            gameLoop.running = true;
            gameLoop();
        }
    }

    function endGame() {
        gameOver = true;
        if (enemyInterval) {
            clearInterval(enemyInterval);
            enemyInterval = null;
        }
        if (score > 0) {
            highscores.push({ name: playerName, score: score });
            highscores.sort((a, b) => b.score - a.score);
            highscores = highscores.slice(0, 10);
            updateHighscore();
        }

        // Show game over screen
        ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#fff';
        ctx.font = '48px VT323, monospace';
        ctx.textAlign = 'center';
        ctx.fillText('Game Over', canvas.width / 2, canvas.height / 2 - 50);
        ctx.font = '24px VT323, monospace';
        ctx.fillText(`Score: ${score}`, canvas.width / 2, canvas.height / 2);
        
        const playAgainButton = document.createElement('button');
        playAgainButton.textContent = 'Play Again';
        playAgainButton.style.position = 'absolute';
        playAgainButton.style.top = 'calc(50% + 50px)';
        playAgainButton.style.left = '50%';
        playAgainButton.style.transform = 'translateX(-50%)';
        playAgainButton.style.padding = '1rem 2rem';
        playAgainButton.style.fontSize = '1.5rem';
        playAgainButton.style.cursor = 'pointer';
        playAgainButton.style.fontFamily = 'VT323, monospace';
        playAgainButton.onclick = () => {
            document.body.removeChild(playAgainButton);
            startGame();
        };
        document.body.appendChild(playAgainButton);
    }

    function returnToStartScreen() {
        gameOver = true;
        if (enemyInterval) {
            clearInterval(enemyInterval);
            enemyInterval = null;
        }
        
        if (score > 0) {
            highscores.push({ name: playerName, score: score });
            highscores.sort((a, b) => b.score - a.score);
            highscores = highscores.slice(0, 10);
            updateHighscore();
        }

        const playAgainButton = document.querySelector('body > button');
        if (playAgainButton && playAgainButton.textContent === 'Play Again') {
            document.body.removeChild(playAgainButton);
        }

        gameContainer.style.display = 'none';
        startScreen.style.display = 'block';
    }

    function updateHighscore() {
        highscoreList.innerHTML = '';
        highscores.forEach(score => {
            const li = document.createElement('li');
            li.textContent = `${score.name}: ${score.score}`;
            highscoreList.appendChild(li);
        });
    }

    startButton.addEventListener('click', startGame);
    playerNameInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            startGame();
        }
    });
    endGameButton.addEventListener('click', returnToStartScreen);
    window.addEventListener('resize', resizeCanvas);

    const player = {
        x: 0,
        y: 0,
        vx: 0.1,
        vy: 0.1,
        angle: 0,
        rotation: 0,
        thrusting: false,
        slowing: false,
        size: 20,
    };

    const keys = {
        up: false,
        down: false,
        left: false,
        right: false,
        space: false,
    };

    function handleKeyDown(e) {
        switch (e.key) {
            case 'ArrowUp':
                keys.up = true;
                break;
            case 'ArrowDown':
                keys.down = true;
                break;
            case 'ArrowLeft':
                keys.left = true;
                break;
            case 'ArrowRight':
                keys.right = true;
                break;
            case ' ':
                if (!keys.space) {
                    keys.space = true;
                    bullets.push({
                        x: player.x + Math.cos(player.angle) * player.size / 2,
                        y: player.y + Math.sin(player.angle) * player.size / 2,
                        vx: Math.cos(player.angle) * 7,
                        vy: Math.sin(player.angle) * 7,
                        size: 5,
                        life: 1,
                    });
                }
                break;
        }
    }

    function handleKeyUp(e) {
        switch (e.key) {
            case 'ArrowUp':
                keys.up = false;
                break;
            case 'ArrowDown':
                keys.down = false;
                break;
            case 'ArrowLeft':
                keys.left = false;
                break;
            case 'ArrowRight':
                keys.right = false;
                break;
            case ' ':
                keys.space = false;
                break;
        }
    }

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);

    function checkCollisions() {
        // Player with asteroids
        asteroids.forEach(asteroid => {
            const dist = Math.hypot(player.x - asteroid.x, player.y - asteroid.y);
            if (dist < player.size / 2 + asteroid.size / 2) {
                createExplosion(player.x, player.y, 20);
                endGame();
            }
        });

        // Bullets with enemies
        bullets.forEach((bullet, bulletIndex) => {
            enemies.forEach((enemy, enemyIndex) => {
                const dist = Math.hypot(bullet.x - enemy.x, bullet.y - enemy.y);
                if (dist < bullet.size + enemy.size / 2) {
                    createExplosion(enemy.x, enemy.y, 10);
                    enemies.splice(enemyIndex, 1);
                    bullets.splice(bulletIndex, 1);
                    score += 10;
                }
            });
        });
    }

    function update() {
        if (gameOver) return;

        // Player rotation
        if (keys.left) {
            player.angle -= 0.05;
        }
        if (keys.right) {
            player.angle += 0.05;
        }

        // Player movement
        player.thrusting = keys.up;
        player.slowing = keys.down;

        if (player.thrusting) {
            const force = 0.1;
            player.vx += Math.cos(player.angle) * force;
            player.vy += Math.sin(player.angle) * force;
        }

        if (player.slowing) {
            player.vx *= 0.98;
            player.vy *= 0.98;
        }
        
        const maxSpeed = 5;
        const speed = Math.sqrt(player.vx * player.vx + player.vy * player.vy);
        if (speed > maxSpeed) {
            player.vx = (player.vx / speed) * maxSpeed;
            player.vy = (player.vy / speed) * maxSpeed;
        }


        player.x += player.vx;
        player.y += player.vy;

        // Update asteroids
        asteroids.forEach(asteroid => {
            asteroid.x += asteroid.vx;
            asteroid.y += asteroid.vy;
        });

        // Update enemies
        enemies.forEach(enemy => {
            enemy.x += enemy.vx;
            enemy.y += enemy.vy;
        });

        // Update bullets
        bullets.forEach((bullet, index) => {
            bullet.x += bullet.vx;
            bullet.y += bullet.vy;
            bullet.life -= 0.01;
            if (bullet.life < 0) {
                bullets.splice(index, 1);
            }
        });

        // Update explosions
        explosions.forEach((explosion, index) => {
            explosion.x += explosion.vx;
            explosion.y += explosion.vy;
            explosion.life -= 0.02;
            if (explosion.life < 0) {
                explosions.splice(index, 1);
            }
        });

        checkCollisions();
    }

    function draw() {
        if (gameOver) return;

        ctx.fillStyle = '#000';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.save();
        ctx.translate(canvas.width / 2 - player.x, canvas.height / 2 - player.y);

        // Draw player
        ctx.save();
        ctx.translate(player.x, player.y);
        ctx.rotate(player.angle);
        ctx.beginPath();
        ctx.moveTo(player.size / 2, 0);
        ctx.lineTo(-player.size / 2, -player.size / 3);
        ctx.lineTo(-player.size / 2, player.size / 3);
        ctx.closePath();
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.restore();

        // Draw asteroids
        asteroids.forEach(asteroid => {
            ctx.save();
            ctx.translate(asteroid.x, asteroid.y);
            ctx.beginPath();
            ctx.moveTo(asteroid.vertices[0].x, asteroid.vertices[0].y);
            for (let i = 1; i < asteroid.vertices.length; i++) {
                ctx.lineTo(asteroid.vertices[i].x, asteroid.vertices[i].y);
            }
            ctx.closePath();
            ctx.strokeStyle = '#fff';
            ctx.lineWidth = 2;
            ctx.stroke();
            ctx.restore();
        });

        // Draw enemies
        enemies.forEach(enemy => {
            ctx.save();
            ctx.translate(enemy.x, enemy.y);
            ctx.rotate(enemy.angle + Math.PI / 2);
            ctx.font = `${enemy.size}px VT323, monospace`;
            ctx.fillStyle = '#f00';
            ctx.textAlign = 'center';
            ctx.fillText('▼', 0, 0);
            ctx.restore();
        });

        // Draw bullets
        bullets.forEach(bullet => {
            ctx.font = `${bullet.size * 2}px VT323, monospace`;
            ctx.fillStyle = '#ff0';
            ctx.textAlign = 'center';
            ctx.fillText('·', bullet.x, bullet.y);
        });

        // Draw explosions
        explosions.forEach(explosion => {
            ctx.fillStyle = `rgba(255, 255, 255, ${explosion.life})`;
            ctx.beginPath();
            ctx.arc(explosion.x, explosion.y, explosion.size, 0, Math.PI * 2);
            ctx.fill();
        });

        ctx.restore();
    }

    function gameLoop() {
        update();
        draw();
        if (!gameOver) {
            requestAnimationFrame(gameLoop);
        } else {
            gameLoop.running = false;
        }
    }
    gameLoop.running = false;
});
