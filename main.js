const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75, window.innerWidth / window.innerHeight, 0.1,1000
);
camera.position.z = 40;
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0x000000); 
document.getElementById("canvas-container").appendChild(renderer.domElement);
const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.enableZoom = true;
function addStars(count = 1000) {
  const geometry = new THREE.BufferGeometry();
  const positions = [];
  for (let i = 0; i < count; i++) {
    const x = THREE.MathUtils.randFloatSpread(600);
    const y = THREE.MathUtils.randFloatSpread(600);
    const z = THREE.MathUtils.randFloatSpread(600);
    positions.push(x, y, z);
  }
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  const material = new THREE.PointsMaterial({
    color: 0xffffff,
    size: 0.7,
    sizeAttenuation: true
  });
  const stars = new THREE.Points(geometry, material);
  scene.add(stars);
}
addStars();
const sunGeometry = new THREE.SphereGeometry(4, 32, 32);
const sunMaterial = new THREE.MeshBasicMaterial({ color: 0xFDB813 });
const sun = new THREE.Mesh(sunGeometry, sunMaterial);
scene.add(sun);
const pointLight = new THREE.PointLight(0xffffff, 2, 100);
pointLight.position.set(0, 0, 0);
scene.add(pointLight);
const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
scene.add(ambientLight);
const planets = [
  { name: "Mercury", color: 0xaaaaaa, size: 0.3, distance: 6, speed: 0.04, angle: 0 },
  { name: "Venus",   color: 0xffcc99, size: 0.6, distance: 8, speed: 0.03, angle: 0 },
  { name: "Earth",   color: 0x2194ce, size: 1,   distance: 11, speed: 0.02, angle: 0 },
  { name: "Mars",    color: 0xff3300, size: 0.8, distance: 14, speed: 0.017, angle: 0 },
  { name: "Jupiter", color: 0xff9966, size: 2.5, distance: 18, speed: 0.01, angle: 0 },
  { name: "Saturn",  color: 0xffff99, size: 2,   distance: 22, speed: 0.008, angle: 0 },
  { name: "Uranus",  color: 0x66ffff, size: 1.2, distance: 26, speed: 0.007, angle: 0 },
  { name: "Neptune", color: 0x6666ff, size: 1.1, distance: 30, speed: 0.006, angle: 0 }
];
planets.forEach(planet => {
  const geometry = new THREE.SphereGeometry(planet.size, 32, 32);
  const material = new THREE.MeshStandardMaterial({ color: planet.color });
  const mesh = new THREE.Mesh(geometry, material);
  mesh.name = planet.name;
  planet.mesh = mesh;
  scene.add(mesh);
});
const slidersContainer = document.getElementById("sliders");
planets.forEach((planet, index) => {
  const label = document.createElement("label");
  label.textContent = `${planet.name} Speed`;
  const slider = document.createElement("input");
  slider.type = "range";
  slider.min = "0.001";
  slider.max = "0.1";
  slider.step = "0.001";
  slider.value = planet.speed;
  slider.dataset.index = index;
  slider.addEventListener("input", (e) => {
    const idx = e.target.dataset.index;
    planets[idx].speed = parseFloat(e.target.value);
  });

  slidersContainer.appendChild(label);
  slidersContainer.appendChild(slider);
});
let isAnimating = true;
const toggleAnimationBtn = document.getElementById("toggle-animation");
toggleAnimationBtn.addEventListener("click", () => {
  isAnimating = !isAnimating;
  toggleAnimationBtn.textContent = isAnimating ? "⏸ Pause" : "▶️ Resume";
});
const toggleThemeBtn = document.getElementById("toggle-theme");
toggleThemeBtn.addEventListener("click", () => {
  const isLight = document.body.classList.toggle("light-mode");
  if (isLight) {
    renderer.setClearColor(0xffffff); 
  } else {
    renderer.setClearColor(0x000000); 
  }
});
const tooltip = document.getElementById("tooltip");
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

window.addEventListener("mousemove", (event) => {
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects(planets.map(p => p.mesh));

  if (intersects.length > 0) {
    tooltip.style.display = "block";
    tooltip.textContent = intersects[0].object.name;
    tooltip.style.left = event.clientX + 10 + "px";
    tooltip.style.top = event.clientY + 10 + "px";
  } else {
    tooltip.style.display = "none";
  }
});
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
function animate() {
  requestAnimationFrame(animate);

  if (isAnimating) {
    planets.forEach(planet => {
      planet.angle += planet.speed;
      planet.mesh.position.x = Math.cos(planet.angle) * planet.distance;
      planet.mesh.position.z = Math.sin(planet.angle) * planet.distance;
    });
  }

  controls.update();
  renderer.render(scene, camera);
}
animate();


  