import { LightningElement,track,wire } from 'lwc';
import { refreshApex } from '@salesforce/apex';
import getTasks from '@salesforce/apex/ToDoListController.getTasks';

export default class Todo extends LightningElement {
    @track newTask;
    error;
    toDoTasksResponse;
    
    @track
    todoTasks = [];

    updateNewTask(event){
        this.newTask = event.target.value;
    }

    /* Method to add task to List */
    addTaskToList(event) {
        console.log(this.newTask);
        if(this.newTask){        
            this.todoTasks.push({
                Id: this.todoTasks.length + 1,
                Subject : this.newTask,
            });
            this.newTask = '';
        }
    }

    deleteTaskFromList(event){

        console.log('### DELETE Task for ID :::' + event.target.name);

        let idToDelete =  event.target.name;
        let todoTasks =  this.todoTasks;
        let indexToDelete;

        /* Basic looping method to loop through todotasks items and 
        comparing the Id of todoTask iteam with selected Task from UI */
        // for(var i = 0; i < todoTasks.length; i++ ){
        //     if(idToDelete == todoTasks[i].id){
        //         indexToDelete = i;
        //     }
        // }
        //this.todoTasks.splice(indexToDelete,1);  

        // splice method with findIndex method to find the index 
        // remove single element from list
        // todoTasks.splice(todoTasks.findIndex((todoTask)=> {
        //     return todoTask.id === indexToDelete;
        // }),1);

        todoTasks.splice(todoTasks.findIndex(item => idToDelete === item.id),1);

              
    }

    @wire(getTasks)
    wiredtodoTasks(response){
        
        this.toDoTasksResponse = response;
        let data  = response.data;
        let error = response.error;

        if(data){
            this.todoTasks = [];
            data.forEach(task => {
                this.todoTasks.push({
                    Id: this.todoTasks.length + 1,
                    Subject: task.Subject,
                    recordId: task.Id
                });
            });
            console.log( JSON.stringify(this.todoTasks));
        }else if(error){
            console.log(error);
        }
    }

    refreshTodoList(){
        refreshApex(this.toDoTasksResponse);
    }
}