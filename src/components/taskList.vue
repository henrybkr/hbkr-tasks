<template>
	<div>
		<div class="container">
			<transition-group name="fade" enter-active-class="animated fadeInUp" leave-active-class="animated fadeOutDown">
				<div class="myTask" v-bind:key="task.id" v-for="task in taskListFiltered">
					<todoItem v-bind:task="task" />
				</div>
			</transition-group>
			<transition-group name="fade" enter-active-class="animated fadeInUp" leave-active-class="animated fadeOutDown">
			<div v-if="!taskList.length" v-bind:key="1" class="noTaskText"><i>No tasks</i>
				<hr>
				<blockquote>
					{{getQuote[0]}}
					<cite>{{getQuote[1]}}</cite>
				</blockquote>
			</div>
			</transition-group>
			
			<div class="list-info-container">
				<div><label><input type="checkbox" :checked="!anyRemaining" @change="checkAllTasks"> Check All</label></div>
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

import todoItem from './todoItem.vue';

export default {
	name: "taskList",
	data () {
		return {
			// Imports
			format, compareAsc,
			
			// temporary cache for the edit, to remember what it was before changing it
			beforeEditCache: '',
			filter: 'all',
		}
	},
	components: {
		todoItem
	},
	props: ["taskList"],
	computed: {
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
		// Reactive property to display only certain filtered tasks to the user.		
		taskListFiltered: function() {
			if (this.filter == 'all') {
				return this.taskList
			}
			else if (this.filter == 'active') {
				return this.taskList.filter(task => !task.completed);
			}
			else if (this.filter == 'completed') {
				return this.taskList.filter(task => task.completed);
			}
			
			return false; //Default
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
		// Method to add a new task
		addTask(newTask) {
			this.taskList.push({
				// Identifiers
				id: newTask.id,
				title: newTask.title,

				// Timestamp stuff
				added: newTask.added,
				lastEdit: newTask.lastEdit,

				// Flags
				editing: newTask.editing,
				completed: newTask.completed,
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
				//this.taskList.splice(index, 1) //Note to self, this SHOULD work, but has some weird effects. For example, deleting from a list of three starting with two, then going to delete 3 outputs an error.
				//this.taskList.splice(task => task.id === index, 1) // Similar to above. Deleting two first (success), then deleting three seems to delete one instead. Odd.
				// Gone with a filter route for now until performance becomes a concern. See above comments.
				this.taskList = this.taskList.filter(task => task.id !== index)
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
							this.deleteTask(false, toDelete[num].id, toDelete[num].title); // Disable additional confirmation about deleting. Already asked.
						return true;
					}
			} catch (error) {
				alert("Looks like there was an error:\n"+error);
				return false;
			}
		},
		// Method of check all of the tasks in the list.
		checkAllTasks() {
			this.taskList.forEach((task) => task.completed = event.target.checked);
		},
		// Simply updates the current list of tasks with the given new list.
		updateList(newList) {
			this.taskList = newList;
		},

		updateTaskTitle(inputID, newTitle) {

			// Only continue if a single result is found for the filtered task.

			if (this.taskList.filter(task => task.id !== inputID).length == 1) {
				// Update the task to the new title and update the last edit time.
				this.taskList.filter(task => task.id === inputID)[0].title = newTitle;
				this.taskList.filter(task => task.id === inputID)[0].lastEdit = format(new Date(), 'yyyy-MM-dd-hh-mm-ss');
			}
		}
	},
	created() {
		/* global eventBus */

		// Event listeners to fire immediately.
		eventBus.$on('singleDelete', (id, title) => this.deleteTask(true, id, title));	// enable the flag that ensures user confirms.
		eventBus.$on('addTask', (newTask) => this.addTask(newTask));
		eventBus.$on('checkAllTasks', () => this.checkAllTasks());
		eventBus.$on('updateTaskTitle', (id, newTitle) => this.updateTaskTitle(id, newTitle));
	}
}
</script>

<style lang="scss" scoped>
	@import url("https://cdnjs.cloudflare.com/ajax/libs/animate.css/3.5.2/animate.min.css");
	.list-info-container {
		display: flex;
		align-items: center;
		justify-content: space-between;
		font-size: 16px;
		border-top: 1px solid black;
		padding-top: 14px;
		margin-bottom: 14px;
		margin-top: 50px;
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
		background-color: white;
		appearance: none;
		padding: 2px 10px;
		margin-right:5px;
		display: inline-block;
		border: 1px solid lightgray;
		&:hover {
			background: rgba(000, 000, 000, 0.05);
		}
		&:focus {
			outline: none;
		}
	}
	.active {
		background: rgba(000, 000, 000, 0.1);
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

</style>