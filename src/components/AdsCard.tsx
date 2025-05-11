import * as THREE from "three";
import { Card } from "./card"; // Import the Card class
import { DetailedCard } from "./detailedCard"; // Import the DetailedCard class

class AdsCard {
  private title: string;
  private content: string;
  private details: string;
  private scene: THREE.Scene;
  private position: THREE.Vector3;
  private rotation: THREE.Vector3;
  private isLeft: boolean;
  private isPanel: boolean;
  private raycaster: THREE.Raycaster = new THREE.Raycaster();
  private pointer = new THREE.Vector2(0, 0);
  private camera: THREE.Camera;
  private isfocused: boolean;
  private name: string;
  public animateDetail: (delta: number) => void;
  public changeFlag: () => void;
  public cardHitbox: THREE.Mesh;

  constructor(
    title: string,
    content: string,
    details: string,
    scene: THREE.Scene,
    camera: THREE.Camera,
    position: THREE.Vector3,
    rotation: THREE.Vector3,
    isLeft: boolean = false,
    isPanel: boolean = false,
    name: string = ""
  ) {
    this.title = title;
    this.content = content;
    this.details = details;
    this.scene = scene;
    this.camera = camera;
    this.position = position;
    this.rotation = rotation;
    this.isLeft = isLeft;
    this.isPanel = isPanel;
    this.isfocused = false;
    this.name = name;
    this.cardHitbox = new THREE.Mesh();
    this.animateDetail = (delta: number) => delta;
    this.changeFlag = () => {};
    this.create();
  }
  create() {
    const card = new Card(
      this.title,
      this.content,
      this.scene,
      this.position,
      new THREE.Vector3(
        this.rotation.x,
        this.rotation.y + (this.isLeft ? 0 : Math.PI),
        this.rotation.z
      ),
      this.isPanel,
      true,
      this.name
    );
    this.cardHitbox = card.hitbox;

    const detailedCard = new DetailedCard(
      this.details,
      this.scene,
      new THREE.Vector3(
        this.position.x + (this.isLeft ? 2.625 : 4.1),
        this.position.y,
        this.position.z
      ),
      new THREE.Vector3(
        this.rotation.x,
        this.rotation.y + Math.PI / 2,
        this.rotation.z
      ),
      this.isLeft,
      true,
      true
    );

    this.animateDetail = (delta: number) => {
      detailedCard.animateDetail(delta);
      this.raycaster.setFromCamera(this.pointer, this.camera);
      const intersects = this.raycaster.intersectObject(card.hitbox, true);
      const intersects2 = this.raycaster.intersectObject(
        detailedCard.hitbox,
        true
      );
      if (intersects.length > 0 && intersects[0].distance < 4.5) {
        this.isfocused = true;
      }
      if (
        ((intersects2.length > 0 && intersects2[0].distance > 1.5) ||
          intersects.length > 0) &&
        this.isfocused
      ) {
        detailedCard.setAnimation(true);
      } else {
        detailedCard.setAnimation(false);
        this.isfocused = false;
      }
    };
  }
}

export default AdsCard;
