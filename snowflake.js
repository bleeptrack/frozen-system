var angle = 60
var lineGroup;
var mainLine;
var innerLines = [];
var outerLines = [];
var hexagons = [];

function createSnowflake(){
    lineGroup = new Group();
    mainLine = new Path.Line(view.center, view.center.subtract([0, 300]) );
    mainLine.strokeColor = 'red';
    mainLine.strokeWidth = 15;
    mainLine.strokeCap = 'round';
    decorateLine(mainLine, 0);

    flip();
    decorateBackground(mainLine);

    lineGroup.addChild(mainLine);
    spread();
    decorateBackground();

    createOutLine();
    //lineGroup.translate([100,100]);
}

function createOutLine(){
    let shape = new Path();
    lineGroup.children.forEach(path => {
        if(path.closed){
            let p = PaperOffset.offset(path, 20+path.strokeWidth/2);


            let tmp = p.unite(shape);
            shape.remove();
            p.remove();
            shape = tmp;
        }else{
            let p = PaperOffset.offsetStroke(path, 20+path.strokeWidth/2) ;
            p.fillColor = 'orange';
            let tmp = p.unite(shape);
            shape.remove();
            p.remove();
            shape = tmp;

            let c = new Path.Circle(path.lastSegment.point, 20+path.strokeWidth/2);
            c.fillColor = 'black';
            let tmp2 = c.unite(shape);
            shape.remove();
            c.remove();
            shape = tmp2;

        }
    });
    //let p = PaperOffset.offset(shape, 20);
    //shape.remove();
    //shape = p;
    shape.strokeColor = 'green';
    shape.fillColor = undefined;
}

function spread(){
    let newGroup = new Group();

    for(let i = 1; i<6; i++){
        let sym = lineGroup.clone();
        sym.rotate(angle*i, view.center);
        newGroup.addChildren(sym.children);
    }
    newGroup.addChildren(lineGroup.children);

    lineGroup = newGroup;
}

function flip(){
    let flip = lineGroup.clone();
    flip.scale(-1, 1, lineGroup.bounds.bottomLeft);
    let newGroup = new Group();
    newGroup.addChildren(lineGroup.children);
    newGroup.addChildren(flip.children);
    lineGroup = newGroup;
}

function decorateBackground(line){
    let hexa;
    if(line){
        hexa = new Path.RegularPolygon(line.getPointAt(Math.random() * line.length/2 + line.length/2), 6, Math.max(line.length/5, Math.random()*line.length/2));
        hexa.strokeWidth = line.strokeWidth;

    }else{
        hexa = new Path.RegularPolygon(view.center, 6, Math.random()*100+ 100);
        hexa.strokeWidth = mainLine.strokeWidth;
    }
    hexa.strokeColor = 'grey';
    hexa.sendToBack();
    lineGroup.addChild(hexa);
    for(let i = 1; i<4; i++){
        let smallHexa = hexa.clone();
        smallHexa.scale(1 - i*0.2);

        if(i==3){

            smallHexa.strokeWidth = 1;
            smallHexa.fillColor = 'purple';
            smallHexa.strokeColor = 'purple';
            smallHexa.sendToBack();

        }else{
            smallHexa.strokeWidth = hexa.strokeWidth * (1 - i*0.3);
            smallHexa.sendToBack();

        }
        lineGroup.addChild(smallHexa);
    }

}

function decorateLine(line, depth){
    for(let i = 0; i<Math.floor(Math.random()*4 + 2); i++){

        let miniLine = line.clone();
        miniLine.scale(1/ (Math.random()*5 + 1));
        miniLine.strokeWidth = line.strokeWidth*3/4;

        let start = line.getPointAt( Math.max(miniLine.length, Math.random() * line.length) );
        miniLine.position = start;
        miniLine.rotate(60, miniLine.firstSegment.point);
        miniLine.bringToFront();
        lineGroup.addChild(miniLine);
        if(depth<1){
            miniLine.strokeColor = 'red'
        }else{
            miniLine.strokeColor = 'blue';
        }

        let conti = Math.random() < 0.7 && miniLine.length > mainLine.length/3;
        if(conti){
            decorateLine(miniLine, depth+1);
        }
    }
}

function colorAll(arr, col){
    arr.forEach(item => {
        item.strokeColor = 'red';
    });
}

function clamp(value, min, max){
    if(value < min){
        return min;
    }else if(value > max){
        return max;
    }
    return value;
}


//min and max are included
function randInt(min, max){
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
