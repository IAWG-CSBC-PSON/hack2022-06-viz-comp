# hack2022-06-viz-comp
Challenge 6: Visual Comparison of Single-Cell Clustering Results

## Challenge
Clustering cells based on common marker expression levels is a crucial step to identify cell types, especially when no ground-truth information is available. However, clustering results highly depend on the applied aggregation strategy and on various preprocessing such as transformations and normalization as well as input parameters. Without ground-truth information, the result is hard to judge based on statistical summary measures only. Integrating biomedical experts for quality control and comparison of results can thus be helpful to verify outcomes and make decisions on which algorithm and settings perform the best. Challenge participants will design and implement an interactive visual interface to visualize and compare clustering results, by making use of visual comparison techniques such as juxtaposition with small multiples, explicit encoding in order to show average outcomes, similarities and differences, and a range of statistical measures to visually communicate computed clustering qualities.

## Data
The data is available via [Synapse](https://www.synapse.org/#!Synapse:syn26848666).

#### raw_data.csv
This file contains single cell from the sardana_97 section. Each row (overall 962343) represents a cell. Columns (features) are normalized (0,1) and used as input for the clustering.
(add screenshot here)

#### clustering.csv
This file contains results from various clusterings (columns) as well as silhouette coefficients for each cell. The silhouette coefficient describes a relation between the distance to other cells in the cluster versus the distance to cells in the next neighboring cluster. The silhouette coefficient ranges from [-1,1], where -1 represents a bad clustering for the point while 1 indicates a good fit.

#### silhouette_coefficients.csv
This file contains [silhouette coefficients](https://en.wikipedia.org/wiki/Silhouette_(clustering)) for every point (row) and every cloustering (column).

#### cluster matchings
Cluster matchings (how do clusters in clustering A match to clusters in clustering B) are not stored in files but can be queries via the restful API endpoint (see Codebase).
(add screenshot here)

## Setup
We setup a small client-server project using [FastAPI](https://fastapi.tiangolo.com/). Of course, you are free to code in your favourite language and environment.
However, if you choose to use our codebase, please follow the following steps:
 
**1. check out the github code**:
`git checkout hack2022-06-viz-comp`

**2. create environment**:
* install [miniconda](https://conda.io/miniconda.html) or [conda](https://docs.conda.io/projects/conda/en/latest/user-guide/install/download.html). 
* create env:  `conda env create -f requirements.yml`
* active: `conda activate clusterComparison`

**3. Node.js installation and packages**
* Install [Node.js](https://nodejs.org/en/), then navigate to `/static` and run `npm install` to install all packages listed in package.json.
* Run `npm run built` to package the Javascript, or run `npm run watch` if you plan on editing dependencies on the fly while running the server

**4. start server**
`uvicorn main:app --reload` - Runs the webserver (and updates its codebase on the fly while running when you make changes)

**5. Access the Frontend(s)**
* Open your favourite browser and navigate to `http://localhost:8000` to access the frontend
* To get a visual overview and try out all available endpoints via GUI, navigate to `http://localhost:8000/docs`
* To get a documentation of all available endpoints of the APO navigate to `http://localhost:8000/redoc`

*The FastAPI GUI to test endpoints:*

<img width="600" alt="FastAPI GUI to test endpoints" src="https://user-images.githubusercontent.com/31503434/151735722-6f2de154-6cc0-4c28-a8db-f45ae0106b76.png">

## Codebase
**to be added soon**

## References and Tips
**to be added soon**

#### Encoding Considerations for Visualizing Clustering Data


#### Encoding Considerations for Visual Comparison:
Gleicher, M., Albers, D., Walker, R., Jusufi, I., Hansen, C.D. and Roberts, J.C., 2011. Visual comparison for information visualization. Information Visualization, 10(4), pp.289-309.
![image](https://user-images.githubusercontent.com/31503434/151735372-bacc248f-aab8-40f5-a883-e3af0c4dd288.png)

Lekschas, F., Zhou, X., Chen, W., Gehlenborg, N., Bach, B. and Pfister, H., 2020. A generic framework and library for exploration of small multiples through interactive piling. IEEE Transactions on Visualization and Computer Graphics, 27(2), pp.358-368.

