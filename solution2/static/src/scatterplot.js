import createScatterplot from 'regl-scatterplot';
import * as d3 from "d3";
import 'bootstrap';
import SimpleEventHandler from "./simpleEventHandler";
import legend from "d3-svg-legend";

export default class Scatterplot{

    // Vars
    scatterplot;
    rawData;
    points = [];
    dataType = 'clustering';
    method = 'hdbscan';
    scatterplotID = 0;
    eventHandler;
    row;
    column;

    type_clustering = 'clustering';
    type_silhouette = 'silhouette';

    constructor(rawData, dataType, method, id, eventHandler){
        this.dataType = dataType;
        this.method = method;
        this.scatterplotID = id;
        this.rawData = rawData;
        this.eventHandler = eventHandler;
    }

    async init(){
        console.log('init scatterplot ' + this.scatterplotID);
        this.row = d3.select('#cluster_row');
        if (this.dataType == this.type_silhouette){
            this.row = d3.select('#silhouette_row');
        }
        this.column =  this.row.append("div")
            .attr("class", 'col-xl')

        let wrapper = this.column.append("div")
            .attr("class", 'scatterplot_wrapper')
            .attr("id", 'scatterplot_wrapper_' + this.scatterplotID);

        wrapper.append('div')
            .attr("id", "label_" + this.scatterplotID)
            .attr("class", "label")
            .html('' + this.method);

        wrapper.append("canvas")
            .attr("id", 'canvas_' + this.scatterplotID)
            .attr("class", 'canvas');


        this.wrangle();
    }

     wrangle(){
        let that = this;
        let canvas = document.querySelector('#canvas_' + this.scatterplotID);
        let width = 250;
        let height = 250;

        const xScale = d3.scaleLinear().domain([-1, 1]);
        const yScale = d3.scaleLinear().domain([-1, 1]);

        this.scatterplot = createScatterplot({
          canvas,
          width,
          height,
          xScale,
          yScale,
          pointSize: 1,
        });

        this.scatterplot.set({cameraTarget: [5,8]})
        this.scatterplot.set({cameraDistance: 15})

        this.scatterplot.set({
          opacityBy: 'valueA',
          sizeBy: 'valueA',
          colorBy: 'valueB',
        });

        //empty points
        this.points = [];

        //color mapping
         if (this.dataType == this.type_clustering){
             this.scatterplot.set({
                //12 categorical colors
                pointColor: ['#1f78b4', '#33a02c', '#e31a1c', '#ff7f00', '#6a3d9a', '#b15928', '#a6cee3', '#b2df8a', '#fb9a99', '#fdbf6f', '#cab2d6', '#ffff99',
                              '#1f78b4', '#33a02c', '#e31a1c', '#ff7f00', '#6a3d9a', '#b15928', '#a6cee3', '#b2df8a', '#fb9a99', '#fdbf6f', '#cab2d6', '#ffff99',
                             '#1f78b4', '#33a02c', '#e31a1c', '#ff7f00', '#6a3d9a', '#b15928', '#a6cee3', '#b2df8a', '#fb9a99', '#fdbf6f', '#cab2d6', '#ffff99'],
                 pointSize: [3],
                 opacity: [0.5],
             });

              this.rawData.forEach(function(d){
                 //we map value A to 1 here, value B to the clustering membership
                 that.points.push([parseFloat(d.emb1), parseFloat(d.emb2), 1, parseInt(d[that.method])]);
             });
         }
         else {
             this.scatterplot.set({
                 //9 divergent colors
                 pointColor: ['#b2182b','#ef8a62','#fddbc7','#f7f7f7','#d1e5f0','#67a9cf','#2166ac'],
                 pointSize: [3],
                 opacity: [0.9],
             });

             this.rawData.forEach(function(d){
                 //we map value A to 1 here, value B to the clustering membership
                 that.points.push([parseFloat(d.emb1), parseFloat(d.emb2), 1, parseInt((parseFloat(d[that.method + '_silhuette'])+1)*3)]);
             });
         }

        this.render();
    }

    render(){
        //render the scatterplot (webgl)
        this.scatterplot.draw(this.points);
        console.log('rendering done');

        this.scatterplot.subscribe('view', ({ xScale, yScale }) => {

          let mappings = this.scatterplot.get('pointsInView').map((pointIndex) => [
            xScale(this.points[pointIndex][0]),
            yScale(this.points[pointIndex][1])
          ]);
          // console.log('point sample position', mappings[0][0], mappings[0][1]);

          console.log('camera target', this.scatterplot.get('cameraTarget'));
          console.log('camera distance', this.scatterplot.get('cameraDistance'));

          let packet = {
                        cameraTarget: this.scatterplot.get('cameraTarget'),
                        cameraDistance: this.scatterplot.get('cameraDistance'),
                        source: this.scatterplotID,
                    };

          this.eventHandler.trigger("EVENT_VIEW_CHANGE", packet);
        });

        this.scatterplot.subscribe('select', ({ points }) => {
            console.log("selection");

            let packet = {
                points : points ,
                source: this.scatterplotID,
            };

            this.eventHandler.trigger("EVENT_SELECTION", packet);
        })

    }

    redraw(cameraTarget, cameraDistance, source){
        if (source != this.scatterplotID) {
            this.scatterplot.set({cameraTarget: cameraTarget});
            this.scatterplot.set({cameraDistance: cameraDistance});
        }
        // this.scatterplot.draw();
    }

    select(points , source){
        if (source != this.scatterplotID){
            this.scatterplot.select(points, {preventEvent: true});
            // this.scatterplot.draw();
        }
    }


}

