import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

const ARViewPage = () => {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);

  // Handle image upload
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const file = event.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    if (!containerRef.current) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, containerRef.current.clientWidth / containerRef.current.clientHeight, 0.1, 1000);

    // Adjust camera position to ensure visibility
    camera.position.set(0, 1, 4); // Move camera further back and slightly above to view the model

    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    containerRef.current.appendChild(renderer.domElement);

    // Add lighting to the scene
    const ambientLight = new THREE.AmbientLight(0x404040, 2);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 2); // Increased intensity for better visibility
    directionalLight.position.set(5, 5, 5).normalize();
    scene.add(directionalLight);

    const pointLight = new THREE.PointLight(0xffffff, 2, 100); // Increased intensity
    pointLight.position.set(0, 5, 5);
    scene.add(pointLight);

    const spotLight = new THREE.SpotLight(0xffffff, 1);
    spotLight.position.set(-5, 5, 5);
    spotLight.target.position.set(0, 0, 0);
    scene.add(spotLight);

    // Load the background image if available
    if (uploadedImage) {
      const texture = new THREE.TextureLoader().load(uploadedImage, () => {
        console.log("Texture loaded successfully");
      }, undefined, (error) => {
        console.error("Error loading texture", error);
      });
      const planeGeometry = new THREE.PlaneGeometry(10, 10);
      const planeMaterial = new THREE.MeshBasicMaterial({ map: texture, side: THREE.DoubleSide });
      const plane = new THREE.Mesh(planeGeometry, planeMaterial);
      plane.position.set(0, 0, -5);
      scene.add(plane);
    }

    // Load the 3D plant model (using GLTFLoader)
    const loader = new GLTFLoader();
    loader.load('/models/first_try.glb', (gltf: any) => {
      const plant = gltf.scene;
      plant.scale.set(1, 1, 1); // Adjust scale for better visibility
      plant.position.set(0, 0, 0); // Place model at the center of the scene

      console.log("3D model loaded", gltf);
      scene.add(plant);
      setIsLoading(false); // Set loading to false once model is loaded
    }, undefined, (error: string) => {
      console.error("Error loading 3D model", error);
      setIsLoading(false); // Handle failure and stop loading
    });

    // Animation loop
    const animate = () => {
      renderer.render(scene, camera);
      requestAnimationFrame(animate); // Ensure animation loop is running
    };
    requestAnimationFrame(animate);

    return () => {
      renderer.dispose();
    };
  }, [uploadedImage]);

  return (
    <div>
      {isLoading && <div>Loading model...</div>} {/* Show loading message */}
      <input type="file" onChange={handleImageUpload} />
      <div ref={containerRef} style={{ width: '100%', height: '500px' }} />
    </div>
  );
};

export default ARViewPage;
