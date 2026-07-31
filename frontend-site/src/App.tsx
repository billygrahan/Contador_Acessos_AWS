import logo from "./assets/images/logo.png";
import { useEffect, useState } from "react";

function App() {
  const [hits, setHits] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const API_URL = "https://vmea16gz7g.execute-api.us-east-1.amazonaws.com/hits";
  useEffect(() => {
    // Substitua pela URL gerada pelo Output 'ApiUrl' após o primeiro deploy
    if (!localStorage.getItem("alreadyInterested")) {
      fetch(API_URL, { method: "POST" })
        .then((res) => res.json())
        .then((data) => {
          localStorage.setItem("alreadyInterested", "true");
          setHits(data.hits);
        })
        .catch((err) => console.error("Erro ao computar acesso:", err))
        .finally(() => setIsLoading(false));
    }
  }, []);
  useEffect(() => {
    fetch(API_URL, { method: "GET" })
      .then((res) => res.json())
      .then((data) => setHits(data.hits))
      .catch((err) => console.error(err))
      .finally(() => setIsLoading(false));
  }, []);
  return (
    <body className="flex flex-col min-h-screen bg-gray-100">
      <header className="w-full bg-white/80 backdrop-blur border-b border-gray-200 shadow-sm sticky top-0">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-8 py-4">
          <a href="#" className="flex items-center gap-3">
            <img
              src={logo}
              alt="Logo Produtos Tech"
              className="w-20 h-20 object-contain"
            />

            <h1 className="text-2xl font-bold tracking-wide">
              <span className="text-blue-600">Produtos</span>
              <span className="text-gray-700">Tech</span>
            </h1>
          </a>

          <nav className="hidden md:flex items-center gap-8">
            <a
              href="#sobre"
              className="text-gray-600 hover:text-blue-600 transition"
            >
              Sobre
            </a>

            <a
              href="#contador"
              className="text-gray-600 hover:text-blue-600 transition"
            >
              Contador
            </a>
          </nav>

          <a
            href="#contador"
            className="bg-blue-600 hover:bg-blue-700 hidden sm:block transition text-white px-5 py-2 rounded-lg font-medium"
          >
            Quero conhecer
          </a>
        </div>
      </header>

      <main
        id="hero"
        className="flex-1 flex items-center justify-center bg-gradient-to-br from-gray-50/80 via-white/70 to-blue-50/80"
      >
        <section className="max-w-7xl w-full mx-auto px-8 py-24 flex flex-col gap-20">
          <div className="max-w-4xl">
            <h2 className="text-5xl md:text-7xl font-extrabold text-gray-900 leading-tight">
              O futuro da tecnologia{" "}
              <span className="text-blue-600">está chegando.</span>
            </h2>

            <p className="mt-8 text-lg md:text-xl text-gray-700 max-w-3xl leading-relaxed">
              Estamos preparando uma experiência inovadora para transformar a
              forma como você encontra e acompanha produtos tecnológicos. Seja
              um dos primeiros a conhecer essa novidade.
            </p>

            <div
              id="contador"
              className="mt-12 inline-flex bg-white rounded-2xl shadow-lg border border-gray-200 px-8 py-6"
            >
              <div>
                <span className="text-gray-500 text-sm uppercase tracking-wider">
                  Pessoas interessadas
                </span>

                <h3
                  id="access-count"
                  className="text-5xl font-extrabold text-blue-600 mt-2 min-h-[60px] flex items-center"
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 bg-blue-600 rounded-full animate-bounce"></span>
                      <span
                        className="w-3 h-3 bg-blue-600 rounded-full animate-bounce"
                        style={{ animationDelay: "150ms" }}
                      ></span>
                      <span
                        className="w-3 h-3 bg-blue-600 rounded-full animate-bounce"
                        style={{ animationDelay: "300ms" }}
                      ></span>
                    </div>
                  ) : (
                    hits
                  )}
                </h3>
              </div>
            </div>
          </div>

          <section
            id="sobre"
            className="bg-white/85 backdrop-blur rounded-3xl shadow-2xl border border-gray-200 p-10 md:p-16"
          >
            <p className="uppercase tracking-[0.35em] text-blue-600 font-bold text-sm">
              Em breve
            </p>

            <h2 className="mt-5 text-5xl md:text-7xl font-extrabold text-gray-900 leading-tight">
              Uma nova forma de descobrir{" "}
              <span className="text-blue-600">produtos tecnológicos.</span>
            </h2>

            <p className="mt-8 text-2xl text-gray-800 max-w-3xl font-medium">
              Um novo produto está sendo desenvolvido para transformar a forma
              como você encontra tecnologia.
            </p>

            <p className="mt-5 text-lg text-gray-600 max-w-2xl">
              Estamos nos últimos ajustes. Fique de olho, porque a novidade será
              lançada em breve.
            </p>
          </section>
        </section>
      </main>

      <script src="./src/scripts/script.js"></script>
    </body>
  );
}

export default App;
