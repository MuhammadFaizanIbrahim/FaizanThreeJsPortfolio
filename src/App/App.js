import * as THREE from 'three';
import Camera from './Camera.js';
import Renderer from './Renderer.js';
import Loop from './Utils/Loop.js';
import GUI from './Utils/GUI.js';
import World from './World/World.js';
import Resize from './Utils/Resize.js';
import AssetLoader from './Utils/AssetLoader.js';
import Preloader from './UI/Preloader.js';
import InputController from './UI/InputController.js';

// export default class App {
//     static instance = null; // ✅ Proper singleton pattern

//     constructor() {
//         if (App.instance) return App.instance; // ✅ Returns existing instance
//         App.instance = this; // ✅ Assigns instance

//         // three.js elements
//         this.canvas = document.querySelector("canvas.threejs");
//         this.scene = new THREE.Scene();

//         // add debug GUI
//         this.gui = new GUI();

//         // Asset Loader
//         this.assetLoader = new AssetLoader();

//         // UI
//         this.preloader = new Preloader();
//         this.inputController = new InputController();

//         // World
//         this.world = new World();

//         // Camera and Renderer
//         this.camera = new Camera();
//         this.renderer = new Renderer();

//         // extra utils
//         this.loop = new Loop();
//         this.resize = new Resize();
//     }
// }

export default class App {
    static instance = null;

    constructor() {
        if (App.instance) return App.instance;
        App.instance = this;

        this.canvas = document.querySelector("canvas.threejs");
        this.scene = new THREE.Scene();

        // add debug GUI
        this.gui = new GUI();

        // Asset Loader
        this.assetLoader = new AssetLoader();

        // UI
        this.preloader = new Preloader();
        this.inputController = new InputController();

        // World
        this.world = new World(); // 🌟 World should initialize physics

        // Camera and Renderer
        this.camera = new Camera();
        this.renderer = new Renderer();

        // extra utils
        this.loop = new Loop();
        this.resize = new Resize();
    }

    /** ✅ Add this method to return physics */
    getPhysics() {
        return this.world?.physics ?? null;
    }
}
