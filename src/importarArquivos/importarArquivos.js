function importarArquivo(e) {
  let file = e.target.files[0];
  if (!file) {
    return;
  }

  let reader = new FileReader();

  reader.onload = function (e) {
    let contents = e.target.result;
    let investimentos = contents.split("Título: ");
    displayCards(investimentos);
  };

  reader.readAsText(file);
}

function displayContents(contents) {
  let element = document.getElementById("file-content");
  element.textContent = contents;
}

function displayCards(investimentos) {
  investimentos.forEach((investimento) => {
    if (investimento.trim().length === 0) {
      return;
    }

    let card = document.createElement("div");
    card.className = "card m-3 p-3";
    let lines = investimento.split(/[\r\n]+/g);
    let titulo = document.createElement("h3");
    titulo.className = "text-wrap";
    titulo.textContent = lines[0];
    card.appendChild(titulo);

    lines.forEach((line, idx) => {
      if (idx > 0) {
        let conteudo = document.createElement("span");
        conteudo.textContent = line;
        conteudo.style.display = "block";
        conteudo.className = "text-wrap";
        card.appendChild(conteudo);
      }
    });

    let element = document.getElementById("file-content");
    element.appendChild(card);
  });
}
