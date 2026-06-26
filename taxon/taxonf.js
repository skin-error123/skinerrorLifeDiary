// 노드와 엣지 생성


const bgNodes = backgrounds.map(b => ({
    data: { id: b.id, image: b.image, type: "background" }
}));

const nodes = taxa.map(t => ({
    data: { id: t.id, label: t.id }  // label을 id로
}));

const edges = taxa.flatMap(t =>
    t.parents.map(p => ({
        data: { source: p, target: t.id }
    }))
);

// Cytoscape 초기화
const cy = cytoscape({
    container: document.getElementById("cy"),
    elements: { nodes: [...bgNodes, ...nodes], edges },
    minZoom: 0.05,   // 최소 축소
    maxZoom: 3,
    style: [
        {
            selector: "node[type = 'background']",
            style: {
                "background-image": "data(image)",
                "background-fit": "cover",
                width: 200,
                height: 150,
                shape: "rectangle",
                "border-width": 0,
                label: "",
                "z-index": 1,
                "z-compound-depth": "bottom"
            }
        },
        {
            selector: "node[type != 'background']",
            style: {
                label: "data(label)",
                "text-valign": "center",
                "background-color": "#4CAF50",
                color: "#fff",
                "font-size": "14px",
                shape: "roundrectangle",
                width: "label",      // 글자 크기에 맞게 자동
                height: "label",
                "padding": "10px",
                "z-index": 10   // 글자 주변 여백
            }
        },
        {
            selector: "edge",
            style: {
                "curve-style": "bezier",
                "target-arrow-shape": "triangle",
                "line-color": "#aaa",
                "target-arrow-color": "#aaa"
            }
        }
    ],
    layout: {
        name: "breadthfirst",
        directed: true,
        roots: ["LUCA"],     // LUCA id
        spacingFactor: 1.5,
        transform: (node, pos) => ({ x: pos.x, y: -pos.y })  // 위아래 뒤집기
    }
});

cy.nodes("[type='background']").style("z-index", -1);

// 노드 이동할 때마다 좌표 저장

cy.on("dragfree", "node", function (e) {
    const node = e.target;
    const positions = {};

    cy.nodes().forEach(n => {
        positions[n.id()] = n.position();
    });

    localStorage.setItem("positions", JSON.stringify(positions));
});

// 페이지 열 때 저장된 좌표 불러오기
const saved = localStorage.getItem("positions");
if (saved) {
    const positions = JSON.parse(saved);
    cy.nodes().forEach(n => {
        if (positions[n.id()]) {
            n.position(positions[n.id()]);
        }
    });
}

let selectedBg = null;

// 배경 이미지 클릭하면 선택
cy.on("tap", "node[type='background']", function (e) {
    selectedBg = e.target;
});

// 배율 적용
document.getElementById("applyScale").addEventListener("click", function () {
    if (!selectedBg) {
        alert("이미지를 먼저 클릭하세요");
        return;
    }

    const scale = parseFloat(document.getElementById("scaleInput").value);
    const baseWidth = 200;   // 원본 기준 크기
    const baseHeight = 150;

    const newWidth = baseWidth * scale;
    const newHeight = baseHeight * scale;

    selectedBg.style("width", newWidth);
    selectedBg.style("height", newHeight);

    // 저장
    const sizes = JSON.parse(localStorage.getItem("sizes") || "{}");
    sizes[selectedBg.id()] = { width: newWidth, height: newHeight };
    localStorage.setItem("sizes", JSON.stringify(sizes));
});

const savedSizes = localStorage.getItem("sizes");
if (savedSizes) {
    const sizes = JSON.parse(savedSizes);
    cy.nodes().forEach(n => {
        if (sizes[n.id()]) {
            n.style("width", sizes[n.id()].width);
            n.style("height", sizes[n.id()].height);
        }
    });
}

cy.on("tap", "node[type != 'background']", function (e) {
    const node = e.target;
    location.href = `detail.html?name=${node.id()}`;
});

//cy.nodes().forEach(n => n.ungrabify());