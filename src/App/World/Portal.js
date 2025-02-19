import { Vector3 } from "three";
import App from "../App";

export default class Portal {
    constructor(portalMesh, modalInfo) {
        this.app = new App();
        this.portalMesh = portalMesh;
        this.modalInfo = modalInfo;
        this.modalManager = null; // Lazy load it
        this.prevIsNear = false;
        this.character = null;
    }

    async loadModalManager() {
        if (!this.modalManager) {
            const { default: ModalManager } = await import("../UI/ModalManager");
            this.modalManager = new ModalManager();
        }
    }

    loop() {
        if (!this.character) {
            this.character = this.app.world.character.instance;
            if (!this.character) return; // Exit if character is still undefined
        }

        const portalPosition = new Vector3();
        this.portalMesh.getWorldPosition(portalPosition);

        const distance = this.character.position.distanceTo(portalPosition);
        const isNear = distance < 9;

        if (isNear && !this.prevIsNear) {
            this.loadModalManager().then(() => {
                this.modalManager.openModal(this.modalInfo.title, this.modalInfo.description, this.modalInfo.id);
            });
        } else if (!isNear && this.prevIsNear) {
            if (this.modalManager) this.modalManager.closeModal();
        }

        this.prevIsNear = isNear;
    }
}
