
import Scatterplot from './scatterplot.js';
import {ScatterGL, Dataset, RenderMode, ScatterGLParams, Styles} from 'scatter-gl';
import SimpleEventHandler from "./simpleEventHandler";
import * as d3 from "d3";


export default class ThreeDScatterplot{
    // Vars
    scatterGL;
    rawData;
    points = [];
    dataType = 'clustering';
    method = 'hdbscan';
    scatterplotID = 0;
    eventHandler;
    row;
    column;
    containerElement;
    colors;
    cameraTarget;

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

        //note the difference: we use a div instead of a canvas element here.
        wrapper = wrapper.append("div")
            .attr("class", 'dcanvasWrapper');

        wrapper.append("div")
            .attr("id", 'canvas_' + this.scatterplotID)
            .attr("class", 'dcanvas');


        this.wrangle();
    }

    wrangle() {
        let that = this;
        this.containerElement = document.querySelector('#canvas_' + this.scatterplotID);
        // let width = 250;
        // let height = 250;

        let toInclude = ['emb1_3D', 'emb2_3D', 'emb3_3D'];

        let allGroup = d3.map(this.rawData, function(d){
            return [d.emb1_3D, d.emb2_3D, d.emb3_3D];
        })

        this.points = new ScatterGL.Dataset(allGroup);

        if (this.dataType == this.type_clustering) {
            this.colors = ['#1f78b4', '#33a02c', '#e31a1c', '#ff7f00', '#6a3d9a', '#b15928', '#a6cee3', '#b2df8a', '#fb9a99', '#fdbf6f', '#cab2d6', '#ffff99',
                '#1f78b4', '#33a02c', '#e31a1c', '#ff7f00', '#6a3d9a', '#b15928', '#a6cee3', '#b2df8a', '#fb9a99', '#fdbf6f', '#cab2d6', '#ffff99',
                '#1f78b4', '#33a02c', '#e31a1c', '#ff7f00', '#6a3d9a', '#b15928', '#a6cee3', '#b2df8a', '#fb9a99', '#fdbf6f', '#cab2d6', '#ffff99'];
            this.colors = this.colors.map(function(d){
                return that.addAlpha(d, 0.6);
            });
        }else{
            this.colors = ['#67001f','#b2182b','#d6604d','#f4a582','#fddbc7','#f7f7f7','#d1e5f0','#92c5de','#4393c3','#2166ac','#053061']
                // ['#67001f','#b2182b','#f4a582','#f7f7f7','#92c5de','#4393c3','#053061']
                // ['#b2182b','#ef8a62','#fddbc7','#f7f7f7','#d1e5f0','#67a9cf','#2166ac'];
            this.colors = this.colors.map(function(d){
                return that.addAlpha(d, 0.9);
            });
        }


        this.render();
    }

    render(){
        let that = this;
        this.scatterGL = new ScatterGL(this.containerElement, {
            onClick: (point) => {
                setMessage(`click ${point}`);
            },
            orbitControls: (zoomSpeed, autoRotateSpeed, mouseRotateSpeed) => {
                console.log('control');
            },
            onCameraMove: (cameraPosition, cameraTarget) => {
                setMessage(`camera Positon ${cameraPosition.x} ${cameraPosition.y} ${cameraPosition.z}`);
                let packet = {
                    cameraPosition : cameraPosition,
                    cameraTarget : cameraTarget
                };

                this.eventHandler.trigger("EVENT_3DVIEW_CHANGE", packet);
            },
            camera:  {
                position: [0.6582957223896573, 1.828357172445856, 7.1467109551441075]
            },
            styles: { point: { scaleDefault: 0.001 } }
        });
        this.scatterGL.render(this.points);
        this.scatterGL.setPointColorer((i) => {
            if (this.dataType == this.type_clustering) {
                let clusterID = this.rawData[i][this.method];
                return this.colors[clusterID];
            }else{
                let silhouetteScore = this.rawData[i][that.method + '_silhuette'];
                return this.colors[parseInt((parseFloat(silhouetteScore)+1)*5)];
            }
        });

        const setMessage = (message) => {
          const messageStr = `🔥 ${message}`;
          console.log(messageStr);
          // messagesElement.innerHTML = messageStr;
        };

        this.scatterGL.scatterPlot.onMouseMove.bind(function(){
             that.eventHandler.trigger("EVENT_3DVIEW_CHANGE", packet);
        });
    }

    addAlpha(hex, alpha) {
            var r = parseInt(hex.slice(1, 3), 16),
                g = parseInt(hex.slice(3, 5), 16),
                b = parseInt(hex.slice(5, 7), 16);

            if (alpha) {
                return "rgba(" + r + ", " + g + ", " + b + ", " + alpha + ")";
            } else {
                return "rgb(" + r + ", " + g + ", " + b + ")";
            }
        }

}