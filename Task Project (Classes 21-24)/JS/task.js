
class Task{

    constructor(title, important, dueDate, description, alertText, location){
        this.title=title;
        this.important=important;
        this.dueDate=dueDate;
        this.description=description;
        this.alertText=alertText;
        this.location=location;

        this.user = "andrew";
        this.createdOn = new Date();
    }

}