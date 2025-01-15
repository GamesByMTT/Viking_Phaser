import Phaser, { Scene } from "phaser";
import { currentGameData, initData, ResultData } from "../Globals";
import { PopupManager } from "../PopupManager";
import SoundManager from "../SoundManager";
import { gameConfig } from "../appconfig";

export class SettingPopup extends Phaser.GameObjects.Container {
    SoundManager: SoundManager
    settingClose!: Phaser.GameObjects.Sprite
    soundEnabled: boolean = true; // Track sound state
    musicEnabled: boolean = true; // Track sound state
    constructor(scene: Scene, data: any) {
        super(scene);
        this.SoundManager = new SoundManager(scene)
        const settingblurGraphic = this.scene.add.graphics().setDepth(1); // Set depth lower than popup elements
        settingblurGraphic.fillStyle(0x000000, 0.5); // Black with 50% opacity
        settingblurGraphic.fillRect(0, 0, this.scene.scale.width, this.scene.scale.height); // Cover entire screen

        // const infopopupContainer = this.scene.add.container(
        //     this.scene.scale.width / 2,
        //     this.scene.scale.height / 2
        // ).setDepth(1);

        let soundOn = this.SoundManager.getMasterVolume() > 0;
        let musicOn = this.SoundManager.getSoundVolume("backgroundMusic") > 0;

        const popupBg = this.scene.add.image(gameConfig.scale.width * 0.5, gameConfig.scale.height * 0.5, 'settingPopup').setDepth(9).setOrigin(0.5);
        const soundsImage = this.scene.add.image(gameConfig.scale.width * 0.5 - 200, gameConfig.scale.height * 0.5 - 120, 'soundImage').setDepth(10);
        const musicImage = this.scene.add.image(gameConfig.scale.width * 0.5 - 200, gameConfig.scale.height * 0.5 + 50, 'musicImage').setDepth(10);
        const toggleSoundBar = this.scene.add.image(gameConfig.scale.width * 0.5 + 200, gameConfig.scale.height * 0.5 - 120, "toggleBar").setScale(0.5)
        const toggleBarSprite = [
            this.scene.textures.get('toggleBar'),
            this.scene.textures.get('toggleBar')
        ];

        const soundToggleButton = currentGameData.soundMode ? 'onButton' : 'offButton'
        let onOff: any
        if (!currentGameData.soundMode) {
            onOff = this.scene.add.image(gameConfig.scale.width * 0.5 + 180, gameConfig.scale.height * 0.5 - 120, soundToggleButton).setScale(0.5);
        } else {
            onOff = this.scene.add.image(gameConfig.scale.width * 0.5 + 220, gameConfig.scale.height * 0.5 - 120, soundToggleButton).setScale(0.5);
        }
        onOff.setInteractive()
        onOff.on('pointerdown', () => {
            // this.toggleSound(onOff);
            soundOn = !soundOn;
            this.adjustSoundVolume(onOff); // Assuming 1 is full volume
            onOff.setTexture(soundOn ? 'onButton' : 'offButton');
        })

        const toggleMusicBar = this.scene.add.image(gameConfig.scale.width * 0.5 + 200, gameConfig.scale.height * 0.5 + 50, "toggleBar")
        toggleMusicBar.setScale(0.5)
        const musicToggleButton = currentGameData.musicMode ? 'onButton' : 'offButton'
        let offMusic: any

        if (!currentGameData.musicMode) {
            offMusic = this.scene.add.image(gameConfig.scale.width * 0.5 + 180, gameConfig.scale.height * 0.5 + 50, musicToggleButton).setScale(0.5);
        } else {
            offMusic = this.scene.add.image(gameConfig.scale.width * 0.5 + 220, gameConfig.scale.height * 0.5 + 50, musicToggleButton).setScale(0.5);
        }
        offMusic.setScale(0.5)
        offMusic.setInteractive();
        offMusic.on('pointerdown', () => {
            this.adjustMusicVolume(offMusic); // Assuming 1 is full volume
        })

        // this.toggleBar = new InteractiveBtn(this.scene, toggleBarSprite, () => {
        //     // this.toggleSound();
        // }, 0, true).setPosition(200, -120);
        // this.toggleBar.setScale(0.5);

        // const exitButtonSprites = [
        //     this.scene.textures.get('exitButton'),
        //     this.scene.textures.get('exitButtonPressed')
        // ];
        this.settingClose = this.scene.add.sprite(gameConfig.scale.width * 0.5 + 350, gameConfig.scale.height * 0.5 - 350, "exitButton").setScale(0.7).setOrigin(0.5).setInteractive()
        this.settingClose.on("pointerdown", () => {
            // infopopupContainer.destroy();
            settingblurGraphic.destroy();
            this.buttonMusic("buttonpressed")
            this.scene.events.emit("closePopup");
        })
        // this.settingClose = new InteractiveBtn(this.scene, exitButtonSprites, () => {
        //     infopopupContainer.destroy();
        //     settingblurGraphic.destroy();
        //     this.buttonMusic("buttonpressed")
        // }, 0, true);
        // this.settingClose.setPosition(350, -350).setScale(0.7);

        popupBg.setOrigin(0.5);
        popupBg.setScale(0.8);
        popupBg.setAlpha(1); // Set background transparency

        this.add([popupBg, this.settingClose, soundsImage, musicImage, toggleSoundBar, onOff, toggleMusicBar, offMusic]);
    }

    buttonMusic(key: string) {
        this.SoundManager.playSound(key)
    }

    adjustSoundVolume(onOff: any) {
        currentGameData.soundMode = !currentGameData.soundMode
        this.soundEnabled = !this.soundEnabled;
        if (this.soundEnabled) {
            onOff.setTexture('onButton');
            onOff.setPosition(gameConfig.scale.width * 0.5 + 220, gameConfig.scale.height * 0.5 - 120); // Move position for 'On' state

        } else {
            onOff.setTexture('offButton');
            onOff.setPosition(gameConfig.scale.width * 0.5 + 180, gameConfig.scale.height * 0.5 - 120); // Move position for 'Off' state
        }
        this.SoundManager.setSoundEnabled(this.soundEnabled)
    }

    // Function to adjust music volume
    adjustMusicVolume(offMusic: any) {
        currentGameData.musicMode = !currentGameData.musicMode
        this.musicEnabled = !this.musicEnabled;
        if (this.musicEnabled) {
            offMusic.setTexture('onButton');
            offMusic.setPosition(gameConfig.scale.width * 0.5 + 220, gameConfig.scale.height * 0.5 + 50); // Move position for 'On' state
        } else {
            offMusic.setTexture('offButton');
            offMusic.setPosition(gameConfig.scale.width * 0.5 + 180, gameConfig.scale.height * 0.5 + 50); // Move position for 'Off' state;
        }
        this.SoundManager.setMusicEnabled(this.musicEnabled)
    }

    toggleSound(onOff: any) {
        // Toggle sound state
        this.soundEnabled = !this.soundEnabled;
        if (this.soundEnabled) {
            onOff.setTexture('onButton');
            onOff.setPosition(gameConfig.scale.width * 0.5 + 220, gameConfig.scale.height * 0.5 - 120); // Move position for 'On' state
            this.SoundManager.setSoundEnabled(this.soundEnabled)
            // Logic to turn sound on
            // Globals.soundManager.play("yourSound");
        } else {
            onOff.setTexture('offButton');
            onOff.setPosition(gameConfig.scale.width * 0.5 + 180, gameConfig.scale.height * 0.5 - 120); // Move position for 'Off' state
            this.SoundManager.setSoundEnabled(this.soundEnabled)
            // Logic to turn sound off
            // Globals.soundManager.stop("yourSound");
        }
    }

    toggleMusic(offMusic: any) {
        // Toggle sound state
        this.musicEnabled = !this.musicEnabled;
        if (this.musicEnabled) {
            offMusic.setTexture('onButton');
            offMusic.setPosition(gameConfig.scale.width * 0.5 + 220, gameConfig.scale.height * 0.5 + 50); // Move position for 'On' state
            this.SoundManager.setMusicEnabled(this.musicEnabled)

            // Globals.soundManager.play("yourSound");
        } else {
            offMusic.setTexture('offButton');
            this.SoundManager.setMusicEnabled(this.musicEnabled);
            offMusic.setPosition(gameConfig.scale.width * 0.5 + 180, gameConfig.scale.height * 0.5 + 50); // Move position for 'Off' state
            // Logic to turn sound off
            // Globals.soundManager.stop("yourSound");
        }
    }

}