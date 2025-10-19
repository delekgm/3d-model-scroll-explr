import NavBar from "./components/NavBar"
import Features from "./components/Features"
import Footer from "./components/Footer"
import gsap from "gsap"
import { ScrollTrigger } from 'gsap/all'

gsap.registerPlugin(ScrollTrigger)

function App() {

  return (
    <main>
      <NavBar />
      <Features />
      <Footer />
    </main>
  )
}

export default App
