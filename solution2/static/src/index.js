import createScatterplot from 'regl-scatterplot';
import * as d3 from "d3";
import Scatterplot from './scatterplot.js';
import {ScatterGL, Dataset, RenderMode, ScatterGLParams, Styles} from 'scatter-gl';
import SimpleEventHandler from "./simpleEventHandler";
import legend from 'd3-svg-legend'
import ThreeDScatterplot from "./3dscatterplot";

//global
let scatterplots = new Array();

async function start3D(){
    let clustering_data = await d3.csv('/clustering');
    let silhuette_data = await d3.csv('/silhouette');

        clustering_data = clustering_data.filter(function(d,i){
        return (i%5 == 0);
    })

    silhuette_data = silhuette_data.filter(function(d,i){
        return (i%5 == 0);
    })

    let eventHandler = new SimpleEventHandler(d3.select('body').node());

    //clustering

    let scatterplot1 = new ThreeDScatterplot(clustering_data, 'clustering', 'hdbscan', 1, eventHandler);
    scatterplots.push(scatterplot1);
    await scatterplot1.init();

    let scatterplot2 = new ThreeDScatterplot(clustering_data, 'clustering', 'kmeans', 2, eventHandler);
    scatterplots.push(scatterplot2);
    await scatterplot2.init();

    let scatterplot3 = new ThreeDScatterplot(clustering_data, 'clustering', 'gmm', 3, eventHandler);
    scatterplots.push(scatterplot3);
    await scatterplot3.init();

    let scatterplot4 = new ThreeDScatterplot(clustering_data, 'clustering', 'flowsom', 4, eventHandler);
    scatterplots.push(scatterplot4);
    await scatterplot4.init();

    let scatterplot5 = new ThreeDScatterplot(clustering_data, 'clustering', 'LeidenCluster', 5, eventHandler);
    scatterplots.push(scatterplot5);
    await scatterplot5.init();

    //silhouette

    let scatterplot6 = new ThreeDScatterplot(silhuette_data, 'silhouette', 'hdbscan', 6, eventHandler);
    scatterplots.push(scatterplot6);
    await scatterplot6.init();

    let scatterplot7 = new ThreeDScatterplot(silhuette_data, 'silhouette', 'kmeans', 7, eventHandler);
    scatterplots.push(scatterplot7);
    await scatterplot7.init();

    let scatterplot8 = new ThreeDScatterplot(silhuette_data, 'silhouette', 'gmm', 8, eventHandler);
    scatterplots.push(scatterplot8);
    await scatterplot8.init();

    let scatterplot9 = new ThreeDScatterplot(silhuette_data, 'silhouette', 'flowsom', 9, eventHandler);
    scatterplots.push(scatterplot9);
    await scatterplot9.init();

    let scatterplot10 = new ThreeDScatterplot(silhuette_data, 'silhouette', 'LeidenCluster', 10, eventHandler);
    scatterplots.push(scatterplot10);
    await scatterplot10.init();

    addLegendClustering();
    addLegendSilhouette();

    eventHandler.bind("EVENT_3DVIEW_CHANGE", update3DViews );
    eventHandler.bind("EVENT_3DSELECTION", update3DSelection );

}

async function start(){
    let clustering_data = await d3.csv('/clustering');
    let silhuette_data = await d3.csv('/silhouette');

    // clustering_data = clustering_data.filter(function(d,i){
    //     return (i%10 == 0);
    // })
    //
    // silhuette_data = silhuette_data.filter(function(d,i){
    //     return (i%10 == 0);
    // })

    let eventHandler = new SimpleEventHandler(d3.select('body').node());

    //CLUSTERINGS:

    //hdbscan
    let scatterplot2 = new Scatterplot(clustering_data, 'clustering', 'hdbscan', 2, eventHandler);
    scatterplots.push(scatterplot2);
    await scatterplot2.init();

    //kmeans
    let scatterplot4 = new Scatterplot(clustering_data, 'clustering', 'kmeans', 4, eventHandler);
    scatterplots.push(scatterplot4);
    await scatterplot4.init();

    //gmm
    let scatterplot6 = new Scatterplot(clustering_data, 'clustering', 'gmm', 6, eventHandler);
    scatterplots.push(scatterplot6);
    await scatterplot6.init();

    //flowsom
    let scatterplot8 = new Scatterplot(clustering_data, 'clustering', 'flowsom', 8, eventHandler);
    scatterplots.push(scatterplot8);
    await scatterplot8.init();

    //leiden
    let scatterplot10 = new Scatterplot(clustering_data, 'clustering', 'LeidenCluster', 10, eventHandler);
    scatterplots.push(scatterplot10);
    await scatterplot10.init();

    // //deep cluster
    // let scatterplot11 = new Scatterplot(clustering_data, 'clustering', 'DeepCluster_10', 11);
    // await scatterplot11.init();

    //SILHOUETTE SCORES:

    //hdbscan
    let scatterplot1 = new Scatterplot(silhuette_data, 'silhouette', 'hdbscan', 1, eventHandler);
    scatterplots.push(scatterplot1);
    await scatterplot1.init();

    //kmeans
    let scatterplot3 = new Scatterplot(silhuette_data, 'silhouette', 'kmeans', 3, eventHandler);
    scatterplots.push(scatterplot3);
    await scatterplot3.init();

    //gmm
    let scatterplot5 = new Scatterplot(silhuette_data, 'silhouette', 'gmm', 5, eventHandler);
    scatterplots.push(scatterplot5);
    await scatterplot5.init();

    //flowsom
    let scatterplot7 = new Scatterplot(silhuette_data, 'silhouette', 'flowsom', 7, eventHandler);
    scatterplots.push(scatterplot7);
    await scatterplot7.init();

     //leiden
    let scatterplot9 = new Scatterplot(silhuette_data, 'silhouette', 'LeidenCluster', 9, eventHandler);
    scatterplots.push(scatterplot9);
    await scatterplot9.init();

    eventHandler.bind("EVENT_VIEW_CHANGE", updateViews );
    eventHandler.bind("EVENT_SELECTION", updateSelection );

    addLegendClustering();
    addLegendSilhouette();
}

async function addLegendSilhouette(){
            // Color legend.
      var colorScale = d3.scaleQuantize()
        .domain([ -1, 1 ])
        // .range(['#b2182b','#ef8a62','#fddbc7','#f7f7f7','#d1e5f0','#67a9cf','#2166ac']);
      .range(['#67001f','#b2182b','#d6604d','#f4a582','#fddbc7','#f7f7f7','#d1e5f0','#92c5de','#4393c3','#2166ac','#053061']);
      var colorLegend = legend.legendColor()
        .labelFormat(d3.format(".1f"))
        .scale(colorScale)
        .shapePadding(5)
        .shapeWidth(10)
        .shapeHeight(15)
        .labelOffset(12);

      let div = d3.select('#silhouette_row').append('div')
          .attr('class', 'col-xl');
      let svg = div.append("svg").attr("width", 60).attr("height", 250);

      svg.append("g")
        .attr("transform", "translate(0, 50)")
          .style("font-size","7px")
        .call(colorLegend);
}

async function addLegendClustering(){
        // Color legend.
  var colorScale = d3.scaleOrdinal()
    .domain(["C1","C2","C3","C4","C5","C6","C7","C8","C9","C10","C11","C12","C13","C14","C15","C16","C17","C18","C19","C20"])
    .range(['#1f78b4', '#33a02c', '#e31a1c', '#ff7f00', '#6a3d9a', '#b15928', '#a6cee3', '#b2df8a', '#fb9a99', '#fdbf6f', '#cab2d6', '#ffff99','#1f78b4', '#33a02c', '#e31a1c', '#ff7f00', '#6a3d9a', '#b15928', '#a6cee3', '#b2df8a',]);

  var colorLegend = legend.legendColor()
    .labelFormat(d3.format(".1f"))
    .scale(colorScale)
    .shapePadding(3)
    .shapeWidth(6)
    .shapeHeight(8)
    .labelOffset(10);

  let div = d3.select('#cluster_row').append('div')
      .attr('class', 'col-xl');
  let svg = div.append("svg").attr("width", 60).attr("height", 250);

  svg.append("g")
    .attr("transform", "translate(0, 20)")
      .style("font-size","6px")
    .call(colorLegend);
}

function updateViews(packet){
    scatterplots.forEach(function(plot){
        plot.redraw(packet.cameraTarget, packet.cameraDistance, packet.source);
    })
}

function update3DViews(packet){
    scatterplots.forEach(function(plot){
        plot.scatterGL.scatterPlot.setCameraPositionAndTarget(
            [packet.cameraPosition.x, packet.cameraPosition.y, packet.cameraPosition.z],
            [packet.cameraTarget.x, packet.cameraTarget.y, packet.cameraTarget.z]);
    })
}


function updateSelection(packet){
    // console.log('update selection');
    scatterplots.forEach(function(plot){
        plot.select(packet.points , packet.source);
    })
}

function update3DSelection(packet){
    // console.log('update selection');
    scatterplots.forEach(function(plot){
        plot.select(packet.points , packet.source);
    })
}







//2D
// start();

//3D
start3D();