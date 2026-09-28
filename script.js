const historyKey = "ai_route_history_v1";

function showSection(id) {
    document.querySelectorAll(".section").forEach(s => s.classList.remove("active-section"));
    document.getElementById(id).classList.add("active-section");

    document.querySelectorAll(".nav-item").forEach(b => b.classList.remove("active"));
    const nav = document.querySelector(`[data-section="${id}"]`);
    if (nav) nav.classList.add("active");

    const titles = {
        dashboard: "AI Route Finding Dashboard",
        route: "Route Finder",
        algorithm: "A* Search Algorithm",
        history: "Search History",
        about: "About Project"
    };
    document.getElementById("pageTitle").textContent = titles[id];
    if (id === "history") renderHistory();
}

document.querySelectorAll(".nav-item").forEach(btn => {
    btn.addEventListener("click", () => showSection(btn.dataset.section));
});

async function findRoute() {
    const start = document.getElementById("start").value;
    const goal = document.getElementById("goal").value;

    if (!start || !goal) {
        alert("Please select both starting location and destination.");
        return;
    }

    const loading = document.getElementById("loading");
    const empty = document.getElementById("emptyResult");
    const result = document.getElementById("routeResult");
    const status = document.getElementById("resultStatus");

    loading.classList.remove("hidden");
    empty.classList.add("hidden");
    result.classList.add("hidden");
    status.textContent = "Searching...";

    try {
        const response = await fetch("/find-route", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({start, goal})
        });

        const data = await response.json();

        if (!response.ok) throw new Error(data.error || "Route not found");

        const pathBox = document.getElementById("routePath");
        pathBox.innerHTML = data.path.map((node, i) => {
            const nodeHTML = `<span class="route-node">${node}</span>`;
            return i < data.path.length - 1 ? nodeHTML + `<span class="route-arrow2">→</span>` : nodeHTML;
        }).join("");

        document.getElementById("routeCost").textContent = data.cost;
        document.getElementById("routeSteps").textContent = data.steps;
        result.classList.remove("hidden");
        status.textContent = "Route Found";

        saveHistory({
            start, goal, path: data.path.join(" → "), cost: data.cost,
            time: new Date().toLocaleString()
        });
    } catch (error) {
        empty.classList.remove("hidden");
        empty.querySelector("h3").textContent = "Unable to find route";
        empty.querySelector("p").textContent = error.message;
        status.textContent = "Error";
    } finally {
        loading.classList.add("hidden");
    }
}

function quickRoute() {
    showSection("route");
    document.getElementById("start").value = "College";
    document.getElementById("goal").value = "Airport";
    findRoute();
}

function saveHistory(item) {
    const history = JSON.parse(localStorage.getItem(historyKey) || "[]");
    history.unshift(item);
    localStorage.setItem(historyKey, JSON.stringify(history.slice(0, 20)));
}

function renderHistory() {
    const history = JSON.parse(localStorage.getItem(historyKey) || "[]");
    const empty = document.getElementById("historyEmpty");
    const list = document.getElementById("historyList");

    if (!history.length) {
        empty.classList.remove("hidden");
        list.classList.add("hidden");
        return;
    }

    empty.classList.add("hidden");
    list.classList.remove("hidden");
    list.innerHTML = history.map(item => `
        <div class="history-item">
            <div><b>${item.start} → ${item.goal}</b><br><small>${item.path}</small></div>
            <div><b>${item.cost} units</b><br><small>${item.time}</small></div>
        </div>
    `).join("");
}

async function loadStats() {
    try {
        const response = await fetch("/api/stats");
        const data = await response.json();
        document.getElementById("locationsStat").textContent = data.locations;
        document.getElementById("connectionsStat").textContent = data.connections;
    } catch (e) {}
}

loadStats();
