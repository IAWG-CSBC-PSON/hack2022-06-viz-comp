from fastapi import FastAPI, Request
from fastapi.responses import FileResponse
from fastapi.responses import HTMLResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from fastapi.responses import JSONResponse
import json
from analytics import two_cluster_mapping as mp
import pandas as pd
import time

#python -m uvicorn main:app --reload
app = FastAPI()

#defining where html files (static and templates) live
app.mount("/static", StaticFiles(directory="static"), name="static")
templates = Jinja2Templates(directory="templates")

#data routes
@app.get("/raw_data")
async def raw_data():
    return FileResponse('data/raw_data.csv');

@app.get("/clustering")
async def cluster_results():
    return FileResponse('data/merged_all_2.csv');

@app.get("/silhouette")
async def silhouette_coefficients():
    return FileResponse('data/silhouette_coefficients_umap.csv');

@app.get("/cluster_alignment")
async def cluster_alignment(input: str = 'hdbscan', compare: str = 'flowsom'):
    mapping = mp.get_alignment(input, compare)
    return FileResponse('data/cluster_mapping.csv');

@app.get("/cluster_mapping")
async def cluster_mapping_matrix(input: str = 'hdbscan', compare: str = 'flowsom'):
    mapping = mp.get_mapping_matrix(input, compare)
    mapping = mapping.to_numpy().tolist()
    mapping= json.dumps(mapping)
    return  JSONResponse(content=mapping)




#page routes
@app.get("/", response_class=HTMLResponse)
async def getIndex(request: Request):
    return templates.TemplateResponse("index.html", {"request": request})


#try out: http://127.0.0.1:8000/docs for a visual interface to test endpoints
#try out http://127.0.0.1:8000/redoc for an API documentation














    # data = pd.read_csv('cluster_data.csv');
    # return Response(data.to_csv(index=False),
    # mimetype = "text/csv",
    # headers = {"Content-disposition":
    #                "attachment; filename=" + filename + ".csv"})
    # # return {data.to_string()}