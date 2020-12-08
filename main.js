var template=`<?xml version="1.0" encoding="UTF-8" standalone="no"?>
<!-- Created with Inkscape (http://www.inkscape.org/) -->

<svg
   xmlns:dc="http://purl.org/dc/elements/1.1/"
   xmlns:cc="http://creativecommons.org/ns#"
   xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"
   xmlns:svg="http://www.w3.org/2000/svg"
   xmlns="http://www.w3.org/2000/svg"
   xmlns:sodipodi="http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd"
   xmlns:inkscape="http://www.inkscape.org/namespaces/inkscape"
   width="100.0mm"
   height="100.0mm"
   viewBox="0 0 100.0 100.0"
   version="1.1"
   id="svg8"
   inkscape:version="0.92.5 (2060ec1f9f, 2020-04-08)"
   sodipodi:docname="template.svg">
  <defs
     id="defs2" />
  <sodipodi:namedview
     id="base"
     pagecolor="#ffffff"
     bordercolor="#666666"
     borderopacity="1.0"
     inkscape:pageopacity="0.0"
     inkscape:pageshadow="2"
     inkscape:zoom="0.35"
     inkscape:cx="-100"
     inkscape:cy="560"
     inkscape:document-units="mm"
     inkscape:current-layer="g838"
     showgrid="true"
     inkscape:window-width="1920"
     inkscape:window-height="1050"
     inkscape:window-x="0"
     inkscape:window-y="0"
     inkscape:window-maximized="1"
     borderlayer="true">
    <inkscape:grid
       id="grid816"
       units="mm"
       type="xygrid"
       empspacing="1"
       spacingy="2.54"
       spacingx="2.54" />
  </sodipodi:namedview>
  <metadata
     id="metadata5">
    <rdf:RDF>
      <cc:Work
         rdf:about="">
        <dc:format>image/svg+xml</dc:format>
        <dc:type
           rdf:resource="http://purl.org/dc/dcmitype/StillImage" />
        <dc:title></dc:title>
      </cc:Work>
    </rdf:RDF>
  </metadata>
  <g
     id="g822"
     sodipodi:insensitive="true"
     inkscape:groupmode="layer"
     inkscape:label="[fixed] BG">
    <rect
       id="rect820"
       style="stroke:none;fill-opacity:1;fill:#FFFFFF"
       height="100.0"
       width="100.0"
       y="0"
       x="0" />
  </g>
  <g
     id="g826"
     inkscape:groupmode="layer"
     inkscape:label="B.Cu-disabled" />
  <g
     id="g828"
     inkscape:groupmode="layer"
     inkscape:label="B.Adhes-disabled" />
  <g
     id="g830"
     inkscape:groupmode="layer"
     inkscape:label="F.Adhes-disabled" />
  <g
     id="g832"
     inkscape:groupmode="layer"
     inkscape:label="B.Paste-disabled" />
  <g
     id="g834"
     inkscape:groupmode="layer"
     inkscape:label="F.Paste-disabled" />
  <g
     id="g836"
     inkscape:groupmode="layer"
     inkscape:label="B.SilkS" />
  <g
     id="g844"
     inkscape:groupmode="layer"
     inkscape:label="Dwgs.User-disabled" />
  <g
     id="g846"
     inkscape:groupmode="layer"
     inkscape:label="Cmts.User-disabled" />
  <g
     id="g848"
     inkscape:groupmode="layer"
     inkscape:label="Eco1.User-disabled" />
  <g
     id="g850"
     inkscape:groupmode="layer"
     inkscape:label="Eco2.User-disabled" />
  <g
     id="g852"
     inkscape:groupmode="layer"
     inkscape:label="Edge.Cuts" />
  <g
     id="g854"
     inkscape:groupmode="layer"
     inkscape:label="Margin-disabled" />
  <g
     id="g856"
     inkscape:groupmode="layer"
     inkscape:label="B.CrtYd-disabled" />
  <g
     id="g858"
     inkscape:groupmode="layer"
     inkscape:label="F.CrtYd-disabled" />
  <g
     id="g860"
     inkscape:groupmode="layer"
     inkscape:label="B.Fab-disabled" />
  <g
     id="g862"
     inkscape:groupmode="layer"
     inkscape:label="F.Fab-disabled" />
  <g
     id="g864"
     inkscape:groupmode="layer"
     inkscape:label="Drill" />
`;



paper.install(window);
window.onload = function() {
	paper.setup('paperCanvas');

    createSnowflake();




}

function copyColorToNewGroup(col, col2){
    let paths = getLayerByStrokeColor(col);
    let newPaths = [];
    paths.forEach(item => {
       let newPath = item.clone();
       newPath.strokeColor = col2;
       newPaths.push(newPath);
    });
    return newPaths;
}

function getLayerByStrokeColor(col){
    return lineGroup.children.filter(item => item.strokeColor != null && item.strokeColor.equals(col));
}

function getLayerByFillColor(col){
    return lineGroup.children.filter(item => item.fillColor != null && item.fillColor.equals(col));
}

//create SVG with layer ordering for usual pcb production
function buildPerfectPurle(){
    let str = template;
    let mainStrokes = getLayerByStrokeColor(new Color('red'));
    let sideStrokes = getLayerByStrokeColor(new Color('blue'));
    let sideStrokesCut = copyColorToNewGroup('red', 'white');
    let hexas = getLayerByStrokeColor(new Color('grey'));
    let cutline = getLayerByStrokeColor(new Color('green'))[0];
    if(cutline.children){
        cutline = cutline.children;
    }else{
        cutline = [cutline];
    }
    let holes = getLayerByFillColor(new Color('purple'));
    str += buildLayer("F.Cu", [...mainStrokes, ...hexas]);
    str += buildLayer("F.Mask", [...mainStrokes, ...holes]);
    str += buildLayer("F.SilkS", [...sideStrokes, ...sideStrokesCut]);
    str += buildLayer("B.Cu", [...mainStrokes, ...hexas]);
    str += buildLayer("B.Mask", [...mainStrokes, ...holes]);
    str += buildLayer("B.SilkS", [...sideStrokes, ...sideStrokesCut]);
    str += buildLayer("Edge.Cuts", [...cutline]);
    //str += buildLayer("B.Mask", starsF);
    //str += buildLayer("B.Mask", [border]);
    //str += buildLayer("F.SilkS", decorationsF);
    str += '</svg>';
    return str;
}



function buildLayer(layername, components){
    str = `<g id="${layername}" inkscape:groupmode="layer" inkscape:label="${layername}">`;
    for(let i = 0; i<components.length; i++){
        str += components[i].exportSVG({asString: true});
    }
    str += '</g>';
    return str;
}

//let user download canvas content as SVG
function downloadSVG(type){

    //var svg = project.exportSVG({ asString: true, bounds: 'content' });
    var svg = buildPerfectPurle();

    var svgBlob = new Blob([svg], {type:"image/svg+xml;charset=utf-8"});
    var svgUrl = URL.createObjectURL(svgBlob);
    var downloadLink = document.createElement("a");
    downloadLink.href = svgUrl;
    downloadLink.download = "snowflake.svg";
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
}

function shuffle(a) {
    var j, x, i;
    for (i = a.length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1));
        x = a[i];
        a[i] = a[j];
        a[j] = x;
    }
    return a;
}
