import * as THREE from "three";
import { FontLoader, TextGeometry } from "three/examples/jsm/Addons.js";

const createNameTitle = (scene: THREE.Scene) => {
  const loader = new FontLoader();
  loader.load("/tunnel/fonts/Roboto_Regular.json", (font) => {
    // Title
    const titleGeometry = new TextGeometry("NGUYEN VAN MAO", {
      font,
      size: 0.5,
      depth: 0,
      curveSegments: 12,
    });
    titleGeometry.computeBoundingBox();
    titleGeometry.center();

    const titleMaterial = new THREE.MeshStandardMaterial({
      color: 0x000000,
      emissive: 0xb0e7ff,
      emissiveIntensity: 1,
      metalness: 0.4,
      roughness: 0.3,
    });

    const titleMesh = new THREE.Mesh(titleGeometry, titleMaterial);
    titleMesh.rotateY(0);
    titleMesh.position.set(0, 2.85, -2.95);
    scene.add(titleMesh);

    const title2Geometry = new TextGeometry("EVOLVING WITH TECH", {
      font,
      size: 0.26,
      depth: 0,
      curveSegments: 12,
    });
    title2Geometry.computeBoundingBox();
    title2Geometry.center();

    const title2Mesh = new THREE.Mesh(title2Geometry, titleMaterial);
    title2Mesh.rotateY(0);
    title2Mesh.position.set(-1, 2.15, -2.95);
    scene.add(title2Mesh);

    const title3Geometry = new TextGeometry("LEADING WITH INTEND", {
      font,
      size: 0.26,
      depth: 0,
      curveSegments: 12,
    });
    title3Geometry.computeBoundingBox();
    title3Geometry.center();

    const title3Mesh = new THREE.Mesh(title3Geometry, titleMaterial);
    title3Mesh.position.set(1, 1.75, -2.95);
    scene.add(title3Mesh);
    const dividerPoints = [
      new THREE.Vector3(-2.8, 0, 0),
      new THREE.Vector3(2.8, 0, 0),
    ];
    const dividerGeometry = new THREE.BufferGeometry().setFromPoints(
      dividerPoints
    );
    const divider = new THREE.Line(dividerGeometry, titleMaterial);
    divider.position.set(0, 2.45, -2.95);
    scene.add(divider);
  });
};

export default createNameTitle;
