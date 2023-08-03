
//call the image id and not g tag id
spaceship = document.getElementById('player'); //querySelector method is used to select the spaceship element, but in the SVG, the spaceship element has the ID player, not a class. So, the correct method to use is getElementById, not querySelector.
enemies = document.querySelectorAll('.enemies image');
meteors = document.querySelectorAll('.meteors');
missiles = document.querySelectorAll('.missiles');
background = document.getElementById('background');
tryAgain = document.getElementById('tryAgain');
isPlaying = true;
isEnemyHit = false
isShooting = false;
let x;
let spaceshipX=0;
let spaceshipY=0;
let spaceshipSpeed = 10;
let missilesContainer = document.createElementNS("http://www.w3.org/2000/svg", "g");
document.querySelector('svg').appendChild(missilesContainer); 
let activeMissiles = [];
let isCollided = false;
count = 0;


player1 = () => {
    if(!isCollided && isPlaying) { 
        playerDirection = (event) =>{
            switch(event) {
                case "s":
                    // Move the spaceship left
                    spaceshipY += spaceshipSpeed;
                    spaceship.setAttribute("y", spaceshipY + "px");
                    checkCollision();
                    break;
                    case "w":
                    // Move the spaceship right
                    spaceshipY -= spaceshipSpeed;
                    spaceship.setAttribute("y", spaceshipY + "px");
                    checkCollision();
                    break;
                    case "a":
                    // Move the spaceship up
                    spaceshipX -= spaceshipSpeed;
                    spaceship.setAttribute("x", spaceshipX + "px");
                    checkCollision();
                    break;
                    case "d":
                    // Move the spaceship down
                    spaceshipX += spaceshipSpeed;
                    spaceship.setAttribute("x", spaceshipX + "px");
                    checkCollision();
                    break;
                    default:
                    // Handle other key presses (if needed)
                    break;
            }
                requestAnimationFrame(playerDirection);
        }

                function shootMissiles() {
                document.addEventListener("keydown", (event) => {
                    const key = event.key;
                    if (key === "k" && !isShooting) {
                        isShooting = true; // Update the isShooting flag to prevent continuous shooting
    
                        // Create a new missile element
                        let newMissile = document.createElementNS("http://www.w3.org/2000/svg", "rect");
                        const spaceshipX = parseInt(spaceship.getAttribute("x"));
                        const spaceshipY = parseInt(spaceship.getAttribute("y"));
                        newMissile.setAttribute("x", spaceshipX + 170); // Adjust to spaceship width which is 164
                        newMissile.setAttribute("y", spaceshipY + 820); // Adjust with spaceship transform 779.5
                        newMissile.setAttribute("height", 5);
                        newMissile.setAttribute("width", 5);
                        newMissile.setAttribute("fill", "red");
                        missilesContainer.appendChild(newMissile);
                        // Add the new missile to the activeMissiles array
                        activeMissiles.push(newMissile);
    
                        // Move the missile forward until it goes out of the viewport or hits an enemy or a meteor
                        function moveMissiles() {
                            activeMissiles.forEach((missile, index) => {
                                let missileY = parseInt(missile.getAttribute("x"));
                                missileY += 10;
                                missile.setAttribute("x", missileY);

                                // Get the bounding rectangle of the missile
                                const missileBoundary = missile.getBoundingClientRect();

                                // Check for collisions with enemies
                                for (let i = 0; i < enemies.length; i++) {
                                    const enemy = enemies[i];
                                    const enemyBoundary = enemy.getBoundingClientRect();

                                    if (
                                        missileBoundary.left < enemyBoundary.right &&
                                        missileBoundary.right > enemyBoundary.left &&
                                        missileBoundary.top < enemyBoundary.bottom &&
                                        missileBoundary.bottom > enemyBoundary.top
                                    ) {
                                        // Collision occurred with enemy
                                        count++;
                                        console.log('You shot ' + count + " enemies");
                                        isEnemyHit = true; 
                                        // Remove the specific enemy that was hit
                                        enemy.remove();
                                        // Handle the collision with the enemy here
                                        // You may want to do additional actions when an enemy is hit
                                        
                                    }
                                }
    
                                // Check for collisions with enemies and meteors
                                // Remove the enemy or meteor if hit by a missile
    
                                // If the missile goes out of the viewport, remove it from the container and activeMissiles array
                                if (missileY >= 1920) {
                                    missilesContainer.removeChild(missile);
                                    activeMissiles.splice(index, 1);
                                }
                            });
    
                            // Keep moving the missiles until there are no active missiles left
                            if (activeMissiles.length > 0) {
                                requestAnimationFrame(moveMissiles);
                            } else {
                                isShooting = false; // Reset isShooting so that we can shoot again
                            }
                        }
    
                        // Start moving the missiles
                        requestAnimationFrame(moveMissiles);
                    }
                });
            }
            
            shootMissiles();
           // playerDirection();  removed since it's better to handle the player's movement continuously using the event listener for better control 
            
    }
        
    
    checkCollision();   
}

        
        // 4. Define function collision():
function checkCollision(){
    isCollided = false;
    const spaceshipBoundary = spaceship.getBoundingClientRect();
    // Check for collisions with enemies
    for (let i = 0; i < enemies.length; i++) {
        const enemy = enemies[i];
        const enemyBoundary = enemy.getBoundingClientRect();

        if (
            spaceshipBoundary.left < enemyBoundary.right &&
            spaceshipBoundary.right > enemyBoundary.left &&
            spaceshipBoundary.top < enemyBoundary.bottom &&
            spaceshipBoundary.bottom > enemyBoundary.top
        ) {
            // Collision occurred with enemy
            console.log(`Collision detected with enemy ${i + 1}`);
            isCollided = true;
            //break; // No need to check other enemies if collision detected
            reset();
            
        }

     //moved the missile collision in the missile function since it is only called in that function
    }

    // Check for collisions with meteors
    for (let j = 0; j < meteors.length; j++) {
        const meteor = meteors[j];
        const meteorBoundary = meteor.getBoundingClientRect();

        if (
            spaceshipBoundary.left < meteorBoundary.right &&
            spaceshipBoundary.right > meteorBoundary.left &&
            spaceshipBoundary.top < meteorBoundary.bottom &&
            spaceshipBoundary.bottom > meteorBoundary.top
        ) {
            // Collision occurred with meteor
            console.log(`Collision detected with meteor ${j + 1}`);
            isCollided = true;
            //break; // No need to check other meteors if collision detected
          reset();
        }
    }
    
}

// Define the scenery function to handle background movement and enemy/meteor animation
function scenery() {
    let speed = 2;

    // If spaceship is not hit already and is playing:
    if (!isCollided && isPlaying) {
        
        // Initial settings
        //hideMissiles();

        // Move the background
        x = parseInt(background.getAttribute("x"))- 2; //tuple1 = parseInt(tuple1 || 0) - 2; wouldn't work on here
        background.setAttribute("x", x + "px");
        

        // Move enemies
        //had to include  y="0" to enemy image for posirion in HTML
        enemies.forEach(enemy => {// had to change x to y for direction. not sure if it was because i rotated in illustrator
            y = parseFloat(enemy.getAttribute('y')) - 4;//speed is different with speed as the value
            enemy.setAttribute('y', y + 'px');
        });        

        // Move meteors
        meteors.forEach(meteor => {
            x = parseFloat(meteor.getAttribute('x')) - speed;
            meteor.setAttribute('x', x + 'px');
        });

    //backgrounds.setAttribute("x", speed + "px");
    requestAnimationFrame(scenery);
    //Direction of background, meteors, and enemies move to the left.



    }
}


document.addEventListener("keydown", (event) => {
    const key = event.key;
    playerDirection(key);
    });

    function reset() {
        // Reset spaceship position
        spaceshipX = 0;
        spaceshipY = 0;
        spaceship.setAttribute("x", spaceshipX + "px");
        spaceship.setAttribute("y", spaceshipY + "px");
        background.setAttribute("x","0");
    
        // Reset enemies position
        enemies.forEach(enemy => {
            enemy.setAttribute("y", "-4");
        });
    
        // Reset meteors position
        const xPositions = [3576.5, 4225.5, 5892.5]; // You can customize the x-positions for each meteor
        meteors.forEach((meteor, index) => {
            // Check if the index exists in the xPositions array, if not, use the default position 0
            const xPosition = xPositions[index]; // !== undefined ? xPositions[index] : 0 was added but thought it was redundant
        
            // Set the x-position for each meteor
            meteor.setAttribute("x", xPosition.toString());
        });
        
    
        // Clear any existing missiles
        missilesContainer.innerHTML = "";
        activeMissiles = [];
    
        // Reset game state
        isPlaying = true;
        isCollided = false;
        count = 0;
        tryAgain.style.display = "block";
        const displayTryAgain = setTimeout(() => {
            tryAgain.style.display = "none";
        }, 1000);
    }
   
  
    finished = () => {
        const targetXPosition = -11000;
    
        const checkPosition = () => {
            // Parse the x attribute as an integer before comparison
            const xPosition = parseInt(background.getAttribute("x"));
    
            if (xPosition <= targetXPosition) {
                // Do something when the x attribute is equal to the target value
               alert("You have finished!. You shot down " + count + " ememies!" );
                isPlaying = false; // Pause the game by setting isPlaying to false
                clearInterval(intervalId); // Clear the interval to stop the game loop
                reset();
            }
        };
    
        // Check the position initially
        checkPosition();
    
       // Set up the interval to check the position continuously
        const intervalId = setInterval(checkPosition, 100); // Check every 100 milliseconds (adjust the interval as needed)
    }
    
   // if (background.getAttribute("x") <= "-10") {
       //wouldn't work this way

    

// 6. Define function gameloop():
function gameloop() {

player1();
scenery();
checkCollision();
finished();
}

alert("Welcome to Duane's Invader!\nTo play,\n\n'w' is up!\n's' is down!\n'a' is left!\n'd' is right!\n'k' is to shoot!\n\nGood Luck!");
// 7. Call function gameloop()
gameloop();
    