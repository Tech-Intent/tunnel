import * as THREE from "three";
import { FontLoader, TextGeometry } from "three/examples/jsm/Addons.js";
import { getGeometryWidth } from "./utils";
class Card {
  title: string;
  content: string;
  scene: THREE.Scene;
  position: THREE.Vector3;
  rotation: THREE.Vector3;
  isPanel: boolean;
  isBorder: boolean;
  loader: FontLoader;
  hitbox: THREE.Mesh;
  name: string;

  constructor(
    title: string,
    content: string,
    scene: THREE.Scene,
    position: THREE.Vector3,
    rotation: THREE.Vector3,
    isPanel: boolean = false,
    isBorder: boolean = false,
    name: string = ""
  ) {
    this.title = title;
    this.content = content;
    this.scene = scene;
    this.position = position;
    this.rotation = rotation;
    this.isPanel = isPanel;
    this.isBorder = isBorder;
    this.loader = new FontLoader();
    this.hitbox = new THREE.Mesh();
    this.createCard();
    this.name = name;
  }

  createCard() {
    this.loader.load(
      import.meta.env.BASE_URL + "fonts/Roboto_Regular.json",
      (font) => {
        const padding = 0.3;
        // Title
        const titleGeometry = new TextGeometry(this.title, {
          font,
          size: 0.2,
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

        // Wrap content to match title width

        const contentGeometry = new TextGeometry(this.content, {
          font,
          size: 0.15,
          depth: 0,
          curveSegments: 12,
        });
        contentGeometry.computeBoundingBox();
        contentGeometry.center();

        const contentMesh = new THREE.Mesh(contentGeometry, titleMaterial);

        // Calculate card height from text
        const lineCount = this.content.split("\n").length;
        const lineHeight = 0.2;
        const totalTextHeight = lineCount * 1.6 * lineHeight + 0.3;
        const cardWidth = titleWidth + padding * 2;
        const cardHeight = totalTextHeight + padding * 2;

        // Positioning the title and content
        const centerY = this.position.y;

        // Title
        titleMesh.position.set(
          this.position.x,
          centerY + cardHeight / 2 - padding - 0.1,
          this.position.z
        );
        titleMesh.rotation.set(
          this.rotation.x,
          this.rotation.y,
          this.rotation.z
        );
        this.scene.add(titleMesh);

        // Content
        if (this.content !== "") {
          contentMesh.position.set(
            this.position.x,
            centerY - cardHeight / 2 + lineHeight * lineCount,
            this.position.z
          );
          contentMesh.rotation.set(
            this.rotation.x,
            this.rotation.y,
            this.rotation.z
          );
          this.scene.add(contentMesh);

          // Divider line
          const dividerPoints = [
            new THREE.Vector3(-cardWidth / 2 + padding / 2, lineHeight, 0),
            new THREE.Vector3(cardWidth / 2 - padding / 2, lineHeight, 0),
          ];
          const dividerGeometry = new THREE.BufferGeometry().setFromPoints(
            dividerPoints
          );
          const divider = new THREE.Line(dividerGeometry, titleMaterial);
          divider.position.set(
            this.position.x,
            centerY + cardHeight / 2 - lineHeight * 2.5 - padding,
            this.position.z
          );
          divider.rotation.set(
            this.rotation.x,
            this.rotation.y,
            this.rotation.z
          );
          this.scene.add(divider);
        }

        // Rounded Rectangle (border)
        const radius = 0.1;
        const segments = 10;
        const w = cardWidth / 2;
        const h = cardHeight / 2;
        const r = radius;

        const arcTR = new THREE.ArcCurve(-w, h, r, Math.PI * 0.5, Math.PI); // Top-left
        const arcTL = new THREE.ArcCurve(w, h, r, 0, Math.PI * 0.5); // Top-right
        const arcBL = new THREE.ArcCurve(w, -h, r, -Math.PI * 0.5, 0); // Bottom-right
        const arcBR = new THREE.ArcCurve(-w, -h, r, Math.PI * 1, Math.PI * 1.5); // Bottom-left

        const points: THREE.Vector3[] = [
          ...arcTL
            .getPoints(segments)
            .map((p) => new THREE.Vector3(p.x, p.y, 0)),
          ...arcTR
            .getPoints(segments)
            .map((p) => new THREE.Vector3(p.x, p.y, 0)),
          ...arcBR
            .getPoints(segments)
            .map((p) => new THREE.Vector3(p.x, p.y, 0)),
          ...arcBL
            .getPoints(segments)
            .map((p) => new THREE.Vector3(p.x, p.y, 0)),
        ];

        if (this.isBorder) {
          const borderGeometry = new THREE.BufferGeometry().setFromPoints(
            points
          );
          const borderMaterial = new THREE.LineBasicMaterial({
            color: 0xb0e7ff,
          });
          const borderLine = new THREE.LineLoop(borderGeometry, borderMaterial);
          borderLine.position.copy(this.position);
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
        this.hitbox = new THREE.Mesh(
          backGeometry,
          new THREE.MeshBasicMaterial({
            visible: false,
            side: THREE.DoubleSide,
          })
        );
        this.hitbox.scale.set(1.2, 1.5, 1);
        this.hitbox.position.set(
          this.position.x,
          this.position.y,
          this.position.z
        );
        this.hitbox.name = this.name;
        this.scene.add(this.hitbox);
        console.log(this.hitbox.position);

        if (!this.isPanel) return;

        // Panel Background
        const backMaterial = new THREE.MeshBasicMaterial({
          color: 0xb0e7ff,
          opacity: 0.05,
          transparent: true,
          side: THREE.DoubleSide,
        });

        const backPanel = new THREE.Mesh(backGeometry, backMaterial);
        backPanel.position.set(
          this.position.x,
          this.position.y,
          this.position.z + 0.01
        );
        backPanel.rotation.set(
          this.rotation.x,
          this.rotation.y,
          this.rotation.z
        );
        this.scene.add(backPanel);
      }
    );
  }
}

export { Card };
