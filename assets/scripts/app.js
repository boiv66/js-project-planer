 

class domMover{
    static moveElement(elId, newDes){
        const el = document.getElementById(elId); 
        const desEl = document.querySelector(newDes); 
        desEl.append(el); 

    }

    static clearEvent(element){
        const clonedEl = element.cloneNode(true); 
        element.replaceWith(clonedEl); 
        return clonedEl; 

         

    }
}
class ProjectList{
    projectList = [];
    
    constructor(type){
        this.type = type; 
        const projItem = document.querySelectorAll(`#${type}-projects li`);
        console.log(projItem); 
        for (const proj of projItem){
            this.projectList.push(new Project(proj.id, this.switchProject.bind(this), this.type)); 
        }

    }

    addProject(project){
        this.projectList.push(project);
        // console.log("project added: ", project);
        domMover.moveElement(project.id, `#${this.type}-projects ul` )
        project.updateType(this.switchProject.bind(this), this.type); 

    }

    setSwitchHandler(switchHandlerFunc){
        this.switchHandler = switchHandlerFunc;


    }

    switchProject(id){
        this.switchHandler(this.projectList.find(p=> p.id === id));
        this.project = this.projectList.filter(p => p.id !== id); 
        
    }

}

class Tooltip{

    constructor(closeNotiFunc, text){
        this.closeNotiFunc = closeNotiFunc; 
        this.text = text; 


    }
    hide = () => {
        this.noteEl.remove();
        this.closeNotiFunc();


    }
    display(){
        console.log('the tooltip...');
        const tooltipEl = document.createElement('div'); 
        tooltipEl.className = 'card';
        tooltipEl.textContent = this.text; 
        this.noteEl = tooltipEl; 
        tooltipEl.addEventListener('click', this.hide ); 
        document.body.append(tooltipEl); 
    }

}

class Project{
    hasTooltip = false;

    constructor(id, switchHandlerFunc, type){
        this.id = id; 
        this.switchHandler = switchHandlerFunc; 
        this.addEventForSwitchButton(type); 
        this.addEventForMoreInfoButton();

    }
    addEventForSwitchButton(type){
        console.log(`#${this.id} button:last-of-type`);
        let switchButton = document.querySelector(`#${this.id} button:last-of-type`); 
        switchButton = domMover.clearEvent(switchButton);
        switchButton.textContent = type === 'finished' ? 'Activate' : 'Finish';
        switchButton.addEventListener('click', this.switchHandler.bind(null, this.id));

    }

    showMoreInfo(){
        if(!this.hasTooltip){
           
            console.log(this); 
            const projEl = document.getElementById(this.id); 
            const projDataExtraInfo = projEl.dataset.extraInfo; 
            console.log(projDataExtraInfo); 
            const tooltip = new Tooltip(() => this.hasTooltip = false, projDataExtraInfo); 
            tooltip.display();
            this.hasTooltip = true;
        }

        
    }

    addEventForMoreInfoButton(){
        const moreInfoButton = document.querySelector(`#${this.id} button`); 
        moreInfoButton.addEventListener('click', this.showMoreInfo.bind(this)); 
    }
    
    updateType(updateProjectFunc, type){
        this.switchHandler = updateProjectFunc; 
        this.addEventForSwitchButton(type); 
    }
}


 class App{
     static init(){
        const finished = new ProjectList('finished');
        const inProgress = new ProjectList('active')
        inProgress.setSwitchHandler(finished.addProject.bind(finished));
        finished.setSwitchHandler(inProgress.addProject.bind(inProgress)); 

     }
 }

 App.init(); 