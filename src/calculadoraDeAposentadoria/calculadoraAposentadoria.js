function toBrFormat(event) {
  let numero;
  numero = event.value
    .replaceAll(/[^\p{L}\d\s_]/gi, "")
    .replace(/(\d+)(\d{2}$)/, "$1,$2");
  while (numero.match(/(\d+)(\d{3})/)) {
    numero = numero.replace(/(\d+)(\d{3})/, "$1.$2$`");
  }
  event.value = numero;
}

function inputLimit(event) {
  if (event.value?.length > event.maxLength) {
    event.value = event.value.slice(0, event.maxLength);
  }
}

const btnSubmitForm = document.getElementById("btnSubmitForm");
btnSubmitForm.addEventListener("click", simularAposentadoria);

//PROPRIEDADES
/*
aporteInicial
irSobreInvestimento
idadeAposentadoria
idadeAtual
patrimonioAposentadoria
rendaMensal
rendaParaInvestir
rentabilidadeAnual
*/

let formData = {
  aporteInicial: "",
  irSobreInvestimento: "",
  idadeAposentadoria: "",
  idadeAtual: "",
  patrimonioAposentadoria: "",
  rendaMensal: "",
  rendaParaInvestir: "",
  rentabilidadeAnual: "",
};

let formatoReal = {
  minimumFractionDigits: 2,
  style: "currency",
  currency: "BRL",
};

function simularAposentadoria(event) {
  event.preventDefault();
  // formData.aporteInicial = 42000;
  // formData.idadeAposentadoria = 60;
  // formData.idadeAtual = 29;
  // formData.irSobreInvestimento = 0;
  // formData.rendaMensal = 3400;
  // formData.rentabilidadeAnual = 6;
  // formData.rendaParaInvestir = 30;

  formData = getInputValues();
  limparResultados();
  calcularAposentadoria();
}

function limparResultados() {
  let resultados = document.getElementById("resultados");
  resultados.innerHTML = "";
  let resultadoCards = document.createElement("div");
  resultadoCards.className = "row row-cols-md-3 row-cols-1 d-flex";
  resultadoCards.id = "cardsResultado";
  resultados.appendChild(resultadoCards);
}

function calcularAposentadoria() {
  let mesesParaAposentar =
    (formData.idadeAposentadoria - formData.idadeAtual) * 12;
  let irSobreInvestimento = formData.irSobreInvestimento / 100;
  let rentabilidadeMensal =
    (1 + formData.rentabilidadeAnual / 100) ** (1 / 12) - 1;
  let aporteMensal = formData.rendaMensal * (formData.rendaParaInvestir / 100);
  let montante = formData.aporteInicial;

  criarTabelaResultados(montante);

  let totalJuros = 0;
  let totalInvestido = montante;

  for (let i = 1; i <= mesesParaAposentar; i++) {
    let rendimento = montante * rentabilidadeMensal * (1 - irSobreInvestimento);
    montante += rendimento + aporteMensal;

    totalJuros += rendimento;
    totalInvestido = formData.aporteInicial + i * aporteMensal;

    adicionarValoresTabela(i, rendimento, totalInvestido, totalJuros, montante);
  }

  criarResultadoFinalMeta(
    montante.toFixed(2) - formData.patrimonioAposentadoria
  );

  let gastoMensal = montante * rentabilidadeMensal * (1 - irSobreInvestimento);
  criarResultadoFinalGastoMensal(gastoMensal);

  criarResultadoFinalValorAposentadoria(
    montante,
    aporteMensal,
    formData.idadeAposentadoria - formData.idadeAtual
  );
}

function getInputValues() {
  let data = {};
  let inputs = document
    .querySelector("#formAposentadoria")
    .querySelectorAll("input");

  inputs.forEach((input) => {
    //Remove a palavra input e coloca a primeira letra minúscula
    let key =
      input.id.replace("input", "")[0].toLowerCase() +
      input.id.replace("input", "").slice(1);
    data[key] = parseFloat(input.value.replace(".", "").replace(",", "."));
  });

  return data;
}

//RESULTADOS RESUMO
function criarResultadoFinalValorAposentadoria(montante, aporteMensal, anos) {
  let resultados = document.getElementById("cardsResultado");
  let cardAposentadoria = document.createElement("div");
  cardAposentadoria.className = "card d-inline-flex text-center p-4 mb-2";
  cardAposentadoria.style = "margin-right: 15px";
  let aposentadoriaHeader = document.createElement("span");
  aposentadoriaHeader.textContent = "Você se aposentará com";
  let aposentadoriaMontante = document.createElement("span");
  aposentadoriaMontante.textContent = montante.toLocaleString(
    "pt-BR",
    formatoReal
  );
  aposentadoriaMontante.className = "fs-4";
  aposentadoriaMontante.style = "color: var(--bs-gray); font-weight: bold";
  let aposentadoriaFooter = document.createElement("span");
  aposentadoriaFooter.textContent = `Aportando ${aporteMensal.toLocaleString(
    "pt-BR",
    formatoReal
  )} por ${anos} anos.`;
  aposentadoriaFooter.style = "font-size: 10px";

  cardAposentadoria.append(
    aposentadoriaHeader,
    aposentadoriaMontante,
    aposentadoriaFooter
  );

  resultados.prepend(cardAposentadoria);
}

function criarResultadoFinalGastoMensal(gastoMensal) {
  let resultados = document.getElementById("cardsResultado");
  let cardGastoMensal = document.createElement("div");
  cardGastoMensal.className = "card d-inline-flex text-center p-4 mb-2";
  let gastoHeader = document.createElement("span");
  gastoHeader.textContent = "Poderá gastar por mês";
  let gastoMensalValor = document.createElement("span");
  gastoMensalValor.textContent = gastoMensal.toLocaleString(
    "pt-BR",
    formatoReal
  );
  gastoMensalValor.className = "fs-4";
  gastoMensalValor.style = "color: var(--bs-blue); font-weight: bold";
  let gastoFooter = document.createElement("span");
  gastoFooter.textContent = `Para seu dinheiro nunca acabar.`;
  gastoFooter.style = "font-size: 10px";

  cardGastoMensal.append(gastoHeader, gastoMensalValor, gastoFooter);

  resultados.prepend(cardGastoMensal);
}

function criarResultadoFinalMeta(meta) {
  let resultados = document.getElementById("cardsResultado");
  let cardMeta = document.createElement("div");
  cardMeta.className = "card d-inline-flex text-center p-4 mb-2";
  let metaHeader = document.createElement("span");
  metaHeader.textContent = `${
    meta >= 0 ? "Você ultrapassou sua meta em" : "Você ficou abaixo da meta em"
  }`;
  let metaValor = document.createElement("span");
  metaValor.textContent = meta.toLocaleString("pt-BR", formatoReal);
  metaValor.className = "fs-4";
  metaValor.style = `color: var(--bs-${
    meta >= 0 ? "green" : "red"
  }); font-weight: bold`;

  cardMeta.append(metaHeader, metaValor);

  resultados.prepend(cardMeta);
}

//TABELA
function criarTabelaResultados(montante) {
  let resultados = document.getElementById("resultados");

  let tableDiv = document.createElement("div");
  tableDiv.className = "mt-4 table-size";

  let tabela = document.createElement("table");
  tabela.id = "tabelaResultados";
  tabela.className = "table table-bordered";
  let tHead = document.createElement("thead");
  let tableRow = document.createElement("tr");
  let headers = [
    "Mês",
    "Juros",
    "Total Investido",
    "Total Juros",
    "Total Acumulado",
  ];

  headers.forEach((header) => {
    let tableHeader = document.createElement("th");
    tableHeader.textContent = header;
    tableRow.appendChild(tableHeader);
  });

  tHead.appendChild(tableRow);
  let tBody = document.createElement("tbody");
  tBody.id = "tabelaResultadoBody";

  tabela.appendChild(tHead);
  tabela.appendChild(tBody);
  tableDiv.appendChild(tabela);
  resultados.append(tableDiv);

  adicionarValoresTabela(0, 0, montante, 0, montante);
}

function adicionarValoresTabela(
  mes,
  juros,
  totalInvestido,
  totalJuros,
  totalAcumulado
) {
  let tableBody = document.getElementById("tabelaResultadoBody");
  let tableRow = document.createElement("tr");
  let mesTd = document.createElement("td");
  mesTd.textContent = mes;
  let jurosTd = document.createElement("td");
  jurosTd.textContent = juros.toLocaleString("pt-BR", formatoReal);
  let totalInvestidoTd = document.createElement("td");
  totalInvestidoTd.textContent = totalInvestido.toLocaleString(
    "pt-BR",
    formatoReal
  );
  totalInvestidoTd.style = "background-color: #daf2ff";
  let totalJurosTd = document.createElement("td");
  totalJurosTd.textContent = totalJuros.toLocaleString("pt-BR", formatoReal);
  totalJurosTd.style = "background-color: #d8fde0";
  let totalAcumuladoTd = document.createElement("td");
  totalAcumuladoTd.textContent = totalAcumulado.toLocaleString(
    "pt-BR",
    formatoReal
  );
  totalAcumuladoTd.style = "background-color: var(--bs-gray-200)";

  tableRow.append(
    mesTd,
    jurosTd,
    totalInvestidoTd,
    totalJurosTd,
    totalAcumuladoTd
  );

  tableBody.appendChild(tableRow);
}
