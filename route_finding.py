import heapq

GRAPH = {
    "College": {"Bus Stand": 4, "Hospital": 7, "Library": 3},
    "Bus Stand": {"College": 4, "Market": 5, "Railway Station": 6},
    "Hospital": {"College": 7, "Market": 4, "Airport": 12},
    "Library": {"College": 3, "Market": 2, "Park": 5},
    "Market": {"Bus Stand": 5, "Hospital": 4, "Library": 2, "Park": 3, "Railway Station": 5},
    "Park": {"Library": 5, "Market": 3, "Airport": 8},
    "Railway Station": {"Bus Stand": 6, "Market": 5, "Airport": 7},
    "Airport": {"Hospital": 12, "Park": 8, "Railway Station": 7}
}

LOCATIONS = list(GRAPH.keys())

# Demonstration heuristic values for the laboratory graph.
HEURISTIC = {
    "College": 10,
    "Bus Stand": 7,
    "Hospital": 8,
    "Library": 8,
    "Market": 5,
    "Park": 4,
    "Railway Station": 3,
    "Airport": 0
}

def find_route(start, goal):
    open_list = []
    heapq.heappush(open_list, (HEURISTIC.get(start, 0), 0, start))

    came_from = {}
    g_score = {node: float("inf") for node in GRAPH}
    g_score[start] = 0
    steps = 0

    while open_list:
        _, current_cost, current = heapq.heappop(open_list)
        steps += 1

        if current == goal:
            path = [current]
            while current in came_from:
                current = came_from[current]
                path.append(current)
            path.reverse()
            return path, g_score[goal], steps

        for neighbor, edge_cost in GRAPH[current].items():
            tentative_g = g_score[current] + edge_cost

            if tentative_g < g_score[neighbor]:
                came_from[neighbor] = current
                g_score[neighbor] = tentative_g
                f_score = tentative_g + HEURISTIC.get(neighbor, 0)
                heapq.heappush(open_list, (f_score, tentative_g, neighbor))

    return [], 0, steps
