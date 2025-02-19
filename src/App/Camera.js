export default class Camera {
    constructor() {
        this.app = null; // Initialize app as null
        this.loadThreeJS();
    }

    async loadThreeJS() {
        const THREE = await import('three'); // Lazy-load THREE.js
        const { sizesStore } = await import('./Utils/Store.js');
        const { default: App } = await import('./App.js');

        this.app = new App(); // Now assign App after it's imported
        this.canvas = this.app.canvas;
        this.sizesStore = sizesStore;
        this.sizes = this.sizesStore.getState();
        this.THREE = THREE;

        this.setInstance();
        this.setMouseControls();
        this.setResizeListener();
    }

    setInstance() {
        if (!this.THREE) return; // Ensure THREE is loaded
        this.instance = new this.THREE.PerspectiveCamera(
            75, 
            this.sizes.width / this.sizes.height,
            0.1,
            600
        );

        this.euler = new this.THREE.Euler(0, 0, 0, 'YXZ');
        this.sensitivity = 0.002;
    }

    setMouseControls() {
        this.canvas?.addEventListener('click', () => {
            this.canvas.requestPointerLock();
        });

        document.addEventListener('mousemove', (event) => {
            if (document.pointerLockElement === this.canvas) {
                this.euler.y -= event.movementX * this.sensitivity;
                this.euler.x -= event.movementY * this.sensitivity;
                this.euler.x = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, this.euler.x));
                this.instance.quaternion.setFromEuler(this.euler);
            }
        });
    }

    setResizeListener() {
        this.sizesStore.subscribe((sizes) => {
            if (this.instance) {
                this.instance.aspect = sizes.width / sizes.height;
                this.instance.updateProjectionMatrix();
            }
        });
    }

    loop() {
        // ✅ Check if `this.app` and `this.app.world` are loaded before using them
        if (!this.app || !this.app.world || !this.app.world.characterController) return;

        const characterController = this.app.world.characterController.rigidBody;
        if (characterController) {
            const characterPosition = characterController.translation();
            if (characterPosition) {
                this.instance.position.set(
                    characterPosition.x, 
                    characterPosition.y + 7, 
                    characterPosition.z - 1
                );
            }
        }
    }
}
