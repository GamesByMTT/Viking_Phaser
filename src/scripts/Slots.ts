import Phaser from 'phaser';
import { Globals, ResultData, initData } from "./Globals";
import { gameConfig } from './appconfig';
import { UiContainer } from './UiContainer';
import { Easing, Tween } from "@tweenjs/tween.js"; // If using TWEEN for animations
import SoundManager from './SoundManager';
export class Slots extends Phaser.GameObjects.Container {
    slotMask: Phaser.GameObjects.Graphics;
    SoundManager: SoundManager
    slotSymbols: any[][] = [];
    moveSlots: boolean = false;
    uiContainer!: UiContainer;
    // winingMusic!: Phaser.Sound.BaseSound
    resultCallBack: () => void;
    slotFrame!: Phaser.GameObjects.Sprite;
    private maskWidth: number;
    private maskHeight: number;
    private symbolKeys: string[];
    private symbolWidth: number;
    private symbolHeight: number;
    private spacingX: number;
    private spacingY: number;
    private reelContainers: Phaser.GameObjects.Container[] = [];
    constructor(scene: Phaser.Scene, uiContainer: UiContainer, callback: () => void, SoundManager : SoundManager) {
        super(scene);

        this.resultCallBack = callback;
        this.uiContainer = uiContainer;
        this.SoundManager = SoundManager
        this.slotMask = new Phaser.GameObjects.Graphics(scene);
        
        this.maskWidth = gameConfig.scale.width / 1.8;
        this.maskHeight = 480;
        this.slotMask.fillStyle(0xffffff, 1);
        this.slotMask.fillRoundedRect(0, 0, this.maskWidth, this.maskHeight, 20);
        // mask Position set
        this.slotMask.setPosition(
            gameConfig.scale.width / 4,
            gameConfig.scale.height /4.1 
        );
        // this.add(this.slotMask);
        // Filter and pick symbol keys based on the criteria
        this.symbolKeys = this.getFilteredSymbolKeys();
        
        // Assume all symbols have the same width and height
        const exampleSymbol = new Phaser.GameObjects.Sprite(scene, 0, 0, this.getRandomSymbolKey());
        this.symbolWidth = exampleSymbol.displayWidth/ 4;
        this.symbolHeight = exampleSymbol.displayHeight/4;
        this.spacingX = this.symbolWidth * 1.9; // Add some spacing
        this.spacingY = this.symbolHeight * 1.8; // Add some spacing
        const startPos = {
            x: gameConfig.scale.width / 3.1,
            y: gameConfig.scale.height /3.25     
        };
        const totalSymbol = 8;
        const visibleSymbol = 3;
        const startIndex = 1;
        const initialYOffset = (totalSymbol - startIndex - visibleSymbol) * this.spacingY;
        console.log(initialYOffset, "initialYOffset");
        
        for (let i = 0; i < 5; i++) { // 5 columns
            const reelContainer = new Phaser.GameObjects.Container(scene);
            this.reelContainers.push(reelContainer); // Store the container for future use
            
            this.slotSymbols[i] = [];
            for (let j = 0; j < 28; j++) { // 3 rows
                let symbolKey = this.getRandomSymbolKey(); // Get a random symbol key
                let slot = new Symbols(scene, symbolKey, { x: i, y: j }, reelContainer);
                slot.symbol.setMask(new Phaser.Display.Masks.GeometryMask(scene, this.slotMask));
                slot.symbol.setPosition(
                    startPos.x + i * this.spacingX,
                    startPos.y + j * this.spacingY
                );
                slot.symbol.setScale(0.45, 0.45)
                slot.startX = slot.symbol.x;
                slot.startY = slot.symbol.y;
                this.slotSymbols[i].push(slot);
                reelContainer.add(slot.symbol)
            }
            
            
            reelContainer.setPosition(reelContainer.x, -initialYOffset + 20);
            this.add(reelContainer); 
        }
    }

    getFilteredSymbolKeys(): string[] {
        // Filter symbols based on the pattern
        const allSprites = Globals.resources;
        const filteredSprites = Object.keys(allSprites).filter(spriteName => {
            const regex = /^slots\d+_\d+$/; // Regex to match "slots<number>_<number>"
            if (regex.test(spriteName)) {
                const [, num1, num2] = spriteName.match(/^slots(\d+)_(\d+)$/) || [];
                const number1 = parseInt(num1, 10);
                const number2 = parseInt(num2, 10);
                // Check if the numbers are within the desired range
                return number1 >= 1 && number1 <= 14 && number2 >= 1 && number2 <= 14;
            }
            return false;
        });

        return filteredSprites;
    }

    getRandomSymbolKey(): string {
        const randomIndex = Phaser.Math.Between(0, this.symbolKeys.length - 1);        
        return this.symbolKeys[randomIndex];
    }

    moveReel() {    
        const initialYOffset = (this.slotSymbols[0][0].totalSymbol - this.slotSymbols[0][0].visibleSymbol - this.slotSymbols[0][0].startIndex) * this.slotSymbols[0][0].spacingY;
        setTimeout(() => {
            for (let i = 0; i < this.reelContainers.length; i++) {
                this.reelContainers[i].setPosition(
                    this.reelContainers[i].x,
                    -initialYOffset // Set the reel's position back to the calculated start position
                );
            }    
        }, 100);
         
        for (let i = 0; i < this.reelContainers.length; i++) {
            for (let j = 0; j < this.reelContainers[i].list.length; j++) {
                // setTimeout(() => {
                    this.slotSymbols[i][j].startMoving = true;
                    if (j < 3) this.slotSymbols[i][j].stopAnimation();
                // }, 100 * i);
            }
        }
        this.uiContainer.maxbetBtn.disableInteractive();
        this.moveSlots = true;
    }

    update(time: number, delta: number) {
        
        if (this.slotSymbols && this.moveSlots) {
            for (let i = 0; i < this.reelContainers.length; i++) {
                // Update the position of the entire reel container (move the reel upwards)
                for (let j = 0; j < this.slotSymbols[i].length; j++) {
                    // Update each symbol in the reel
                    this.slotSymbols[i][j].update(delta);
                }
            }
          
        }
    }

    stopTween() {
        // Calculate the maximum delay for stopping the reels
        const maxDelay = 200 * (this.reelContainers.length - 1);
    
        // Call resultCallBack after all tweens finish
        setTimeout(() => {
            this.resultCallBack();
            this.moveSlots = false;
    
            ResultData.gameData.symbolsToEmit.forEach((rowArray: any) => {
                rowArray.forEach((row: any) => {
                    if (typeof row === "string") {
                        const [y, x]: number[] = row.split(",").map((value) => parseInt(value));
                        const animationId = `symbol_anim_${ResultData.gameData.ResultReel[x][y]}`;
                        if (this.slotSymbols[y] && this.slotSymbols[y][x]) {
                            this.winMusic("winMusic");
                            this.slotSymbols[y][x].playAnimation(animationId);
                        }
                    }
                });
            });
        }, maxDelay + 100); // Ensure resultCallBack is called after all reels stop
    
        // Iterate over reelContainers and stop them with a delay
        for (let i = 0; i < this.reelContainers.length; i++) {
            setTimeout(() => {
                this.stopReel(this.reelContainers[i], i);
            }, 100 * i); // Delay each reel stop by 200ms times its index
        }
    }
    
    stopReel(reelContainer: Phaser.GameObjects.Container, reelIndex: number) {
        // Stop the motion of the reelContaine
        this.scene.tweens.add({
            targets: this.slotSymbols,
            y: 0, // Move reel container to its final position
            ease: 'Bounce.easeIn', // Use the bounce easing for the effect
            duration: 100, // Duration of the bounce effect
            repeat: 1,
            yoyo: true,
            onComplete: () => {
                // this.reelContainer.setPosition(this.reelContainer.x, finalPositionY);
            }
        });
               for (let i = 0; i < this.slotSymbols.length; i++) {
                    for (let j = 0; j < this.slotSymbols[i].length; j++) {
                      setTimeout(() => {
                            this.slotSymbols[i][j].endTween();
                        }, 100 * i);
                    }
                }
            
    
    }
    // winMusic
    winMusic(key: string){
        this.SoundManager.playSound(key)
    }
    
}

// @Sybols CLass
class Symbols {
    symbol: Phaser.GameObjects.Sprite;
    startY: number = 0;
    startX: number = 0;
    startMoving: boolean = false;
    index: { x: number; y: number };
    totalSymbol : number = 14;
    visibleSymbol: number = 3;
    startIndex: number = 1;
    spacingY : number = 204;
    initialYOffset : number = 0
    scene: Phaser.Scene;
    private isMobile: boolean;
    reelContainer: Phaser.GameObjects.Container;
    private bouncingTween: Phaser.Tweens.Tween | null = null;

    constructor(scene: Phaser.Scene, symbolKey: string, index: { x: number; y: number }, reelContainer: Phaser.GameObjects.Container) {
        this.scene = scene;
        this.index = index;
       this.reelContainer = reelContainer;
        const updatedSymbolKey = this.updateKeyToZero(symbolKey)
        this.symbol = new Phaser.GameObjects.Sprite(scene, 0, 0, updatedSymbolKey);
        this.symbol.setOrigin(0.5, 0.5);
        this.isMobile = scene.sys.game.device.os.android || scene.sys.game.device.os.iOS;
        // Load textures and create animation
        const textures: string[] = [];
        for (let i = 0; i < 28; i++) {
            textures.push(`${symbolKey}`);
        }  
        this.scene.anims.create({
            key: `${symbolKey}`,
            frames: textures.map((texture) => ({ key: texture })),
            frameRate: 20,
            repeat: -1,
        });        
    }

    createBounceTween(){
        const finalPositionY = 0;
        if (this.bouncingTween) {
            this.bouncingTween.stop();
        }
        
        // Create a bounce effect for the reelContainer
        this.bouncingTween = this.scene.tweens.add({
            targets: this.reelContainer,
            y: this.reelContainer.height + 20, // Move reelContainer upwards by 20 units
            ease: 'Elastic.easeOut', // Bounce easing function
            duration: 800, // Duration of the bounce effect
            yoyo: true, // Make it bounce back and forth
            repeat: 5, // Repeat once (you can adjust or remove if needed)
            onComplete: () => {
                this.scene.tweens.add({
                    targets: this.reelContainer,
                    y: this.reelContainer.height, 
                })
                // Set the final position of the reelContainer
                this.reelContainer.setPosition(this.reelContainer.x, finalPositionY - 40);
            }
        });
       }
    // to update the slotx_0 to show the 0 index image at the end
    updateKeyToZero(symbolKey: string): string {
        const match = symbolKey.match(/^slots(\d+)_\d+$/);
        if (match) {
            const xValue = match[1];
            return `slots${xValue}_0`;
        } else {
            return symbolKey; // Return the original key if format is incorrect
        }
    }
    playAnimation(animationId: any) {
        this.symbol.play(animationId)
    }
    stopAnimation() {
        this.symbol.anims.stop();
        this.symbol.setFrame(0);
    }
      endTween() {
       
        if (this.index.y < 3) {
            let textureKeys: string[] = [];
            // Retrieve the elementId based on index
            const elementId = ResultData.gameData.ResultReel[this.index.y][this.index.x];
                for (let i = 0; i <28; i++) {
                    const textureKey = `slots${elementId}_${i}`;
                    // Check if the texture exists in cache
                    if (this.scene.textures.exists(textureKey)) {
                        textureKeys.push(textureKey);
                    } 
                }
                // Check if we have texture keys to set
                    if (textureKeys.length > 0) {
                    // Create animation with the collected texture keys
                        this.scene.anims.create({
                            key: `symbol_anim_${elementId}`,
                            frames: textureKeys.map(key => ({ key })),
                            frameRate: 20,
                            repeat: -1
                        });
                    // Set the texture to the first key and start the animation
                        this.symbol.setTexture(textureKeys[0]);               
                    }
        }
        // Stop moving and start tweening the sprite's position
        this.startMoving = false;
        const finalPositionY = 0;
        this.reelContainer.setPosition(this.reelContainer.x, finalPositionY);
    }
    
    update(delta: number) {
        // Update the Y position based on movement speed or delta
        const moveSpeed = 100; // You can adjust this speed value as needed
        if (this.startMoving) {
            // Move the reel container upwards
            this.reelContainer.y += moveSpeed * delta / 1000; // Convert delta to seconds
    
            // Check if the reel container has moved past its upper bound
            if (this.reelContainer.y >= (this.isMobile ? window.innerHeight * 2 : window.innerHeight * 0.2)) {
                 this.reelContainer.y = 0;
            }
            this.createBounceTween()
        }else{
            setTimeout(() => {
                if (this.bouncingTween) {
                    this.bouncingTween.stop();
                }
            }, 500);
            
        }
    }
}
