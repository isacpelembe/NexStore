/*------------------------ PESQUISA DE PRODUTOS ------------------------*/
const searchInput = document.getElementById("searchInput");
const produtos = document.querySelectorAll(".card-produto");
const popup404 = document.getElementById("searchPopup");

searchInput.addEventListener("input", function () {
  const termo = searchInput.value.toLowerCase().trim();

  let encontrados = 0;

  produtos.forEach(produto => {
    const nome = produto.getAttribute("data-nome").toLowerCase();

    if (nome.includes(termo)) {
      produto.style.display = "flex";
      encontrados++;
    } else {
      produto.style.display = "none";
    }
  });

  /*------------------------ MOSTRAR POPUP DO ERRO 404 ------------------------*/
  if (encontrados === 0 && termo !== "") {
    popup404.classList.add("show");
  } else {
    popup404.classList.remove("show");
  }
});

/*------------------------ FECHAR POPUP 404 ------------------------*/
function fecharPopup404() {
  popup404.classList.remove("show");
}

popup404.addEventListener("click", function (e) {
  if (e.target === popup404) {
    fecharPopup404();
  }
});

document.addEventListener("keydown", function (e) {
  if (e.key === "Escape") {
    fecharPopup404();
  }
});

  /* ------------------------ MOBILE PESQUISA ------------------------ */
document.addEventListener("DOMContentLoaded", () => {
  const searchBox = document.querySelector(".search-box");
  const searchIcon = document.querySelector(".search-box i");

  searchIcon.addEventListener("click", () => {
    searchBox.classList.toggle("active");
    if (searchBox.classList.contains("active")) {
      searchBox.querySelector("input").focus();
    }
  });
});