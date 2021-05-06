import React, { useRef, Suspense,   useState, useEffect  } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { useGLTF, OrbitControls, ContactShadows, Environment } from '@react-three/drei'
import { proxy,  useSnapshot } from 'valtio'
import { HexColorPicker } from "react-colorful"


const state = proxy({
  current: null,
  items: {
    cimen: "#ffffff",
    Marbre: "#ffffff"

  },
})



function Model(props) {
  const ref = useRef()
  const group = useRef()
  const snap =  useSnapshot(state)
  const { nodes, materials } = useGLTF('good.glb')

  useFrame((state) => {
    const t = state.clock.getElapsedTime()
    ref.current.rotation.z = -0.2 - (1 + Math.sin(t / 1.5)) / 20
    ref.current.rotation.x = Math.cos(t / 4) / 8
    ref.current.rotation.y = Math.sin(t / 4) / 8
    ref.current.position.y = (1 + Math.sin(t / 1.5)) / 10
  })



  const [hovered, set] = useState(null)
  useEffect(() => {
    const cursor = `<svg width="64" height="64" fill="none" xmlns="http://www.w3.org/2000/svg"><g clip-path="url(#clip0)"><path fill="rgba(255, 255, 255, 0.5)" d="M29.5 54C43.031 54 54 43.031 54 29.5S43.031 5 29.5 5 5 15.969 5 29.5 15.969 54 29.5 54z" stroke="#000"/><g filter="url(#filter0_d)"><path d="M29.5 47C39.165 47 47 39.165 47 29.5S39.165 12 29.5 12 12 19.835 12 29.5 19.835 47 29.5 47z" fill="${snap.items[hovered]}"/></g><path d="M2 2l11 2.947L4.947 13 2 2z" fill="#000"/><text fill="#000" style="white-space:pre" font-family="Inter var, sans-serif" font-size="10" letter-spacing="-.01em"><tspan x="35" y="63">${hovered}</tspan></text></g><defs><clipPath id="clip0"><path fill="#fff" d="M0 0h64v64H0z"/></clipPath><filter id="filter0_d" x="6" y="8" width="47" height="47" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feColorMatrix in="SourceAlpha" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"/><feOffset dy="2"/><feGaussianBlur stdDeviation="3"/><feColorMatrix values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.15 0"/><feBlend in2="BackgroundImageFix" result="effect1_dropShadow"/><feBlend in="SourceGraphic" in2="effect1_dropShadow" result="shape"/></filter></defs></svg>`
    const auto = `<svg width="64" height="64" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill="rgba(255, 255, 255, 0.5)" d="M29.5 54C43.031 54 54 43.031 54 29.5S43.031 5 29.5 5 5 15.969 5 29.5 15.969 54 29.5 54z" stroke="#000"/><path d="M2 2l11 2.947L4.947 13 2 2z" fill="#000"/></svg>`
    document.body.style.cursor = `url('data:image/svg+xml;base64,${btoa(hovered ? cursor : auto)}'), auto`
  }, [hovered])

  
  return (
    <group 
    ref={ref}
   {...props} dispose={null}
    onPointerOver={(e) => (e.stopPropagation(), set(e.object.material.name))}
    onPointerOut={(e) => e.intersections.length === 0 && set(null)}
    onPointerDown={(e) => (e.stopPropagation(), (state.current = e.object.material.name))}
    onPointerMissed={() => (state.current = null)}
    
    >
      <mesh material-color={snap.items.cimen} geometry={nodes.coulis.geometry} material={materials.cimen} />
       <mesh material-color={snap.items.Marbre} geometry={nodes.plaquette.geometry} material={materials.Marbre} /> 
    </group>
  )
}


function Picker() {
  const snap = useSnapshot(state)
  return (
    <div style={{ display: snap.current ? "block" : "none" }}>
    <HexColorPicker className="picker" color={snap.items[snap.current]} onChange={(color) => (state.items[snap.current] = color)} />
    <h1>{snap.current}</h1>
  </div>
  )
}



export default function App() {
  return (
    <>
    <Picker />
    <Canvas shadows dpr={[1, 2]} camera={{ position: [0, 0, 60], fov: 50 }} > 
      <ambientLight intensity={0.1} />
      <spotLight intensity={0.5} angle={0.3} penumbra={1} position={[30, 0, 50]} castShadow />
      <Suspense fallback={null}>
  
        <Model />
        <ContactShadows  />
        <Environment preset="city"intensity={0.3} />
      </Suspense>
      <OrbitControls   enableZoom={false} />
    </Canvas>

</>
  )
}
