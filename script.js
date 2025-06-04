document.addEventListener("DOMContentLoaded", () => {
  const searchInput = document.getElementById("searchInput");
  const pasteButton = document.getElementById("pasteButton");
  const deleteButton = document.getElementById("deleteButton");
  const searchButton = document.getElementById("searchButton");
  const resultsDiv = document.getElementById("results");

  let database = [];

  // deletar o input
  deleteButton.addEventListener("click", () => {
    searchInput.value = "";
    resultsDiv.innerHTML = "";
    searchInput.focus();
  });

  fetch("data.json")
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok " + response.statusText);
      }
      return response.json();
    })
    .then((data) => {
      database = data;
    })
    .catch((error) => {
      console.error("Falha ao carregar o banco de dados:", error);
      resultsDiv.textContent =
        "Erro ao carregar as perguntas e respostas. Verifique o console para detalhes.";
    });

  // Função para normalizar texto (remove espaços extras, converte para minúsculas, trata múltiplos espaços/newlines)
  function normalizeText(text) {
    if (typeof text !== "string") return "";
    return text.trim().toLowerCase().replace(/\s+/g, " ");
  }

  // Função de busca
  function handleSearch() {
    const query = searchInput.value.trim();
    resultsDiv.innerHTML = "";

    if (!query) {
      resultsDiv.textContent = "Por favor, digite ou cole uma pergunta.";
      return;
    }

    const normalizedQuery = normalizeText(query);
    let found = false;

    for (const item of database) {
      const normalizedQuestion = normalizeText(item.question);

      if (normalizedQuestion === normalizedQuery) {
        resultsDiv.textContent = item.answer;
        found = true;
        break;
      }
    }

    if (!found) {
      resultsDiv.textContent = "Não encontrei nada.";
    }
  }

  pasteButton.addEventListener("click", async () => {
    try {
      if (!navigator.clipboard || !navigator.clipboard.readText) {
        resultsDiv.textContent =
          "API de área de transferência não suportada neste navegador ou contexto. Cole manualmente (Ctrl+V).";
        searchInput.focus();
        return;
      }
      const text = await navigator.clipboard.readText();
      searchInput.value = text;
      searchInput.focus();
    } catch (err) {
      console.error("Falha ao colar texto: ", err);
      resultsDiv.textContent =
        "Não foi possível colar. Verifique as permissões ou cole manualmente (Ctrl+V ou Cmd+V).";
      searchInput.focus();
    }
  });

  searchButton.addEventListener("click", handleSearch);

  searchInput.addEventListener("keypress", (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSearch();
    }
  });
});
