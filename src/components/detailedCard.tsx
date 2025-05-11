import * as THREE from "three";
import { FontLoader, TextGeometry } from "three/examples/jsm/Addons.js";
import { easeInOutQuad, getGeometryWidth, wrapText } from "./utils";

class DetailedCard {
  title: string;
  scene: THREE.Scene;
  position: THREE.Vector3;
  rotation: THREE.Vector3;
  isLeft: boolean;
  isPanel: boolean;
  isBorder: boolean;
  loader: FontLoader;
  flag: boolean;
  setAnimation: (flag: boolean) => void;
  animateDetail: (delta: number) => void;
  hitbox: THREE.Mesh;

  constructor(
    title: string,
    scene: THREE.Scene,
    position: THREE.Vector3,
    rotation: THREE.Vector3,
    isLeft: boolean = false,
    isPanel: boolean = false,
    isBorder: boolean = false,
    animateDetail: (delta: number) => void = (delta: number) => {
      return delta;
    }
  ) {
    this.title = title;
    this.scene = scene;
    this.position = position;
    this.rotation = rotation;
    this.isLeft = isLeft;
    this.isPanel = isPanel;
    this.isBorder = isBorder;
    this.loader = new FontLoader();
    this.flag = false;
    this.hitbox = new THREE.Mesh();
    this.animateDetail = animateDetail;
    this.setAnimation = (flag: boolean) => flag;
    this.createDetails();
  }

  createDetails() {
    this.loader.load("/fonts/Roboto_Regular.json", (font) => {
      const padding = 0.2;
      const fontSize = 0.1;
      this.title = wrapText(this.title, 50);
      const titleGeometry = new TextGeometry(this.title, {
        font,
        size: fontSize,
        depth: 0,
        curveSegments: 12,
      });
      titleGeometry.computeBoundingBox();
      titleGeometry.center();
      const titleWidth = getGeometryWidth(titleGeometry);

      const titleMaterial = new THREE.MeshStandardMaterial({
        color: 0x000000,
        emissive: 0xb0e7ff,
        emissiveIntensity: 1,
        metalness: 0.4,
        roughness: 0.3,
      });

      const titleMesh = new THREE.Mesh(titleGeometry, titleMaterial);

      const wrappedContent = wrapText(this.title, 50);
      const lineCount = wrappedContent.split("\n").length;
      const totalTextHeight = lineCount * fontSize * 1.2;
      const cardWidth = titleWidth + padding * 2;
      const cardHeight = totalTextHeight + padding * 2;

      const centerY = this.position.y;

      titleMesh.position.set(
        this.position.x,
        centerY,
        this.position.z - (titleWidth / 2 + padding) * (this.isLeft ? 1 : -1)
      );
      titleMesh.rotation.set(this.rotation.x, this.rotation.y, this.rotation.z);
      this.scene.add(titleMesh);
      let borderLine: THREE.LineLoop;
      let backPanel: THREE.Mesh;

      const radius = 0.1;
      const segments = 10;
      const w = cardWidth / 2;
      const h = cardHeight / 2;
      const r = radius;
      const arcTR = new THREE.ArcCurve(-w, h, r, Math.PI * 0.5, Math.PI);
      const arcTL = new THREE.ArcCurve(w, h, r, 0, Math.PI * 0.5);
      const arcBL = new THREE.ArcCurve(w, -h, r, -Math.PI * 0.5, 0);
      const arcBR = new THREE.ArcCurve(-w, -h, r, Math.PI * 1, Math.PI * 1.5);

      const points: THREE.Vector3[] = [
        ...arcTL.getPoints(segments).map((p) => new THREE.Vector3(p.x, p.y, 0)),
        ...arcTR.getPoints(segments).map((p) => new THREE.Vector3(p.x, p.y, 0)),
        ...arcBR.getPoints(segments).map((p) => new THREE.Vector3(p.x, p.y, 0)),
        ...arcBL.getPoints(segments).map((p) => new THREE.Vector3(p.x, p.y, 0)),
      ];
      if (this.isBorder) {
        const borderGeometry = new THREE.BufferGeometry().setFromPoints(points);
        const borderMaterial = new THREE.LineBasicMaterial({
          color: 0xb0e7ff,
        });
        borderLine = new THREE.LineLoop(borderGeometry, borderMaterial);
        borderLine.position.set(
          this.position.x,
          centerY,
          this.position.z - (titleWidth / 2 + padding) * (this.isLeft ? 1 : -1)
        );
        borderLine.rotation.set(
          this.rotation.x,
          this.rotation.y,
          this.rotation.z
        );
        this.scene.add(borderLine);
      }
      const shapePoints: THREE.Vector2[] = points.map(
        (p) => new THREE.Vector2(p.x, p.y)
      );
      const shape = new THREE.Shape();
      shape.moveTo(shapePoints[0].x, shapePoints[0].y);
      for (let i = 1; i < shapePoints.length; i++) {
        shape.lineTo(shapePoints[i].x, shapePoints[i].y);
      }
      shape.lineTo(shapePoints[0].x, shapePoints[0].y);
      const backGeometry = new THREE.ShapeGeometry(shape);
      const backMaterial = new THREE.MeshBasicMaterial({
        color: 0x406799,
        opacity: 0.85,
        transparent: true,
        side: THREE.DoubleSide,
      });
      if (this.isPanel) {
        backPanel = new THREE.Mesh(backGeometry, backMaterial);
        this.hitbox = new THREE.Mesh(
          backGeometry,
          new THREE.MeshBasicMaterial({
            visible: false,
            side: THREE.DoubleSide,
          })
        );
        this.hitbox.scale.set(1.5, 1.5, 1);
        this.hitbox.position.set(
          this.position.x + 0.01,
          this.position.y,
          this.position.z - (titleWidth / 2 + padding) * (this.isLeft ? 1 : -1)
        );
        this.hitbox.rotation.set(
          this.rotation.x,
          this.rotation.y,
          this.rotation.z
        );
        this.scene.add(this.hitbox);
        backPanel.position.set(
          this.position.x + 0.01,
          this.position.y,
          this.position.z - (titleWidth / 2 + padding) * (this.isLeft ? 1 : -1)
        );
        backPanel.rotation.set(
          this.rotation.x,
          this.rotation.y,
          this.rotation.z
        );
        this.scene.add(backPanel);
      }
      let animationProgress = 0;
      const animationDuration = 1.0; // seconds
      let animating = false;
      let startZ = 0;
      let endZ = 0;

      const setAnimationTargets = (flag: boolean) => {
        startZ = titleMesh.position.z;
        if (!flag)
          endZ =
            this.position.z +
            (titleWidth / 2 + padding + 0.3) * (this.isLeft ? 1 : -1);
        else
          endZ =
            this.position.z -
            (titleWidth / 2 + padding) * (this.isLeft ? 1 : -1);
        animationProgress = 0;
        animating = true;
      };

      this.setAnimation = setAnimationTargets;
      const animateDetails = (delta: number): void => {
        if (!animating) return;

        animationProgress += delta;
        const t = Math.min(animationProgress / animationDuration, 1);
        const easedT = easeInOutQuad(t);
        const currentZ = startZ + (endZ - startZ) * easedT;
        backMaterial.opacity = Math.abs(
          (this.position.z +
            (titleWidth / 2 + padding) * (this.isLeft ? 1 : -1) -
            currentZ) /
            (titleWidth + padding * 2 + 0.3)
        );

        titleMesh.position.setZ(currentZ);
        borderLine.position.setZ(currentZ);
        backPanel.position.setZ(currentZ);
        this.hitbox.position.setZ(currentZ);
        this.scene.add(this.hitbox);

        if (t >= 1) {
          animating = false; // stop when done
        }
      };
      this.animateDetail = animateDetails;
    });
  }
}

export { DetailedCard };
