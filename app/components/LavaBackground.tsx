"use client"

import { useEffect, useRef } from 'react'

const vertexShader = `
  attribute vec2 position;
  varying vec2 vUv;
  void main() {
    vUv = position * 0.5 + 0.5;
    gl_Position = vec4(position, 0.0, 1.0);
  }
`

const fragmentShader = `
  precision mediump float;
  uniform float time;
  uniform vec2 mouse;
  uniform vec2 resolution;
  uniform float click;
  varying vec2 vUv;

  // Simplex 2D noise
  vec3 permute(vec3 x) { return mod(((x*34.0)+1.0)*x, 289.0); }

  float snoise(vec2 v){
    const vec4 C = vec4(0.211324865405187, 0.366025403784439,
             -0.577350269189626, 0.024390243902439);
    vec2 i  = floor(v + dot(v, C.yy) );
    vec2 x0 = v -   i + dot(i, C.xx);
    vec2 i1;
    i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
    vec4 x12 = x0.xyxy + C.xxzz;
    x12.xy -= i1;
    i = mod(i, 289.0);
    vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))
    + i.x + vec3(0.0, i1.x, 1.0 ));
    vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy),
      dot(x12.zw,x12.zw)), 0.0);
    m = m*m ;
    m = m*m ;
    vec3 x = 2.0 * fract(p * C.www) - 1.0;
    vec3 h = abs(x) - 0.5;
    vec3 ox = floor(x + 0.5);
    vec3 a0 = x - ox;
    m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
    vec3 g;
    g.x  = a0.x  * x0.x  + h.x  * x0.y;
    g.yz = a0.yz * x12.xz + h.yz * x12.yw;
    return 130.0 * dot(m, g);
  }

  void main() {
    vec2 pixelCoord = vUv * resolution;
    vec2 mousePixelCoord = (mouse * 0.5 + 0.5) * resolution;
    float distanceFromMouse = length(pixelCoord - mousePixelCoord);
    float maxRadius = 400.0;
    
    if (distanceFromMouse > maxRadius) {
      gl_FragColor = vec4(0.0);
      return;
    }

    vec2 normalizedCoord = (pixelCoord - mousePixelCoord) / maxRadius;
    
    // Faster base movement for more liveliness
    vec2 movement = vec2(
      time * 0.15,
      time * 0.17
    );
    
    // Base noise scales (no longer affected by click)
    float n1 = snoise(normalizedCoord * 2.0 + movement);
    float n2 = snoise(normalizedCoord * 4.0 - movement * 0.5);
    float n3 = snoise(normalizedCoord * 6.0 + movement * 0.7);
    
    // Dynamic noise mixing for constant shape evolution
    float shapeNoise = (
      n1 * (0.6 + sin(time * 2.0) * 0.1) + 
      n2 * (0.3 + cos(time * 1.7) * 0.1) + 
      n3 * (0.1 + sin(time * 1.5) * 0.05)
    );
    
    // Shape mask (no longer affected by click)
    float shapeMask = smoothstep(1.2, -0.2, length(normalizedCoord) + shapeNoise * 0.7);
    
    // Brand colors
    vec3 lime = vec3(0.698, 0.874, 0.184);
    vec3 olive = vec3(0.467, 0.533, 0.216);
    vec3 purple = vec3(0.467, 0.216, 0.533);
    
    // Dynamic color mixing
    vec3 color1 = mix(lime, olive, smoothstep(-1.0, 1.0, n1 + sin(time) * 0.2));
    vec3 color2 = mix(olive, purple, smoothstep(-1.0, 1.0, n2 + cos(time * 0.8) * 0.2));
    vec3 finalColor = mix(color1, color2, smoothstep(-1.0, 1.0, shapeNoise));
    
    // Add subtle glow
    float glow = smoothstep(0.2, 0.8, shapeNoise);
    finalColor += glow * 0.15;
    
    // Edge fade
    float edgeFade = smoothstep(maxRadius, maxRadius * 0.5, distanceFromMouse);
    
    // Click flash effect (only affects opacity)
    float clickFlash = exp(-click * 10.0) * 0.05; // Sharp initial flash that quickly fades
    
    // Base opacity with time variation and click flash
    float baseOpacity = 0.12; // Slightly lower base opacity
    float timeOpacity = baseOpacity + sin(time * 0.5) * 0.02; // Subtle opacity oscillation
    float finalOpacity = timeOpacity + clickFlash; // Add flash on click
    
    gl_FragColor = vec4(finalColor, shapeMask * finalOpacity * edgeFade);
  }
`

export default function LavaBackground() {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const mouseRef = useRef({ x: 0, y: 0 })
    const targetMouseRef = useRef({ x: 0, y: 0 })
    const programRef = useRef<WebGLProgram | null>(null)
    const timeRef = useRef(0)
    const clickTimeRef = useRef(0)
    const rafRef = useRef(0)

    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return

        // Set initial size
        canvas.width = window.innerWidth
        canvas.height = window.innerHeight

        const gl = canvas.getContext('webgl', {
            alpha: true,
            premultipliedAlpha: false,
        })
        if (!gl) return

        // Create shaders
        const vs = gl.createShader(gl.VERTEX_SHADER)
        const fs = gl.createShader(gl.FRAGMENT_SHADER)
        if (!vs || !fs) return

        gl.shaderSource(vs, vertexShader)
        gl.shaderSource(fs, fragmentShader)
        gl.compileShader(vs)
        gl.compileShader(fs)

        // Create program
        const program = gl.createProgram()
        if (!program) return

        gl.attachShader(program, vs)
        gl.attachShader(program, fs)
        gl.linkProgram(program)
        programRef.current = program

        // Create buffer
        const buffer = gl.createBuffer()
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
        gl.bufferData(
            gl.ARRAY_BUFFER,
            new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]),
            gl.STATIC_DRAW
        )

        // Get locations
        const positionLocation = gl.getAttribLocation(program, 'position')
        const timeLocation = gl.getUniformLocation(program, 'time')
        const mouseLocation = gl.getUniformLocation(program, 'mouse')
        const resolutionLocation = gl.getUniformLocation(program, 'resolution')
        const clickLocation = gl.getUniformLocation(program, 'click')

        // Setup position attribute
        gl.enableVertexAttribArray(positionLocation)
        gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0)

        // Set initial resolution
        gl.viewport(0, 0, canvas.width, canvas.height)
        gl.useProgram(program)
        gl.uniform2f(resolutionLocation, canvas.width, canvas.height)

        const handleResize = () => {
            canvas.width = window.innerWidth
            canvas.height = window.innerHeight
            gl.viewport(0, 0, canvas.width, canvas.height)
            gl.uniform2f(resolutionLocation, canvas.width, canvas.height)
        }
        window.addEventListener('resize', handleResize)

        const handleMouseMove = (event: MouseEvent) => {
            const x = (event.clientX / window.innerWidth) * 2 - 1
            const y = -(event.clientY / window.innerHeight) * 2 + 1
            targetMouseRef.current = { x, y }
        }

        const handleClick = () => {
            clickTimeRef.current = timeRef.current  // Reset click time on each click
        }

        window.addEventListener('mousemove', handleMouseMove)
        window.addEventListener('click', handleClick)

        // Set initial positions
        mouseRef.current = { x: 0, y: 0 }
        targetMouseRef.current = { x: 0, y: 0 }

        const render = () => {
            timeRef.current += 0.005

            // Smooth interpolation towards target position
            const interpolationFactor = 0.015

            mouseRef.current = {
                x: mouseRef.current.x + (targetMouseRef.current.x - mouseRef.current.x) * interpolationFactor,
                y: mouseRef.current.y + (targetMouseRef.current.y - mouseRef.current.y) * interpolationFactor
            }

            gl.useProgram(program)
            gl.uniform1f(timeLocation, timeRef.current)
            gl.uniform2f(mouseLocation, mouseRef.current.x, mouseRef.current.y)

            // Calculate click effect value (decays over time)
            const clickEffect = Math.max(0, timeRef.current - clickTimeRef.current)
            gl.uniform1f(clickLocation, clickEffect)

            gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)
            rafRef.current = requestAnimationFrame(render)
        }
        render()

        return () => {
            window.removeEventListener('resize', handleResize)
            window.removeEventListener('mousemove', handleMouseMove)
            window.removeEventListener('click', handleClick)
            cancelAnimationFrame(rafRef.current)
            gl.deleteProgram(program)
            gl.deleteShader(vs)
            gl.deleteShader(fs)
        }
    }, [])

    return (
        <canvas
            ref={canvasRef}
            className="fixed inset-0 pointer-events-none"
            style={{ zIndex: -1 }}
        />
    )
} 