import { Injectable, NgZone } from '@angular/core';
import * as THREE from 'three';

@Injectable({
  providedIn: 'root'
})
export class ParticlesService {
  private scene: THREE.Scene | null = null;
  private camera: THREE.PerspectiveCamera | null = null;
  private renderer: THREE.WebGLRenderer | null = null;
  private particles: THREE.Points | null = null;
  private mouseX = 0;
  private mouseY = 0;
  private windowHalfX = window.innerWidth / 2;
  private windowHalfY = window.innerHeight / 2;
  private animationFrameId: number | null = null;

  constructor(private ngZone: NgZone) {}

  initialize(container: HTMLElement): void {
    if (!container) return;

    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 1, 2000);
    this.camera.position.z = 1000;
    
    const geometry = new THREE.BufferGeometry();
    const vertices = [];
    const particleCount = 10000;
    
    for (let i = 0; i < particleCount; i++) {
      const x = Math.random() * 2000 - 1000;
      const y = Math.random() * 2000 - 1000;
      const z = Math.random() * 2000 - 1000;
      vertices.push(x, y, z);
    }
    
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
    
    const material = new THREE.PointsMaterial({
      size: 3,
      color: 0xFFFFFF,
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending
    });
    
    this.particles = new THREE.Points(geometry, material);
    this.scene.add(this.particles);
    
    this.renderer = new THREE.WebGLRenderer({ 
      antialias: true,
      alpha: true
    });
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setClearColor(0x000000, 0);
    container.appendChild(this.renderer.domElement);
    
    document.addEventListener('mousemove', this.onDocumentMouseMove.bind(this));
    window.addEventListener('resize', this.onWindowResize.bind(this));
    
    this.ngZone.runOutsideAngular(() => {
      this.animate();
    });
  }

  private onDocumentMouseMove(event: MouseEvent): void {
    this.mouseX = (event.clientX - this.windowHalfX) * 0.05;
    this.mouseY = (event.clientY - this.windowHalfY) * 0.05;
  }

  private onWindowResize(): void {
    if (!this.camera || !this.renderer) return;
    
    this.windowHalfX = window.innerWidth / 2;
    this.windowHalfY = window.innerHeight / 2;
    
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  private animate(): void {
    if (!this.scene || !this.camera || !this.renderer || !this.particles) {
      return;
    }
    
    this.particles.rotation.x += 0.0005;
    this.particles.rotation.y += 0.001;
    
    this.camera.position.x += (this.mouseX - this.camera.position.x) * 0.02;
    this.camera.position.y += (-this.mouseY - this.camera.position.y) * 0.02;
    this.camera.lookAt(this.scene.position);
    
    this.renderer.render(this.scene, this.camera);
    
    this.animationFrameId = requestAnimationFrame(() => this.animate());
  }
  
  dispose(): void {
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
    }
    
    document.removeEventListener('mousemove', this.onDocumentMouseMove.bind(this));
    window.removeEventListener('resize', this.onWindowResize.bind(this));
    
    if (this.renderer) {
      if (this.renderer.domElement.parentElement) {
        this.renderer.domElement.parentElement.removeChild(this.renderer.domElement);
      }
      this.renderer.dispose();
      this.renderer = null;
    }
    
    if (this.particles && this.scene) {
      this.scene.remove(this.particles);
      this.particles.geometry.dispose();
      (this.particles.material as THREE.Material).dispose();
      this.particles = null;
    }
    
    this.scene = null;
    this.camera = null;
  }
}
