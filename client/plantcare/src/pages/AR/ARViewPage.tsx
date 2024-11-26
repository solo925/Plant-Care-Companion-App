import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

const ARViewPage = () => {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const modelRef = useRef<THREE.Object3D | null>(null);
  const planeRef = useRef<THREE.Mesh | null>(null);
  const isDragging = useRef(false);
  const dragOffset = useRef(new THREE.Vector3());
  const mouse = useRef(new THREE.Vector2());
  const sceneRef = useRef<THREE.Scene | null>(null);


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
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(
      75,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.set(0, 2, 6);

    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    containerRef.current.appendChild(renderer.domElement);

   
    const ambientLight = new THREE.AmbientLight(0x404040, 2);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 2);
    directionalLight.position.set(5, 5, 5).normalize();
    scene.add(directionalLight);


    const dragPlaneGeometry = new THREE.PlaneGeometry(10, 10);
    const dragPlaneMaterial = new THREE.MeshBasicMaterial({ visible: false });
    const dragPlane = new THREE.Mesh(dragPlaneGeometry, dragPlaneMaterial);
    dragPlane.position.set(0, 0, 0);
    dragPlane.rotateX(-Math.PI / 2);
    scene.add(dragPlane);
    planeRef.current = dragPlane;

   
    const loader = new GLTFLoader();
    loader.load(
      '/models/first_try.glb',
      (gltf: any) => {
        const plant = gltf.scene;
        plant.scale.set(6, 6, 6);
        plant.position.set(0, 0, 0);
        modelRef.current = plant;
        scene.add(plant);
        setIsLoading(false);
      },
      undefined,
      (error: string) => {
        console.error('Error loading 3D model', error);
        setIsLoading(false);
      }
    );

   
    const raycaster = new THREE.Raycaster();

   
    const onMouseMove = (event: MouseEvent) => {
      mouse.current.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.current.y = -(event.clientY / window.innerHeight) * 2 + 1;

      if (isDragging.current && modelRef.current) {
        raycaster.setFromCamera(mouse.current, camera);
        const intersects = raycaster.intersectObject(planeRef.current!);

        if (intersects.length > 0) {
          const newPosition = intersects[0].point.sub(dragOffset.current);
          modelRef.current.position.copy(newPosition);
        }
      }
    };

    const onMouseDown = () => {
      if (modelRef.current) {
        raycaster.setFromCamera(mouse.current, camera);
        const intersects = raycaster.intersectObject(modelRef.current);

        if (intersects.length > 0) {
          isDragging.current = true;

          const planeIntersect = raycaster.intersectObject(planeRef.current!);
          if (planeIntersect.length > 0) {
            dragOffset.current.copy(planeIntersect[0].point).sub(modelRef.current.position);
          }
        }
      }
    };

    const onMouseUp = () => {
      isDragging.current = false;
    };

 
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mouseup', onMouseUp);

 
    const animate = () => {
      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    };
    animate();

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mouseup', onMouseUp);
      renderer.dispose();
    };
  }, []);

  useEffect(() => {
    if (!sceneRef.current || !uploadedImage) return;

    const scene = sceneRef.current;

    
    if (modelRef.current) {
      scene.remove(modelRef.current);
      modelRef.current = null;
    }

    const texture = new THREE.TextureLoader().load(uploadedImage);
    const planeGeometry = new THREE.PlaneGeometry(10, 10);
    const planeMaterial = new THREE.MeshBasicMaterial({ map: texture, side: THREE.DoubleSide });
    const plane = new THREE.Mesh(planeGeometry, planeMaterial);
    plane.position.set(0, 0, -5);
    scene.add(plane);

   
    const loader = new GLTFLoader();
    loader.load('/models/first_try.glb', (gltf: any) => {
      const plant = gltf.scene;
      plant.scale.set(6, 6, 6);
      plant.position.set(0, 0, 0);
      modelRef.current = plant;
      scene.add(plant);
    });
  }, [uploadedImage]);

  return (
    <div>
      {isLoading && <div>Loading model...</div>}
      <input type="file" onChange={handleImageUpload} />
      <div ref={containerRef} style={{ width: '100%', height: '500px' }} />
    </div>
  );
};

export default ARViewPage;
