 


class ProjectList{
    projectList = []; 

    constructor(type){
        const projItem = document.querySelectorAll(`#${type}-projects li`);
        console.log(projItem); 
        for (const proj in projItem){
            this.projectList.push(new Project(proj.id)); 
        }

    }

}

class Project{
    constructor(id){
        this.id = id; 
        this.addEventForSwitchButton(); 
        this.addEventForMoreInfoButton();

    }
    addEventForSwitchButton(){
        const switchButton = document.querySelector(`#${id} button:last-of-type`); 
        switchButton.addEventListener('click', )
    }

    addEventForMoreInfoButton(){
        const moreInfoButton = document.querySelector(`#${type} button`); 
        moreInfoButton.addEventListener('click', ); 
    }
    
}


 class App{
     static init(){
         const finished = new ProjectList('finished');
         const inProgress = new ProjectList('active')

     }
 }

 App.init(); 