import Phaser, { Scene } from "phaser";
import { TextLabel } from "../TextLabel";
import { UiContainer } from "../UiContainer";
import { Globals } from "../Globals";
import SoundManager from "../SoundManager";
import { InteractiveBtn } from "../InteractiveBtn";
import { gameConfig } from "../appconfig";

export class LogoutPopup extends Phaser.GameObjects.Container{
    UiContainer!: UiContainer
    yesBtn!: InteractiveBtn
    noBtn!: InteractiveBtn
  
    constructor(scene: Scene, data: any){
        super(scene, 0, 0)
        

         const blurGraphic = this.scene.add.graphics().setDepth(1); // Set depth lower than popup elements
                blurGraphic.fillStyle(0x000000, 0.5); // Black with 50% opacity
                blurGraphic.fillRect(0, 0, this.scene.scale.width, this.scene.scale.height); // Cover entire screen

                // Popup background image
                const popupBg = this.scene.add.image(gameConfig.scale.width * 0.5, gameConfig.scale.height * 0.5, "logoutPop").setDepth(10);
                popupBg.setOrigin(0.5);
                popupBg.setDisplaySize(835, 677); // Set the size for your popup background
                popupBg.setAlpha(1); // Set background transparency
                // this.UiContainer.exitBtn.disableInteractive();
                // Add text to the popup
                const popupText = new TextLabel(this.scene, gameConfig.scale.width * 0.5, gameConfig.scale.height * 0.5 - 75, "Do you really want \n to exit?", 50, "#6b768b");
                // Yes and No buttons
                const logoutButtonSprite = [
                    this.scene.textures.get("normalButton"),
                    this.scene.textures.get("normalButton")
                ];
                // this.yesBtn = this.scene.add.sprite(-130, 80, "normalButton").setScale(0.7)
                this.yesBtn = new InteractiveBtn(this.scene, logoutButtonSprite, () => {           
                    Globals.Socket?.socket.emit("EXIT", {});
                    window.parent.postMessage("onExit", "*");
                    blurGraphic.destroy(); // Destroy blurGraphic when popup is closed
                }, 0, true);
            
                this.noBtn = new InteractiveBtn(this.scene, logoutButtonSprite, () => {
                    // this.UiContainer.exitBtn.setInteractive()
                    // this.exitBtn.setTexture("normalButton");
                    blurGraphic.destroy(); // Destroy blurGraphic when popup is closed
                    this.scene.events.emit("closePopup")
                }, 0, true);
               
                this.yesBtn.setPosition(gameConfig.scale.width * 0.5 - 130, gameConfig.scale.height * 0.5 + 80).setScale(0.5, 0.5);
                this.noBtn.setPosition(gameConfig.scale.width * 0.5 + 130, gameConfig.scale.height * 0.5 + 80).setScale(0.5, 0.5);;
                // Button labels
                const noText = new TextLabel(this.scene, gameConfig.scale.width * 0.5 + 130, gameConfig.scale.height * 0.5 + 75, "No", 30, "#ffffff");
                const yesText = new TextLabel(this.scene, this.yesBtn.x, gameConfig.scale.height * 0.5 + 75, "Yes", 30, "#ffffff");
                // Add all elements to popupContainer
                this.add([popupBg, popupText, this.yesBtn, this.noBtn, yesText, noText]);
                // Add popupContainer to the scene
                
    }

}