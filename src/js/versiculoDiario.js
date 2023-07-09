async function getVersiculoAleatorio() {
    const response = await fetch('https://www.abibliadigital.com.br/api/verses/nvi/random');
    const data = await response.json();
    return data;
  }
  
  function atualizarVersiculo(versiculo, livro, capitulo, numeroVersiculo) {
    const divVersiculo = document.getElementById('versiculo-do-dia');
    divVersiculo.innerHTML = ` ${versiculo} <br> ${livro} ${capitulo}:${numeroVersiculo}`;
  }
  
  function verificarHora() {
    const agora = new Date();
    const hora = agora.getHours();
    const minutos = agora.getMinutes();
    
    if ( hora === 18 && minutos === 32) {
      getVersiculoAleatorio().then(data => {
        localStorage.setItem('versiculo', data.text);
        localStorage.setItem('livro', data.book.name)
        localStorage.setItem('capitulo', data.chapter);
        localStorage.setItem('numero', data.number)
        atualizarVersiculo(data.text, data.book.name, data.chapter, data.number);
      });
    }
  }
  
  const versiculoArmazenado = localStorage.getItem('versiculo');
  const livroArmazenado = localStorage.getItem('livro')
  const capituloArmazenado = localStorage.getItem('capitulo')
  const numeroArmazenado = localStorage.getItem('numero')
  
  if (versiculoArmazenado) {
    atualizarVersiculo(versiculoArmazenado, livroArmazenado, capituloArmazenado, numeroArmazenado);
  } else {
    getVersiculoAleatorio().then(data => {
      localStorage.setItem('versiculo', data.text);
      localStorage.setItem('livro', data.book.name)
      localStorage.setItem('capitulo', data.chapter)
      localStorage.setItem('numero', data.number)
      atualizarVersiculo(data);
    });
  }
  
  setInterval(verificarHora, 60000);
  
  
  