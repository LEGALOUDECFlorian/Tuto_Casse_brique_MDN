console.log(!!undefined);
// mise en place et definition du canvas
const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");
// demarrage du jeu
let gameStarted = false;
// point de départ de la balle
// let x = canvas.width / 2;
// let y = canvas.height - 30;
// Initialiser les coordonnées de la balle en dehors du canvas
// let x = -100;
// let y = -100;
 

//direction du mouvement de la balle
let dx = 2;
let dy = -2;
//taille de la balle
let ballRadius = 10;
// couleur de la balle
let ballColor = "#f0f";
// infos de la raquette
const paddleHeight = 10;
const paddleWidth = 75;
let paddleX = (canvas.width - paddleWidth) / 2;
// etat des touche au demarrage de l'app
let rightPressed = false;
let leftPressed = false;
// construction des briques
let brickRowCount = 3;
let brickColumnCount = 8;
let brickWidth = 45;
let brickHeight = 20;
let brickPadding = 10;
let brickOffsetTop = 28;
let brickOffsetLeft = 25;
// fabrication du tableau de brique
let bricks = [];
for (let c = 0; c < brickColumnCount; c++) {
  bricks[c] = [];
  for (let r = 0; r < brickRowCount; r++) {
    bricks[c][r] = { x: 0, y: 0, status: 1 };
  }
}
// Définissez un tableau de couleurs prédéfinies
const predefinedColors = ["#a2f307", "#05f9e2", "#ff6f00", "#f50b86"];
let currentColorIndex = 0;
// score joueur
let score = 0;
// vie au joueur
let lives = 3;
// Coordonnées de la souris (ou de la touche) avant le démarrage du jeu
// let initialMouseX = 0;
// Initialiser les coordonnées de la balle sur la raquette
let x = paddleX + paddleWidth / 2;
let y = canvas.height - paddleHeight - ballRadius;

// gestionnaires d'événements pour détecter le début du jeu
document.addEventListener("click", startGame, false);
document.addEventListener("keydown", startGame, false);
// gestionnaires d'événements pour le déplacement de la raquette
document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);
document.addEventListener("mousemove", mouseMoveHandler, false);

// Ajoutez des gestionnaires d'événements pour suivre la position de la souris ou de la touche
// document.addEventListener("mousemove", recordInitialMousePosition, false);
// document.addEventListener("keydown", recordInitialMousePosition, false);

// function recordInitialMousePosition(e) {
//   // Enregistrez la position de la souris ou de la touche
//   initialMouseX = e.clientX || (e.touches && e.touches[0].clientX);
// }

function startGame(e) {
  // Si le clic de la souris ou la touche est enfoncée, démarrez le jeu
  if (e.type === "click" || (e.type === "keydown" && (e.key == " " || e.key == "Enter"))) {
    gameStarted = true;

    // //  Initialisez les coordonnées de la balle sur la raquette
    //  x = paddleX + paddleWidth / 2;
    //  y = canvas.height - paddleHeight - ballRadius;

     // Utilisez la dernière position de la souris ou de la touche pour initialiser les coordonnées de la balle
    //  x = initialMouseX || (canvas.width / 2);
    //  y = canvas.height - paddleHeight - ballRadius;
 

    // Supprimez les écouteurs d'événements pour éviter de redémarrer le jeu plusieurs fois
    document.removeEventListener("click", startGame);
    document.removeEventListener("keydown", startGame);
    // document.removeEventListener("mousemove", recordInitialMousePosition);
  }
}

function mouseMoveHandler(e) {
  let relativeX = e.clientX - canvas.offsetLeft;
  if (relativeX > paddleWidth && relativeX < canvas.width) {
    paddleX = relativeX - paddleWidth;
  }
}

function keyDownHandler(e) {
  if (e.key == "Right" || e.key == "ArrowRight") {
    rightPressed = true;
  } else if (e.key == "Left" || e.key == "ArrowLeft") {
    leftPressed = true;
  }
}

function keyUpHandler(e) {
  if (e.key == "Right" || e.key == "ArrowRight") {
    rightPressed = false;
  } else if (e.key == "Left" || e.key == "ArrowLeft") {
    leftPressed = false;
  }
}

function collisionDetection() {
  for (let c = 0; c < brickColumnCount; c++) {
    for (let r = 0; r < brickRowCount; r++) {
      let b = bricks[c][r];
      if (b.status == 1) {
        if (
          x > b.x &&
          x < b.x + brickWidth &&
          y > b.y &&
          y < b.y + brickHeight
        ) {
          dy = -dy;
          b.status = 0;
          score += 10;
            // Changez la couleur de la balle de façon aléatoire après chaque collision
            // ballColor = getRandomColor();
             // Changez la couleur de la balle à partir du tableau de couleurs prédéfinies
          ballColor = predefinedColors[currentColorIndex];

          // Passez à la couleur suivante dans le tableau
          currentColorIndex = (currentColorIndex + 1) % predefinedColors.length;

          if (score == brickRowCount * brickColumnCount * 10) {
            alert("C'est gagné, Bravo!\nvotre score est de : " + score);
            document.location.reload();
            clearInterval(interval); // Needed for Chrome to end game
          }
        }
      }
    }
  }
}

function drawScore() {
  ctx.font = "16px Arial";
  ctx.fillStyle = "#0095DD";
  ctx.fillText("Score: " + score, 8, 20);
}

function drawLives() {
  ctx.font = "16px Arial";
  ctx.fillStyle = "#0095DD";
  ctx.fillText("Lives: " + lives, canvas.width - 65, 20);
}

// fonction pour générer une couleur aléatoire
function getRandomColor() {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

// function changeColorBall() {
//   if (y + dy > canvas.height - ballRadius) {
//     ballColor = "#a2f307";
//   }
//   if (y + dy < ballRadius) {
//     ballColor = "#05f9e2";
//   }
//   if (x + dx > canvas.width - ballRadius) {
//     ballColor = "#ff6f00";
//   }
//   if (x + dx < ballRadius) {
//     ballColor = "#f50b86";
//   }
// }

function drawBall() {
  ctx.beginPath();
  ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
  ctx.fillStyle = ballColor;
  ctx.fill();
  ctx.closePath();
}

function drawPaddle() {
  ctx.beginPath();
  ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
  ctx.fillStyle = "#0095DD";
  ctx.fill();
  ctx.closePath();
}

function drawBricks() {
  for (let c = 0; c < brickColumnCount; c++) {
    for (let r = 0; r < brickRowCount; r++) {
      if (bricks[c][r].status == 1) {
        let brickX = c * (brickWidth + brickPadding) + brickOffsetLeft;
        let brickY = r * (brickHeight + brickPadding) + brickOffsetTop;
        bricks[c][r].x = brickX;
        bricks[c][r].y = brickY;
        ctx.beginPath();
        ctx.rect(brickX, brickY, brickWidth, brickHeight);
        ctx.fillStyle = "#0095DD";
        ctx.fill();
        ctx.closePath();
      }
    }
  }
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawBall();
    drawBricks();
    collisionDetection();
    drawPaddle();
    drawScore();
    drawLives();
    if (gameStarted) {
    x += dx;
    y += dy;
    // changeColorBall();

    if (y + dy < ballRadius) {
      dy = -dy;
    } else if (y + dy > canvas.height - (ballRadius + 2)) {
      if (x > paddleX && x < paddleX + paddleWidth) {
        dy = -dy;
        dx += 0.1;
        dy += -0.1;
        // Changez la couleur de la balle à partir du tableau de couleurs prédéfinies
        ballColor = predefinedColors[currentColorIndex];

        // Passez à la couleur suivante dans le tableau
        currentColorIndex = (currentColorIndex + 1) % predefinedColors.length;

         // Ajustez dx en fonction de l'endroit où la balle a frappé la raquette
         let relativeIntersectX = x - (paddleX + paddleWidth / 2);
         let normalizedRelativeIntersectX = relativeIntersectX / (paddleWidth / 2);
         dx = normalizedRelativeIntersectX * 4; // Ajustez le facteur selon vos besoins
         
      } else {
        lives--;
        if (!lives) {
          alert("GAME OVER");
          document.location.reload();
          clearInterval(interval);
        } else {
          x = canvas.width / 2;
          y = canvas.height - 30;
          dx = 2;
          dy = -2;
          
          paddleX = (canvas.width - paddleWidth) / 2;
        }
      }
    }

    if (x + dx > canvas.width - ballRadius || x + dx < ballRadius) {
      dx = -dx;
    }
   
    if (rightPressed) {
      paddleX += 5;
      if (paddleX + paddleWidth > canvas.width) {
        paddleX = canvas.width - paddleWidth;
      }
    } else if (leftPressed) {
      paddleX -= 5;
      if (paddleX < 0) {
        paddleX = 0;
      }
    }
   

     
  }
}


const interval = setInterval(draw, 10);
