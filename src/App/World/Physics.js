import { Vector3, Quaternion, Matrix4 } from "three";
import App from "../App.js";
import { appStateStore } from "../Utils/Store.js";

export default class Physics {
  constructor() {
    this.app = new App();
    this.scene = this.app.scene;
    this.meshMap = new Map();
    this.rapier = null;
    this.rapierLoaded = false;
    this.world = null;

    this.loadRapier();
  }

  async loadRapier() {
    const { default: RAPIER } = await import("@dimforge/rapier3d");
    const gravity = { x: 0, y: -9.81, z: 0 };
    this.world = new RAPIER.World(gravity);
    this.rapier = RAPIER;
    this.rapierLoaded = true;
    appStateStore.setState({ physicsReady: true });
  }

  add(mesh, type, collider) {
    if (!this.rapierLoaded) return;

    let rigidBodyType = this.rapier.RigidBodyDesc[type]?.();
    if (!rigidBodyType) return;

    this.rigidBody = this.world.createRigidBody(rigidBodyType);
    let colliderType;

    switch (collider) {
      case "cuboid":
        const size = this.computeCuboidDimensions(mesh);
        colliderType = this.rapier.ColliderDesc.cuboid(size.x / 2, size.y / 2, size.z / 2);
        break;
      case "ball":
        const radius = this.computeBallDimensions(mesh);
        colliderType = this.rapier.ColliderDesc.ball(radius);
        break;
      case "trimesh":
        const { scaledVertices, indices } = this.computeTrimeshDimensions(mesh);
        colliderType = this.rapier.ColliderDesc.trimesh(scaledVertices, indices);
        break;
    }

    if (colliderType) {
      this.world.createCollider(colliderType, this.rigidBody);
    }

    // Set initial position & rotation
    this.rigidBody.setTranslation(mesh.getWorldPosition(new Vector3()), true);
    this.rigidBody.setRotation(mesh.getWorldQuaternion(new Quaternion()), true);

    this.meshMap.set(mesh, this.rigidBody);
    return this.rigidBody;
  }

  computeCuboidDimensions(mesh) {
    mesh.geometry.computeBoundingBox();
    const size = mesh.geometry.boundingBox.getSize(new Vector3());
    return size.multiply(mesh.getWorldScale(new Vector3()));
  }

  computeBallDimensions(mesh) {
    mesh.geometry.computeBoundingSphere();
    const radius = mesh.geometry.boundingSphere.radius;
    return radius * Math.max(...mesh.getWorldScale(new Vector3()).toArray());
  }

  computeTrimeshDimensions(mesh) {
    const { array: vertices } = mesh.geometry.attributes.position;
    const { array: indices } = mesh.geometry.index;
    const worldScale = mesh.getWorldScale(new Vector3());
    return { scaledVertices: vertices.map((v, i) => v * worldScale.getComponent(i % 3)), indices };
  }

  loop() {
    if (!this.rapierLoaded) return;
    this.world.step();

    const inverseMatrix = new Matrix4();
    const inverseQuaternion = new Quaternion();

    this.meshMap.forEach((rigidBody, mesh) => {
      const position = new Vector3().copy(rigidBody.translation());
      const rotation = new Quaternion().copy(rigidBody.rotation());

      if (mesh.parent) {
        inverseMatrix.copy(mesh.parent.matrixWorld).invert();
        position.applyMatrix4(inverseMatrix);

        inverseMatrix.extractRotation(mesh.parent.matrixWorld).invert();
        inverseQuaternion.setFromRotationMatrix(inverseMatrix);
        rotation.premultiply(inverseQuaternion);
      }

      mesh.position.copy(position);
      mesh.quaternion.copy(rotation);
    });
  }
}
