class Component {
  constructor(hostEl) {
    if (!hostEl) {
      this.hostEl = document.body;
    } else {
      this.hostEl = document.getElementById(hostEl);
    }
  }
}
class domMover {
  static moveElement(elId, newDes) {
    const el = document.getElementById(elId);
    const desEl = document.querySelector(newDes);
    desEl.append(el);
  }

  static clearEvent(element) {
    const clonedEl = element.cloneNode(true);
    element.replaceWith(clonedEl);
    return clonedEl;
  }
}
class ProjectList {
  projectList = [];

  constructor(type) {
    this.type = type;
    const projItem = document.querySelectorAll(`#${type}-projects li`);
    console.log(projItem);
    for (const proj of projItem) {
      this.projectList.push(
        new Project(proj.id, this.switchProject.bind(this), this.type)
      );
    }
    this.dropEnable();
  }

  addProject(project) {
    this.projectList.push(project);
    // console.log("project added: ", project);
    domMover.moveElement(project.id, `#${this.type}-projects ul`);
    project.updateType(this.switchProject.bind(this), this.type);
  }

  setSwitchHandler(switchHandlerFunc) {
    this.switchHandler = switchHandlerFunc;
  }

  switchProject(id) {
    this.switchHandler(this.projectList.find((p) => p.id === id));
    this.project = this.projectList.filter((p) => p.id !== id);
  }

  dropEnable() {
    const list = document.querySelector(`#${this.type}-projects ul`);
    list.addEventListener("dragenter", (event) => {
      if (event.dataTransfer.types[0] === "text/plain") {
        event.preventDefault();
      }
      list.parentElement.classList.add("droppable");
    });
    list.addEventListener("dragover", (event) => {
      // can not get the concrete data of id, only
      // the data type
      if (event.dataTransfer.types[0] === "text/plain") {
        event.preventDefault();
      }
    });

    list.addEventListener("dragleave", (event) => {
      if (event.relatedTarget.closest(`#${this.type}-projects ul`) !== list){
        list.parentElement.classList.remove("droppable");
      }
        
    });

    list.addEventListener('drop', event => {
        const projId = event.dataTransfer.getData('text/plain'); 
        if (this.projectList.find(project => project.id === projId)){
            return; 
        }
        document.getElementById(projId).querySelector('button:last-of-type').click(); 
        list.parentElement.classList.remove("droppable");
        event.preventDefault(); // prevent full screen of img or url 
       
    } );
  }
}

class Tooltip extends Component {
  constructor(closeNotiFunc, text, hostEl) {
    super(hostEl);
    this.closeNotiFunc = closeNotiFunc;
    this.text = text;
  }
  hide = () => {
    this.noteEl.remove();
    this.closeNotiFunc();
  };
  display() {
    const tooltipEl = document.createElement("div");
    tooltipEl.className = "card";
    tooltipEl.textContent = this.text;

    const hostLeftPos = this.hostEl.offsetLeft;
    const hostTopPos = this.hostEl.offsetTop;
    const hostHeight = this.hostEl.offsetHeight;
    const scrollParent = this.hostEl.parentElement.scrollTop;

    // value here is always pixel
    const tooltipX = hostLeftPos + 20;
    const tooltipY = hostHeight + hostTopPos - scrollParent - 10;

    tooltipEl.style.left = tooltipX + "px";
    tooltipEl.style.top = tooltipY + "px";
    tooltipEl.style.position = "absolute";

    // console.log("hostEl", this.hostEl);

    // console.log(this.hostEl.getBoundingClientRect());
    this.noteEl = tooltipEl;
    tooltipEl.addEventListener("click", this.hide);
    this.hostEl.append(tooltipEl);
  }
}

class Project {
  hasTooltip = false;

  constructor(id, switchHandlerFunc, type) {
    this.id = id;
    this.switchHandler = switchHandlerFunc;
    this.addEventForSwitchButton(type);
    this.addEventForMoreInfoButton();
    this.dragEnable();
  }
  addEventForSwitchButton(type) {
    console.log(`#${this.id} button:last-of-type`);
    let switchButton = document.querySelector(
      `#${this.id} button:last-of-type`
    );
    switchButton = domMover.clearEvent(switchButton);
    switchButton.textContent = type === "finished" ? "Activate" : "Finish";
    switchButton.addEventListener(
      "click",
      this.switchHandler.bind(null, this.id)
    );
  }

  showMoreInfo() {
    if (!this.hasTooltip) {
      console.log(this);
      const projEl = document.getElementById(this.id);
      const projDataExtraInfo = projEl.dataset.extraInfo;
      console.log(projDataExtraInfo);
      const tooltip = new Tooltip(
        () => (this.hasTooltip = false),
        projDataExtraInfo,
        this.id
      );
      tooltip.display();
      this.hasTooltip = true;
    }
  }

  dragEnable() {
    const dragElement = document.getElementById(this.id);
    dragElement.addEventListener("dragstart", (event) => {
      event.dataTransfer.setData("text/plain", this.id);
      event.dataTransfer.effectAllowed = "move";
    });
    dragElement.addEventListener('dragend', event => console.log(event))
  }

  addEventForMoreInfoButton() {
    const moreInfoButton = document.querySelector(`#${this.id} button`);
    moreInfoButton.addEventListener("click", this.showMoreInfo.bind(this));
  }

  updateType(updateProjectFunc, type) {
    this.switchHandler = updateProjectFunc;
    this.addEventForSwitchButton(type);
  }
}

class App {
  static init() {
    const finished = new ProjectList("finished");
    const inProgress = new ProjectList("active");
    inProgress.setSwitchHandler(finished.addProject.bind(finished));
    finished.setSwitchHandler(inProgress.addProject.bind(inProgress));
  }
}

App.init();
