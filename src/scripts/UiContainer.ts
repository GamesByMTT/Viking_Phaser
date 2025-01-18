import Phaser from 'phaser';
import { Scene, GameObjects, Types } from 'phaser';
import { Globals, ResultData, currentGameData, initData } from './Globals';
import { TextLabel } from './TextLabel';
import { gameConfig } from './appconfig';
import MainScene from '../view/MainScene';
import SoundManager from './SoundManager';
import { PopupManager } from './PopupManager';
import { InteractiveBtn } from './InteractiveBtn';
// Define UiContainer as a Phaser Scene class
export class UiContainer extends Phaser.GameObjects.Container {
    SoundManager: SoundManager
    
    popupManager: PopupManager
    spinBtn!: Phaser.GameObjects.Sprite;
    maxbetBtn!: Phaser.GameObjects.Sprite;
    autoBetBtn!: Phaser.GameObjects.Sprite;
    freeSpinBgImg!: Phaser.GameObjects.Sprite
    fireAnimation: Phaser.GameObjects.Sprite[] = [];
    CurrentBetText!: TextLabel;
    currentWiningText!: TextLabel;
    currentBalanceText!: TextLabel;
    CurrentLineText!: TextLabel;
    freeSpinText!: TextLabel;
    pBtn!: Phaser.GameObjects.Sprite;
    mBtn!: Phaser.GameObjects.Sprite
    public isAutoSpinning: boolean = false; // Flag to track if auto-spin is active
    mainScene!: Phaser.Scene
    fireSprite1!: Phaser.GameObjects.Sprite
    fireSprite2!: Phaser.GameObjects.Sprite
    betButtonDisable!: Phaser.GameObjects.Container
    freeSpinContainer!: Phaser.GameObjects.Container
    spinButtonSound!: Phaser.Sound.BaseSound
    normalButtonSound!: Phaser.Sound.BaseSound
    exitBtn!: Phaser.GameObjects.Sprite
    settingBtn!: InteractiveBtn;
    infoBtn!: InteractiveBtn;
    public isSpinning: boolean = false
    turboSprite!: Phaser.GameObjects.Sprite;
    turboMode: boolean = false
    turboAnimation: Phaser.Types.Animations.AnimationFrame[] = []

    constructor(scene: Scene, spinCallBack: () => void, soundManager: SoundManager) {
        super(scene);
        this.popupManager = new PopupManager(scene)
        scene.add.existing(this); 
        this.isSpinning = false
        // Initialize UI elements
        this.maxBetInit();
        this.autoSpinBtnInit(spinCallBack);
        this.spinBtnInit(spinCallBack);
       
        this.lineBtnInit();
        this.winBtnInit();
        this.balanceBtnInit();
        this.BetBtnInit();
        this.settingBtnInit();
        this.infoBtnInit();
        this.exitButton();
        this.turboButton()
        this.SoundManager = soundManager;
        this.scene.events.on("freeSpin", () => this.freeSpinStart(spinCallBack), this)
        this.scene.events.on("updateWin", this.updateData, this)
        // this.freeSpininit();
        // this.vaseInit();
    }

     //turbo Button
     turboButton(){
        const container = this.scene.add.container(gameConfig.scale.width * 0.85, gameConfig.scale.height * 0.68)
        this.turboSprite = this.scene.add.sprite(0, 0, "turboButton").setOrigin(0.5).setScale(0.5).setInteractive()
       
        this.turboSprite.on("pointerdown", ()=>{
            this.turboSprite.setScale(0.55)
            this.addFrames()
            currentGameData.turboMode = !currentGameData.turboMode
            if(currentGameData.turboMode){
                this.turboSprite.play('turboSpin')
            }else{
                this.turboSprite.stop()
                this.turboAnimation = []
                this.turboSprite.setTexture('turboButton')
            }
        })
        this.turboSprite.on("pointerup", ()=>{
            this.turboSprite.setScale(0.58)
        })
        container.add([this.turboSprite])
    }
    addFrames(){
        for(let p = 0; p < 30; p++){
            this.turboAnimation.push({key: `turboSpin${p}`});
        }
        this.scene.anims.create({
            key: 'turboSpin',
            frames: this.turboAnimation,
            frameRate: 40,
            repeat: -1
        })
    }

    /**
     * @method lineBtnInit Shows the number of lines for example 1 to 20
     */
    lineBtnInit() { 
        const container = this.scene.add.container(gameConfig.scale.width/5.1, this.maxbetBtn.y);
        // const lineText = new TextLabel(this.scene, -20, -70, "LINES", 30, "#3C2625");
        const linePanel = this.scene.add.sprite(0, 0, "lines").setOrigin(0.5);
        // container.add(lineText);
        this.pBtn = this.createButton('pBtn', 90, 3, () => {
            this.bnuttonMusic("buttonpressed");
            this.pBtn.setTexture('pBtnH');
            this.pBtn.disableInteractive();
            if (!currentGameData.isMoving) {
                currentGameData.currentBetIndex++;
                if (currentGameData.currentBetIndex >= initData.gameData.Bets.length) {
                    currentGameData.currentBetIndex = 0;
                }
                const betAmount = initData.gameData.Bets[currentGameData.currentBetIndex];
                const updatedBetAmount = betAmount * 20;
                this.CurrentLineText.updateLabelText(betAmount);
                this.CurrentBetText.updateLabelText(updatedBetAmount.toString());
            }
            this.scene.time.delayedCall(200, () => {
                this.pBtn.setTexture('pBtn');
                this.pBtn.setInteractive({ useHandCursor: true, pixelPerfect: true });
            });
        });
        this.mBtn = this.createButton('mBtn', -95, 3, () => {
            this.bnuttonMusic("buttonpressed");
            this.mBtn.setTexture('mBtnH');
            this.mBtn.disableInteractive();
            if (!currentGameData.isMoving) {
                currentGameData.currentBetIndex++;
                if (currentGameData.currentBetIndex >= initData.gameData.Bets.length) {
                    currentGameData.currentBetIndex = 0;
                }
                const betAmount = initData.gameData.Bets[currentGameData.currentBetIndex];
                const updatedBetAmount = betAmount * 20;
                this.CurrentLineText.updateLabelText(betAmount);
                this.CurrentBetText.updateLabelText(updatedBetAmount.toString());
            }
            this.scene.time.delayedCall(200, () => {
                this.mBtn.setTexture('mBtn');
                this.mBtn.setInteractive({ useHandCursor: true, pixelPerfect: true });
            });
        });
        this.CurrentLineText = new TextLabel(this.scene, 0, 10, initData.gameData.Bets[currentGameData.currentBetIndex], 27, "#ffffff");
        //Line Count
        container.add([linePanel, this.pBtn, this.mBtn, this.CurrentLineText])
    }

    /**
     * @method winBtnInit add sprite and text
     * @description add the sprite/Placeholder and text for winning amount 
     */
    winBtnInit() {
        const winPanel = this.scene.add.sprite(0, 0, 'winPanel');
        winPanel.setOrigin(0.5);
        // winPanel.setScale(0.8, 0.8)
        winPanel.setPosition(gameConfig.scale.width/1.50, this.maxbetBtn.y);
        const currentWining: any = ResultData.playerData.currentWining;
       
        this.currentWiningText = new TextLabel(this.scene, 0, 7, currentWining, 27, "#FFFFFF");
        const winPanelChild = this.scene.add.container(winPanel.x, winPanel.y)
        winPanelChild.add(this.currentWiningText);
        if(currentWining > 0){
            console.log(currentWining, "currentWining");
            this.scene.tweens.add({
                targets:  this.currentWiningText,
                scaleX: 1.3, 
                scaleY: 1.3, 
                duration: 800, // Duration of the scale effect
                yoyo: true, 
                repeat: -1, 
                ease: 'Sine.easeInOut' // Easing function
            });
        }
    }
    /**
     * @method balanceBtnInit Remaning balance after bet (total)
     * @description added the sprite/placeholder and Text for Total Balance 
     */
    balanceBtnInit() {
        const balancePanel = this.scene.add.sprite(0, 0, 'balancePanel');
        balancePanel.setOrigin(0.5);
        balancePanel.setPosition(gameConfig.scale.width / 1.27, this.maxbetBtn.y);
        const container = this.scene.add.container(balancePanel.x, balancePanel.y);
        // container.add(balancePanel);
        currentGameData.currentBalance = initData.playerData.Balance;
        this.currentBalanceText = new TextLabel(this.scene, 0, 7, currentGameData.currentBalance.toFixed(3), 27, "#ffffff");
        container.add(this.currentBalanceText);
    }
/**
     * @method spinBtnInit Spin the reel
     * @description this method is used for creating and spin button and on button click the a SPIn emit will be triggered to socket and will deduct the amout according to the bet
     */
    spinBtnInit(spinCallBack: () => void) {
        this.spinBtn = new Phaser.GameObjects.Sprite(this.scene, 0, 0, "spinBtn");
        this.spinBtn = this.createButton('spinBtn', gameConfig.scale.width / 2, gameConfig.scale.height - this.spinBtn.height/1.1, () => {
            if(ResultData.playerData.Balance < initData.gameData.Bets[currentGameData.currentBetIndex]){
                this.lowBalancePopup();
                return
            }
            // this.spinButtonSound.play();
                this.bnuttonMusic("spinButton");
            // checking if autoSpining is working or not if it is auto Spining then stop it
            if(currentGameData.isAutoSpin){
                currentGameData.isAutoSpin = !currentGameData.isAutoSpin
                return;
            }
            const balance = parseFloat(this.currentBalanceText.text);
            const balanceendValue = balance - (initData.gameData.Bets[currentGameData.currentBetIndex] * initData.gameData.Lines.length);
            // Create the tween
            this.scene.tweens.add({
                targets: { value: balance },
                value: balanceendValue,
                duration: 500, // Duration in milliseconds
                ease: 'Linear',
                onUpdate: (tween) => {
                    // Update the text during the tween
                    const currentBalance = tween.getValue();
                    this.currentBalanceText.updateLabelText(currentBalance.toFixed(3).toString());
                },
                onComplete: () => {
                    // Ensure final value is exact
                    this.currentBalanceText.updateLabelText(balanceendValue.toFixed(3).toString());
                }
            });
        // tween added to scale transition
            this.scene.tweens.add({
                targets: this.spinBtn,
                scaleX: 1.1,
                scaleY: 1.1,
                duration: 100,
                onComplete: () => {
                    this.startSpining(spinCallBack)
                    // Scale back to original size 
                    this.scene.tweens.add({
                        targets: this.spinBtn,
                        scaleX: 1,
                        scaleY: 1,
                        duration: 100,
                        onComplete: () => {
                            
                        }
                    });
                    // 
                }
            });
        });

    }

    startSpining(spinCallBack: () => void){
        this.isSpinning = true;
        this.onSpin(true)
        Globals.Socket?.sendMessage("SPIN", { 
                currentBet: currentGameData.currentBetIndex, 
                currentLines: initData.gameData.Lines.length, 
                spins: 1 
        });
        spinCallBack();
        // Reset the flag after some time or when spin completes
        setTimeout(() => {
            this.isSpinning = false;
        }, 1200); // Adjust timeout as needed
    }

    /**
     * @method maxBetBtn used to increase the bet amount to maximum
     * @description this method is used to add a spirte button and the button will be used to increase the betamount to maximun example on this we have twenty lines and max bet is 1 so the max bet value will be 1X20 = 20
     */
    maxBetInit() {
        this.maxbetBtn =  new Phaser.GameObjects.Sprite(this.scene, 0, 0, 'maxBetBtn');
        this.maxbetBtn = this.createButton('maxBetBtn', gameConfig.scale.width / 2 - this.maxbetBtn.width / 1.3, gameConfig.scale.height - this.maxbetBtn.height - 25 , () => {
            if (this.SoundManager) {
                this.bnuttonMusic("buttonpressed");
            }
            this.scene.tweens.add({
                targets: this.maxbetBtn,
                scaleX: 1.1,
                scaleY: 1.1,
                duration: 100,
                onComplete: ()=>{
                    this.maxbetBtn.setTexture("maxBetBtOnPressed")
                    this.maxbetBtn.disableInteractive()
                    currentGameData.currentBetIndex = initData.gameData.Bets[initData.gameData.Bets.length - 1];
                    this.CurrentBetText.updateLabelText((currentGameData.currentBetIndex*20).toString());
                    this.CurrentLineText.updateLabelText(initData.gameData.Bets[initData.gameData.Bets.length - 1]);
                    this.scene.tweens.add({
                        targets: this.maxbetBtn,
                        scaleX: 1,
                        scaleY: 1,
                        duration: 100,
                        onComplete: ()=>{
                            this.maxbetBtn.setTexture("maxBetBtn");
                            this.maxbetBtn.setInteractive({ useHandCursor: true, pixelPerfect: true })
                        }
                    })
                    
                }
            })
        
        }).setDepth(0);      
    }


    /**
     * @method autoSpinBtnInit 
     * @param spinCallBack 
     * @description crete and auto spin button and on that spin button click it change the sprite and called a recursive function and update the balance accroding to that
     */
    autoSpinBtnInit(spinCallBack: () => void){
        const container = this.scene.add.container(gameConfig.scale.width * 0.562, gameConfig.scale.height * 0.875,)
        // const outerCircle = this.scene.add.sprite(0, 0, "circleBg").setScale(0.75)
        const autoPlay = [
            this.scene.textures.get("autoSpin"),
            this.scene.textures.get("autoSpin")
        ]
        this.autoBetBtn = new InteractiveBtn(this.scene, autoPlay, ()=>{
            currentGameData.isAutoSpin = !currentGameData.isAutoSpin
            console.log(currentGameData.isAutoSpin, "currentGameData.isAutoSpin");
            
            if(!currentGameData.isAutoSpin){
                this.isSpinning = false
                return
            }else{
                this.buttonMusic("buttonpressed")
                this.freeSpinStart(spinCallBack)
            }
        }, 7, true);
        // const autoPlayText = this.scene.add.text(0, 0, "Auto\nPlay",{fontFamily: "Deutsch", fontSize: "28px", color:"#ffffff", align:"center"}).setOrigin(0.5)
        // this.autoBetBtn.setScale(0.9)
        container.add([this.autoBetBtn]);

    }

    freeSpinStart(spinCallBack: () => void){
        currentGameData.bonusOpen = false
        if(currentGameData.isAutoSpin || ResultData.gameData.freeSpins.count > 0){
            if(ResultData.gameData.freeSpins.count > 0){
                
            }
            this.isSpinning = true;
            this.onSpin(true)
            Globals.Socket?.sendMessage("SPIN", { 
                currentBet: currentGameData.currentBetIndex, 
                currentLines: initData.gameData.Lines.length, 
                spins: 1 
            });
            spinCallBack();
        }
        
            // Reset the flag after some time or when spin completes
        // setTimeout(() => {
        //     this.isSpinning = false;
        // }, 1200); // Adjust timeout as needed
    }
    // autoSpinBtnInit(spinCallBack: () => void) {
    //     this.autoBetBtn = new Phaser.GameObjects.Sprite(this.scene, 0, 0, "autoSpin");
    //     this.autoBetBtn = this.createButton(
    //         'autoSpin',
    //         gameConfig.scale.width / 2 + this.autoBetBtn.width / 1.3,
    //         gameConfig.scale.height - this.autoBetBtn.height - 25,
    //         () => {
    //             this.normalButtonSound = this.scene.sound.add("buttonpressed", {
    //                 loop: false,
    //                 volume: 0.8
    //             })
    //             this.normalButtonSound.play()
    //             this.scene.tweens.add({
    //                 targets: this.autoBetBtn,
    //                 scaleX: 1.2,
    //                 scaleY: 1.2,
    //                 duration: 100,
    //                 onComplete: () =>{
    //                     this.isAutoSpinning = !this.isAutoSpinning; // Toggle auto-spin state
    //                     if (this.isAutoSpinning && currentGameData.currentBalance > 0) {
    //                         if(this.isSpinning){
    //                             this.isSpinning = false
    //                             currentGameData.isAutoSpin = !currentGameData.isAutoSpin
    //                             return
    //                         }else{
    //                             this.buttonMusic("buttonpressed")
    //                             currentGameData.isAutoSpin = !currentGameData.isAutoSpin
    //                             this.freeSpinStart(spinCallBack)
    //                         }
    //                     } else {
    //                         // Stop the spin if auto-spin is turned off
    //                         this.autoSpinRec(false);
    //                     }
    //                     this.scene.tweens.add({
    //                         targets: this.autoBetBtn,
    //                         scaleX: 1,
    //                         scaleY: 1,
    //                         duration: 100,
    //                         onComplete: () => {
    //                             // this.spinBtn.setTexture('spinBtn');
    //                         }
    //                     });
    //                 }
    //             })
    //         }
    //     ).setDepth(0);
    // }

    
    lowBalancePopup(){
        // Create a semi-transparent background for the popup
        const blurGraphic = this.scene.add.graphics().setDepth(1); // Set depth lower than popup elements
        blurGraphic.fillStyle(0x000000, 0.5); // Black with 50% opacity
        blurGraphic.fillRect(0, 0, this.scene.scale.width, this.scene.scale.height); // Cover entire screen
    
        // Create a container for the popup
        const popupContainer = this.scene.add.container(
            this.scene.scale.width / 2,
            this.scene.scale.height / 2
        ).setDepth(1); // Set depth higher than blurGraphic
    
        // Popup background image
        const popupBg = this.scene.add.image(0, 0, 'logoutPop').setDepth(10);
        popupBg.setOrigin(0.5);
        popupBg.setDisplaySize(900, 671); // Set the size for your popup background
        popupBg.setAlpha(1); // Set background transparency
   
        this.exitBtn = this.createButton('exitButton', 420, -310, () => { 
            popupContainer.destroy();
            blurGraphic.destroy(); // Destroy blurGraphic when popup is closed
            this.bnuttonMusic("buttonpressed");
        })
        this.exitBtn.setScale(0.6)
        // Add text to the popup
        const popupText = this.scene.add.text(0, 0, "Your account balance is running low. Please add funds to keep continue.", {color:"#ffffff", fontSize: "40px", fontFamily: 'Digra', align:"center",wordWrap: { width: 600, useAdvancedWrap: true }}).setOrigin(0.5);
      
      
        // Add all elements to popupContainer
        popupContainer.add([popupBg, popupText,this.exitBtn]);
        // Add popupContainer to the scene
        this.scene.add.existing(popupContainer);  
    }

    
    /**
     * @method BetBtnInit 
     * @description this method is used to create the bet Button which will show the totla bet which is placed and also the plus and minus button to increase and decrese the bet value
     */
    BetBtnInit() {
        const container = this.scene.add.container(gameConfig.scale.width / 3.1, this.maxbetBtn.y);
        this.betButtonDisable = container    
        const betPanel = this.scene.add.sprite(0, 0, 'BetPanel').setOrigin(0.5);
        container.add(betPanel);
        this.CurrentBetText = new TextLabel(this.scene, 0, 7, ((initData.gameData.Bets[currentGameData.currentBetIndex]) * 20).toString(), 27, "#FFFFFF").setDepth(6);
        container.add(this.CurrentBetText);
    }

    /**
     * @method freeSpininit 
     * @description this method is used for showing the number of freeSpin value at the top of reels
     */
    // freeSpininit(freeSpinNumber: number){
    //     if(freeSpinNumber == 0){
    //         if(this.freeSpinBgImg){
    //             this.freeSpinBgImg.destroy();
    //             this.freeSpinText.destroy()
    //             this.freeSpinContainer.destroy();
    //         }   
    //     }
    //     if(freeSpinNumber >= 1){
    //         // this.freeSpinContainer = this.scene.add.container(gameConfig.scale.width/2, gameConfig.scale.height*0.15);
    //         // const freeSpinBg = this.scene.add.sprite(this.freeSpinContainer.x, this.freeSpinContainer.y, "").setScale(0.8, 0.5);
    //         // const freeSpinCount = new TextLabel(this.scene, freeSpinBg.x - 20, freeSpinBg.y - 5, "Free Spin : ", 27, "#ffffff");
    //         // this.freeSpinText = new TextLabel(this.scene, freeSpinBg.x + 55, freeSpinBg.y - 5, freeSpinNumber.toString(), 27, "#ffffff")
    //         // this.freeSpinBgImg = freeSpinBg
    //     }else{
           
    //     }
    // }
    /**
     * @method startSpinRecursion
     * @param spinCallBack 
     */
    startSpinRecursion(spinCallBack: () => void) {
        if (this.isAutoSpinning && currentGameData.currentBalance > 0) {
            // this.startFireAnimation();
            // Delay before the next spin
            const delay = currentGameData.isMoving && (ResultData.gameData.symbolsToEmit.length > 0) ? 3000 : 5000;
            this.scene.time.delayedCall(delay, () => {
                if (this.isAutoSpinning && currentGameData.currentBalance >= 0) {
                    Globals.Socket?.sendMessage("SPIN", {
                        currentBet: currentGameData.currentBetIndex,
                        currentLines : 20
                    });
                    currentGameData.currentBalance -= initData.gameData.Bets[currentGameData.currentBetIndex];
                    this.currentBalanceText.updateLabelText(currentGameData.currentBalance.toFixed(2));
                    spinCallBack();
                    // Call the spin recursively
                    this.spinRecursively(spinCallBack);
                }
            });
        }
    }

    spinRecursively(spinCallBack: () => void) {
        if (this.isAutoSpinning) {
            // Perform the spin
            this.autoSpinRec(true);
            if (currentGameData.currentBalance < initData.gameData.Bets[currentGameData.currentBetIndex]) {
                // Stop the spin when a winning condition is met or balance is insufficient
                this.autoSpinRec(false);
                spinCallBack();
            } else {
                // Continue spinning if no winning condition is met and balance is sufficient
                this.startSpinRecursion(spinCallBack);
            }
        }
    }
    
    createButton(key: string, x: number, y: number, callback: () => void): Phaser.GameObjects.Sprite {
        const button = this.scene.add.sprite(x, y, key).setInteractive({ useHandCursor: true, pixelPerfect: true });
        button.on('pointerdown', callback);
        return button;
    }
   
    autoSpinRec(spin: boolean){
        if(spin){
            this.spinBtn.setTexture("spinBtnOnPressed");
            this.autoBetBtn.setTexture("autoSpinOnPressed");
            this.maxbetBtn.disableInteractive();
            this.pBtn.disableInteractive();
            this.mBtn.disableInteractive();
        }else{
            this.spinBtn.setTexture("spinBtn");
            this.autoBetBtn.setTexture("autoSpin");
            this.maxbetBtn.setInteractive({ useHandCursor: true, pixelPerfect: true });
            this.pBtn.setInteractive({ useHandCursor: true, pixelPerfect: true });
            this.mBtn.setInteractive({ useHandCursor: true, pixelPerfect: true });
        }        
    }

    onSpin(spin: boolean) {
        // Handle spin functionality
        if(this.isAutoSpinning){
            return
        }
        if(spin){
            this.spinBtn.disableInteractive();
            this.spinBtn.setTexture("spinBtnOnPressed");
            this.autoBetBtn.setTexture("autoSpinOnPressed");
            this.autoBetBtn.disableInteractive();
            this.maxbetBtn.disableInteractive();
            this.pBtn.disableInteractive();
            this.mBtn.disableInteractive();
            
        }else{
            this.spinBtn.setTexture("spinBtn");
            this.spinBtn.setInteractive({ useHandCursor: true, pixelPerfect: true });
            this.autoBetBtn.setTexture("autoSpin");
            this.autoBetBtn.setInteractive({ useHandCursor: true, pixelPerfect: true });
            this.maxbetBtn.setInteractive({ useHandCursor: true, pixelPerfect: true });
            this.pBtn.setInteractive({ useHandCursor: true, pixelPerfect: true });
            this.mBtn.setInteractive({ useHandCursor: true, pixelPerfect: true });
        }        
    }

    bnuttonMusic(key: string){
        this.SoundManager.playSound(key)
    }
  
    settingBtnInit() {
            const settingBtnSprites = [
                this.scene.textures.get('settingBtn'),
                this.scene.textures.get('settingBtnH')
            ];
            this.settingBtn = new InteractiveBtn(this.scene, settingBtnSprites, () => {
                this.buttonMusic("buttonpressed")
                // setting Button
                this.popupManager.showSettingPopup({})
                // this.openSettingPopup();
            }, 1, true); // Adjusted the position index
            this.settingBtn.setPosition(gameConfig.scale.width * 0.17, gameConfig.scale.height * 0.5);
            this.add(this.settingBtn);
    }

    infoBtnInit() {
            const infoBtnSprites = [
                this.scene.textures.get('infoBtn'),
                this.scene.textures.get('infoBtnH'),
            ];
            this.infoBtn = new InteractiveBtn(this.scene, infoBtnSprites, () => {
                // info button 
                this.buttonMusic("buttonpressed")
                this.popupManager.showInfoPopup({})
                // this.openInfoPopup();
            }, 2, true); // Adjusted the position index
            this.infoBtn.setPosition(gameConfig.scale.width * 0.17, gameConfig.scale.height * 0.65);
            this.add(this.infoBtn);
    }

    exitButton(){
        const exitButtonSprites = [
            this.scene.textures.get('exitButton'),
            this.scene.textures.get('exitButtonPressed')
        ];
        this.exitBtn = new InteractiveBtn(this.scene, exitButtonSprites, ()=>{
                this.buttonMusic("buttonpressed")
                // this.openLogoutPopup();
                this.popupManager.showLogoutPopup({})
        }, 0, true, );
        this.exitBtn.setPosition(gameConfig.scale.width * 0.76, this.exitBtn.height)
        this.add(this.exitBtn)
    }

    updateData(){
        const startValue = parseFloat(this.currentBalanceText.text);
        const endValue = ResultData.playerData.Balance;
        // Create the tween
        this.scene.tweens.add({
            targets: { value: startValue },
            value: endValue,
            duration: 1000, // Duration in milliseconds
            ease: 'Linear',
            onUpdate: (tween) => {
                // Update the text during the tween
                const currentValue = tween.getValue();
                this.currentBalanceText.updateLabelText(currentValue.toFixed(3).toString());
            },
            onComplete: () => {
                this.currentBalanceText.updateLabelText(endValue.toFixed(3).toString());
            }
        });

        //Animation for win Text
        const winStart = parseFloat(this.currentWiningText.text);
        const winendValue = ResultData.playerData.currentWining;
        // Create the tween
        this.scene.tweens.add({
            targets: { value: winStart },
            value: winendValue,
            duration: 500, // Duration in milliseconds
            ease: 'Linear',
            onUpdate: (tween) => {
                // Update the text during the tween
                const currentWinValue = tween.getValue();
                this.currentWiningText.updateLabelText(currentWinValue.toFixed(3).toString());
            },
            onComplete: () => {
                // Ensure final value is exact
                this.currentWiningText.updateLabelText(winendValue.toFixed(3).toString());
            }
        });
       
        if (ResultData.gameData.isBonus) {
            currentGameData.bonusOpen = true;
            this.scene.events.emit("bonusStateChanged", true);
            // this.popupManager.showBonusPopup({
            //     onClose: () => {
            //         currentGameData.bonusOpen = false;
            //         this.scene.events.emit("bonusStateChanged", false);
            //     }
            // });
            this.popupManager.showBonusPopup({
                onClose: () => {
                    currentGameData.bonusOpen = false;
                    this.scene.events.emit("bonusStateChanged", false);
                }
            });
        }
    }

    buttonMusic(key: string){
        this.SoundManager.playSound(key)
    }
}
