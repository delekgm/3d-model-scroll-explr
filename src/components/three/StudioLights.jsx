import { Environment, Lightformer, SpotLight } from "@react-three/drei"

const StudioLights = () => {
  return (
    <group name="lights">
        <Environment resolution={256}>
            <group>
                <Lightformer 
                    form="rect"
                    intensity={3}
                    position={[-5, -5, 0]}
                    scale={5}
                />
                <Lightformer 
                    form="rect"
                    intensity={2}
                    position={[5, -5, 0]}
                    scale={5}
                />
                <Lightformer 
                    form="rect"
                    intensity={10}
                    position={[5, 10, 1]}
                    scale={5}
                    rotateZ={-Math.PI / 2}
                />
            </group>
        </Environment>
        {/* Top spot */}
        <spotLight
            position={[0, 15, 5]}
            angle={0.2}
            decay={0.1}
            intensity={Math.PI * 0.2}
        />
    </group>
  )
}

export default StudioLights