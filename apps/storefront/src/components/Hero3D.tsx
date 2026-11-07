"use client"

import { Canvas, useFrame } from '@react-three/fiber'
import { useTexture } from '@react-three/drei'
import { useRef, Suspense } from 'react'
import type { Group } from 'three'

function FloatingFrame({ imageUrl }: { imageUrl: string }) {
    const frameRef = useRef<Group>(null)

    const safeUrl = imageUrl && imageUrl.trim() !== '' ? imageUrl : '/poster.jpg'
    const isExternal = safeUrl.startsWith('http')

    // The timestamp hack is removed to break the Suspense loop
    const textureUrl = isExternal ? `/api/proxy-image?url=${encodeURIComponent(safeUrl)}&dummy=.jpg` : safeUrl

    const texture = useTexture(textureUrl) as any

    useFrame((state) => {
        if (frameRef.current) {
            frameRef.current.position.y = Math.sin(state.clock.elapsedTime) * 0.15
            frameRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.15
            frameRef.current.rotation.x = 0.05

            const scrollY = window.scrollY
            frameRef.current.position.y += (scrollY * -0.005)
            frameRef.current.rotation.x += (scrollY * 0.001)
        }
    })

    return (
        <group ref={frameRef}>
            <mesh position={[0, 0, -0.05]}>
                <boxGeometry args={[2.2, 3.2, 0.1]} />
                <meshStandardMaterial color="#F42902" roughness={0.3} metalness={0.6} />
            </mesh>

            <mesh position={[0, 0, 0.01]}>
                <planeGeometry args={[2, 3]} />
                <meshStandardMaterial map={texture} roughness={0.8} />
            </mesh>

            <pointLight position={[0, 0, -1]} distance={5} intensity={2} color="#83FD80" />
        </group>
    )
}

export default function Hero3D({ imageUrl }: { imageUrl: string }) {
    return (
        // Removed the solid background. It is now transparent and sits on Z-index 10.
        <div className="absolute inset-0 z-10 h-screen w-screen pointer-events-none">
            <Canvas camera={{ position: [0, 0, 6], fov: 45 }}>
                <ambientLight intensity={1.2} />
                <directionalLight position={[5, 5, 5]} intensity={1.5} />
                <Suspense fallback={null}>
                    <FloatingFrame imageUrl={imageUrl} />
                </Suspense>
            </Canvas>
        </div>
    )
}