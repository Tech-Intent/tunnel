import * as THREE from "three";
import AdsCard from "./AdsCard";

const createCardSystem = (scene: THREE.Scene, camera: THREE.Camera) => {
  const cardData = [
    {
      title: "Coding Change Into the World",
      subtitle: "coding is my passion",
      content:
        "As a Senior Software Developer, I craft solutions that drive progress and deliver real impact. With deep experience in full-stack development, cloud architecture, and interactive interfaces, I turn complex challenges into clean, scalable code. For me, development is more than building features—it's about creating lasting value through thoughtful, high-quality engineering.",
      position: new THREE.Vector3(5.5, 2.5, 2.98),
      rotation: new THREE.Vector3(0, Math.PI, 0),
      isLeft: true,
      isVisible: true,
    },
    {
      title: "Senior Software Developer",
      subtitle: "NovaSoft Labs\nDec 2021-Present\n(Berlin, Germany-Remote)",
      content:
        "Optimized frontend development with a modular React system, automated deployments to reduce release bugs by 70%, and enhanced dashboard performance using Three.js, improving speed and compatibility across devices.",
      position: new THREE.Vector3(15.6, 2.5, 2.98),
      rotation: new THREE.Vector3(0, Math.PI, 0),
      isLeft: true,
      isVisible: true,
    },
    {
      title: "Software Developer",
      subtitle:
        "Concentrix Tigerspike\nApr 2019 – Nov 2021\nSydney, Australia (Remote)",
      content:
        "Streamlined development with reusable TypeScript modules, optimized deployment workflows with containerization and CI/CD, and improved real-time dashboard performance, reducing response time by 50%.",
      position: new THREE.Vector3(20.7, 2.5, 2.85),
      rotation: new THREE.Vector3(0, Math.PI, 0),
      isLeft: true,
      isVisible: true,
    },
    {
      title: "Junior Software Developer",
      subtitle:
        "FPT Software\nJul 2017 – Mar 2019\nHo Chi Minh City,Vietnam (Remote)",
      content:
        "Quickly adapted to a complex codebase, delivering full-stack features and resolving third-party API integration issues to enhance system reliability and improve user flow for HR and logistics clients.",
      position: new THREE.Vector3(25.7, 2.5, 2.98),
      rotation: new THREE.Vector3(0, Math.PI, 0),
      isLeft: true,
      isVisible: true,
    },
    {
      title: "Ho Chi Minh City University of Technology",
      subtitle:
        "Bachelor’s degree of Computer Science\nSep 2013 – Jun 2017\nGPA:3.7/4.0",
      content:
        "Bachelor’s degree in Computer Science from Ho Chi Minh City University of Technology, graduating with a GPA of 3.7/4.0, showcasing strong technical foundations in software development.",
      position: new THREE.Vector3(9.4, 2.5, -2.98),
      rotation: new THREE.Vector3(0, Math.PI, 0),
      isLeft: false,
      isVisible: true,
    },
    {
      title: "What can I do? And what do you want?",
      subtitle: "Looking for the right solution? Let my skills deliver it.",
      content:
        "React.js, TypeScript, Node.js, PostgreSQL, Express.js, JavaScript, Three.js, Docker, AWS Lambda, AWS S3, CloudFront, GitHub Actions, Redis, Storybook, CI/CD, REST APIs, MongoDB, RDS, MySQL, Git, MVC, WebGL.",
      position: new THREE.Vector3(28.4, 2.5, -2.98),
      rotation: new THREE.Vector3(0, Math.PI, 0),
      isLeft: false,
      isVisible: true,
    },
    {
      title: "Do you want to contact to me?",
      subtitle: "you can contact to me through many platforms",
      content: "Just Keep Going, and you will see how to contact to me",
      position: new THREE.Vector3(35.7, 2.5, 2.98),
      rotation: new THREE.Vector3(0, Math.PI, 0),
      isLeft: true,
      isVisible: true,
    },
  ];
  const linkCardData = [
    {
      title: "www.linkedin.com/in/nguyen-van-mao-ba9959361",
      subtitle: "Linked in",
      content: "Press Space Button to visit Linked In",
      position: new THREE.Vector3(47.3, 2.5, -2.98),
      rotation: new THREE.Vector3(0, Math.PI, 0),
      isLeft: false,
      isPanel: true,
      name: "LinkedInCard",
    },
    {
      title: "vanmaonguyen60@gmail.com",
      subtitle: "Gmail",
      content: "Press Space Button to contact through Gmail",
      position: new THREE.Vector3(56.6, 2.5, -2.98),
      rotation: new THREE.Vector3(0, Math.PI, 0),
      isLeft: false,
      isPanel: true,
      name: "GmailCard",
    },
    {
      title: "https://github.com/Tech-Intent",
      subtitle: "GitHub",
      content: "Press Space Button to visit my github.",
      position: new THREE.Vector3(45.9, 2.5, 2.98),
      rotation: new THREE.Vector3(0, Math.PI, 0),
      isLeft: true,
      isPanel: true,
      name: "GitHubCard",
    },
  ];

  const cards = cardData.map(
    (data) =>
      new AdsCard(
        data.title,
        data.subtitle,
        data.content,
        scene,
        camera,
        data.position,
        data.rotation,
        data.isLeft,
        data.isVisible
      )
  );
  const linkCards = linkCardData.map((data) => {
    const linkCard = new AdsCard(
      data.title,
      data.subtitle,
      data.content,
      scene,
      camera,
      data.position,
      data.rotation,
      data.isLeft,
      data.isPanel,
      data.name
    );
    cards.push(linkCard);
    return linkCard.cardHitbox;
  });

  return { cards, linkCards };
};

export default createCardSystem;
