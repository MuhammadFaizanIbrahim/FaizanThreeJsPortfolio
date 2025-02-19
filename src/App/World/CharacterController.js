import * as THREE from "three";
import App from "../App.js";
import { inputStore } from "../Utils/Store.js";

/**
 * Class representing a character controller.
 */
export default class CharacterController {
  /**
   * Create a character controller.
   */
  constructor() {
    this.app = new App();
    this.scene = this.app.scene;
    this.character = this.app.world?.character?.instance ?? null;

    if (!this.character) {
      console.error("❌ Character instance is missing!");
      return;
    }

    this.loadPhysics(); // Load physics dynamically

    // Subscribe to input store
    inputStore.subscribe((state) => {
      this.forward = state.forward;
      this.backward = state.backward;
      this.left = state.left;
      this.right = state.right;
    });
  }

  /**
   * Dynamically loads the physics engine and initializes the controller.
   */
  async loadPhysics() {
    const physics = this.app.getPhysics();
    
    if (!physics) {
      console.error("❌ Physics engine is not initialized!");
      return;
    }

    const { rapier, world } = physics;
    if (!rapier || !world) {
      console.error("❌ Physics engine or world is missing!");
      return;
    }

    this.rapier = rapier;
    this.world = world;

    this.instantiateController();
  }

  /**
   * Instantiate the character controller.
   */
  instantiateController() {
    if (!this.rapier || !this.world) {
      console.error("❌ Physics system is not ready.");
      return;
    }

    this.rigidBodyType = this.rapier.RigidBodyDesc.kinematicPositionBased();
    this.rigidBody = this.world.createRigidBody(this.rigidBodyType);
    
    this.colliderType = this.rapier.ColliderDesc.cuboid(0.3, 1, 0.3);
    this.collider = this.world.createCollider(this.colliderType, this.rigidBody);

    const worldPosition = new THREE.Vector3();
    const worldRotation = new THREE.Quaternion();
    
    this.character.getWorldPosition(worldPosition);
    this.character.getWorldQuaternion(worldRotation);

    this.rigidBody.setTranslation(worldPosition);
    this.rigidBody.setRotation(worldRotation);

    this.characterController = this.world.createCharacterController(0.01);
    this.characterController.setApplyImpulsesToDynamicBodies(true);
    this.characterController.enableAutostep(5, 0.1, false);
    this.characterController.enableSnapToGround(1);
  }

  /**
   * Loop function that updates the character's position.
   */
  loop() {
    if (!this.rapier || !this.world || !this.character || !this.characterController) return;

    const movement = new THREE.Vector3();
    if (this.forward) movement.z -= 1;
    if (this.backward) movement.z += 1;
    if (this.left) movement.x -= 1;
    if (this.right) movement.x += 1;

    if (movement.length() !== 0) {
      const angle = Math.atan2(movement.x, movement.z) + Math.PI;
      this.character.quaternion.slerp(
        new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), angle),
        0.1
      );
    }

    movement.normalize().multiplyScalar(0.1);
    movement.y = -1;

    this.characterController.computeColliderMovement(this.collider, movement);
    const newPosition = new THREE.Vector3()
      .copy(this.rigidBody.translation())
      .add(this.characterController.computedMovement());

    this.rigidBody.setNextKinematicTranslation(newPosition);
    this.character.position.lerp(this.rigidBody.translation(), 0.1);
  }
}
