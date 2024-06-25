import pencil from '../tools/pencil.js';
import bucket from '../tools/bucket.js';
import line from '../tools/line.js';
import brush from '../tools/brush.js';

export class Toolbar {
    constructor(state) {
        this.state = state;

        this.tools = [pencil, line, brush, bucket];
        this.buttons = [];

        // toolbar button for current tool
        this.currentSelectedButton = undefined;

        // init toolbar
        this.container = document.getElementById("toolbar");
        console.log("container: ", this.container);

        // setup button for each tool
        this.tools.forEach((tool) => {        
            var button = document.createElement('button');
            button.innerHTML = tool.name;
            button.onclick = () => {
                tool.select();
                this.setSelectedClass(button);
                this.state.currentTool = tool;
            };
            this.buttons.push(button);
            this.container.appendChild(button);
        });

        this.buttons[0].onclick()
    }

    // for button pressed visual
    setSelectedClass(button) {
        if (this.currentSelectedButton !== undefined) this.currentSelectedButton.classList.remove("selected");
        this.currentSelectedButton = button;
        this.currentSelectedButton.classList.add("selected");
    }

}
