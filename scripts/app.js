/*
sample object layout...
   taskObject =	 [
	{title: "sample task", description: "sample description", priority: "none", status: "incomplete"},
	{title: "sample IMPORTANT task", description: "sample IMPORTANT description", priority: "urgent", status: "incomplete"},
	{title: "sample completed task", description: "sample completed description", priority: "none", status: "complete"}
   ]
*/

var App = {
	init: function( config ) {
		this.taskObject = [];
		this.task= config.task;
		this.complete= config.complete;
		this.homePage = config.homePage;
		this.renderList();
		this.bindFunctions();
	},
	
	bindFunctions: function() {
		
		
		// $('#add').on('pageshow', function(e, data) {
		// 	$('#add form input#title').trigger('focus');
		// });
		$(' .update-save').click(App.updateTask);
		$(' .complete-all').click(App.completeAll);
		$(' .delete-all').click(App.DeleteAll);
		$(' .update-button').click(App.loadUpdateForm);
		$(" .toogle-task").on('click',App.taskSwiped);
		$('.add-save').click(App.addTask);
		// $('#delete-confirm .btn-confirm').on('tap', App.reset);
		// $('#purge-confirm .btn-confirm').on('tap', App.purgeCompleted);
		// //trigger autofocus for 'add' dialog
		// $('#add form input[autofocus]').trigger('focus');
		// this.list.on('swipe', function(event) {
		// 	console.log(event);
		// });

	},
	
	/*
	* Retrieve data from localStorage
	* returns the retrieved data as an object
	*/
	loadUpdateForm: function() {
		var item = $(event.currentTarget);
		var id = item.attr('id');
		App.loadData();
		var title = App.taskObject[id].title;
		var description = App.taskObject[id].description;
		var priority = App.taskObject[id].priority;
		var status = App.taskObject[id].status;
		
		$('#update-dialog #update-id').val(id);
		$('#update-dialog #update-title').val(title);
		$('#update-dialog #update-description').val(description);
		var urgentInput = $('#update-dialog  #update-urgent').parent();
		var statusInput = $('#update-dialog  #update-status').parent();
		if(priority == 'urgent'){
			
			if(! $("#update-dialog  #update-urgent").prop("checked") ){
				urgentInput.trigger("click");
			}
			
		}
		else{
			if( $("#update-dialog  #update-urgent").prop("checked") ){
				urgentInput.trigger("click");
			}
		}
		if(status == 'complete'){
			
			if(! $("#update-dialog  #update-status").prop("checked") ){
				statusInput.trigger("click");
			}
		}
		else{
			if( $("#update-dialog  #update-status").prop("checked") ){
				statusInput.trigger("click");
			}
		}
		$('#update-dialog').fadeIn('fast');
		$("#update-title").focus();
	},
	completeAll: function() {
		for(x in App.taskObject){
			App.taskObject[x].status = 'complete';
		}
		
		App.saveData();
		App.renderList();
	},
	createCard: function(id) {
		var title = App.taskObject[id].title;
		var description = App.taskObject[id].description;
		var priority = App.taskObject[id].priority;
		var status = App.taskObject[id].status;
		var listClass= priority + ' ' + status;
		var card = '' ;

			var task_urgent = '';
			if(priority == 'urgent'){
				task_urgent = 'urgent';
				title = '<i class="material-icons md-light">flag</i>'+ title;
			} else {
				task_urgent = 'task';
			};
			if(status == "complete"){
				card = 
					'<div id="'+id+'" class="mdl-cell mdl-cell--6-col mdl-card mdl-shadow--4dp '+task_urgent+'-card todo portfolio-card ">'+ 
						'<div class="mdl-card__title">'+
							'<h2 class="mdl-card__title-text">'+title+'</h2>'+
							'<a id="'+id+'"class="mdl-button mdl-button--colored mdl-js-button mdl-js-ripple-effect mdl-button--accent toogle-task" href="#"><i class="material-icons md-dark">undo</i> </a>'+
						'</div>'
						'<div class="mdl-card__supporting-text">'+description+'</div>'+
					'</div>';
			} else {
				card = 
					'<div id="'+id+'" class="mdl-cell mdl-cell--12-col mdl-card mdl-shadow--4dp '+task_urgent+'-card todo portfolio-card ">'+ 
						'<div class="mdl-card__title">'+
							'<h2 class="mdl-card__title-text">'+title+'</h2>'+
						'</div>'+
						'<div class="mdl-card__supporting-text">'+description+'</div>'+
						'<div class="mdl-card__actions mdl-card--border"><a id="'+id+'"class="mdl-button mdl-button--colored mdl-js-button mdl-js-ripple-effect mdl-button--accent toogle-task" href="#"><i class="material-icons md-light">done</i></a><a id="'+id+'"class="mdl-button mdl-button--colored mdl-js-button mdl-js-ripple-effect mdl-button--accent update-button" href="#"><i class="material-icons md-light">update</i></a></div>'+
					'</div>';
			}
		return card;
		
			
	},
	loadData: function() {
		if(!localStorage) { //if localStorage is not compatible
			alert('localStorage is not compatible with your browse');
			this.taskObject = null;
		}   
		if(localStorage.getItem('todoData') == null || localStorage.getItem('todoData') == "[]" ) {//first time site is accessed, set up sample tasks...
			console.log('creating sample tasks');
			var newTaskObject =	 [
				{title: "sample task", description: "sample description", priority: "none", status: "incomplete"},
				{title: "sample IMPORTANT task", description: "sample IMPORTANT description", priority: "urgent", status: "incomplete"},
				{title: "sample completed task", description: "sample completed description", priority: "none", status: "complete"}
			];
			localStorage.setItem('todoData', JSON.stringify(newTaskObject));
			console.log('localStorage for new ToDo list created');
			this.taskObject = newTaskObject;
	   }
		if(localStorage.getItem('todoData')) {
			console.log('retrieving existing tasks...');
			retrievedObject = JSON.parse(localStorage.getItem('todoData'));
			console.log('data retrieved from localStorage: ');
			
			this.taskObject = retrievedObject;
		}	
	},
	
	/*
	* Renders list by traversing through tasks and
	* appending list items into DOM
	*/
	renderList: function() {
		this.loadData();
		this.task.empty();
		this.complete.empty();
		App.sortTask();
		var task, complete; 
		for (x in this.taskObject) { 

			var title = this.taskObject[x].title;
			var status = this.taskObject[x].status;
			var description = this.taskObject[x].description;
			var priority = this.taskObject[x].priority;
			 card =App.createCard(x);
			 
			if(status == 'incomplete'){
				$(card).appendTo("#task").hide().fadeIn(500);
			}
			else{
				$(card).appendTo("#complete").hide().fadeIn(500);
			}
			
			

		}
		App.bindFunctions();

		
		
	},
	
	/*
	* Saves tasks data into localStorage
	*/
	saveData: function() {
		
		if(this.taskObject == null) {
			console.log('Error: task data not defined');
			return false;
		}
		localStorage.setItem('todoData', JSON.stringify(this.taskObject));
		console.log('Data saved into localStorage');
		App.sortTask();
		App.bindFunctions();
	},
	
	taskSwiped: function(event) {
		var item = $(event.currentTarget);
		console.log(item);
		var parent = item.parent();
		parent = parent.parent();
		classparent = parent.parent();
		var id = item.attr('id');
		console.log("swipe "+ id);
		if(classparent.hasClass('task')) {
			App.taskObject[id].status = 'complete';
			App.saveData();
			console.log( "complete  "+ App.taskObject[id].status);
			parent.fadeOut('fast',function() {
					App.renderList();
				
				App.bindFunctions();
			});
			
		} else if(classparent.hasClass('complete')) {
			App.taskObject[id].status = 'incomplete';
			App.saveData();

			console.log( "incomplete  "+ App.taskObject[id].status);
			parent.fadeOut('fast', function(){
				App.renderList();
				App.bindFunctions();	
			});
		}
		App.bindFunctions();
		
		
		
	},

	/*
	* event handler for adding a new task
	*/
	addTask: function() {
		var newTitle ;
		if( $(' #title').val() == '') {
			
			$('#title').val('');
			$('#description').val('');
			$("#add-dialog").fadeOut("fast");
			return false;
		}
		else{
			newTitle =   $('#add-dialog #title').val();
		}
		var newPriority = 'none';
		if( $(' #urgent ').is(':checked') ) {
			newPriority = 'urgent';
			$("#urgent").trigger("click");
				
		}
		var newDescription = $('#add-dialog #description').val();
		
		var newTask = {
			title: newTitle,
			description: newDescription,
			priority: newPriority,
			status: 'incomplete'
		}
		
		//Prepend new task to array -- the unshift method prepends, push appends

		App.taskObject.unshift(newTask);
		console.log('new task added to taskObject');
		
		//save updated object to localStorage
		App.saveData();
		
		//reload task list
		App.renderList();
		
		
		//reset form
		$('#add-dialog #title').val('');
		$('#add-dialog #description').val('');
	},
	sortTask: function() {
		console.log(' sortTaskObject');
		var task = [];
		var urgent = [];
		var sortTaskObject = [];
		for (x in this.taskObject) { 
			var title = this.taskObject[x].title;
			var status = this.taskObject[x].status;
			var description = this.taskObject[x].description;
			var priority = this.taskObject[x].priority;
			
			var temp = {
				title: title,
				description: description,
				priority: priority,
				status: status
			}
			if(priority == 'urgent') {
				urgent.push(temp);
				
			}
			else{
				task.push(temp);
				
			};
		}
		this.taskObject = [];
		this.taskObject = urgent;
		for(x in task) {
			var temp = {
				title: task[x].title,
				description: task[x].description,
				priority: task[x].priority,
				status: task[x].status
			}
			this.taskObject.push(temp);
		}
		console.log("taskObject array");

		

	},
	DeleteAll: function() {
		console.log(' Delete complete');
		dialog.close();
		var task = [];
		for (x in App.taskObject) { 
			var title = App.taskObject[x].title;
			var status = App.taskObject[x].status;
			var description = App.taskObject[x].description;
			var priority = App.taskObject[x].priority;
			var temp = {
				title: title,
				description: description,
				priority: priority,
				status: status
			}
			
			if(status == 'incomplete') {
				task.push(temp);
			};
		}
		
		App.taskObject = [];
		App.taskObject = task;
		App.saveData();
		App.renderList();
		App.bindFunctions();
		

	},
	updateTask: function() {
		console.log('updating task...');
		var id = $("#update-id").val();
		var title = $("#update-title").val();
		var description = $("#update-description").val();
		var priority = "none" ;
		if( $("#update-urgent").prop("checked")){
			var priority = "urgent" ;
			var urgent_card =  $("#update-urgent").parent();
			urgent_card.trigger("click");
		}
		var status = "incomplete" ;
		if( $("#update-status").prop("checked")){
			var status = "complete" ;
			var status_card =  $("#update-status").parent();
			status_card.trigger("click");
		}
		App.taskObject[id].title = title;
		App.taskObject[id].description = description;
		App.taskObject[id].priority = priority;
		App.taskObject[id].status = status;
		$("#update-dialog").fadeOut();
		$("#update-id").val('');
		$("#update-title").val('');
		$("#update-description").val('');
		App.sortTask();
		App.saveData();
		App.renderList();
		App.bindFunctions();
	},

	reset: function(event) {
		// App.resetSampleData();
		// App.renderList();
		// $.mobile.changePage( App.homePage );
	},
	
	/*
	* transfer incomplete tasks to new array, 
	* and set taskObject to new array
	*/
	purgeCompleted: function(event) {
		// var numItemsPurged = 0;
		// var newTaskObject = [];
		// for (x in App.taskObject) {
		// 	console.log(x);
		// 	if(App.taskObject[x].status == 'incomplete') {
		// 		newTaskObject.push(App.taskObject[x]);
		// 	}
		// }
		// console.log('new taskObject: ' + newTaskObject);
		// App.taskObject = newTaskObject;
		// console.log(this);
		// App.saveData();
		// App.renderList();
		// $.mobile.changePage( App.homePage );
		
	},
	
	/*
	* Reset function: Clears todoData and resets sample tasks
	*/
	resetSampleData: function() {
	 //   this.taskObject = [
		// {title: "sample task", description: "sample description", priority: "none", status: "incomplete"},
		// {title: "sample IMPORTANT task", description: "sample IMPORTANT description", priority: "urgent", status: "incomplete"},
		// {title: "sample completed task", description: "sample completed description", priority: "none", status: "complete"}
	 //   ];
	 //   localStorage.removeItem('todoData');
		// console.log('old localStorage data cleared');
	 //   localStorage.setItem('todoData', JSON.stringify(this.taskObject));
		// console.log('new data in localStorage: ' + localStorage.getItem('todoData'));
	},
	
	
};
$(function() {
	App.init({
		homePage: $('#home'),
		task: $('#task'),
		complete: $('#complete')
	});
});
