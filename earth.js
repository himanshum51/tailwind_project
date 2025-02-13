const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Load space background
const loader = new THREE.TextureLoader();
const spaceTexture = loader.load('https://threejs.org/examples/textures/skybox/space.jpg'); // Change to a high-quality deep space texture
scene.background = spaceTexture;

// Load Earth textures
const earthTexture = loader.load('https://threejs.org/examples/textures/earth_atmos_2048.jpg');
const earthBumpMap = loader.load('https://threejs.org/examples/textures/earth_bump_2048.jpg');
const earthSpecMap = loader.load('https://threejs.org/examples/textures/earth_specular_2048.jpg');
const cloudTexture = loader.load('https://threejs.org/examples/textures/earth_clouds_2048.png');

// Create Earth sphere
const earthGeometry = new THREE.SphereGeometry(3, 64, 64);
const earthMaterial = new THREE.MeshPhongMaterial({
    map: earthTexture,
    bumpMap: earthBumpMap,
    bumpScale: 0.05,
    specularMap: earthSpecMap,
    specular: new THREE.Color(0x333333),
});
const earth = new THREE.Mesh(earthGeometry, earthMaterial);
scene.add(earth);

// Create atmosphere glow (halo effect)
const atmosphereGeometry = new THREE.SphereGeometry(3.1, 64, 64);
const atmosphereMaterial = new THREE.MeshBasicMaterial({
    color: 0x00aaff,
    transparent: true,
    opacity: 0.2,
    blending: THREE.AdditiveBlending,
});
const atmosphere = new THREE.Mesh(atmosphereGeometry, atmosphereMaterial);
earth.add(atmosphere);

// Create clouds layer
const cloudGeometry = new THREE.SphereGeometry(3.05, 64, 64);
const cloudMaterial = new THREE.MeshStandardMaterial({
    map: cloudTexture,
    transparent: true,
    opacity: 0.6,
});
const clouds = new THREE.Mesh(cloudGeometry, cloudMaterial);
earth.add(clouds);

// Create Moon
const moonTexture = loader.load('https://threejs.org/examples/textures/moon_1024.jpg');
const moonGeometry = new THREE.SphereGeometry(0.8, 32, 32);
const moonMaterial = new THREE.MeshPhongMaterial({ map: moonTexture });
const moon = new THREE.Mesh(moonGeometry, moonMaterial);
scene.add(moon);

// Add sunlight
const sunlight = new THREE.PointLight(0xffffff, 1.5, 100);
sunlight.position.set(10, 5, 10);
scene.add(sunlight);

// Camera setup
camera.position.z = 8;

// Animation loop
function animate() {
    requestAnimationFrame(animate);
    
    // Rotate Earth and clouds
    earth.rotation.y += 0.001;
    clouds.rotation.y += 0.002;
    
    // Moon orbit around Earth
    const time = Date.now() * 0.0005;
    moon.position.x = 6 * Math.cos(time);
    moon.position.z = 6 * Math.sin(time);
    
    renderer.render(scene, camera);
}
animate();

// Handle window resizing
window.addEventListener('resize', () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
});
