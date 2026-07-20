import './App.css'
import heroImg from './assets/hero.png'

function App() {
  return (
    <main id="center">
      <section className="hero">
        <img src={heroImg} alt="Produto incrível" className="hero-img" />
        <h1>Produto Incrível</h1>
        <p>Chegando em breve! Seja o primeiro a conhecer.</p>
        <button className="cta">Quero ser avisado</button>
      </section>
    </main>
  )
}

export default App
