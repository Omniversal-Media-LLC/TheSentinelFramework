// Sierpinski Lattice Animation for Sentinel Framework

class LatticeVisualizer {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) return;
        
        this.ctx = this.canvas.getContext('2d');
        this.time = 0;
        this.animationId = null;
        
        this.setupCanvas();
        this.initializeParticles();
        this.startAnimation();
        
        // Handle window resize
        window.addEventListener('resize', () => this.setupCanvas());
    }
    
    setupCanvas() {
        const rect = this.canvas.getBoundingClientRect();
        this.canvas.width = rect.width * window.devicePixelRatio;
        this.canvas.height = rect.height * window.devicePixelRatio;
        this.ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
        
        this.centerX = rect.width / 2;
        this.centerY = rect.height / 2;
        this.size = Math.min(rect.width, rect.height) * 0.4;
    }
    
    initializeParticles() {
        this.particles = [];
        for (let i = 0; i < 50; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width / window.devicePixelRatio,
                y: Math.random() * this.canvas.height / window.devicePixelRatio,
                vx: (Math.random() - 0.5) * 2,
                vy: (Math.random() - 0.5) * 2,
                size: Math.random() * 3 + 1,
                hue: Math.random() * 360,
                alpha: Math.random() * 0.5 + 0.3
            });
        }
    }
    
    drawSierpinskiTriangle(x, y, size, depth, maxDepth = 6) {
        if (depth > maxDepth || size < 2) return;
        
        const height = size * Math.sqrt(3) / 2;
        const hue = (depth * 60 + this.time * 30) % 360;
        const alpha = Math.max(0.3, 1 - depth * 0.15);
        
        // Draw triangle outline
        this.ctx.strokeStyle = `hsla(${hue}, 70%, 60%, ${alpha})`;
        this.ctx.lineWidth = Math.max(0.5, 3 - depth * 0.4);
        this.ctx.shadowColor = `hsla(${hue}, 70%, 60%, 0.5)`;
        this.ctx.shadowBlur = 5;
        
        this.ctx.beginPath();
        this.ctx.moveTo(x, y);
        this.ctx.lineTo(x - size/2, y + height);
        this.ctx.lineTo(x + size/2, y + height);
        this.ctx.closePath();
        this.ctx.stroke();
        
        // Reset shadow
        this.ctx.shadowBlur = 0;
        
        // Recursive triangles
        const newSize = size / 2;
        const offset = Math.sin(this.time + depth) * 2;
        
        this.drawSierpinskiTriangle(x + offset, y, newSize, depth + 1, maxDepth);
        this.drawSierpinskiTriangle(x - newSize/2 + offset, y + height/2, newSize, depth + 1, maxDepth);
        this.drawSierpinskiTriangle(x + newSize/2 + offset, y + height/2, newSize, depth + 1, maxDepth);
    }
    
    drawPhotonLocking() {
        // Draw photon streams
        const numStreams = 8;
        for (let i = 0; i < numStreams; i++) {
            const angle = (i / numStreams) * Math.PI * 2 + this.time * 0.5;
            const radius = this.size * 0.8;
            
            const x1 = this.centerX + Math.cos(angle) * radius * 0.3;
            const y1 = this.centerY + Math.sin(angle) * radius * 0.3;
            const x2 = this.centerX + Math.cos(angle) * radius;
            const y2 = this.centerY + Math.sin(angle) * radius;
            
            const gradient = this.ctx.createLinearGradient(x1, y1, x2, y2);
            gradient.addColorStop(0, 'rgba(0, 212, 255, 0.8)');
            gradient.addColorStop(1, 'rgba(0, 212, 255, 0)');
            
            this.ctx.strokeStyle = gradient;
            this.ctx.lineWidth = 2;
            this.ctx.beginPath();
            this.ctx.moveTo(x1, y1);
            this.ctx.lineTo(x2, y2);
            this.ctx.stroke();
        }
    }
    
    drawTriWaveField() {
        // Draw tri-wave forcefield
        const waves = 3;
        for (let w = 0; w < waves; w++) {
            const radius = this.size * (0.6 + w * 0.15);
            const frequency = 8 + w * 4;
            const phase = this.time * (1 + w * 0.3);
            
            this.ctx.beginPath();
            for (let angle = 0; angle <= Math.PI * 2; angle += 0.1) {
                const wave = Math.sin(angle * frequency + phase) * 10;
                const x = this.centerX + Math.cos(angle) * (radius + wave);
                const y = this.centerY + Math.sin(angle) * (radius + wave);
                
                if (angle === 0) {
                    this.ctx.moveTo(x, y);
                } else {
                    this.ctx.lineTo(x, y);
                }
            }
            
            const hue = (w * 120 + this.time * 20) % 360;
            this.ctx.strokeStyle = `hsla(${hue}, 60%, 50%, 0.4)`;
            this.ctx.lineWidth = 1;
            this.ctx.stroke();
        }
    }
    
    drawQuantumParticles() {
        this.particles.forEach(particle => {
            // Update position
            particle.x += particle.vx;
            particle.y += particle.vy;
            
            // Wrap around edges
            const canvasWidth = this.canvas.width / window.devicePixelRatio;
            const canvasHeight = this.canvas.height / window.devicePixelRatio;
            
            if (particle.x < 0) particle.x = canvasWidth;
            if (particle.x > canvasWidth) particle.x = 0;
            if (particle.y < 0) particle.y = canvasHeight;
            if (particle.y > canvasHeight) particle.y = 0;
            
            // Draw particle
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            this.ctx.fillStyle = `hsla(${particle.hue}, 70%, 60%, ${particle.alpha})`;
            this.ctx.fill();
            
            // Add glow effect
            this.ctx.shadowColor = `hsla(${particle.hue}, 70%, 60%, 0.8)`;
            this.ctx.shadowBlur = particle.size * 2;
            this.ctx.fill();
            this.ctx.shadowBlur = 0;
            
            // Update hue for color cycling
            particle.hue = (particle.hue + 1) % 360;
        });
    }
    
    animate() {
        // Clear canvas with fade effect
        this.ctx.fillStyle = 'rgba(10, 10, 10, 0.1)';
        this.ctx.fillRect(0, 0, this.canvas.width / window.devicePixelRatio, this.canvas.height / window.devicePixelRatio);
        
        // Draw all components
        this.drawQuantumParticles();
        this.drawTriWaveField();
        this.drawPhotonLocking();
        this.drawSierpinskiTriangle(this.centerX, this.centerY - this.size/3, this.size, 0);
        
        // Update time
        this.time += 0.02;
        
        // Continue animation
        this.animationId = requestAnimationFrame(() => this.animate());
    }
    
    startAnimation() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
        this.animate();
    }
    
    stopAnimation() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
    }
}

// Initialize lattice visualization when page loads
document.addEventListener('DOMContentLoaded', function() {
    // Create canvas if it doesn't exist
    if (window.location.pathname.includes('lattice.html')) {
        const canvas = document.createElement('canvas');
        canvas.id = 'lattice-canvas';
        canvas.style.width = '100%';
        canvas.style.height = '400px';
        canvas.style.border = '1px solid var(--border-color)';
        canvas.style.borderRadius = '10px';
        canvas.style.background = 'rgba(0, 0, 0, 0.5)';
        
        // Insert canvas after the lattice explanation
        const latticeSection = document.querySelector('.content h2');
        if (latticeSection) {
            latticeSection.parentNode.insertBefore(canvas, latticeSection.nextSibling);
        }
        
        // Initialize visualizer
        new LatticeVisualizer('lattice-canvas');
    }
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = LatticeVisualizer;
}