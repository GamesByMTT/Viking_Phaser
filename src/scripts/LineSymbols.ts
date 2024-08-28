import Phaser from "phaser";
import { initData } from "./Globals";
import { gameConfig } from "./appconfig";
import { LineGenerator } from "./Lines";

export default class LineSymbols extends Phaser.GameObjects.Container{
    numberArr: Phaser.GameObjects.Text[] = [];
    linesGenerator!: LineGenerator; // Reference to LineGenerator
    numberContainers!: Phaser.GameObjects.Container
    constructor(scene: Phaser.Scene, yOf: number, xOf: number, linesGenerator: LineGenerator) {
        // console.log(xOf, yOf);
        super(scene);
        this.linesGenerator = linesGenerator;
        // Create lines based on initData
        for (let i = 0; i < initData.gameData.Lines.length; i++) {
            let numberText = this.createNumber(scene, i);
            this.numberArr.push(numberText);
            this.add(numberText);
        }

        this.setPosition(gameConfig.scale.width / 2, gameConfig.scale.height/2.9);
        // Add this Container to the scene
        scene.add.existing(this);
    }

    createNumber(scene: Phaser.Scene, index: number): Phaser.GameObjects.Text {
        const numberContainer = new Phaser.GameObjects.Container(scene);
        
        let xPosition;
        
        let yPosition = 0;
        let numberBg = scene.add.sprite(0, 0, "lineSymbols")
        // Determine x position based on even or odd index
        if (index % 2 === 0) {
            // Even numbers (0, 2, 4, 6, 8, etc.) go on one side
            xPosition = - gameConfig.scale.width/3.75;
            yPosition = (index / 2) * 60 - 150;  // Staggered downwards for each even number
            numberContainer.add(numberBg.setPosition(gameConfig.scale.width/4.3, yPosition + 380));
        } else {
            // Odd numbers (1, 3, 5, 7, 9, etc.) go on the opposite side
            xPosition = gameConfig.scale.width/3.79;
            yPosition =  ((index - 1) / 2) * 60 - 150;  // Staggered downwards for each odd number
            numberContainer.add(numberBg.setPosition(gameConfig.scale.width / 1.31, yPosition + 380))
        }

        // Create a text object for each number
        let numberText = scene.add.text(xPosition, yPosition, (index + 1).toString(), {
            font: "24px",
            color: "#ffffff",
            align: 'center',    
        }).setOrigin(0.5, 0.5).setDepth(12);
        numberContainer.add(numberText)
        // Enable input on the number text
        numberText.setInteractive({ useHandCursor: true }).setDepth(5);
        
        // Add hover event listeners
        numberText.on("pointerover", () => this.showLines(index));
        numberText.on("pointerout", () => this.hideLines());
        return numberText;
    }
    showLines(index: number) {
        // Example: show lines related to the number
        this.linesGenerator.showLines([index]); // Adjust as needed
    }

    hideLines() {
        this.linesGenerator.hideLines();
    }
}