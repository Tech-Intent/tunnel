import * as THREE from "three";
import { Scene } from "three";

const createTunnel = (scene: Scene) => {
  
  const group = new THREE.Group();
  // Create a rounded cube using BoxGeometry and add radius to the edges
  const geometry = new THREE.BoxGeometry(2, 0.1, 2, 8, 2); // The 4 segments help with smoothing the edges
  const cubeMaterial = new THREE.MeshPhysicalMaterial({
    color: 0xaaaaaa, // Metal tile base color (light gray)
    metalness: 1, // Metal-like surface
    roughness: 1, // Slightly smooth
  });
  const roundedCube = new THREE.Mesh(geometry, cubeMaterial);
  //floor
  for (let i = -4; i < 36; i++) {
    let cubeClone = roundedCube.clone();
    let cubeLeft = roundedCube.clone();
    let cubeRight = roundedCube.clone();
    let cubeLeft2 = roundedCube.clone();
    let cubeRight2 = roundedCube.clone();

    cubeClone.position.set(i * 2.05, 0, 0);
    cubeClone.scale.set(1, 0, 1);

    cubeLeft.scale.set(1, 0, 0.5);
    cubeRight.scale.set(1, 0, 0.5);
    cubeLeft.position.set(i * 2.05 + 0.5, 0, 1.51);
    cubeRight.position.set(i * 2.05 + 0.5, 0, -1.51);

    cubeLeft2.scale.set(1, 0, 0.5);
    cubeRight2.scale.set(1, 0, 0.5);
    cubeLeft2.position.set(i * 2.05 - 0.5, 0, 2.52);
    cubeRight2.position.set(i * 2.05 - 0.5, 0, -2.52);
    group.add(cubeClone);
    group.add(cubeRight);
    group.add(cubeLeft);
    group.add(cubeLeft2);
    group.add(cubeRight2);
  }
  //ceil
  for (let i = -4; i < 36; i++) {
    let cubeClone = roundedCube.clone();
    let cubeLeft2 = roundedCube.clone();
    let cubeRight;
    let cubeLeft;
    if (i % 2 == 0) {
      cubeRight = new THREE.Mesh(
        geometry,
        new THREE.MeshStandardMaterial({
          color: 0x000000,
          emissive: 0xb0e7ff,
          emissiveIntensity: 1,
          metalness: 0.4,
          roughness: 0.3,
        })
      );
      cubeLeft = cubeRight.clone();
    } else {
      cubeRight = roundedCube.clone();
      cubeLeft = roundedCube.clone();
    }
    let cubeRight2 = roundedCube.clone();

    cubeClone.position.set(i * 2.05, 4, 0);

    cubeLeft.scale.set(1, 1, 0.5);
    cubeRight.scale.set(1, 1, 0.5);
    cubeLeft.position.set(i * 2.05 + 0.5, 4, 1.51);
    cubeRight.position.set(i * 2.05 + 0.5, 4, -1.51);

    cubeLeft2.scale.set(1, 1, 0.5);
    cubeRight2.scale.set(1, 1, 0.5);
    cubeLeft2.position.set(i * 2.05 - 0.5, 4.1, 2.52);
    cubeRight2.position.set(i * 2.05 - 0.5, 4.1, -2.52);

    group.add(cubeClone);
    group.add(cubeRight);
    group.add(cubeLeft);
    group.add(cubeLeft2);
    group.add(cubeRight2);
  }
  //wall
  for (let i = -2; i < 18; i++) {
    let cubeLeft = roundedCube.clone();
    cubeLeft.scale.set(2.5, 30, 0);
    cubeLeft.position.set(i * 5.05 + 0.5, 2.51, 3);
    group.add(cubeLeft);
    let cubeLeft2 = roundedCube.clone();
    cubeLeft2.scale.set(2, 7, 0);
    cubeLeft2.position.set(i * 4.01 - 0.5, 0.65, 3);
    group.add(cubeLeft2);

    if (i % 2 == 0) {
      let cubeRight = roundedCube.clone();
      cubeRight.scale.set(4, 30, 0);
      cubeRight.position.set(i * 4.73 - 9.5, 2.51, -3);
      group.add(cubeRight);

      let cubeRight2 = roundedCube.clone();
      cubeRight2.scale.set(5, 7, 0);
      cubeRight2.position.set(i * 5.03 - 5.5, 0.65, -3);

      group.add(cubeRight2);
    }
  }

  let cubeLeft = new THREE.Mesh(
    geometry,
    new THREE.MeshStandardMaterial({
      color: 0x000000,
      emissive: 0x000000,
      emissiveIntensity: 1,
      metalness: 0.4,
      roughness: 0.3,
    })
  );
  let cubeRight = new THREE.Mesh(
    geometry,
    new THREE.MeshStandardMaterial({
      color: 0x000000,
      emissive: 0x000000,
      emissiveIntensity: 1,
      metalness: 0.4,
      roughness: 0.3,
    })
  );
  cubeLeft.scale.set(40, 1.4, 0.1);
  cubeRight.scale.set(40, 1.4, 0.1);
  cubeLeft.position.set(30, 0.15, 3);
  cubeRight.position.set(30, 0.15, -3);
  group.add(cubeLeft);
  group.add(cubeRight);

  // Add the rounded cube to the scene
  scene.add(group);
  return group;
};

export default createTunnel;
