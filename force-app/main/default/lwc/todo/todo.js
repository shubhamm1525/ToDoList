import { LightningElement,track } from 'lwc';

export default class Todo extends LightningElement {
    @track newTask;
    
    @track
    todoTasks = [
    ];

    updateNewTask(event){
        this.newTask = event.target.value;
    }

    addTaskToList(event) {
        console.log(this.newTask);
        if(this.newTask){        
            this.todoTasks.push({
                id: this.todoTasks.length + 1,
                name : this.newTask
            });
            this.newTask = '';
        }
    }

    deleteTaskFromList(event){

        console.log('### DELETE Task for ID :::' + event.target.name);

        let idToDelete =  event.target.name;
        let todoTasks =  this.todoTasks;
        let indexToDelete;

        for(var i = 0; i < todoTasks.length; i++ ){
            if(idToDelete == todoTasks[i].id){
                indexToDelete = i;
            }
        }
        this.todoTasks.splice(indexToDelete,1);        
    }
}