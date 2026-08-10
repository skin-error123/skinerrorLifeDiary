// 노드와 엣지 생성

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
    elements: { nodes, edges },
    minZoom: 0.05,   // 최소 축소
    maxZoom: 3,
    style: [
        {
            selector: "node",
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
        roots: ["LUCA"],
        spacingFactor: 1.5,
        transform: (node, pos) => ({ x: pos.x, y: -pos.y })  // 위아래 뒤집기
    }
});

// 노드 이동할 때마다 좌표 저장
/*cy.on("dragfree", "node", function (e) {
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
}*/

let selectedBg = null;

cy.on("tap", "node", function (e) {
    const node = e.target;
    location.href = `detail.html?name=${node.id()}`;
});

//cy.nodes().forEach(n => n.ungrabify());