import Hero from '../components/Hero'
import Clients from '../components/Clients'
import Services from '../components/Services'
import Methodology from '../components/Methodology'
import WhyArgo from '../components/WhyArgo'
import Testimonials from '../components/Testimonials'
import FAQ from '../components/FAQ'
import Contact from '../components/Contact'

export default function Home() {
  return (
    <main id="main">
      <Hero />
      <Clients />
      <Services />
      <Methodology />
      <WhyArgo />
      <Testimonials />
      <FAQ />
      <Contact />
    </main>
  )
}
