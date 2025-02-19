import * as THREE from "three";
import assetStore from "../Utils/AssetStore.js";
import App from "../App.js";

export default class Character {
  constructor() {
    this.app = new App();
    this.scene = this.app.scene;
    this.assetStore = assetStore.getState();
    this.avatar = this.assetStore.loadedAssets.avatar;

    this.instance = null; // ✅ Ensure instance is defined early

    this.instantiateCharacter();
  }

  instantiateCharacter() {
    // ✅ Log to see if this function runs
    console.log("Instantiating Character...");

    // Create character and add to scene
    const geometry = new THREE.BoxGeometry(0.6, 2, 0.6);
    const material = new THREE.MeshStandardMaterial({
      color: 0x00ff00,
      wireframe: true,
      visible: false,
    });

    this.instance = new THREE.Mesh(geometry, material);

    // ✅ Log to ensure instance is being created
    console.log("Character instance created:", this.instance);

    // Move the character far from the origin
    this.instance.position.set(11, 0, 40);
    this.scene.add(this.instance);

    // Add avatar to character
    if (this.avatar?.scene) {
      const avatar = this.avatar.scene;
      avatar.rotation.y = Math.PI;
      avatar.position.y = 0;
      avatar.scale.set(4, 4, 4);
      this.instance.add(avatar);
    } else {
      console.warn("Avatar is not loaded yet!");
    }
  }
}
