// import * as THREE from 'three'
// import { OrbitControls } from "three/addons/controls/OrbitControls.js";
// import { sizesStore } from './Utils/Store.js';


// import App from './App.js'

// export default class Camera{
//     constructor() {
//         this.app = new App()
//         this.canvas = this.app.canvas

//         this.sizesStore = sizesStore

//         this.sizes = this.sizesStore.getState()

//         this.setInstance()
//         this.setControls()
//         this.setResizeLister()
//     }

//     // setInstance() {
//     //     this.instance = new THREE.PerspectiveCamera(
//     //         35,
//     //         this.sizes.width / this.sizes.height,
//     //         1,
//     //         600
//     //       );
//     //       this.instance.position.z = 100
//     //     this.instance.position.y = 20
//     // }

//     setInstance() {
//         this.instance = new THREE.PerspectiveCamera(
//             35,
//             this.sizes.width / this.sizes.height,
//             1,
//             600
//         );
//         this.instance.position.set(0, 0, 100); // Set y to 0 to remove elevation
//     }

//     setControls() {
//         this.controls = new OrbitControls(this.instance, this.canvas);
//         this.controls.enableDamping = true;

//     }

//     setResizeLister() {
//         this.sizesStore.subscribe((sizes)=>{
//             this.instance.aspect = sizes.width / sizes.height
//             this.instance.updateProjectionMatrix()
//         })
//     }

//     loop() {
//         this.controls.update()
//         this.characterController = this.app.world.characterController?.rigidBody
//         if(this.characterController) {


//             const characterPosition = this.characterController.translation()
//             const characterRotation = this.characterController.rotation()

//             const cameraOffset = new THREE.Vector3(0, 0, 35)
//             cameraOffset.applyQuaternion(characterRotation)
//             cameraOffset.add(characterPosition)

//             const targetOffset = new THREE.Vector3(0, 0, 0)
//             targetOffset.applyQuaternion(characterRotation)
//             targetOffset.add(characterPosition)

//             this.instance.position.lerp(cameraOffset, 0.1)
//             this.controls.target.lerp(targetOffset, 0.1)
//         }
//     }
// }

import * as THREE from 'three';
import { sizesStore } from './Utils/Store.js';
import App from './App.js';

export default class Camera {
    constructor() {
        this.app = new App();
        this.canvas = this.app.canvas;
        this.sizesStore = sizesStore;
        this.sizes = this.sizesStore.getState();

        this.setInstance();
        this.setMouseControls();
        this.setResizeListener();
    }

    setInstance() {
        this.instance = new THREE.PerspectiveCamera(
            75, // Wider FOV for first-person
            this.sizes.width / this.sizes.height,
            0.1,
            600
        );

        this.euler = new THREE.Euler(0, 0, 0, 'YXZ'); // Order: Yaw (Y) then Pitch (X)
        this.sensitivity = 0.002; // Mouse sensitivity
    }

    setMouseControls() {
        this.canvas.requestPointerLock = this.canvas.requestPointerLock || this.canvas.mozRequestPointerLock;
        document.exitPointerLock = document.exitPointerLock || document.mozExitPointerLock;

        this.canvas.addEventListener('click', () => {
            this.canvas.requestPointerLock();
        });

        document.addEventListener('mousemove', (event) => {
            if (document.pointerLockElement === this.canvas) {
                this.euler.y -= event.movementX * this.sensitivity;
                this.euler.x -= event.movementY * this.sensitivity;
                this.euler.x = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, this.euler.x)); // Limit pitch
                this.instance.quaternion.setFromEuler(this.euler);
            }
        });
    }

    setResizeListener() {
        this.sizesStore.subscribe((sizes) => {
            this.instance.aspect = sizes.width / sizes.height;
            this.instance.updateProjectionMatrix();
        });
    }

    loop() {
        this.characterController = this.app.world.characterController?.rigidBody;
        if (this.characterController) {
            const characterPosition = this.characterController.translation();
            
            // Set camera position at character's head height (Y + 1.8)
            this.instance.position.set(
                characterPosition.x, 
                characterPosition.y + 7, 
                characterPosition.z - 1
            );
        }
    }
}
