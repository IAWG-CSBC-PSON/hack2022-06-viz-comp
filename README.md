# hack2022-06-viz-comp
Challenge 6: Visual Comparison of Single-Cell Clustering Results

## Challenge Description
Clustering cells based on common marker expression levels is a crucial step to identify cell types, especially when no ground-truth information is available. However, clustering results highly depend on the applied aggregation strategy and on various preprocessing such as transformations and normalization as well as input parameters. Without ground-truth information, the result is hard to judge based on statistical summary measures only. Integrating biomedical experts for quality control and comparison of results can thus be helpful to verify outcomes and make decisions on which algorithm and settings perform the best. Challenge participants will design and implement an interactive visual interface to visualize and compare clustering results, by making use of visual comparison techniques such as juxtaposition with small multiples, explicit encoding in order to show average outcomes, similarities and differences, and a range of statistical measures to visually communicate computed clustering qualities.

Visualization/visual interface solutions should answer the following questions:

- *Overview:* What are summarizing statistics (method, num clusters, clustering quality, average marker intensities per cluster) of the various clusterings and how can they be displayed, arranged, and sorted to allow a quick comparative overview?

- *Detail:* How are individual markers distributed per cluster, how well are clusters separated/quality of the clustering.

- *Mappings:* How does a clustering compare to another or many other clusterings? What are similarities and differences? Can they be visually encoded?


## Data
The data is available via [Synapse](https://www.synapse.org/#!Synapse:syn26848666).

`raw_data.csv` This file contains single cell from the sardana_97 section. Each row (overall 962343) represents a cell. Columns (features) are normalized (0,1) and used as input for the clustering.

`clustering.csv` This file contains results from various clusterings (columns) for each cell (row). The data also contains 2D and 3D UMAP projection coordinates.

`silhouette_coefficients.csv` This file contains [silhouette coefficients](https://en.wikipedia.org/wiki/Silhouette_(clustering)) for every point (row) and every cloustering (column). The silhouette coefficient describes a relation between the distance to other cells in the cluster versus the distance to cells in the next neighboring cluster. The silhouette coefficient ranges from [-1,1], where -1 represents a bad clustering for the point while 1 indicates a good fit.

`cluster matchings` Cluster matchings (how do clusters in clustering A match to clusters in clustering B) are not stored in files but can be queries via the restful API endpoint (see Codebase) or by executing the python script manually.

## Setup
We setup a small client-server project using [FastAPI](https://fastapi.tiangolo.com/). Of course, you are free to code in your favourite language and environment.
However, if you choose to use our codebase, please follow the following steps:
 
**1. Check out the github code**:
`git checkout hack2022-06-viz-comp`

**2. Create environment**:
* install [miniconda](https://conda.io/miniconda.html) or [conda](https://docs.conda.io/projects/conda/en/latest/user-guide/install/download.html). 
* create env:  `conda env create -f requirements.yml`
* active: `conda activate clusterComparison`

**3. Node.js installation and webpack packaging**
* Install [Node.js](https://nodejs.org/en/), then navigate to `/static` and run `npm install` to install all packages listed in package.json.
* Run `npm run built` to package the Javascript, or run `npm run watch` if you plan on editing dependencies on the fly while running the server

**4. Start server**
`uvicorn main:app --reload` - Runs the webserver (and updates its codebase on the fly while running when you make changes)

**5. Access frontend(s)**
* Open your favourite browser and navigate to `http://localhost:8000` to access the frontend. You should see a zoomable/pannable scatterplot showing a UMAP projection, colored by hdbscan cluster membership.
* To get a visual overview and try out all available endpoints via GUI, navigate to `http://localhost:8000/docs`
* To get a documentation of all available endpoints of the APO navigate to `http://localhost:8000/redoc`


*The FastAPI GUI to test endpoints:*

<img width="500" alt="FastAPI GUI to test endpoints" src="https://user-images.githubusercontent.com/31503434/151735722-6f2de154-6cc0-4c28-a8db-f45ae0106b76.png">

## Codebase
The FastPI endpoints, such as loading data to the client, are located in `main.py`.
The entry point for the frontend is `index.html` + `index.js` under `static/src`.
As a starting point, the project includes a scalable webgl scatterplot. How to code additional functionality for this scatterplot is described in the respective github project [regl-scatterplot](https://github.com/flekschas/regl-scatterplot).

## References and Tips

#### Categorization and Approaches for Visual Comparison 
- Gleicher, M., 2017. Considerations for visualizing comparison. IEEE transactions on visualization and computer graphics, 24(1), pp.413-423. >> This paper summarizes considerations and methods for visual comparison and can help as inspiration for the project. [paper](https://graphics.cs.wisc.edu/Papers/2018/Gle18/viscomp.pdf)

<img width="600" alt="Visual Comparison" src="https://user-images.githubusercontent.com/31503434/151735372-bacc248f-aab8-40f5-a883-e3af0c4dd288.png">

- Lekschas, F., Zhou, X., Chen, W., Gehlenborg, N., Bach, B. and Pfister, H., 2020. A generic framework and library for exploration of small multiples through interactive piling. IEEE Transactions on Visualization and Computer Graphics, 27(2), pp.358-368. >> This paper describes a grid-based small-multiple approach for an overview over mltiple datasets and ways to aggregate (pile) and compare them. [paper](https://doi.org/10.1109/TVCG.2020.3028948) piling library](https://piling.js.org/)

<img width="600" alt="Piling.js" src="https://user-images.githubusercontent.com/31503434/151975324-a8349527-1a58-4aa0-bed9-355789ba713a.png">


#### Clustering Visualization and Comparison 
- L'Yi, S., Ko, B., Shin, D., Cho, Y.J., Lee, J., Kim, B. and Seo, J., 2015. XCluSim: a visual analytics tool for interactively comparing multiple clustering results of bioinformatics data. BMC bioinformatics, 16(11), pp.1-15. >> This paper describes a visual analytics system to compare clusterings with various views showing different aspects (summarizing stats, distribution, quality, etc.) of the clusterings. It can serve as inspirations for designing and implementing visualizations in this challenge. [paper](https://link.springer.com/article/10.1186/1471-2105-16-S11-S5)

<img width="600" alt="Encodings to visually compare clusterings" src="https://user-images.githubusercontent.com/31503434/151973708-d722f2b5-86fd-4be3-a65e-95ca8838350d.png">

- Selecting the number of clusters with silhouette analysis on KMeans clustering
[to website](https://scikit-learn.org/stable/auto_examples/cluster/plot_kmeans_silhouette_analysis.html)


#### Visualization and Computation Libraries

- Heatmaps with Python Seaborn [to website](https://seaborn.pydata.org/generated/seaborn.heatmap.html)

- Clustering and Quality Meassures with scikit-learn [to website](https://scikit-learn.org/stable/modules/clustering.html)

- d3j.s A javascript library for creating interacive visualizations. [to website](https://d3js.org/)

- bootstrap. Quickly design/layout and customize responsive websites with Bootstrap [to website](https://getbootstrap.com/)

- regl scatterplot. A fast and scalable webgl scatterplot, including zooming, panning, and lasso-selection. [to website](https://github.com/flekschas/regl-scatterplot)

-3D scatterplot. A plotly-based 3D scatterplot (javascript). [to website](https://plotly.com/javascript/3d-scatter-plots/)
