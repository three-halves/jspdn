// abstract tool class that tool scripts should inherit from
class Tool {
    constructor() {
        this.name = "default tool name";
        this.optionsElement = "";
    }

    select() {
        document.getElementById("tool-options").innerHTML = '';
        this.initTool();
        // console.log("selected " + this.name);
    }

    initTool() {

    }

    handleMouseDown(event, state, x, y) {
        
    }

    handleMouseUp(event, state, x, y) {

    }

    handleMouseMove(event, state, x, y) {

    }
}

export default Tool;