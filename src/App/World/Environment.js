import * as THREE from "three";
import App from "../App.js";
import assetStore from "../Utils/AssetStore.js";
import Portal from "./Portal.js";
import ModalContentProvider from "../UI/ModalContentProvider.js";

export default class Environment {
  constructor() {
    this.app = new App();
    this.scene = this.app.scene;
    this.physics = this.app.world.physics;
    this.pane = this.app.gui.pane;

    this.assetStore = assetStore.getState();
    this.environment = this.assetStore.loadedAssets.environment;

    this.loadEnvironment();
    this.addLights();
    this.addPortals();
  }

  loadEnvironment() {
    const environmentScene = this.environment.scene;
    this.scene.add(environmentScene);

    // environmentScene.position.set(-4.8, 0, -7.4);
    environmentScene.position.set(0, 0, 0);
    environmentScene.rotation.set(0, -0.5, 0);
    environmentScene.scale.setScalar(2);

    // const objectTransforms = {
    // "RoomBase001": { position: [8, 5.8, -10.5]},
    // };

    //   for (const key in objectTransforms) {
    //     if (child.name === key) {
    //         const { position } = objectTransforms[key];
    //         child.position.set(...position);
    // child.rotation.set(...rotation);
    // child.scale.setScalar(...scale);
    //     }
    // }

    environmentScene.traverse((child) => {
      if (child.isMesh) {
        const physicalObjects = [
          "Stairs",
          "Frame",
          "LED",
          "Logo",
          "Floor",
          "Scenary",
          "Chair",
          "Pole",
          "Desks",
          "Table",
        ];
        if (physicalObjects.some((keyword) => child.name.includes(keyword))) {
          this.physics.add(child, "fixed", "cuboid");
        }
        const roomBaseObjects = ["Base"];
        if (roomBaseObjects.some((keyword) => child.name.includes(keyword))) {
          this.physics.add(child, "fixed", "trimesh");
        }
        const shadowCasters = ["LED", "Chair", "Pole", "Desks", "Table"];
        if (shadowCasters.some((keyword) => child.name.includes(keyword))) {
          child.castShadow = true;
        }
        const shadowReceivers = ["Stairs", "Floor", "Base"];
        if (shadowReceivers.some((keyword) => child.name.includes(keyword))) {
          child.receiveShadow = true;
        }
      }
    });
  }

  addLights() {
    // Ambient light for general illumination
    const ambientLight = new THREE.AmbientLight(0xffffff, 1);
    this.scene.add(ambientLight);

    // Directional Light
    this.directionalLight = new THREE.DirectionalLight(0xffffff, 2);

    // Move the light closer to the environment
    this.directionalLight.position.set(-30, 5, 20); // Adjust values to bring it closer

    // Enable shadows
    this.directionalLight.castShadow = true;

    // Adjust shadow camera to focus on your environment
    this.directionalLight.shadow.camera.near = 0.5; // Reduce near clipping for better focus
    this.directionalLight.shadow.camera.far = 50; // Adjust if needed to fit your environment

    this.directionalLight.shadow.camera.top = 30; // Reduce from 30 to focus light
    this.directionalLight.shadow.camera.right = 30;
    this.directionalLight.shadow.camera.left = -30;
    this.directionalLight.shadow.camera.bottom = -30;

    this.directionalLight.shadow.bias = -0.002;
    this.directionalLight.shadow.normalBias = 0.02; // Reduce for a softer shadow

    this.scene.add(this.directionalLight);
  }

  addPortals(){
   
    const portfolioPortalMesh = this.environment.scene.getObjectByName('LED')
    const aboutMePortalMesh = this.environment.scene.getObjectByName('Scenary001')
    const socialIconsPortalMesh = this.environment.scene.getObjectByName('InstaLogo')
    const socialIconsPortalMesh2 = this.environment.scene.getObjectByName('GithubLogo')

    const modalContentProvider = new ModalContentProvider()

    this.aboutMePortal = new Portal(aboutMePortalMesh, modalContentProvider.getModalInfo('aboutMe'));
    this.portfolioPortal = new Portal(portfolioPortalMesh, modalContentProvider.getModalInfo('portfolio'));
    this.socialIconsPortal = new Portal(socialIconsPortalMesh, modalContentProvider.getModalInfo('social'));
    this.socialIconsPortal2 = new Portal(socialIconsPortalMesh2, modalContentProvider.getModalInfo('social'));
    
  }

  loop() {
    this.portfolioPortal.loop()
    this.aboutMePortal.loop()
    this.socialIconsPortal.loop()
    this.socialIconsPortal2.loop()
  }
}
