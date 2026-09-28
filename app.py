from flask import Flask, render_template, request, jsonify
from route_finding import find_route, GRAPH, LOCATIONS

app = Flask(__name__)

@app.route("/")
def dashboard():
    return render_template("index.html", locations=LOCATIONS)

@app.route("/find-route", methods=["POST"])
def route():
    data = request.get_json(silent=True) or {}
    start = data.get("start")
    goal = data.get("goal")

    if start not in GRAPH or goal not in GRAPH:
        return jsonify({"error": "Please select valid locations."}), 400

    path, cost, steps = find_route(start, goal)

    if not path:
        return jsonify({"error": "No route was found."}), 404

    return jsonify({
        "path": path,
        "cost": cost,
        "steps": steps,
        "message": "Route found successfully using A* Search."
    })

@app.route("/api/stats")
def stats():
    return jsonify({
        "locations": len(LOCATIONS),
        "connections": sum(len(v) for v in GRAPH.values()) // 2,
        "algorithm": "A* Search",
        "nodes": len(GRAPH)
    })

if __name__ == "__main__":
    app.run(debug=True)
