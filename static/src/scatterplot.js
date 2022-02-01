import createScatterplot from 'regl-scatterplot';
import * as d3 from "d3";

export default class Scatterplot{

    // Vars
    scatterplot;
    rawData;
    points = [];

    constructor(){
        //do something?
    }

    async init(){
        this.rawData = await d3.csv('/cluster_results');
        console.log('test');
        this.wrangle();
    }

     wrangle(){
        let that = this;
        let canvas = document.querySelector('#canvas');
        let width = 300;
        let height = 300;

        this.scatterplot = createScatterplot({
          canvas,
          width,
          height,
          pointSize: 1,
        });

        this.scatterplot.set({cameraTarget: [5,8]})
        this.scatterplot.set({cameraDistance: 15})

        this.scatterplot.set({
          opacityBy: 'valueA',
          sizeBy: 'valueA',
          colorBy: 'valueB',
        });

        //color mapping
        this.scatterplot.set({
            //12 categorical colors (repeating)
            pointColor: ['#1f78b4', '#33a02c', '#e31a1c', '#ff7f00', '#6a3d9a', '#b15928', '#a6cee3', '#b2df8a', '#fb9a99', '#fdbf6f', '#cab2d6', '#ffff99',
                         '#1f78b4', '#33a02c', '#e31a1c', '#ff7f00', '#6a3d9a', '#b15928', '#a6cee3', '#b2df8a', '#fb9a99', '#fdbf6f', '#cab2d6', '#ffff99',
                         '#1f78b4', '#33a02c', '#e31a1c', '#ff7f00', '#6a3d9a', '#b15928', '#a6cee3', '#b2df8a', '#fb9a99', '#fdbf6f', '#cab2d6', '#ffff99'],
          pointSize: [3],
          opacity: [0.5],
        });

        //empty points
        this.points = [];

        //add points
        this.rawData.forEach(function(d){
            //we map value A to 1 here, value B to the clustering membership
            that.points.push([parseFloat(d.emb1), parseFloat(d.emb2), 1, parseInt(d.hdbscan)]);
        });

        this.render();
    }

    render(){
        //render the scatterplot (webgl)
        this.scatterplot.draw(this.points);
        console.log('rendering done');

    }

}
