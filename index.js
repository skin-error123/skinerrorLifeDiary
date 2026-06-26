const input = document.getElementById("searchs");
const resultsList = document.getElementById("searchResults");

input.addEventListener("input", function () {
    const keyword = input.value.trim();

    // 항상 먼저 비우기
    resultsList.innerHTML = "";
    resultsList.style.border = "none";

    if (keyword === "") {
        return;  // 빈 칸이면 여기서 끝
    }

    const matches = taxa.filter(t => t.id.includes(keyword));

    if (matches.length === 0) {
        return;
    }

    resultsList.style.border = "1px solid #ccc";

    matches.forEach(t => {
        const li = document.createElement("li");
        li.textContent = t.id;
        li.style.cursor = "pointer";

        li.addEventListener("click", function () {
            location.href = `taxon/detail.html?name=${t.id}`;
        });

        resultsList.appendChild(li);
    });
});