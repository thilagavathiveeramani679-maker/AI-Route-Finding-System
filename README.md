# AI Route Finding Dashboard

AI Laboratory mini-project using Python Flask and the A* Search Algorithm.

## Features
- Professional dashboard
- A* route finding
- Source/destination selection
- Route cost and search steps
- Search history using browser localStorage
- A* algorithm explanation
- Responsive design
- Deployment-ready Flask configuration

## Run locally

```powershell
pip install -r requirements.txt
python app.py
```

Open: http://127.0.0.1:5000

## Deployment

The project includes `Procfile` and `runtime.txt` for common Python web hosting platforms.

For a production server locally:

```powershell
pip install -r requirements.txt
gunicorn app:app
```

## Important
The locations, costs and heuristic values are demonstration data for an AI laboratory project. It is not a live GPS/navigation system.
