import * as THREE from "three";

import App from "../App.js";
import Physics from "./Physics.js";
import Environment from "./Environment.js";
import Character from "./Character.js";
import CharacterController from "./CharacterController.js";
import AnimationController from "./AnimationController.js";

import { appStateStore } from "../Utils/Store.js";

export default class World {
  constructor() {
    this.app = new App();
    this.scene = this.app.scene;
    this.physics = new Physics();

    this.character = null; // ✅ Define early

    // ✅ Use store subscription to ensure assets are ready
    const unsub = appStateStore.subscribe((state) => {
      if (state.physicsReady && state.assetsReady) {
        this.environment = new Environment();

        // ✅ Initialize Character and wait for it to be ready
        this.character = new Character();

        // ✅ Check when the character is ready
        const checkCharacterReady = setInterval(() => {
          if (this.character.instance) {
            console.log("✅ Character instance is ready!", this.character.instance);
            
            // Now create the controller
            this.characterController = new CharacterController();
            this.animationController = new AnimationController();
            
            clearInterval(checkCharacterReady); // Stop checking
          }
        }, 50); // ✅ Check every 50ms

        unsub();
      }
    });

    this.loop();
  }

  loop(deltaTime, elapsedTime) {
    this.physics.loop();
    if (this.environment) this.environment.loop();
    if (this.characterController) this.characterController.loop();
    if (this.animationController) this.animationController.loop(deltaTime);
  }
}
