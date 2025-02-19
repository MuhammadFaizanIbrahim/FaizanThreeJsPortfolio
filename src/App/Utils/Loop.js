export default class Loop {
    constructor() {
        this.app = null;
        this.camera = null;
        this.renderer = null;
        this.world = null;
        this.clock = null;
        this.previousElapsedTime = 0;

        this.loadDependencies();
    }

    async loadDependencies() {
        const THREE = await import('three'); // ✅ Lazy-load THREE.js
        const { default: App } = await import('../App.js'); // ✅ Lazy-load App.js

        this.THREE = THREE;
        this.app = new App();
        this.camera = this.app.camera;
        this.renderer = this.app.renderer;
        this.world = this.app.world;

        this.clock = new this.THREE.Clock();
        this.loop();
    }

    loop() {
        if (!this.clock || !this.world || !this.camera || !this.renderer) return; // ✅ Prevent crashes

        const elapsedTime = this.clock.getElapsedTime();
        const deltaTime = elapsedTime - this.previousElapsedTime;
        this.previousElapsedTime = elapsedTime;

        if (this.world.loop) this.world.loop(deltaTime, elapsedTime);
        if (this.camera.loop) this.camera.loop(deltaTime);
        if (this.renderer.loop) this.renderer.loop();

        window.requestAnimationFrame(() => this.loop());
    }
}
