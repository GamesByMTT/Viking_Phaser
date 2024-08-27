import { Scene, GameObjects, Scale } from 'phaser';
import { Slots } from '../scripts/Slots';
import { UiContainer } from '../scripts/UiContainer';
import { LineGenerator, Lines } from '../scripts/Lines';
import { UiPopups } from '../scripts/UiPopup';
import LineSymbols from '../scripts/LineSymbols';
import { Globals, ResultData, currentGameData, initData } from '../scripts/Globals';

export default class MainScene extends Scene {
    slot!: Slots;
    slotFrame!: Phaser.GameObjects.Sprite;
    stairs!: Phaser.GameObjects.Sprite;
    reelBg!: Phaser.GameObjects.Sprite
    columnleft!: Phaser.GameObjects.Sprite
    columnRight!: Phaser.GameObjects.Sprite
    roofTop!: Phaser.GameObjects.Sprite
    snow!: Phaser.GameObjects.Sprite  
    lineGenerator!: LineGenerator;
    uiContainer!: UiContainer;
    uiPopups!: UiPopups;
    lineSymbols!: LineSymbols
    private mainContainer!: Phaser.GameObjects.Container;
    fireSprite!: Phaser.GameObjects.Sprite;

    constructor() {
        super({ key: 'MainScene' });
    }
    /**
     * @method create method used to create scene and add graphics respective to the x and y coordinates
     */
    create() {
        // Set up the background
        const { width, height } = this.cameras.main;
        // Initialize main container
        this.mainContainer = this.add.container();

        // Set up the stairs frame
        this.stairs = new Phaser.GameObjects.Sprite(this, width/2, height/1.08, 'stairs').setDepth(0)
        this.reelBg = new Phaser.GameObjects.Sprite(this, width/2, height/2.2, 'reelBg').setDepth(0)
        this.roofTop = new Phaser.GameObjects.Sprite(this, width/2, height * 0.11, 'roof').setDepth(2)
        this.columnleft = new Phaser.GameObjects.Sprite(this, width/4.3, height/2.2, 'column').setDepth(1)
        this.columnRight = new Phaser.GameObjects.Sprite(this, width/1.31, height/2.2, 'column').setDepth(1)
        this.snow = new Phaser.GameObjects.Sprite(this, width/2, height/2.4, 'snow').setScale(0.9, 1)
        
        this.mainContainer.add([this.reelBg, this.roofTop, this.columnleft, this.columnRight, this.snow, this.stairs])

        // Initialize UI Container
        this.uiContainer = new UiContainer(this, () => this.onSpinCallBack());
        this.mainContainer.add(this.uiContainer);
        
        // // Initialize Slots
        this.slot = new Slots(this, this.uiContainer,() => this.onResultCallBack());
        this.mainContainer.add(this.slot);

        // Initialize payLines
        this.lineGenerator = new LineGenerator(this, this.slot.slotSymbols[0][0].symbol.height, this.slot.slotSymbols[0][0].symbol.width).setScale(0.5, 0.4);
        this.mainContainer.add(this.lineGenerator);

        // Initialize UI Popups
        this.uiPopups = new UiPopups(this, this.uiContainer);
        this.mainContainer.add(this.uiPopups)

        // Initialize LineSymbols
        this.lineSymbols = new LineSymbols(this, 10, 12, this.lineGenerator)
        this.mainContainer.add(this.lineSymbols)
    }

    update(time: number, delta: number) {
        this.slot.update(time, delta);
    }

    /**
     * @method onResultCallBack Change Sprite and Lines
     * @description update the spirte of Spin Button after reel spin and emit Lines number to show the line after wiining
     */
    onResultCallBack() {
        this.uiContainer.onSpin(false);
        this.lineGenerator.showLines(ResultData.gameData.linesToEmit);
    }

    /**
     * @method onSpinCallBack Move reel
     * @description on spin button click moves the reel on Seen and hide the lines if there are any
     */
    onSpinCallBack() {
        this.slot.moveReel();
        this.lineGenerator.hideLines();
    }

    /**
     * @method recievedMessage called from MyEmitter
     * @param msgType ResultData
     * @param msgParams any
     * @description this method is used to update the value of textlabels like Balance, winAmount freeSpin which we are reciving after every spin
     */
    recievedMessage(msgType: string, msgParams: any) {
        if (msgType === 'ResultData') {
            this.time.delayedCall(1000, () => {
                console.log(currentGameData, "currentGameData");
                
                this.uiContainer.currentWiningText.updateLabelText(ResultData.playerData.currentWining.toString());
                currentGameData.currentBalance = ResultData.playerData.Balance;
                let betValue = initData.gameData.Bets[currentGameData.currentBetIndex]
                console.log();
                
                this.uiContainer.currentBalanceText.updateLabelText(currentGameData.currentBalance.toFixed(2));
                const freeSpinCount = ResultData.gameData.freeSpins.count;
                // Check if freeSpinCount is greater than 1
                if (freeSpinCount >= 1) {
                    this.uiContainer.freeSpininit(freeSpinCount)
                    // Update the label text
                    this.uiContainer.freeSpinText.updateLabelText(freeSpinCount.toString());
                    // Define the tween animation for Scaling
                    this.tweens.add({
                        targets: this.uiContainer.freeSpinText,
                        scaleX: 1.3, 
                        scaleY: 1.3, 
                        duration: 800, // Duration of the scale effect
                        yoyo: true, 
                        repeat: -1, 
                        ease: 'Sine.easeInOut' // Easing function
                    });
                } else {
                    // If count is 1 or less, ensure text is scaled normally
                    this.uiContainer.freeSpininit(freeSpinCount)
                }
                this.slot.stopTween();
            });
        }
    }
}
