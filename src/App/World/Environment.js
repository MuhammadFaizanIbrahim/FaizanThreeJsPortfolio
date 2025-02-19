import * as THREE from "three";
import App from "../App.js";

const Portal = () => import("./Portal.js");
const ModalContentProvider = () => import("../UI/ModalContentProvider.js");

export default class Environment {
  constructor() {
    this.init();
  }

  async init() {
    this.app = new App();
    this.scene = this.app.scene;
    this.physics = this.app.world.physics;
    this.pane = this.app.gui.pane;

    // ✅ Await the dynamic import
    const assetStoreModule = await import("../Utils/AssetStore.js");
    const assetStore = assetStoreModule.default; // Access the default export

    // ✅ Now, we can safely use getState()
    this.assetStore = assetStore.getState();
    this.environment = this.assetStore.loadedAssets.environment;

    this.loadEnvironment();
    this.addLights();
    this.addPortals();
  }

  loadEnvironment() {
    if (!this.environment) {
      console.error("Environment assets are not loaded yet!");
      return;
    }

    const environmentScene = this.environment.scene;
    this.scene.add(environmentScene);

    environmentScene.position.set(0, 0, 0);
    environmentScene.rotation.set(0, -0.5, 0);
    environmentScene.scale.setScalar(2);

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
    const ambientLight = new THREE.AmbientLight(0xffffff, 1);
    this.scene.add(ambientLight);

    this.directionalLight = new THREE.DirectionalLight(0xffffff, 2);
    this.directionalLight.position.set(-30, 5, 20);
    this.directionalLight.castShadow = true;

    this.directionalLight.shadow.camera.near = 0.5;
    this.directionalLight.shadow.camera.far = 50;
    this.directionalLight.shadow.camera.top = 30;
    this.directionalLight.shadow.camera.right = 30;
    this.directionalLight.shadow.camera.left = -30;
    this.directionalLight.shadow.camera.bottom = -30;

    this.directionalLight.shadow.bias = -0.002;
    this.directionalLight.shadow.normalBias = 0.02;

    this.scene.add(this.directionalLight);
  }

  async addPortals() {
    const portalModule = await Portal();
    const modalContentProviderModule = await ModalContentProvider();

    const PortalClass = portalModule.default;
    const modalContentProvider = new modalContentProviderModule.default();

    const portfolioPortalMesh = this.environment.scene.getObjectByName("LED");
    const aboutMePortalMesh = this.environment.scene.getObjectByName("Scenary001");
    const socialIconsPortalMesh = this.environment.scene.getObjectByName("InstaLogo");
    const socialIconsPortalMesh2 = this.environment.scene.getObjectByName("GithubLogo");

    this.aboutMePortal = new PortalClass(aboutMePortalMesh, modalContentProvider.getModalInfo("aboutMe"));
    this.portfolioPortal = new PortalClass(portfolioPortalMesh, modalContentProvider.getModalInfo("portfolio"));
    this.socialIconsPortal = new PortalClass(socialIconsPortalMesh, modalContentProvider.getModalInfo("social"));
    this.socialIconsPortal2 = new PortalClass(socialIconsPortalMesh2, modalContentProvider.getModalInfo("social"));
  }

  loop() {
    this.portfolioPortal?.loop();
    this.aboutMePortal?.loop();
    this.socialIconsPortal?.loop();
    this.socialIconsPortal2?.loop();
  }
}
