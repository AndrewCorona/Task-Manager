
var visible = false;
var coloralert = false;
var showIcon = `<i class="fas fa-eye"></i>`;
var hideIcon = `<i class="fas fa-eye-slash"></i>`;
var UI = {};
var taskList = [];

function showDetails(){
    console.log("btn clicked!");

    if(!visible){
        UI.secForm.removeClass('hide');
        UI.btnShow.html(hideIcon+" Hide");
        visible = true;
    }
    else{
        UI.secForm.addClass('hide'); 
        UI.btnShow.html(showIcon+" Create New Task");
        visible = false;
    }

}

function changeColor(){
    console.log("it's clicked");

    if(!coloralert){
        UI.btnImportant.removeClass("far");
        UI.btnImportant.addClass("fas active");
        coloralert = true;
    }
    else{
        UI.btnImportant.removeClass("fas active");
        UI.btnImportant.addClass("far");
        coloralert = false;
    }
}

function saveTask(){
    var title = UI.txtTitle.val();
    var date = UI.txtDate.val();
    var desc = UI.txtDescription.val();
    var alert = UI.txtAlert.val();
    var location = UI.txtLocation.val();

    if(!date) {
        $("#alertError").removeClass('hide');

        setTimeout( () => {$("#alertError").addClass('hide');} ,3000);

        return; // finish with the fn, do not continue
    }

    var task = new Task(title,coloralert,date,desc,alert,location);

    taskList.push(task);
    clearForm();
    
    $.ajax({
        url: 'http://fsdi.azurewebsites.net/api/tasks',
        type: 'POST',
        data: JSON.stringify(task), 
        contentType: "application/json",
        success: function(res){

            res.dueDate=new Date(res.dueDate);
            res.createdOn=new Date(res.createdOn);
            displayTask(res);

            //show the success alert
            UI.saveAlert.removeClass("hide");
            //this is the delay for the alert to dissapear
            setTimeout(function(){
                UI.saveAlert.addClass("hide");  
            },3000);
        },
        error: function(details){
            console.log(details)
        }
    });  
    
}


function clearForm(){
    $(".control").val('');
    UI.btnImportant.removeClass("fas active");
    UI.btnImportant.addClass("far");
    coloralert = false;
}

function loadTasks(){
    $.ajax({
        url: 'http://fsdi.azurewebsites.net/api/tasks',
        type: 'GET',
        success: list => {
            
            let myTasks = list.filter(task => task.user === 'andrew');

            for(let i=0; i<myTasks.length; i++){

                myTasks[i].dueDate = new Date(myTasks[i].dueDate);
                myTasks[i].createdOn = new Date(myTasks[i].createdOn);

                displayTask(myTasks[i]);
            }
        },
        error: details => {
            console.log("Error", details);
        }
    });
}

function displayTask(task){
    console.log(task);
    var sytanx =
    `<div class="card">
        <div class="card-header">
            ${task.title}<p class="card-text staricon">${task.important ? '<i class="far fa-star"></i>' : ""}</p>
        </div>
        <div class="card-body">
            <h5 class="card-title">Description: ${task.description}</h5>
            <p class="card-text">Due date set: ${task.dueDate.toLocaleDateString() + ' ' + task.dueDate.toLocaleTimeString()}</p><br>
            <p class="card-text">Created: ${task.createdOn}</p><br>
            <p class="card-text">Location: ${task.location}</p><br>
            <a href="#" class="btn btn-primary alert-danger deletetask">Delete Task</a>
        </div>
    </div>`;

    $("#pendingTasks").append(sytanx);
}

function init(){
    console.log("Main Page");

    loadTasks();

    UI = {
        btnShow: $('#btnShow'),
        btnImportant: $('#btnImportant'),
        secForm: $('#secForm'),
        btnSave: $('#btnSave'),
        txtTitle: $('#txtTitle'),
        txtDate: $('#txtDate'),
        txtDescription: $('#txtDescription'),
        txtAlert: $('#txtAlert'),
        txtLocation: $('#txtLocation'),
        saveAlert: $('#hideAlert')
    };
    
    //get data from servers
    //hook events
    UI.btnShow.click(showDetails);
    UI.btnImportant.click(changeColor);
    UI.btnSave.click(saveTask);
    //set the text of an input field    
}

window.onload = init;