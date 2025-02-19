export default class AnimationController {
    constructor() {
        this.app = null;
        this.mixer = null;
        this.animations = new Map();
        this.currentAction = null;

        this.loadThreeJS();
    }

    async loadThreeJS() {
        const THREE = await import('three'); // ✅ Lazy-load THREE.js
        const { default: App } = await import('../App');
        const { inputStore } = await import('../Utils/Store');

        this.THREE = THREE;
        this.app = new App();
        this.scene = this.app.scene;
        this.avatar = this.app.world.character.avatar;

        inputStore.subscribe((input) => this.onInput(input));

        this.instantiatedAnimations();
    }

    instantiatedAnimations() {
        if (!this.avatar || !this.THREE) return; // ✅ Ensure assets are loaded

        this.mixer = new this.THREE.AnimationMixer(this.avatar.scene);

        this.avatar.animations.forEach((clip) => {
            this.animations.set(clip.name, this.mixer.clipAction(clip));
        });

        this.currentAction = this.animations.get('Idle');
        if (this.currentAction) this.currentAction.play();
    }

    playAnimation(name) {
        if (!this.animations.has(name) || this.currentAction === this.animations.get(name)) return;

        const action = this.animations.get(name);
        action.reset();
        action.play();
        action.crossFadeFrom(this.currentAction, 0.2);

        this.currentAction = action;
    }

    onInput(input) {
        if (input.forward || input.backward || input.left || input.right) {
            this.playAnimation('Run');
        } else {
            this.playAnimation('Idle');
        }
    }

    loop(deltaTime) {
        if (this.mixer) this.mixer.update(deltaTime);
    }
}
