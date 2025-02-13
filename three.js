
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('space-bg'), alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Load nebula or galaxy background texture
const loader = new THREE.TextureLoader();
const spaceTexture = loader.load('https://threejs.org/examples/textures/skybox/space.jpg'); // Change with a better texture
scene.background = spaceTexture;

// Create stars in the background
const starsGeometry = new THREE.BufferGeometry();
const starsCount = 1000;
const posArray = new Float32Array(starsCount * 3);

for (let i = 0; i < starsCount * 3; i++) {
    posArray[i] = (Math.random() - 0.5) * 150; // Expanded range for a larger star field
}

starsGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
const starsMaterial = new THREE.PointsMaterial({ color: 0xffffff, size: 0.1 });
const starField = new THREE.Points(starsGeometry, starsMaterial);
scene.add(starField);

// Load Sun texture (or create a glowing effect)
const sunTexture = loader.load('https://example.com/sun-texture.jpg'); // Replace with a better texture for the Sun's surface

// Sun setup with more realism
const sunGeometry = new THREE.SphereGeometry(4, 64, 64); // Higher segments for smoother geometry
const sunMaterial = new THREE.MeshStandardMaterial({
    color: 0xFFFF00, // Yellow color
    emissive: 0xFFFF00, // Makes the Sun glow
    emissiveIntensity: 2, // Increased intensity for a stronger glow
    map: sunTexture, // Add texture to simulate solar surface
    roughness: 0.2, // Add roughness to make the surface less shiny
    metalness: 0.5, // Add a little metallic look to the surface
});

// Add a glowing corona around the Sun
const coronaMaterial = new THREE.MeshBasicMaterial({
    color: 0xFFFF00, // Yellowish corona
    opacity: 0.3, // Slight transparency to create a glowing effect
    transparent: true, // Transparency enabled for corona
    blending: THREE.AdditiveBlending, // Blending mode to make it glow
});
const coronaGeometry = new THREE.SphereGeometry(4.5, 64, 64); // Slightly larger sphere for the corona
const corona = new THREE.Mesh(coronaGeometry, coronaMaterial);
scene.add(corona);

// Add the Sun mesh
const sun = new THREE.Mesh(sunGeometry, sunMaterial);
scene.add(sun);

// Create planets and their orbits
const planetData = [
    { name: 'Mercury', size: 0.4, distance: 6, speed: 0.02, color: 0x888888 },
    { name: 'Venus', size: 0.9, distance: 10, speed: 0.015, color: 0xE0C089 },
    { name: 'Earth', size: 1, distance: 14, speed: 0.01, color: 0x0000FF },
    { name: 'Mars', size: 0.6, distance: 18, speed: 0.008, color: 0xFF4500 },
    { name: 'Jupiter', size: 2, distance: 25, speed: 0.005, color: 0xFF8C00 },
    { name: 'Saturn', size: 1.8, distance: 30, speed: 0.004, color: 0xD2B48C },
    { name: 'Uranus', size: 1.5, distance: 35, speed: 0.003, color: 0xADD8E6 },
    { name: 'Neptune', size: 1.4, distance: 40, speed: 0.0025, color: 0x00008B },
    { name: 'Pluto', size: 0.3, distance: 45, speed: 0.002, color: 0xA9A9A9 },
];

// Create planet meshes
const planets = [];
planetData.forEach((planet, index) => {
    const geometry = new THREE.SphereGeometry(planet.size, 32, 32);
    const material = new THREE.MeshPhongMaterial({ color: planet.color }); // Use MeshPhongMaterial for lighting effects
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.x = planet.distance;
    scene.add(mesh);
    planets.push({ mesh, planet });
});

// Create moon for Earth
const moonGeometry = new THREE.SphereGeometry(0.3, 32, 32);
const moonMaterial = new THREE.MeshBasicMaterial({ color: 0x888888 });
const moon = new THREE.Mesh(moonGeometry, moonMaterial);
planets[2].mesh.add(moon); // Earth (index 2) gets the moon
moon.position.x = 2; // Moon orbits Earth

// Adding light sources (simulating sunlight)
const sunlight = new THREE.PointLight(0xFFFFFF, 1, 100);
sunlight.position.set(0, 0, 0); // Position it at the Sun
scene.add(sunlight);

// Camera setup
camera.position.z = 50;

// Create a smooth orbiting effect for the camera to explore space from different angles
let cameraAngle = 0;
const cameraRadius = 60;

function animateStars() {
    starField.rotation.y += 0.0005;
    
    // Update positions of planets and their rotations
    planets.forEach(({ mesh, planet }) => {
        mesh.rotation.y += 0.01;
        mesh.position.x = planet.distance * Math.cos(Date.now() * 0.001 * planet.speed);
        mesh.position.z = planet.distance * Math.sin(Date.now() * 0.001 * planet.speed);
    });

    // Moon's movement around Earth (index 2)
    moon.rotation.y += 0.02;
    moon.position.x = 2 * Math.cos(Date.now() * 0.005);
    moon.position.z = 2 * Math.sin(Date.now() * 0.005);

    // Update camera position for rotating space exploration
    cameraAngle += 0.002; // Slow rotation of the camera around the center
    camera.position.x = cameraRadius * Math.cos(cameraAngle);
    camera.position.z = cameraRadius * Math.sin(cameraAngle);
    camera.lookAt(sun.position); // Always look at the Sun

    renderer.render(scene, camera);
    requestAnimationFrame(animateStars);
}

animateStars();

// Handle window resizing
window.addEventListener('resize', () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
});
