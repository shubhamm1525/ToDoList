public with sharing class ToDoListController {

    @AuraEnabled(cacheable=true)
    public static List<Task> getTasks(){
        try {

            List<Task> tasksList = [SELECT Id,Subject 
                                FROM Task 
                                WHERE OwnerId=:UserInfo.getUserId()
                                ];
            return tasksList;
            
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

    @AuraEnabled
    private static Task insertTask(String subject) {

        try {
            Task task = new Task();
            task.Subject = subject;
            task.Status = 'Not Started';
            task.Priority = 'Normal';
            task.OwnerId= UserInfo.getUserId();
            insert task;
            return task;
        } catch (Exception e) {
            System.debug(e.getMessage());
        }
        return null;
    }

    @AuraEnabled
    private static Boolean deleteTask(Id recordId) {  
        try {
            Database.delete(recordId);
            return true;  
        } catch (Exception e) {
            System.debug(e.getMessage());
        }
        return false;
    }
}