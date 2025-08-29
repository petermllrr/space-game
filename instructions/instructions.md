# Space game

## Purpose

A retro style space game. It's singleplayer and realized in a console-like graphic style. You control a tiny spacecraft top down, try to avoid asteroids and shoot other spacecraft.

## Use cases

### Start game and enter name

1. **User** opens website and is greeted with a dialog where they can enter their name. User presses "Start" button.
2. **System**
    1. Shows the game, spacecraft in the center. The camera follows the spacecraft, which is always centered in the screen.
    2. The whole screen is filled with space. Asteroids are floating around. Occasionally, an enemy spacecraft spawns. Only 2 max.
    2. In the corner of the screen is a tutorial which shows the controls and the game's goals
    3. A highscore table is shown in the corner of the screen
    4. There is an "End game" button below the highscore table
    5. The player's spacecraft starts with a tiny bit forward inertia, so it's not standing completely still

### Control spacecraft

1. **User** presses arrow keys
2. **System** controls the spacecraft
    - Up arrow -> Spacecraft accelerates in the direction of it's nose. There is a max speed.
    - Down arrow -> Spacecraft slows down.
    - Left-right arrows -> Spacecraft rotates left/right.

### Avoid asteroids

1. **User** collides with an asteroid
2. **System**
    1. Shows an explosion animation
    2. Removes the player's ship from the game
    3. Enters the players current score into the highscore table
    4. Shows a dialog with the players highscore and a button "Play again"

### Shoot other spacecraft

1. **User** shoots enemy spacecraft
2. **System**
    1. Shows an explosion animation for the enemy spacecraft and removes it from the game
    2. Player score is incremented by 10

## Visual style

- Top down
- Early retro game style.
- If possible, use unicode characters to render UI. However, don't use a system font to render it, so it's consistent across platforms.