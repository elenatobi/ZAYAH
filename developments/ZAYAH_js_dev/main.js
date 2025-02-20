const g = new GraphWin("myCanvas");

const e = new Ellipse({
    x: 110,
    y: 50,
    width: 50,
    height: 70,
    color: "orange"
});

e.bind("touchstart", function(evt){
    console.log("touchstart", evt);
})

e.bind("touchmove", function(evt){
    console.log("touchmove", evt);
})

e.bind("touchend", function(evt){
    console.log("touchend", evt);
})


g.add(e);