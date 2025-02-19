export default class AssetLoader {
    constructor() {
        this.assetStore = null;
        this.assetsToLoad = null;
        this.addLoadedAsset = null;

        this.gltfLoader = null;
        this.textureLoader = null;

        this.loadDependencies();
    }

    async loadDependencies() {
        const THREE = await import('three'); // ✅ Lazy-load THREE.js
        const { GLTFLoader } = await import('three/addons/loaders/GLTFLoader.js'); // ✅ Lazy-load GLTFLoader
        const { DRACOLoader } = await import('three/addons/loaders/DRACOLoader.js'); // ✅ Lazy-load DRACOLoader
        const { default: assetStore } = await import('./AssetStore.js'); // ✅ Lazy-load AssetStore

        this.assetStore = assetStore.getState();
        this.assetsToLoad = this.assetStore.assetsToLoad;
        this.addLoadedAsset = this.assetStore.addLoadedAsset;

        this.instantiateLoaders(THREE, GLTFLoader, DRACOLoader);
        this.startLoading();
    }

    instantiateLoaders(THREE, GLTFLoader, DRACOLoader) {
        const dracoLoader = new DRACOLoader();
        dracoLoader.setDecoderPath('/draco/');

        this.gltfLoader = new GLTFLoader();
        this.gltfLoader.setDRACOLoader(dracoLoader);

        this.textureLoader = new THREE.TextureLoader();
    }

    startLoading() {
        if (!this.assetsToLoad || !this.gltfLoader || !this.textureLoader) return;

        this.assetsToLoad.forEach((asset) => {
            if (asset.type === 'texture') {
                this.textureLoader.load(asset.path, (loadedAsset) => {
                    this.addLoadedAsset(loadedAsset, asset.id);
                });
            }
            if (asset.type === 'model') {
                this.gltfLoader.load(asset.path, (loadedAsset) => {
                    this.addLoadedAsset(loadedAsset, asset.id);
                });
            }
        });
    }
}
