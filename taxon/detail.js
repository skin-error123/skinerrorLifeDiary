const params = new URLSearchParams(location.search);
const name = params.get("name");

// 현재 노드의 모든 조상 찾기
function getAncestors(id, visited = new Set()) {
    if (visited.has(id)) return visited;
    visited.add(id);

    const node = taxa.find(t => t.id === id);
    if (node) {
        node.parents.forEach(p => getAncestors(p, visited));
    }
    return visited;
}

const ancestorIds = getAncestors(name);

const miniNodes = [...ancestorIds].map(id => ({
    data: { id: id, label: id }
}));

const miniEdges = taxa
    .filter(t => ancestorIds.has(t.id))
    .flatMap(t =>
        t.parents
            .filter(p => ancestorIds.has(p))
            .map(p => ({ data: { source: p, target: t.id } }))
    );

const miniCy = cytoscape({
    container: document.getElementById("mini-tree"),
    elements: { nodes: miniNodes, edges: miniEdges },
    minZoom: 0.1,   // 이보다 작게 줄어들지 않음
    maxZoom: 2,
    style: [
        {
            selector: "node",
            style: {
                label: "data(label)",
                "font-size": "10px",
                "background-color": "#4CAF50",
                color: "#fff",
                "text-valign": "center",
                "text-halign": "center",
                width: "label",
                height: "label",
                padding: "6px",
                shape: "roundrectangle"
            }
        },
        {
            selector: `node[id = "${name}"]`,
            style: {
                "background-color": "#FF5722"
            }
        },
        {
            selector: "edge",
            style: {
                "curve-style": "round-taxi",   // 직각으로 꺾이는 스타일
                "taxi-direction": "vertical",
                "target-arrow-shape": "triangle",
                "line-color": "#aaa",
                "target-arrow-color": "#aaa"
            }
        }
    ],
    layout: {
        name: "dagre",
        rankDir: "TB",
        nodeSep: 50,    // 같은 줄 노드 사이 간격
        rankSep: 80,    // 줄과 줄 사이 간격
        edgeSep: 20
    },
    userZoomingEnabled: true,
    userPanningEnabled: true
});

miniCy.resize();
miniCy.fit(undefined, 20);  // 먼저 화면에 맞추기


miniCy.on("tap", "node", function (e) {
    const node = e.target;
    location.href = `detail.html?name=${node.id()}`;
});

// 설명/사진 불러오기
fetch(`descriptions/${name}.json`)
    .then(response => response.json())
    .then(data => {
        document.getElementById("title").textContent = name;
        document.getElementById("description").textContent = data.summary;

        if (data.photo) {
            document.getElementById("photo").src = data.photo;
        }
    })
    .catch(() => {
        document.getElementById("description").textContent = "아직 설명이 없어요";
    });