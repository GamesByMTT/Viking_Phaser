import Phaser, { Scene } from "phaser";
import { Globals, ResultData, currentGameData, initData } from '../scripts/Globals';
export default class BonusScene extends Scene{
    SceneBg!: Phaser.GameObjects.Sprite
    columnLeft!: Phaser.GameObjects.Sprite
    columnRight!: Phaser.GameObjects.Sprite
    roofTop!: Phaser.GameObjects.Sprite
    wheel!: Phaser.GameObjects.Sprite
    Stair!: Phaser.GameObjects.Sprite
    public bonusContainer!: Phaser.GameObjects.Container
    snow!: Phaser.GameObjects.Sprite
    spinWheelBg!: Phaser.GameObjects.Sprite
    spinCircle!: Phaser.GameObjects.Sprite
    spinCenter!: Phaser.GameObjects.Sprite
    startButton!: Phaser.GameObjects.Sprite
    public canSpinBonus: boolean = true;
    constructor() {
        super({ key: 'BonusScene' });
    }
    create(){
        const { width, height } = this.cameras.main;
        this.bonusContainer = this.add.container();
        this.SceneBg = new Phaser.GameObjects.Sprite(this, width/2, height/2, 'Background').setDisplaySize(width, height)
        this.Stair = new Phaser.GameObjects.Sprite(this, width/2, height/1.08, 'stairs').setDepth(0)
        this.columnLeft = new Phaser.GameObjects.Sprite(this, width/4.3, height/2.2, 'column').setDepth(1)
        this.columnRight = new Phaser.GameObjects.Sprite(this, width/1.31, height/2.2, 'column').setDepth(1)
        this.roofTop = new Phaser.GameObjects.Sprite(this, width/2, height * 0.11, 'roof').setDepth(2)
        this.snow = new Phaser.GameObjects.Sprite(this, width/2, height/2.4, 'snow').setScale(0.9, 1)
        this.spinWheelBg = new Phaser.GameObjects.Sprite(this, width/2, height/2, 'wheelBg').setScale(0.9)
        this.spinCircle = new Phaser.GameObjects.Sprite(this, width/2, height/2.2, 'spinCircle')
        this.spinCenter = new Phaser.GameObjects.Sprite(this, width/2, height/2.2, 'spinCenter').setScale(0.7);
        this.startButton = new Phaser.GameObjects.Sprite (this, width/2, height/1.15, 'freeSpinStartButton').setScale(0.7).setInteractive()
        this.bonusContainer.add([ this.SceneBg, this.roofTop, this.snow, this.Stair,  this.startButton, this.columnLeft, this.columnRight, this.spinWheelBg, this.spinCircle, this.spinCenter]);
        this.startButton.on("pointerdown", ()=>{
            console.log(" this.startButton clicked");
            // Globals.SceneHandler?.removeScene("BonusScene");
        })
    }
}

// // the game itself
// var game;
 
// var gameOptions = {
 
//     // slices (prizes) placed in the wheel
//     slices: 8,
 
//     // prize names, starting from 12 o'clock going clockwise
//     slicePrizes: ["A KEY!!!", "50 STARS", "500 STARS", "BAD LUCK!!!", "200 STARS", "100 STARS", "150 STARS", "BAD LUCK!!!"],
 
//     // wheel rotation duration, in milliseconds
//     rotationTime: 3000
// }
 
// // once the window loads...
// window.onload = function() {
 
//     // game configuration object
//     var gameConfig = {
 
//         // render type
//        type: Phaser.CANVAS,
 
//        // game width, in pixels
//        width: 550,
 
//        // game height, in pixels
//        height: 550,
 
//        // game background color
//        backgroundColor: 0x880044,
 
//        // scenes used by the game
//        scene: [playGame]
//     };
 
//     // game constructor
//     game = new Phaser.Game(gameConfig);
 
//     // pure javascript to give focus to the page/frame and scale the game
//     window.focus()
//     resize();
//     window.addEventListener("resize", resize, false);
// }
 
// // PlayGame scene
// class playGame extends Phaser.Scene{
 
//     // constructor
//     constructor(){
//         super("PlayGame");
//     }
 
//     // method to be executed when the scene preloads
//     preload(){
 
//         // loading assets
//         this.load.image("wheel", "wheel.png");
//         this.load.image("pin", "pin.png");
//     }
 
//     // method to be executed once the scene has been created
//     create(){
 
//         // adding the wheel in the middle of the canvas
//         this.wheel = this.add.sprite(game.config.width / 2, game.config.height / 2, "wheel");
 
//         // adding the pin in the middle of the canvas
//         this.pin = this.add.sprite(game.config.width / 2, game.config.height / 2, "pin");
 
//         // adding the text field
//         this.prizeText = this.add.text(game.config.width / 2, game.config.height - 20, "Spin the wheel", {
//             font: "bold 32px Arial",
//             align: "center",
//             color: "white"
//         });
 
//         // center the text
//         this.prizeText.setOrigin(0.5);
 
//         // the game has just started = we can spin the wheel
//         this.canSpin = true;
 
//         // waiting for your input, then calling "spinWheel" function
//         this.input.on("pointerdown", this.spinWheel, this);
//     }
 
//     // function to spin the wheel
    // spinWheel(){
 
    //     // can we spin the wheel?
    //     if(this.canSpin){
 
    //         // resetting text field
    //         this.prizeText.setText("");
 
    //         // the wheel will spin round from 2 to 4 times. This is just coreography
    //         var rounds = Phaser.Math.Between(2, 4);
 
    //         // then will rotate by a random number from 0 to 360 degrees. This is the actual spin
    //         var degrees = Phaser.Math.Between(0, 360);
 
    //         // before the wheel ends spinning, we already know the prize according to "degrees" rotation and the number of slices
    //         var prize = gameOptions.slices - 1 - Math.floor(degrees / (360 / gameOptions.slices));
 
    //         // now the wheel cannot spin because it's already spinning
    //         this.canSpin = false;
 
    //         // animation tweeen for the spin: duration 3s, will rotate by (360 * rounds + degrees) degrees
    //         // the quadratic easing will simulate friction
    //         this.tweens.add({
 
    //             // adding the wheel to tween targets
    //             targets: [this.wheel],
 
    //             // angle destination
    //             angle: 360 * rounds + degrees,
 
    //             // tween duration
    //             duration: gameOptions.rotationTime,
 
    //             // tween easing
    //             ease: "Cubic.easeOut",
 
    //             // callback scope
    //             callbackScope: this,
 
    //             // function to be executed once the tween has been completed
    //             onComplete: function(tween){
 
    //                 // displaying prize text
    //                 this.prizeText.setText(gameOptions.slicePrizes[prize]);
 
    //                 // player can spin again
    //                 this.canSpin = true;
    //             }
    //         });
    //     }
    // }
// }
 
// // pure javascript to scale the game
// function resize() {
//     var canvas = document.querySelector("canvas");
//     var windowWidth = window.innerWidth;
//     var windowHeight = window.innerHeight;
//     var windowRatio = windowWidth / windowHeight;
//     var gameRatio = game.config.width / game.config.height;
//     if(windowRatio < gameRatio){
//         canvas.style.width = windowWidth + "px";
//         canvas.style.height = (windowWidth / gameRatio) + "px";
//     }
//     else{
//         canvas.style.width = (windowHeight * gameRatio) + "px";
//         canvas.style.height = windowHeight + "px";
//     }
// }