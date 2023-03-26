public with sharing class ToDoListController {

    /*
    * Method to fetch Task records on component load for current Logged in user as Task Owner
    */
    @AuraEnabled(cacheable=true)
    public static List<Task> getTasks(){
        try {
            List<Task> tasksList = [SELECT Id,Subject FROM Task WHERE OwnerId=:UserInfo.getUserId()];
            return tasksList;
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

    /*
    * Method to Insert Task record
    * subject will be passed from UI to JS to Apex
    */
    @AuraEnabled
    public static Task insertTask(String subject) {
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

    /*
    * Method to Delete Task record based on recordId
    */
    @AuraEnabled
    public static Boolean deleteTask(Id recordId) {  
        try {
            Database.delete(recordId);
            return true;  
        } catch (Exception e) {
            System.debug(e.getMessage());
        }
        return false;
    }
}