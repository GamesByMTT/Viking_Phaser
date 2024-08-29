import Phaser from "phaser";
import { Globals, TextStyle } from "./Globals";
import { gameConfig } from "./appconfig";
import { TextLabel } from "./TextLabel";
import { UiContainer } from "./UiContainer";
import MainLoader from "../view/MainLoader";
import SoundManager from "./SoundManager";

export class UiPopups extends Phaser.GameObjects.Container {
    SoundManager: SoundManager;
    UiContainer: UiContainer
    menuBtn!: InteractiveBtn;
    settingBtn!: InteractiveBtn;
    rulesBtn!: InteractiveBtn;
    infoBtn!: InteractiveBtn;
    exitBtn!: InteractiveBtn
    yesBtn!: InteractiveBtn;
    noBtn!: InteractiveBtn
    isOpen: boolean = false;
    isExitOpen: boolean = false;
    settingClose!: InteractiveBtn;
    onButton!: InteractiveBtn;
    offButton!:InteractiveBtn;
    toggleBar!: InteractiveBtn;
    soundEnabled: boolean = true; // Track sound state
    normalButtonSound!: Phaser.Sound.BaseSound
    constructor(scene: Phaser.Scene, uiContainer: UiContainer, soundManager: SoundManager) {
        super(scene);
        this.setPosition(0, 0);
        // this.ruleBtnInit();
        this.settingBtnInit();
        this.infoBtnInit();
        this.menuBtnInit();
        this.exitButton();
        this.UiContainer = uiContainer
        this.SoundManager = soundManager
        scene.add.existing(this);
    }

    menuBtnInit() {
        const menuBtnTextures = [
            this.scene.textures.get('MenuBtn'),
            this.scene.textures.get('MenuBtnH')
        ];
        this.menuBtn = new InteractiveBtn(this.scene, menuBtnTextures, () => {
            this.buttonMusic("buttonpressed")
            this.openPopUp();
        }, 0, true);
        this.menuBtn.setPosition( gameConfig.scale.width/ 2 - this.menuBtn.width * 7, gameConfig.scale.height - this.menuBtn.height * 2.3 );
        this.add(this.menuBtn);
    }
    exitButton(){
        const exitButtonSprites = [
            this.scene.textures.get('exitButton'),
            this.scene.textures.get('exitButtonPressed')
        ];
        this.exitBtn = new InteractiveBtn(this.scene, exitButtonSprites, ()=>{
                this.buttonMusic("buttonpressed")
                this.openLogoutPopup();
        }, 0, true, );
        this.exitBtn.setPosition(gameConfig.scale.width - this.exitBtn.width * 0.5, this.exitBtn.height * 0.5).setScale(0.5, 0.5)
        this.add(this.exitBtn)
    }
    
    settingBtnInit() {
        const settingBtnSprites = [
            this.scene.textures.get('settingBtn'),
            this.scene.textures.get('settingBtnH')
        ];
        this.settingBtn = new InteractiveBtn(this.scene, settingBtnSprites, () => {
            this.buttonMusic("buttonpressed")
            // setting Button
            this.openSettingPopup();
        }, 1, false); // Adjusted the position index
        this.settingBtn.setPosition(gameConfig.scale.width/ 2 - this.settingBtn.width * 5, this.settingBtn.height * 0.7);
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
            this.openInfoPopup();
        }, 2, false); // Adjusted the position index
        this.infoBtn.setPosition(gameConfig.scale.width/ 2 - this.infoBtn.width * 5, this.infoBtn.height * 0.7);
        this.add(this.infoBtn);
    }

    openPopUp() {
        // Toggle the isOpen boolean
        this.isOpen = !this.isOpen;
        this.menuBtn.setInteractive(false);
        if (this.isOpen) {
            // this.tweenToPosition(this.rulesBtn, 3);
            this.tweenToPosition(this.infoBtn, 2);
            this.tweenToPosition(this.settingBtn, 1);
        } else {
            // this.tweenBack(this.rulesBtn);
            this.tweenBack(this.infoBtn);
            this.tweenBack(this.settingBtn);
        }
    }

    tweenToPosition(button: InteractiveBtn, index: number) {
        const targetY =  this.menuBtn.y - (index * (this.menuBtn.height))
       // Calculate the Y position with spacing
       button.setPosition(this.menuBtn.x, this.menuBtn.y)
        button.setVisible(true);
        this.scene.tweens.add({
            targets: button,
            y: targetY,
            duration: 300,
            ease: 'Elastic',
            easeParams: [1, 0.9],
            onComplete: () => {
                button.setInteractive(true);
                this.menuBtn.setInteractive(true);
            }
        });
    }
    tweenBack(button: InteractiveBtn) {
        button.setInteractive(false);
        this.scene.tweens.add({
            targets: button,
            y: button,
            duration: 100,
            ease: 'Elastic',
            easeParams: [1, 0.9],
            onComplete: () => {
                button.setVisible(false);
                this.menuBtn.setInteractive(true);
            }
        });
    }
    /**
     * 
     */
    openSettingPopup() {
        const settingblurGraphic = this.scene.add.graphics().setDepth(1); // Set depth lower than popup elements
        settingblurGraphic.fillStyle(0x000000, 0.5); // Black with 50% opacity
        settingblurGraphic.fillRect(0, 0, this.scene.scale.width, this.scene.scale.height); // Cover entire screen

        const infopopupContainer = this.scene.add.container(
            this.scene.scale.width / 2,
            this.scene.scale.height / 2
        ).setDepth(1);
        
        const popupBg = this.scene.add.image(0, 0, 'settingPopup').setDepth(9);
        const soundsImage = this.scene.add.image(-200, -120, 'soundImage').setDepth(10);
        const musicImage = this.scene.add.image(-200, 50, 'musicImage').setDepth(10);

        const toggleBarSprite = [
            this.scene.textures.get('toggleBar'),
            this.scene.textures.get('toggleBar')
        ];
        if(this.soundEnabled){
            
        }
        const initialTexture = this.soundEnabled ? "onButton" : "offButton";
        const onOff = this.scene.add.image(220, -120, initialTexture).setScale(0.5);
        onOff.setInteractive()
        onOff.on('pointerdown', () => {
            this.toggleSound(onOff);
        })

        const toggleMusicBar = this.scene.add.image(200, 50, "toggleBar")
        toggleMusicBar.setScale(0.5)
        const musicinitialTexture = this.soundEnabled ? "onButton" : "offButton";
        const offMusic = this.scene.add.image(220, 50, musicinitialTexture)
        offMusic.setScale(0.5)
        offMusic.setInteractive();
        offMusic.on('pointerdown', () => {
            this.toggleMusic(offMusic)
        })

        this.toggleBar = new InteractiveBtn(this.scene, toggleBarSprite, () => {
            // this.toggleSound();
        }, 0, true).setPosition(200, -120);
        this.toggleBar.setScale(0.5);

        const exitButtonSprites = [
            this.scene.textures.get('exitButton'),
            this.scene.textures.get('exitButtonPressed')
        ];
        this.settingClose = new InteractiveBtn(this.scene, exitButtonSprites, () => {
            infopopupContainer.destroy();
            settingblurGraphic.destroy();
            this.buttonMusic("buttonpressed")
        }, 0, true);
        this.settingClose.setPosition(350, -350).setScale(0.7);

        popupBg.setOrigin(0.5);
        popupBg.setScale(0.8);
        popupBg.setAlpha(1); // Set background transparency

        infopopupContainer.add([popupBg, this.settingClose, soundsImage, musicImage, this.toggleBar, onOff, toggleMusicBar, offMusic]);
    }

    toggleSound(onOff: any) {
        // Toggle sound state
        this.soundEnabled = !this.soundEnabled;
        if (this.soundEnabled) {
            onOff.setTexture('onButton');
            onOff.setPosition(220, -120); // Move position for 'On' state
            this.SoundManager.setSoundEnabled(this.soundEnabled)
            // Logic to turn sound on
            // Globals.soundManager.play("yourSound");
        } else {
            onOff.setTexture('offButton');
            onOff.setPosition(180, -120); // Move position for 'Off' state
            this.SoundManager.setSoundEnabled(this.soundEnabled)
            // Logic to turn sound off
            // Globals.soundManager.stop("yourSound");
        }
    }

    toggleMusic(offMusic: any) {
        // Toggle sound state
        this.soundEnabled = !this.soundEnabled;
        if (this.soundEnabled) {
            offMusic.setTexture('onButton');
            offMusic.setPosition(220, 50); // Move position for 'On' state
            this.SoundManager.setMusicEnabled(this.soundEnabled)

            // Globals.soundManager.play("yourSound");
        } else {
            offMusic.setTexture('offButton');
            this.SoundManager.setMusicEnabled(this.soundEnabled);
            offMusic.setPosition(180, 50); // Move position for 'Off' state
            // Logic to turn sound off
            // Globals.soundManager.stop("yourSound");
        }
    }

    /**
     * @method openinfo
     */

    openInfoPopup() {
        // 1. Create the main popup container
        const popupContainer = this.scene.add.container(0, 0).setDepth(11);
    
        // 2. Add a background to the popup container
        const popupBackground = this.scene.add.sprite(
            gameConfig.scale.width / 2, 
            gameConfig.scale.height / 2, 
            "popupbg"           
        );
        popupBackground.setDisplaySize(1920, 1080)
        popupContainer.add(popupBackground);
    
        // 3. Add a heading image to the popup container
        const headingImage = this.scene.add.image(
            gameConfig.scale.width / 2, 
            gameConfig.scale.height / 2 - 400, 
            'headingImage'
        );
      
        popupContainer.add(headingImage);

         // 8. Add a close button to the popup
         const closeButton = this.scene.add.sprite(
            gameConfig.scale.width / 2 + 800, 
            gameConfig.scale.height / 2 - 400, 
            'exitButton', 
        ).setInteractive();
        closeButton.setScale(0.5)
    
        closeButton.on('pointerdown', () => {
            popupContainer.destroy(); // Destroy the popup when the close button is clicked
            scrollContainer.destroy()
        });
        const scrollBarBg = this.scene.add.sprite(gameConfig.scale.width / 2 + 800, gameConfig.scale.height / 1.9, "scrollBg")
        scrollBarBg.setScale(0.7)
        popupContainer.add([closeButton, scrollBarBg]);

        const scrollContainer = this.scene.add.container(0, 0);
        
        const scrollbarX = 1920;
        const scrollbarY = 50;
        const scrollbarHeight = 600;
        const handleHeight = 100;
        const handleWidth = 20;
       
        const scrollbarHandle = this.scene.add.sprite(gameConfig.scale.width / 2 + 800, gameConfig.scale.height / 2, "scroller");
        scrollbarHandle.setOrigin(0.5)
        const firstImage = this.scene.add.sprite(gameConfig.scale.width / 2, gameConfig.scale.height / 2 - 240, "minorSymbolsHeading");
        const minorSymnol1 = this.scene.add.sprite(gameConfig.scale.width/2 - 500, gameConfig.scale.width /2 - 200, "slots0_0");
        minorSymnol1.setScale(0.5)

        scrollbarHandle.setInteractive(new Phaser.Geom.Rectangle(scrollbarX, scrollbarY, handleWidth, handleHeight), Phaser.Geom.Rectangle.Contains);

        scrollContainer.add([scrollbarHandle, firstImage, minorSymnol1]);


        const maskShape = this.scene.add.graphics();
        // maskShape.fillStyle(0xffffff);
        maskShape.fillRect(
            0, 
            gameConfig.scale.height / 2 - 300, 
            gameConfig.scale.width, gameConfig.scale.height
        );
    
        const mask = maskShape.createGeometryMask();
        scrollContainer.setMask(mask);
    
        // 6. Add the scrollable container to the popup container
        popupContainer.add(scrollContainer);
        
        // 7. Make the scrollContainer scrollable
        this.scene.input.on('pointermove', function (pointer: any) {
            if (pointer.isDown) {
                scrollContainer.y += pointer.velocity.y / 10; // Adjust the divisor for smoother scrolling
            }
        });
    
       
    }

    buttonMusic(key: string){
        this.SoundManager.playSound(key)
    }

    /**
     * @method openLogoutPopup
     * @description creating an container for exitPopup 
     */
    openLogoutPopup() {
        // Create a semi-transparent background for the popup
        const blurGraphic = this.scene.add.graphics().setDepth(1); // Set depth lower than popup elements
        blurGraphic.fillStyle(0x000000, 0.5); // Black with 50% opacity
        blurGraphic.fillRect(0, 0, this.scene.scale.width, this.scene.scale.height); // Cover entire screen
        
        this.UiContainer.onSpin(true);
        // Create a container for the popup
        const popupContainer = this.scene.add.container(
            this.scene.scale.width / 2,
            this.scene.scale.height / 2
        ).setDepth(1); // Set depth higher than blurGraphic
    
        // Popup background image
        const popupBg = this.scene.add.image(0, 0, 'messagePopup').setDepth(10);
        popupBg.setOrigin(0.5);
        popupBg.setDisplaySize(835, 677); // Set the size for your popup background
        popupBg.setAlpha(1); // Set background transparency
        this.exitBtn.disableInteractive();
        // Add text to the popup
        const popupText = new TextLabel(this.scene, 0, -45, "Do you really want \n to exit?", 50, "#6b768b");
        
        // Yes and No buttons
        const logoutButtonSprite = [
            this.scene.textures.get("normalButton"),
            this.scene.textures.get("normalButton")
        ];
        this.yesBtn = new InteractiveBtn(this.scene, logoutButtonSprite, () => {
            
            this.UiContainer.onSpin(false);
            Globals.Socket?.socket.emit("EXIT", {});
            // window.parent.postMessage("onExit", "*");
            popupContainer.destroy();
            blurGraphic.destroy(); // Destroy blurGraphic when popup is closed
        }, 0, true);
    
        this.noBtn = new InteractiveBtn(this.scene, logoutButtonSprite, () => {
            
            this.UiContainer.onSpin(false);
            this.exitBtn.setInteractive()
            // this.exitBtn.setTexture("normalButton");
            popupContainer.destroy();
            blurGraphic.destroy(); // Destroy blurGraphic when popup is closed
        }, 0, true);
       
        this.yesBtn.setPosition(-130, 80).setScale(0.5, 0.5);
        this.noBtn.setPosition(130, 80).setScale(0.5, 0.5);;
        // Button labels
        const noText = new TextLabel(this.scene, 130, 75, "No", 30, "#ffffff");
        const yesText = new TextLabel(this.scene, -130, 75, "Yes", 30, "#ffffff");
        // Add all elements to popupContainer
        popupContainer.add([popupBg, popupText, this.yesBtn, this.noBtn, yesText, noText]);
        // Add popupContainer to the scene
        this.scene.add.existing(popupContainer);       
    }
    
    buttonInteraction(press: boolean){
        if(press){
            this.menuBtn.disableInteractive();
            this.settingBtn.disableInteractive()
            this.rulesBtn.disableInteractive();
            this.menuBtn.disableInteractive();
        }
    }
}

class InteractiveBtn extends Phaser.GameObjects.Sprite {
    moveToPosition: number = -1;
    defaultTexture!: Phaser.Textures.Texture;
    hoverTexture!: Phaser.Textures.Texture

    constructor(scene: Phaser.Scene, textures: Phaser.Textures.Texture[], callback: () => void, endPos: number, visible: boolean) {
        super(scene, 0, 0, textures[0].key); // Use texture key
        this.defaultTexture = textures[0];
        this.hoverTexture = textures[1];        
        this.setOrigin(0.5);
        this.setInteractive();
        this.setVisible(visible);
        this.moveToPosition = endPos;
        this.on('pointerdown', () => {
            this.setTexture(this.hoverTexture.key)
            // this.setFrame(1);
            callback();
        });
        this.on('pointerup', () => {
            this.setTexture(this.defaultTexture.key)
            // this.setFrame(0);
        });
        this.on('pointerout', () => {
            this.setTexture(this.defaultTexture.key)
            // this.setFrame(0);
        });
        // Set up animations if necessary
        this.anims.create({
            key: 'hover',
            frames: this.anims.generateFrameNumbers(textures[1].key),
            frameRate: 10,
            repeat: -1
        });
    }
}