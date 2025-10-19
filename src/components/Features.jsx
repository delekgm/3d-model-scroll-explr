import { Suspense, useRef } from "react"
import { useMediaQuery } from "react-responsive"
import { useGSAP } from "@gsap/react"
import clsx from "clsx"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/all"
import { Canvas } from "@react-three/fiber"
import { features } from "../constants"
import StudioLights from "./three/StudioLights"
import { Html } from "@react-three/drei"
import { F35TEX } from "./models/F35-tex"
import * as THREE from "three"

const ModelScroll = () => {
    const groupRef = useRef(null)
    const isMobile = useMediaQuery({ query: '(max-width: 767px)'})

    // Rotation animation
    useGSAP(() => {
      const modelTimeline = gsap.timeline({
          scrollTrigger: {
              trigger: '#f-canvas',
              start: 'top 10%',
              endTrigger: '#features',
              end: `bottom center`,
              scrub: 0.5,
              pin: true,
              pinSpacing: true, // make sure space is reserved
          }
      })

      // Set initial positions
      gsap.set(".box .content", {
        y: () => window.innerHeight * 0.2, // ~50vh
        willChange: "transform",
      })

      // Convert NodeList to array correctly
      gsap.utils.toArray(".box").forEach((box) => {
        const content = box.querySelector(".content")
        if (!content) return

        gsap.to(content, {
          y: 0,
          opacity: 1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: box,
            start: "top 50%",
            end: "top 40%",
            scrub: 0.5,
            invalidateOnRefresh: true,
          },
          onComplete: () => (content.style.willChange = "auto")
        })
      })

      // 3D Spin
      if(groupRef.current) {
        modelTimeline
        .to(groupRef.current.rotation, { y: -Math.PI / 2, ease: 'power1.in' })
        .to(groupRef.current.rotation, { x: Math.PI / 6, y: -Math.PI / 2 - Math.PI / 4, ease: 'none' })
        .to(groupRef.current.rotation, { x: Math.PI / 2, y: -Math.PI / 2, ease: 'power1.out'  })
      }

      // When ScrollTrigger refreshes (resize, orientation change), re-run .set() funcs
      ScrollTrigger.addEventListener("refreshInit", () => {
        gsap.set(".box .content", { y: () => window.innerHeight * 0.2 })
      })

      // After your model/fonts load, force a refresh so start/end markers are correct
      ScrollTrigger.refresh()
    }, [])

    return (
      <group ref={groupRef}>
        <Suspense fallback={<Html><h1 className="text-white text-3xl uppercase">Loading...</h1></Html>}>
          <F35TEX scale={isMobile ? 0.02 : 0.03} position={[-0.5, 0.5, 0]} />
        </Suspense>
      </group>
    )

}

const Features = () => {
  const getFeaturePosition = (index, total) => {
    const heightMultiplier = Math.max(1, Math.ceil(total / 5))
    const startVh = 50
    const totalHeight = 90 * heightMultiplier
    const endVh = totalHeight
    const range = endVh - startVh

    if (total === 1) return `${startVh}vh`

    const spacing = range / (total - 1)

    // NEW: spread factor to push items farther apart without touching scroll height
    const spread = 1.8 // tweak 1.2–1.8 as needed; doesn’t affect scrollbar
    return `${startVh + spacing * index * spread}vh`
  }

  const lastTopVh = parseFloat(getFeaturePosition(features.length - 1, features.length))
  const bufferVh = 60 // give yourself room for the last box’s inner padding and some scroll

  return (
    <section id="features" className="relative" style={{ minHeight: `${lastTopVh + bufferVh}vh`}}>
      <div className="relative flex-center">
        <h1 className="absolute top-30">Ultimate Flying Machine</h1>
      </div>

      <Canvas id="f-canvas" camera={{ position: [0, 0.5, 5]}}>
        {/* <color attach="background" args={['#1e1e1e']} /> */}
        <StudioLights />
        <ambientLight intensity={0.6} />
        <ModelScroll />
      </Canvas>

      <div className="absolute inset-0 pointer-events-none">
        {
          features.map((feature, index) => {
            const isLeft = index % 2 === 0
            
            return (
              <div 
                key={feature.id} 
                className={clsx(
                  'box',
                  `box${index + 1}`,
                  'max-w-[120px] md:max-w-xs',
                  isLeft ? 'left-5 md:left-20' : 'right-5 md:right-20',
                )}
                style={{ top: getFeaturePosition(index, features.length) }}
              >
                <div className="content opacity-0">
                <h3 className="text-white text-xl">{feature.highlight}</h3>
                <p>
                  {feature.text}
                </p>
                </div>
              </div>
            )
          })
        }
      </div>
    </section>
  )
}

export default Features