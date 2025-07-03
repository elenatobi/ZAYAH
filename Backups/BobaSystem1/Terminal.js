export class Terminal{
    constructor(value = null){
        this.HTMLElement = this.findValue(value);
        this.HTMLElement.addEventListener("click", this.onclick.bind(this));
    }

    findValue(value){
        if (!value){
            return document.createElement("div");
        }
        if (typeof value === "string"){
            return document.getElementById(value);
        }
        return value;
    }

    onclick(){
        
    }
}

export class FileReadTerminal extends Terminal{
 
    onclick(event){
        let fileInput = document.createElement("input");
        fileInput.type = "file";
        fileInput.addEventListener("change", this.onchange.bind(this));
        fileInput.click();
    }

    onchange(event){
        let file = event.target.files[0];
        if (!file) {
            return;
        }
        let reader = new FileReader();
        reader.addEventListener('load', function(event){
            this.onread(event.target.result);
        }.bind(this));
        reader.readAsText(file);
    }

    onread(result){
        
    }
}

export class FileWriteTerminal extends Terminal{
    write(fileName, data){
        let writer = document.createElement("a");
        let blob = new Blob([data], { type: 'octet/stream' });
        let url = window.URL.createObjectURL(blob);
        writer.href = url;
        writer.download = fileName;
        writer.click();
    }
}

export class ToastTerminal extends Terminal{
    toast(message){
        this.HTMLElement.innerHTML = message;
    }
}