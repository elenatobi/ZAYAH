function crop(val){
    val = val.split("\n");
    let res = [];
    for (let i of val){
        i = i.trim();
        if (i[0] == "-"){
            i = i.slice(1);
        }
        i = i.trim();
        let part = "";
        if (i.startsWith("Atommassa")){
            res.push(i.split(" ")[1].slice(0, -1));
        }
        if (i.startsWith("Atomradie")){
            res.push(i.split(" ")[1].slice(0, -5));
        }
        if (i.startsWith("1st joniseringsenergi")){
            res.push(i.split(" ")[2].slice(0, -6));
        }
        if (i.startsWith("Elektronegativitet")){
            res.push(i.split(" ")[1]);
        }
    }
    return "(" + res.join(" ") + ")";
}

function rm(val){
    val = val.split("\n");
    let res = "";
    for (let i of val){
        i = i.trim();
        if (i[0] == "-"){
            i = i.slice(1);
        }
        i = i.trim();
        if (!(i.startsWith("Atommassa") || i.startsWith("Atomradie") || i.startsWith("1st joniseringsenergi") || i.startsWith("Elektronegativitet"))){
            res += "- " + i + "\n";
        }
    }
    return res;
}

document.addEventListener("DOMContentLoaded", function(){
    let input = document.getElementById("input");
    let outputcrop = document.getElementById("outputCrop");
    let outputrm = document.getElementById("outputRM");
    input.addEventListener("input", function(){
        outputCrop.value = crop(this.value);
        outputrm.value = rm(this.value);
    })
})