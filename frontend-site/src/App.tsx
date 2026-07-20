import './App.css'
import heroImg from './assets/hero.png'
import { useEffect, useState } from 'react';

function App() {
  const [hits, setHits] = useState<number | null>(null);
  useEffect(() => {
    // Substitua pela URL gerada pelo Output 'ApiUrl' após o primeiro deploy
    const API_URL = "https://<api-id>.execute-api.<region>.amazonaws.com/prod/hits";
    fetch(API_URL, { method: 'POST' })
      .then(res => res.json())
      .then(data => setHits(data.hits))
      .catch(err => console.error("Erro ao computar acesso:", err));
  }, []);
  return (
    <main id="center">
      <section className="hero">
        <img src={heroImg} alt="Produto incrível" className="hero-img" />
        <h1>Produto Incrível</h1>
        <p>Chegando em breve! Seja o primeiro a conhecer.</p>
        <button className="cta">Quero ser avisado</button>

        {/* Aqui entra o contador */}
        {hits !== null ? (
          <h2>Você é o interessado número: {hits}</h2>
        ) : (
          <p>Carregando contador...</p>
        )}
      </section>
    </main>
  )
}

export default App


// import { useEffect, useState } from 'react';
// function App() {
//   const [hits, setHits] = useState<number | null>(null);
//   useEffect(() => {
//     // Substitua pela URL gerada pelo Output 'ApiUrl' após o primeiro deploy
//     const API_URL = "https://<api-id>.execute-api.<region>.amazonaws.com/prod/hits";
//     fetch(API_URL, { method: 'POST' })
//       .then(res => res.json())
//       .then(data => setHits(data.hits))
//       .catch(err => console.error("Erro ao computar acesso:", err));
//   }, []);
//   return (
//     <div style={{ padding: '2rem', textAlign: 'center' }}>
//       <h1>Página Em Breve</h1>
//       <p>Obrigado pelo interesse!</p>
//       {hits !== null ? (
//         <h2>Você é o interessado número: {hits}</h2>
// ) : (
//   <p>Carregando contador...</p>
// )}
// </div >
// );
// }