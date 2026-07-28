import Header from './components/Header/Header.jsx'
import Hero from './sections/Hero/Hero.jsx'
import Work from './sections/Work/Work.jsx'
import About from './sections/About/About.jsx'
import Contact from './sections/Contact/Contact.jsx'

export default function App() {
  return (
    <>
      <a className="skip" href="#main">
        Skip to content
      </a>

      <Header />

      <main id="main">
        <Hero />
        <Work />
        <About />
        <Contact />
      </main>
    </>
  )
}
