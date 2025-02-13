const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Load Textures
const loader = new THREE.TextureLoader();
const earthTexture = loader.load('https://upload.wikimedia.org/wikipedia/commons/6/6f/Earth_Eastern_Hemisphere.jpg');
const starTexture = loader.load('https://upload.wikimedia.org/wikipedia/commons/thumb/8/8d/Starsinthesky.jpg/800px-Starsinthesky.jpg');
const planetTexture = loader.load('https://upload.wikimedia.org/wikipedia/commons/9/99/Mars_in_true_color.png');
const galaxyTexture = loader.load('https://upload.wikimedia.org/wikipedia/commons/2/2f/Nebulae.jpg');

// Create Earth Sphere
const earthGeometry = new THREE.SphereGeometry(5, 64, 64);
const earthMaterial = new THREE.MeshStandardMaterial({ map: earthTexture });
const earth = new THREE.Mesh(earthGeometry, earthMaterial);
scene.add(earth);

// Atmosphere Glow Effect
const atmosphereGeometry = new THREE.SphereGeometry(5.2, 64, 64);
const atmosphereMaterial = new THREE.MeshBasicMaterial({
    color: 0x3399FF,
    transparent: true,
    opacity: 0.15,
});
const atmosphere = new THREE.Mesh(atmosphereGeometry, atmosphereMaterial);
scene.add(atmosphere);

// Stars Field
const starsGeometry = new THREE.BufferGeometry();
const starsCount = 8000;
const positions = new Float32Array(starsCount * 3);
for (let i = 0; i < starsCount * 3; i++) {
    positions[i] = (Math.random() - 0.5) * 2000;
}
starsGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
const starsMaterial = new THREE.PointsMaterial({ color: 0xffffff, size: 1, transparent: true });
const stars = new THREE.Points(starsGeometry, starsMaterial);
scene.add(stars);

// Galaxy Background Sphere
const galaxyGeometry = new THREE.SphereGeometry(500, 64, 64);
const galaxyMaterial = new THREE.MeshBasicMaterial({
    map: galaxyTexture,
    side: THREE.BackSide,
});
const galaxy = new THREE.Mesh(galaxyGeometry, galaxyMaterial);
scene.add(galaxy);

// Additional Planets
const planets = [];
for (let i = 0; i < 5; i++) {
    const planetGeo = new THREE.SphereGeometry(2, 64, 64);
    const planetMat = new THREE.MeshStandardMaterial({ map: planetTexture });
    const planet = new THREE.Mesh(planetGeo, planetMat);
    planet.position.set(Math.random() * 100 - 50, Math.random() * 50 - 25, Math.random() * -200 - 50);
    planets.push(planet);
    scene.add(planet);
}

// Sunlight Simulation
const sunlight = new THREE.PointLight(0xffffff, 2, 200);
sunlight.position.set(50, 50, 50);
scene.add(sunlight);

// Camera Position
camera.position.z = 20;

// Animation Loop
function animate() {
    earth.rotation.y += 0.0015;
    atmosphere.rotation.y += 0.0015;
    stars.rotation.y += 0.0005;
    galaxy.rotation.y += 0.0003;
    planets.forEach(planet => planet.rotation.y += 0.001);
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
}
animate();

// Mouse Drag Rotation
let isDragging = false;
let previousMousePosition = { x: 0, y: 0 };

document.addEventListener('mousedown', () => { isDragging = true; });
document.addEventListener('mouseup', () => { isDragging = false; });
document.addEventListener('mousemove', (event) => {
    if (!isDragging) return;
    const deltaX = event.clientX - previousMousePosition.x;
    const deltaY = event.clientY - previousMousePosition.y;
    earth.rotation.y += deltaX * 0.005;
    earth.rotation.x += deltaY * 0.005;
    previousMousePosition = { x: event.clientX, y: event.clientY };
});

// Resize Handling
window.addEventListener('resize', () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
});