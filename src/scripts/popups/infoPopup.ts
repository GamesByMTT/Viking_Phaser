import Phaser, { Scene } from "phaser";
import { currentGameData, initData, ResultData, TextStyle } from "../Globals";
import { PopupManager } from "../PopupManager";
import { gameConfig } from "../appconfig";


export class InfoPopup extends Phaser.GameObjects.Container {

    constructor(scene: Scene, data: any) {
        super(scene, 0, 0)
        // 1. Add a background to the popup container 
        const popupBackground = this.scene.add.sprite(gameConfig.scale.width / 2, gameConfig.scale.height / 2, "popupbackgroumdImage");
        popupBackground.setDisplaySize(1920, 1080);
        this.add(popupBackground);
        // 3. Add a heading image to the popup container 
        const headingImage = this.scene.add.image(gameConfig.scale.width / 2, gameConfig.scale.height / 2 - 400, 'headingImage');
        this.add(headingImage);
        // 4. Add a close button to the popup 
        const closeButton = this.scene.add.sprite(gameConfig.scale.width / 2 + 800, gameConfig.scale.height / 2 - 400, 'exitButton').setInteractive();
        closeButton.setScale(0.5);
        closeButton.on('pointerdown', () => {
            scrollContainer.destroy();
            this.scene.events.emit("closePopup");
            // Destroy the scroll container when the popup is closed
        });
        this.add(closeButton);
        // 5. Create a mask to define the visible area for scrolling 
        const maskShape = this.scene.make.graphics().fillRect(
            0, // Adjust X position to center 
            gameConfig.scale.height / 2 - 300, // Adjust Y position 
            gameConfig.scale.width - 100, // Full width minus some padding 
            1000 // Desired height of the scrollable area 
        );
        const mask = maskShape.createGeometryMask();
        // 6. Add the scrollable container to the popup container 
        const scrollContainer = this.scene.add.container(
            0, // Adjust X position to align with the mask
            gameConfig.scale.height / 2 - 300 // Adjust Y position
        );
        scrollContainer.setMask(mask); // Apply the mask to the scroll container 
        this.add(scrollContainer);

        // 7. Add the content that will be scrolled 
        const contentHeight = 3000; // Example content height, adjust as needed 
        const firstLine = this.scene.add.text(gameConfig.scale.width * 0.5, gameConfig.scale.height * 0.1, "Winning are calculated based on bet per line", {fontFamily: "Digra", fontSize: '40px', color: '#97b0e1', stroke: "#000000", strokeThickness:7,}).setOrigin(0.5);
        const betPerLine = this.scene.add.text(gameConfig.scale.width * 0.5, gameConfig.scale.height * 0.14, "Bet per line = Total Bet / Number of lines", {fontFamily: "Digra", fontSize: '35px', color: '#ffffff', stroke: "#000000", strokeThickness:7,}).setOrigin(0.5)
        const MajorSymBolHeading = this.scene.add.image(gameConfig.scale.width / 2, 250, 'majorSymbolHeading').setOrigin(0.5).setDepth(2);
        const majorSymbol1 = this.scene.add.image(650, 450, "slots5_0").setDepth(2).setScale(0.5)
        const majorSymbol2 = this.scene.add.image(1050, 450, "slots6_0").setDepth(2).setScale(0.5)
        const majorSymbol3 = this.scene.add.image(650, 700, "slots7_0").setDepth(2).setScale(0.5)
        const majorSymbol4 = this.scene.add.image(1050, 700, "slots8_0").setDepth(2).setScale(0.5)
        const majorSymbol1Text = this.scene.add.text(750, 400, '5X - 200X \n4X - 80X \n3X - 40X', TextStyle)
        const majorSymbol2Text = this.scene.add.text(1150, 400, '5X - 200X \n4X - 80X \n3X - 40X', TextStyle)
        const majorSymbol3Text = this.scene.add.text(750, 650, '5X - 200X \n4X - 80X \n3X - 10X', TextStyle)
        const majorSymbol4Text = this.scene.add.text(1150, 650, '5X - 200X \n4X - 80X \n3X - 40X', TextStyle)

        const content = this.scene.add.image(gameConfig.scale.width / 2, 900, 'minorSymbolsHeading').setOrigin(0.5).setDepth(2);
        const minSymbol1 = this.scene.add.image(350, 1100, "slots0_0").setDepth(2).setScale(0.5)
        const minSymbol2 = this.scene.add.image(850, 1100, "slots1_0").setDepth(2).setScale(0.5)
        const minSymbol3 = this.scene.add.image(1350, 1100, "slots2_0").setDepth(2).setScale(0.5)
        const minSymbol4 = this.scene.add.image(650, 1300, "slots3_0").setDepth(2).setScale(0.5)
        const minSymbol5 = this.scene.add.image(1050, 1300, "slots4_0").setDepth(2).setScale(0.5)

        const infoIcons = [
            { x: 500, y: 1050 }, // Position for infoIcon2
            { x: 1000, y: 1050 }, // Position for infoIcon3
            { x: 1500, y: 1050 }, //
            { x: 800, y: 1250 }, //
            { x: 1200, y: 1250 }, //
        ]
        const minorIcon = initData.UIData.symbols
        minorIcon.forEach((symbol, symbolIndex) => {
            // Get the corresponding infoIcon position
            const iconPosition = infoIcons[symbolIndex];
            if (!iconPosition) return; // Avoid undefined positions
            // Loop through each multiplier array (e.g., [100, 0], [50, 0])
            symbol.multiplier.slice(0, 4).forEach((multiplierValueArray, multiplierIndex) => {
                // Ensure multiplierValueArray is an array before accessing elements
                if (Array.isArray(multiplierValueArray)) {
                    const multiplierValue = multiplierValueArray[0]; // Access the first value of the array
                    if (multiplierValue > 0) {  // Only print if the value is greater than 0
                        // Determine the text (e.g., '5x', '4x', '2x')
                        const prefix = [5, 4, 2][multiplierIndex] || 1; // Customize this if needed
                        // Create the text content
                        const text = `${prefix}x ${multiplierValue}x`;
                        // Create the text object
                        const textObject = this.scene.add.text(
                            iconPosition.x, // X position
                            iconPosition.y + multiplierIndex * 40, // Y position (spacing between lines)
                            text,
                            { fontSize: '30px', color: '#fff', align: "left", fontFamily: 'Digra' } // Customize text style
                        );
                        // Set line spacing and other styles
                        textObject.setLineSpacing(10);  // Adjust the line height as needed
                        textObject.setOrigin(0.5); // Center the text if needed
                        scrollContainer.add(textObject);
                    }
                }
            });
        });
        
        
        const specialSymBol1 = this.scene.add.image(200, 1750, "slots9_0").setDepth(2).setOrigin(0.5).setScale(0.5)
        const specialSymBol2 = this.scene.add.image(200, 1950, "slots10_0").setDepth(2).setOrigin(0.5).setScale(0.5)
        const specialSymBol3 = this.scene.add.image(200, 2150, "slots11_0").setDepth(2).setOrigin(0.5).setScale(0.5)
        const specialSymBol4 = this.scene.add.image(200, 2350, "slots12_0").setDepth(2).setOrigin(0.5).setScale(0.5)
        const specialSymBol5 = this.scene.add.image(200, 2550, "slots13_0").setDepth(2).setOrigin(0.5).setScale(0.5)

        const descriptionPos = [
            { x: 350, y: 1700 },
            { x: 350, y: 1900 },
            { x: 350, y: 2100 },
            { x: 350, y: 2300 },
            { x: 350, y: 2500 },
        ]

        for (let i = 9; i <= 13; i++) {
            const symbol = initData.UIData.symbols[i];
            if (symbol) {
                const position = descriptionPos[i - 9];
                const descriptionText = `${symbol.description}`;
                // Create the text object
                const descriptionObject = this.scene.add.text(
                    position.x, // X position
                    position.y + 40, // Y position (spacing between lines)
                    descriptionText,
                    { fontSize: '30px', color: '#fff', align: "left", fontFamily: 'Digra', wordWrap: { width: 1200, useAdvancedWrap: true } } // Customize text style
                );
                descriptionObject.setLineSpacing(10);  // Adjust the line height as needed
                descriptionObject.setOrigin(0, 0.5); // Center the text if needed
                scrollContainer.add(descriptionObject)
            } else {
            }
        }
       
        const specialSymBolHeading = this.scene.add.image(gameConfig.scale.width / 2, 1550, "specialSymBolHeading").setDepth(2).setOrigin(0.5)
        const payLines = this.scene.add.image(gameConfig.scale.width / 2, 3000, 'payLines').setOrigin(0.5).setDepth(2);
        scrollContainer.add([content, firstLine, betPerLine, minSymbol1, minSymbol2,
            minSymbol3, minSymbol4, minSymbol5,
            MajorSymBolHeading, majorSymbol1, majorSymbol1Text, majorSymbol2, majorSymbol2Text,
            majorSymbol3, majorSymbol3Text, majorSymbol4, majorSymbol4Text, specialSymBolHeading, specialSymBol1, specialSymBol2, specialSymBol3, specialSymBol4, specialSymBol5,
            payLines
        ]);
        // 8. Scrollbar background 
        const scrollbarBg = this.scene.add.sprite(gameConfig.scale.width * 0.9, // Positioned on the right side 
            gameConfig.scale.height / 2, 'scrollBg').setOrigin(0.5).setDisplaySize(55, 770); // Adjust height as needed 
        this.add(scrollbarBg);
        // 9. Roller image for the scrollbar 
        const roller = this.scene.add.image(gameConfig.scale.width * 0.9, gameConfig.scale.height / 2 - 200, 'scroller').setOrigin(0.5).setInteractive({ draggable: true }).setScale(1, 0.8);
        this.add(roller);
        // 10. Add drag event listener to the roller 
        this.scene.input.setDraggable(roller);
        roller.on('drag', (pointer: any, dragX: number, dragY: number) => {
            // Keep the roller within the scrollbar bounds
            const minY = scrollbarBg.getTopCenter().y + roller.height / 2 + 20;
            const maxY = scrollbarBg.getBottomCenter().y - roller.height;

            // Clamp roller position
            dragY = Phaser.Math.Clamp(dragY, minY, maxY);
            roller.y = dragY;

            // Calculate the scroll percentage (0 to 1)
            const scrollPercent = (dragY - minY) / (maxY - minY);

            // Map the scroll percentage to the content's Y position range
            const contentMaxY = 130; // The top position of content (relative to mask)
            const contentMinY = -(contentHeight - 600); // The bottom position of content relative to mask

            // Update scroll container's Y position based on scroll percentage
            scrollContainer.y = Phaser.Math.Interpolation.Linear([contentMaxY, contentMinY], scrollPercent);
        });

        this.scene.input.on('wheel', (pointer: any, gameObjects: any, deltaX: number, deltaY: number) => {
            const minY = scrollbarBg.getTopCenter().y + roller.height / 2;
            const maxY = scrollbarBg.getBottomCenter().y - roller.height / 2;

            // Adjust roller Y position based on mouse wheel movement
            let newY = roller.y + deltaY * 0.1; // Adjust speed of scroll
            newY = Phaser.Math.Clamp(newY, minY, maxY);
            roller.y = newY;
            // Calculate the scroll percentage (0 to 1)
            const scrollPercent = (newY - minY) / (maxY - minY);
            // Map the scroll percentage to the content's Y position range
            const contentMaxY = 290; // The top position of content (relative to mask)
            const contentMinY = -(contentHeight - 600); // The bottom position of content relative to mask
            // Update scroll container's Y position based on scroll percentage
            scrollContainer.y = Phaser.Math.Interpolation.Linear([contentMaxY, contentMinY], scrollPercent);
        });

        let startY = 0;
        let currentY = 0;
        let isDragging = false;

        // Make the scroll container interactive
        scrollContainer.setInteractive(new Phaser.Geom.Rectangle(
            0,
            0,
            gameConfig.scale.width - 100, // Width of the scrollable area
            2900 // Height of the scrollable area
        ), Phaser.Geom.Rectangle.Contains);

        // Touch start
        scrollContainer.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
            console.log("touc 2");
            isDragging = true;
            startY = pointer.y;
            currentY = scrollContainer.y;
        });

        // Touch move
        this.scene.input.on('pointermove', (pointer: Phaser.Input.Pointer) => {
            if (!isDragging) return;
            const deltaY = pointer.y - startY;
            const newY = currentY + deltaY;
            // console.log(deltaY, newY, startY, pointer.y);
            // Calculate bounds
            const maxY = 300; // Top bound
            const minY = -(contentHeight - 600); // Bottom bound

            // Clamp the scroll position
            scrollContainer.y = Phaser.Math.Clamp(newY, minY, maxY);

            // Update roller position
            const scrollPercent = (maxY - scrollContainer.y) / (maxY - minY);
            const rollerMinY = scrollbarBg.getTopCenter().y + roller.height / 2;
            const rollerMaxY = scrollbarBg.getBottomCenter().y - roller.height / 2;
            roller.y = Phaser.Math.Linear(rollerMinY, rollerMaxY, scrollPercent);
        });

        // Touch end
        this.scene.input.on('pointerup', () => {
            isDragging = false;
        });
    }
}