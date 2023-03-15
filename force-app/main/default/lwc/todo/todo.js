import { LightningElement,track,wire } from 'lwc';
import { refreshApex } from '@salesforce/apex';
import getTasks from '@salesforce/apex/ToDoListController.getTasks';
import insertTask from '@salesforce/apex/ToDoListController.insertTask';
import deleteTask from '@salesforce/apex/ToDoListController.deleteTask';

export default class Todo extends LightningElement {
    @track newTask = '';
    error;
    toDoTasksResponse;

    processing = true;
    
    @track
    todoTasks = [];

    updateNewTask(event){
        this.newTask = event.target.value;
    }

    /* Method to add task to List */
    addTaskToList(event) {
        
        if(this.newTask == ''){
            return;
        }

        this.processing = true;
        insertTask({subject : this.newTask})
        .then(result => {
            this.processing = false;
                if(this.newTask){        
                    this.todoTasks.push({
                        Id: this.todoTasks.length + 1,
                        Subject : this.newTask,
                        recordId : result.Id
                    });
                    this.newTask = '';
                }
            }
        )
        .error(error => { 
            console.log(error);
        });
    }

    deleteTaskFromList(event){

        console.log('### DELETE Task for ID :::' + event.target.name);

        let idToDelete =  event.target.name;
        let todoTasks =  this.todoTasks;
        let indexToDelete;
        let recordIdToDelete;

        /* Basic looping method to loop through todotasks items and 
        comparing the Id of todoTask iteam with selected Task from UI */
        for(var i = 0; i < todoTasks.length; i++ ){
            if(idToDelete == todoTasks[i].Id){
                indexToDelete = i;
            }
        }

        recordIdToDelete  = todoTasks[indexToDelete].recordId;

        this.processing = true;

        deleteTask({recordId:recordIdToDelete})
        .then(result =>{
            this.processing = false;
        // splice method with findIndex method to find the index 
        // remove single element from list
            if(result){
                todoTasks.splice(indexToDelete,1);    
                console.log(result);
            }else{
                console.log("Unable to delete task");
            }
        }) 
        .error(error => {
            console.log(error);
        });           
    }

    @wire(getTasks)
    wiredtodoTasks(response){
        
        this.toDoTasksResponse = response;
        let data  = response.data;
        let error = response.error;

        if(data || error){
            this.processing = false;
        }

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
        this.processing = true;
        refreshApex(this.toDoTasksResponse)
        .finally(() => this.processing = false);
    }
}   