<template>
	<div>
		<div class="container-fluid">

			

			<div class="slick-container mb-4">
				<!--<hr class="my-4">-->
				<div class="button-bar row m-0 p-0 clearfix">
					<div class="col-6 list-intro p-0">
						<p>Your current task list:</p>
					</div>
					<div class="col-6 list-buttons p-0">
						<b-button class="mt-2 mb-2 float-right" variant="dark" @click="test()">
							<font-awesome-icon class="" :icon="[ 'fas', 'flask' ]" height="30px"/>
						</b-button>
						<b-button class="mt-2 mb-2 float-right" variant="" @click="listReorderSwitch()">
							<!-- Unlock/Lock list buttons -->
							<span v-if="!moveTaskLock"><font-awesome-icon class="" :icon="[ 'fas', 'lock' ]" height="30px"/></span>
							<span v-if="moveTaskLock"><font-awesome-icon class="" :icon="[ 'fas', 'lock-open' ]" height="20px"/></span>
						</b-button>
					</div>
				</div>
				<!-- new version -->
				<div class="fullListArea">
					<!--v-model="myArray"-->
					<draggable class="row mainListDraggable p-0 m-0" group="people" @start="draggingList(true, $event)" @end="draggingList(false, $event)" handle=".handle">
						<div class="col-sm-12 col-lg-4 col-xl-3 col-12 bg-transition p-1" v-for="(item, index) in allListData" :key="item.id" :index="index">
							<div class="listContainer">
								<div class="listHeaderContainer">
									<div class="handleContainerLeft">
										<div class="taskLeftIcon handle"></div>
									</div>
									<div class="listHeader">{{item.name}}</div>
									
								</div>
								<div class="listHeaderButtonContainer">
									<div class="taskRightIcon edit pointer"></div>
								</div>
								<div class="SortableListElement" v-for="(item, index) in item.itemArr" :index="index" :key="index" group="people" @start="drag=true" @end="drag=false" handle=".handle">
									<div class="listItem">
										
										<div class="itemTitle"><!--{{ item.order+1 }}) -->{{ item.title }}</div>
										
									</div>
										
								</div>
							</div>
						</div>

					</draggable>
				</div>
			</div>
			
			<transition-group name="fade" enter-active-class="animated fadeInUp" leave-active-class="animated fadeOutDown">
				<div class="myTask" v-bind:key="task.id" v-for="task in taskListFiltered">
					<todoItem v-bind:task="task" />
				</div>
			</transition-group>
			<transition-group name="fade" enter-active-class="animated fadeInUp" leave-active-class="animated fadeOutDown">
			<div v-if="!taskList.length" v-bind:key="1" class="noTaskText"><i>No tasks</i>
				<hr>
				<blockquote>
					{{ getQuote[0] }}
					<cite>{{ getQuote[1] }}</cite>
				</blockquote>
			</div>
			</transition-group>
			
			<div class="list-info-container">
				<div><label v-if="taskList.length"><input type="checkbox" :checked="!anyRemaining" @change="checkAllTasks"> Check All</label></div>
				<div>
					<div v-if="remainingTasks">{{remainingTasks}} incomplete task</div>
					<div v-else>All tasks complete</div>
					<div v-if="taskList.length">{{taskList.length}} total tasks</div>
					<div v-else>No tasks in list</div>
				</div>
			</div>
			<div class="list-info-container">
				<div>
					<button :class="{ active: filter == 'all' }" @click="filter = 'all'">All</button>
					<button :class="{ active: filter == 'active' }" @click="filter = 'active'">Active</button>
					<button :class="{ active: filter == 'completed' }" @click="filter = 'completed'">Completed</button>
				</div>
				<div>
					<transition name="fade">
						<button v-if="showClearCompleteButton" @click="clearCompleted">Clear Completed</button>
					</transition>
				</div>
			</div>

		</div>
	</div>
</template>

<script>
import { compareAsc, format } from 'date-fns'
import axios from 'axios';

import todoItem from './todoItem.vue';
import { SlickList, SlickItem, HandleDirective } from 'vue-slicksort'
import draggable from 'vuedraggable'

// This will need changing once online. Currently in dev mode
axios.defaults.baseURL = "http://localhost:8000/api"


//var SlickItem = require('SlickItem')
//var SlickList = require('SlickList')

export default {
	name: "taskList",
	directives: { handle: HandleDirective },
	data () {
		return {
			// Imports
			format, compareAsc,
			
			// temporary cache for the edit, to remember what it was before changing it
			beforeEditCache: '',
			filter: 'all',
			moveTaskLock: false,
			
		}
	},
	components: {
		todoItem,
		SlickItem,
		SlickList,
		draggable,
	},
	props: ["taskList"],
	computed: {
		allListData() {
			// return this.$store.state.ListData
			return this.$store.getters.getListItems
		},

		orderedUserTaskItems: {
			get: function () {
				// eslint-disable-next-line
				console.log("hello")
				return []
			},
			set: function () {
				// eslint-disable-next-line
				//alert(newValue)
			}
		},
		// Slick list (sorted items)
		orderedUserTaskLists: {
			get: function () {
				if (this.randomListData.length == 0) {
					return
				} else {
					// First sort the lists themselves into the user preferred order.
					
					let unsortedList = this.randomListData;													// The unsorted data. Where we get this from will change later.			
					let sortedList = unsortedList.sort((a,b) => (a.listOrder > b.listOrder) ? 1 : -1)  		// New sorted data. Sort the array of lists by user preferred list order

					// Now sort the individual items within each list array
					
					for (let x = 0; x != sortedList.length; x++) {
						sortedList[x].itemArr.sort((a,b) => (a.order > b.order) ? 1 : -1)
					}
					
					// eslint-disable-next-line
					//this.randomListData = sortedList															// Update the sortedList data element

					return sortedList;
				}
			},
			set: function (newValue) {
				
				// Update the current display of the user list to the new order
				
				for (let y = 0; y != newValue.length ; y++) {										// Iterate over lists to update with the newly received user order.
					newValue[y].listOrder = y;
				}
				//this.randomListData = tempNew;
				/*
				for (let x = 0; x != newValue.length ; x++) {
					console.log(x + ") " + this.randomListData[x].name + " --- order: " + this.randomListData[x].listOrder)
				}
				*/
				//alert(this.randomListData[0].listOrder)
			}
		},
		
		// This is reactive filter functionality.

		// Note to self, how this is currently working:
		/*
			1) Filtering by task stake (all, active, complete)
			2) Of the filtered list, create two separate "pinned" and "unpinned" task lists
			3) Sort both lists by standard_order, aimed at giving the user ordering customisation later.
			4) Start with the sorted pinned list and concatenate the sorted unpinned list. This way the pinned tasks appear on top.
			5) Return the final list.

			- Because it's reactive, these changes happen immediately. Not sure about performance when lists are long.
			- Should consider splitting some of this functionality up. Example:
				- Could let the user sort by their user choice, id, nearest due date, etc.
				- Pinned tasks could also be in a "forced nearest deadline date" filter for the user to select. 
		*/
		taskListFiltered: function() {
			//console.log("list is modified, updating...")
			let mylist = "";
			
			// Next filter again by task state.
			if (this.filter == 'all') {
				mylist = this.taskList;
			}
			else if (this.filter == 'active') {
				mylist = this.taskList.filter(task => !task.completed);
			}
			else if (this.filter == 'completed') {
				mylist = this.taskList.filter(task => task.completed);
			}

			// Pinned and non-pinned
			let noPinned = mylist.filter(task => !task.pinned);
			let onlyPinned = mylist.filter(task => task.pinned);
			
			// Get all task objects sorted by the user preference.
			let sortedByUserOrder_pinned = onlyPinned.sort((a,b) => (a.standard_order > b.standard_order) ? 1 : -1)
			let sortedByUserOrder_noPinned = noPinned.sort((a,b) => (a.standard_order > b.standard_order) ? 1 : -1)

			let final = sortedByUserOrder_pinned.concat(sortedByUserOrder_noPinned);
			
			return final;
		},
		// Reactive property for determining how many tasks remain in a list. Return false if none.
		remainingTasks: function() {
			let remaining = this.taskList.filter(task => !task.completed).length
			if (remaining != 0) {
				return remaining;
			}
			else {
				return false
			}
		},
		// Reactive property when all tasks are marked as completed.
		anyRemaining: function() {
			return this.remainingTasks!=0;
		},
		
		// Only display the clear completed button when at least one task is set to completed.
		showClearCompleteButton() {
			return this.taskList.filter(task => task.completed).length > 0;
		},
		// Reactive property to output a quote each time the list is found to be empty.
		// Done as a computed property to retain some caching since it's an array and matching random elements are required.
		getQuote: function() {
			// Quote array including the author of the quote.
			let quote = [
				["Simplify the task. Continually look for faster, better, easier ways to get the job done.","Brian Tracy"],
				["The only way to be truly satisfied is to do what you believe is great work.","Steve Jobs"],
				["When you see an opportunity to change the world, get up and get the job done!","Robin Sharma"],
				["Work smarter... Not harder.","Allen F. Morgenstern"],
				["The only way to do great work is to love what you do.", "Steve Jobs"],
				["If you cannot do great things, do small things in a great way.", "Napoleon Hill"],
				["Put your heart, mind, intellect, and soul even to your smallest acts. This is the secret of success.", "Swami Sivananda"],
				["There is joy in work… There is no happiness except in the realization that we have accomplished something.","Henry Ford"],
				["Look at a day when you are supremely satisfied at the end. It's not a day when you lounge around doing nothing; it's when you've had everything to do, and you've done it.", "Margaret Thatcher"],
				["Nothing is really work unless you would rather be doing something else.", "James M. Barrie"],
				["There's nothing like biting off more than you can chew, and then chewing anyway.", "Mark Burnett"]
			]
			// Random number based on the length of the array.
			var randNum = Math.floor(Math.random()*quote.length);

			if (this.taskList.length == 0) {
				// Update the random number. Because there is a change, it will re-render the computed component.
				randNum = Math.floor(Math.random()*quote.length);
			}
			// Return a random quote.
			return quote[randNum]
		}
	},
	methods: {
		draggingList(dragging, event) {
			console.log("dragging = "+dragging)
			let outer = document.getElementsByClassName("mainListDraggable")[0]
			// Basic styling for list dragging
			if (dragging) {
				event.item.classList.add("moveListHighlight");
				outer.classList.add("dashedParentList");
				//
			}
			else {
				event.item.classList.remove("moveListHighlight");
				outer.classList.remove("dashedParentList");
			}
		},
		blah(val) {
			alert(val);
		},
		
		listReorderSwitch() {
			this.moveTaskLock = !this.moveTaskLock;
			var elements = document.getElementsByClassName("handleContainerLeft")	// Collect all "left handle" moving elements on the page.

			if (this.moveTaskLock) {
				let delay = 0
				for(let i=0;i<elements.length;i++) {
					// Produce a different delay for each element, adds to presentation.
					setTimeout(() => {
						// Add the class that "shows" the element to the user.
						elements[i].classList.add("handleContainerLeftShow");
					}, delay);
					delay+=50;
					
				}
				
			}
			else {
				// Hide the handles, no delay effect required
				for(let i=0;i<elements.length;i++) { elements[i].classList.remove("handleContainerLeftShow"); }
			}

		},
				/*
				//alert("okay, lets unlock");
				let x = document.getElementsByClassName("list-item");	//my array of elements
				let elChild = document.createElement('span');
				//elChild.innerHTML = 'Content';
				elChild.classList = 'handle';
				for(let y = 0; y<x.length; y++) {
					//console.log(y);
					let el = x[y];
					el.insertBefore(elChild, el.firstChild);
					//console.log(el);
					//<span v-handle class="handle"></span>
				}
			}
		},
		*/
		getChangeList (val) {
			// eslint-disable-next-line
			console.log(val, 'val')
		},
		getChangeLists (vals) {
			// eslint-disable-next-line
			console.log(vals, 'vals')
		},
		
		// Method to add a new task
		addTask(newTask) {
			// Need to get a new value for the standard_order variable. User will be able to change this, but we should set it anyway to last number+1
			//alert(this.taskList[0].standard_order);

			let highestNum = 0;	// Default
			for (let x in this.taskList) {
				//alert(this.taskList[x].standard_order);
				//alert(this.taskList[x].standard_order);
				if (this.taskList[x].standard_order >= highestNum) {
					//alert(this.taskList[x].standard_order+" > "+highestNum);
					highestNum = this.taskList[x].standard_order
				}
			}
			axios.post('/tasks', {
				title: newTask.title,
				completed: newTask.completed,
				pinned: newTask.pinned,

				standard_order: highestNum+1,
				pinned_order: highestNum+1,
			})
				.then(response => {
					//console.log("response:")
					//console.log(response.status);
					
					//this.taskList = response.data;
					// If successful api post, update locally too (thinking this would be better instead of fetching full list again)
					if (response.status == 201) {
						//console.log(response);
						this.taskList.push({
							// Identifiers
							id: response.data.id,
							title: response.data.title,
							// User customisation
							standard_order: response.data.standard_order,
							// Timestamp stuff
							added: response.data.created_at,
							lastEdit: response.data.updated_at,
							// Flags
							editing: newTask.editing,
							completed: response.data.completed,
							pinned: response.data.pinned,
						})
					}
				})
				.catch(error => {
					// eslint-disable-next-line
					console.log(error);
				})
		},
		// Method to delete a single task.
		// note: mustConfirm, the first input defines whether the user is warned about the delete.
		deleteTask(mustConfirm, index, taskTitle) {
			let conf = true;	// Assume true, for now.
			if (mustConfirm) {
				// Allow for the chance for user to cancel the operation by setting conf to false when cancelling.
				conf = confirm("Please confirm you want to delete the following task:\n\nID: "+index+"\nTitle: "+taskTitle);
			}
			
			// Double check can continue
			if (conf == true) {
				// Once confirmed, send the api delete request
				axios.delete('/tasks/' + index)
					.then(response => {
						if (response.status == 200) {
							// Confirms successfully removed from the database, now mutate the current list on the page

							//this.taskList.splice(index, 1) //Note to self, this SHOULD work, but has some weird effects. For example, deleting from a list of three starting with two, then going to delete 3 outputs an error.
							//this.taskList.splice(task => task.id === index, 1) // Similar to above. Deleting two first (success), then deleting three seems to delete one instead. Odd.
							// Gone with a filter route for now until performance becomes a concern. See above comments.
							this.taskList = this.taskList.filter(task => task.id !== index)
						}
					})
					.catch(error => {
						// eslint-disable-next-line
						console.log(error);
					})
			}
		},
		// Method to clear checked items from the list. Filters the list for checked tasks and loops through them.
		// Previously done by updating the whole list, this should be more efficient when long lists exist.
		clearCompleted: function() {

			// Create an array of task objects that should be deleted.
			let toDelete = this.taskList.filter(task => task.completed);
			
			try {
				let conf = confirm("Are you sure you want to delete "+toDelete.length+" task(s) from your list.");
					if (conf == true) {
						//this.updateList(x);
						for (let num in toDelete)
							this.deleteTask(true, toDelete[num].id, toDelete[num].title); // Disable additional confirmation about deleting. Already asked.
						return true;
					}
			} catch (error) {
				alert("Looks like there was an error:\n"+error);
				return false;
			}
		},
		// Method to add or remove the pin flag from a task object.
		pinTask(currentTask, isPinned) {
			axios.patch('/tasks/'+currentTask.id, {
				title: currentTask.title,
				completed: currentTask.completed,
				pinned: isPinned,					// <-- The part we're updating
				standard_order: currentTask.standard_order,
			})
				.then(response => {
					if (response.status == 200) {
						
						// Update the (local) task pinned flag (meaning we don't have to pull the entire list again)
						this.taskList.filter(task => task.id == currentTask.id)[0].pinned = response.data.pinned;

						//this.taskList = this.taskList;
					}
				})
				.catch(error => {
					// eslint-disable-next-line
					console.log(error);
				})

			/*

			if (isPinned == 0) {
				this.taskList.filter(task => task.id == inputID)[0].pinned = false;
			} else if (x == 1) {
				this.taskList.filter(task => task.id == inputID)[0].pinned = true;
			} else {
				alert("Error with pinTask");
			}
			*/
		},
		// Method of check all of the tasks in the list.
		checkAllTasks() {
			// Update local complete status and then forward the api update command for each task one at a time.
			this.taskList.forEach((task) => {
				task.completed = event.target.checked;
				this.singleTaskStatusUpdate(task);
			})

		},
		// Simply updates the current list of tasks with the given new list.
		updateList(newList) {
			this.taskList = newList;
		},

		singleTaskStatusUpdate(currentTask) {
			axios.patch('/tasks/'+currentTask.id, {
				title: currentTask.title,
				completed: currentTask.completed,
				pinned: currentTask.pinned,
				standard_order: currentTask.standard_order,
			})
				.then(response => {
					//console.log("response:")
					//console.log(response.data);
					
					//this.taskList = response.data;
					// If successful api post, update locally too (thinking this would be better instead of fetching full list again)
					if (response.status == 200) {
						//console.log(response);
						this.taskList.filter(task => task.id == currentTask.id)[0] = ({
							// Identifiers
							id: response.data.id,
							title: response.data.title,
							// User customisation
							standard_order: response.data.standard_order,
							// Timestamp stuff
							added: response.data.created_at,
							lastEdit: response.data.updated_at,
							// Flags
							editing: currentTask.editing,
							completed: response.data.completed,
							pinned: response.data.pinned,
						})
					}
				})
				.catch(error => {
					// eslint-disable-next-line
					console.log(error);
				})
		},

		updateTaskTitle(currentTask, newTitle) {

			// Only continue if a single result is found for the filtered task.
			
			axios.patch('/tasks/'+currentTask.id, {
				title: newTitle,
				completed: currentTask.completed,
				pinned: currentTask.pinned,
				standard_order: currentTask.standard_order,
			})
				.then(response => {
					//console.log("response:")
					//console.log(response.data);
					
					//this.taskList = response.data;
					// If successful api post, update locally too (thinking this would be better instead of fetching full list again)
					if (response.status == 200) {
						//console.log(response);
						this.taskList.filter(task => task.id == currentTask.id)[0] = ({
							// Identifiers
							id: response.data.id,
							title: response.data.title,
							// User customisation
							standard_order: response.data.standard_order,
							// Timestamp stuff
							added: response.data.created_at,
							lastEdit: response.data.updated_at,
							// Flags
							editing: currentTask.editing,
							completed: response.data.completed,
							pinned: response.data.pinned,
						})
					}
				})
				.catch(error => {
					// eslint-disable-next-line
					console.log(error);
				})
				
			// Update the task to the new title and update the last edit time.
			//this.taskList.filter(task => task.id === inputID)[0].title = newTitle;
			//this.taskList.filter(task => task.id === inputID)[0].lastEdit = format(new Date(), 'yyyy-MM-dd-hh-mm-ss');
				
			
		},
		testing(array) {
			// eslint-disable-next-line
			console.log(array)
		},
		changeTaskOrder(test) {
			// eslint-disable-next-line
			console.log(test)
			/*
			let listnum = list.listOrder
			//alert("listnum: "+listnum+"\nold order: "+event.oldIndex+"\nnew order: "+event.newIndex)
			
			let tempList = this.randomListData
			// eslint-disable-next-line
			//console.log(tempList[listnum].itemArr)


			let tempArray = tempList[listnum].itemArr
			// eslint-disable-next-line
			console.log(tempArray)

			*/

			/*
			// Loop through the array to find the old index
			for (let x = 0; x != tempArray.length; x++) {
				if (x == event.oldIndex) {

				}
			}
			*/
			
			
			/*
			randomListData: [
				{
					listOrder: 0,
					name: 'Shopping List',
					itemArr: [
						{
							order: 2,
							title: 'New Desktop PC'
						},
						{
							order: 0,
							title: 'Updated Smartphone'
						},
						{
							order: 1,
							title: 'HQ headphones'
						}
					]
				},
				{
					listOrder: 2,
					name: 'Movies to watch',
					itemArr: [
						{
							order: 0,
							title: 'Inception'
						},
						{
							order: 1,
							title: 'King Kong'
						},
					]
				},
				{
					listOrder: 1,
					name: 'TV shows to watch',
					itemArr: [
						{
							order: 0,
							title: 'Breaking Bad'
						},
						{
							order: 1,
							title: 'Narcos'
						},
						{
							order: 2,
							title: '30 Rock'
						},
						{
							order: 3,
							title: 'The Simpsons'
						},
						{
							order: 4,
							title: 'Game of Thrones'
						}
					]
				}
			],
			*/
			// eslint-disable-next-line
			//console.log(event);
		}
	},
	created() {
		/* global eventBus */

		// Event listeners to fire immediately.
		eventBus.$on('singleDelete', (confirm, id, title) => this.deleteTask(confirm, id, title));	// enable the flag that ensures user confirms.
		eventBus.$on('addTask', (newTask) => this.addTask(newTask));
		eventBus.$on('checkAllTasks', () => this.checkAllTasks());
		eventBus.$on('updateTaskTitle', (theTask, newTitle) => this.updateTaskTitle(theTask, newTitle));
		eventBus.$on('updateTaskStatus', (theTask) => this.singleTaskStatusUpdate(theTask));
		eventBus.$on('pinTask', (theTask) => this.pinTask(theTask, 1));
		eventBus.$on('unpinTask', (theTask) => this.pinTask(theTask, 0));

	}
}
</script>

<style lang="scss">
	@import url("https://cdnjs.cloudflare.com/ajax/libs/animate.css/3.5.2/animate.min.css");
	$assets: '~@/assets/';

	.list-info-container {
		display: flex;
		align-items: center;
		justify-content: space-between;
		font-size: 16px;
		border-top: 1px solid black;
		padding-top: 14px;
		
	}
   .noTaskText {
		color: rgba(000, 000, 000, 0.3);
		padding: 20px 0px;
	}
	.noTaskText p::first-letter {
		font-size:50pt;
	}

	blockquote {
		opacity: 0.7;
		font-size: 18px;
		font-style: italic;
		margin: 0.25em 0;
		padding: 0.35em 0 0 40px;
		line-height: 1.45;
		position: relative;
		color: rgba(000, 000, 000, 0.5);
	}

	blockquote:before {
		display: block;
		padding-left: 10px;
		content: "\201C";
		font-size: 80px;
		position: absolute;
		left: -20px;
		top: -20px;
		color: #333;
		font-family: Georgia, serif;
	}

	blockquote cite {
		color: rgba(000, 000, 000, 0.3);
		font-size: 14px;
		display: block;
		margin-top: 5px;
	}

	blockquote cite:before {
		content: "\2014 \2009";
	}


	button {
		font-size: 14px;
		background: rgba(000, 000, 000, 0.15);
		appearance: none;
		padding: 2px 10px;
		margin-right:5px;
		display: inline-block;
		border: 0px solid lightgray;
		&:hover {
			background: rgba(000, 000, 000, 0.2);
		}
		&:focus {
			outline: none;
		}
	}
	.active {
		background: rgba(000, 000, 000, 0.3);
	}
	// CSS Transitions
	.fade-enter-active, .fade-leave-active {
		transition: opacity 0.3s;
	}
	.fade-enter, .fade-leave-to {
		opacity: 0;
	}

	.myAnimation {
		-webkit-transition: all 0.3s ease;
		-moz-transition: all 0.3s ease;
		-ms-transition: all 0.3s ease;
		-o-transition: all 0.3s ease;
		transition: all 0.3s ease;
	}
	.myTask {
		animation-duration: 0.2s;
	}

	.line {
		height:1px;
		width: 100%;
		background-color: red;
		margin: 50px 0px;
	}

	// Slick stuff:

	.root1 {
	width: 100%;
	display: flex;
	height: 100%;
	box-sizing: border-box;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	}

	.root2 {
		display: flex;
		height: 100%;
	}

	

	.listItem {
		display: flex;
		align-items: center;
		width: 100%;
		padding: 20px;
		margin: 0;
		background-color: rgb(60, 66, 73);
		box-sizing: border-box;
		user-select: none;
		color: rgb(206, 208, 209);
		font-weight: 400;
		border-radius: 3px;
	}
	.listItem:hover {
		background-color: rgb(58, 64, 70);
	}
	.listInner {
		padding: 20px;
		width: calc(100% - 20px);
	}
	.mainListDraggable {
		outline: 5px;
		outline-style: dashed;
		outline-offset: 0;
		outline-color: rgba(255, 255, 255, 0);
		transition: outline .5s ease-in-out;
	}
	.bg-transition {
		transition: background-color .5s ease-in-out;
	}
	.dashedParentList {
		outline: 5px;
		outline-style: dashed;
		outline-color: rgba(255, 255, 255, 0.5) !important;
		outline-offset: 0px;
	}
	.moveListHighlight {
		background-color: rgba(255, 255, 255, 0.03);
		opacity: 0.5;
	}
	.SortableListElement {
		display: flex;
		width: 100%;
		
		max-height: 80vh;
		margin: 0 auto;
		padding: 0;
		overflow: auto;
		/*border: 1px solid #efefef;*/
		
	}
	.listContainer {
		width: 100%;
		border-radius: 3px;
		overflow: hidden;
		background-color: rgb(52, 58, 63);
		color: rgb(204, 206, 207);
	}
	.listHeaderContainer {
		display: flex;
		align-items: center;
		padding: 15px 15px 15px 20px;
		width: calc(100% - 60px);
		float: left;
		margin: 0 auto;
	}
	.listHeaderButtonContainer {
		display: flex;
		align-items: center;
		width: 60px;
		float: left;
		padding: 20px;
		
	}
	.taskRightIcon {
		display: block;
		width: 20px;
		height: 20px;
		
		background-size: contain;
		background-repeat: no-repeat;
		background-position: center;
		opacity: 0.5;
		cursor:move;
	}
	.listHeader {
		user-select: none;
		font-size: 16pt;
		font-weight: 500
	}
	
	.button-bar {
		height: auto;
		width: 100%;		
	}

	.handleContainerLeft {
		width: 0px;
		overflow: hidden;
		padding-right: 0px;
		transition: width .25s ease-in-out, padding-right .25s ease-in-out;
		float: left;		
	}
	.handleContainerLeftShow {
		width: 30px !important;
		padding-right: 5px;
	}
	.taskLeftIcon {
		display: block;
		width: 18px;
		height: 18px;
		background-size: contain;
		background-repeat: no-repeat;
		background-position: center;
		opacity: 0.5;
		cursor:move;
		float: left;
	}
	
	.handle { background-image: url( $assets + "/images/handle_white.svg");}
	.dots { background-image: url( $assets + "/images/dots_white.svg"); }
	.edit { background-image: url( $assets + "/images/edit_white.svg");}
	
	.itemTitle {
		width: 100%;
		height: auto;
	}
	.list-intro {
		width: 50%;
	}
	.list-intro p {
		font-size: 15pt;
		margin: 10px 0;
		
	}
	.list-buttons {
		width: 50%;
	}
	.listTitle {
		font-weight: bold;
		
	}

	.pointer {cursor: pointer !important;}

	/*
	####################################################
	M E D I A  Q U E R I E S
	####################################################
	*/
	
	/* 
	Extra small devices (portrait phones, less than 576px) 
	No media query since this is the default in Bootstrap because it is "mobile first"
	*/
	
	
	/* Small devices (landscape phones, 576px and up) */
	@media (min-width: 576px) {  
	
	}
	
	/* Medium devices (tablets, 768px and up) The navbar toggle appears at this breakpoint */
	@media (min-width: 768px) {
		.SortableItemElement { 
			/*max-width: calc(33.333333% - 0.5rem);*/
		}
	}
	
	/* Large devices (desktops, 992px and up) */
	@media (min-width: 992px) { 
	
	}
	
	/* Extra large devices (large desktops, 1200px and up) */
	@media (min-width: 1200px) {  
		
	}


</style>