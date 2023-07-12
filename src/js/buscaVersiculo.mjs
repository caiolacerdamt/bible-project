import token from '../../environment.mjs';

const resultadoDaBusca = document.querySelector(".resultado-da-busca");
const searchBtn = document.querySelector("#lupa");
const inputBusca = document.querySelector("#palavra");
const versiculosSalvos = document.querySelector('.versiculos-salvos');

async function buscaVersiculo() {
  try {
    if (inputBusca.value) {
      resultadoDaBusca.innerHTML = `<div class="loading-animation"></div>`;

      const termoBuscado = inputBusca.value.toLowerCase();

      const url = await fetch(
        "https://www.abibliadigital.com.br/api/verses/search",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            version: "nvi",
            search: inputBusca.value.toLowerCase(),
          }),
        }
      );
      const data = await url.json();
      console.log(data);

      const verses = data.verses;
      console.log(verses);
      const results = verses
        .map((obj) => {
          const textoFormatado = obj.text.replace(
            new RegExp(termoBuscado, "gi"),
            (match) => `<span class="highlight">${match}</span>`
          );

          return `<div class="result"><p class="paragrafo">${textoFormatado} ${obj.book.name} ${obj.chapter}:${obj.number}</p> 
            <button class="salvar"><i class="fa-solid fa-bookmark"></i></button></div>`;
        })
        .join("");

      const resultadoContainer = document.createElement("div");
      resultadoContainer.classList.add("resultado-da-busca");
      resultadoContainer.innerHTML = results;

      resultadoContainer
        .querySelectorAll(".salvar")
        .forEach((button) => {
          button.addEventListener("click", salvarVersiculo);
        });

      resultadoDaBusca.appendChild(resultadoContainer);

      const loadingAnimation =
        resultadoDaBusca.querySelector(".loading-animation");
      if (loadingAnimation) {
        loadingAnimation.remove();
      }
    }
  } catch (error) {
    console.log(error);
  }
}

function notificacao(message) {
  const notificacao = document.createElement("div");
  notificacao.classList.add("notificacao");
  notificacao.textContent = message;
  document.body.appendChild(notificacao);

  setTimeout(() => {
    notificacao.remove();
  }, 3000);
}

function salvarVersiculo(event) {
  const divResult = event.target.closest(".result");
  const text = divResult.querySelector(".paragrafo").textContent;

  const savedVersiculos =
    JSON.parse(localStorage.getItem("versiculos")) || [];

  if (savedVersiculos.includes(text)) {
    notificacao("Esse versículo já foi salvo");
    return;
  } else {
    notificacao("Versículo Salvo");
  }

  savedVersiculos.push(text);

  localStorage.setItem("versiculos", JSON.stringify(savedVersiculos));

  console.log("Versículo salvo:", text);

  exibirVersiculosSalvos();
}

searchBtn.addEventListener("click", buscaVersiculo);

function exibirVersiculosSalvos() {
  const versiculosLocalStorage =
    JSON.parse(localStorage.getItem("versiculos")) || [];
  versiculosSalvos.innerHTML = "";

  versiculosLocalStorage.forEach((versiculo, index) => {
    const versiculoDiv = document.createElement("div");
    versiculoDiv.classList.add("versiculo-salvo");

    const conteudoVersiculo = document.createElement("p");
    conteudoVersiculo.textContent = versiculo;
    versiculoDiv.appendChild(conteudoVersiculo);

    const botaoExcluir = document.createElement("button");
    botaoExcluir.setAttribute("data-index", index);

    const iconeExcluir = document.createElement("i");
    iconeExcluir.classList.add("fa-solid");
    iconeExcluir.classList.add("fa-trash");
    botaoExcluir.appendChild(iconeExcluir);

    botaoExcluir.addEventListener("click", () => {
      excluirVersiculo(index);
      notificacao("Versículo Excluído");
    });

    versiculoDiv.appendChild(botaoExcluir);
    versiculosSalvos.appendChild(versiculoDiv);
  });
}

function excluirVersiculo(index) {
  const savedVersiculos =
    JSON.parse(localStorage.getItem("versiculos")) || [];

  savedVersiculos.splice(index, 1);

  localStorage.setItem("versiculos", JSON.stringify(savedVersiculos));

  exibirVersiculosSalvos();
}

document.addEventListener("DOMContentLoaded", () => {
  exibirVersiculosSalvos();
});
