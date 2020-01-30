<template>
	
	<div class="todo-item" :key="task.id" v-bind:class="{'is-complete':task.completed}">
		<div class="todo-space clearfix">
			<div class="todo-content">
				<input type="checkbox" v-model="task.completed" @change="markCompleted(task)">
				<div v-if="!task.editing" @dblclick="editMode(task)" class="todo-item-label"><p>{{task.title}}</p></div>
				<input v-else class="todo-item-edit" @blur="editComplete(task)" @keyup.enter="editComplete(task)" @keyup.esc="editCancel(task)" v-focus type="text"  v-model="task.title">
			</div>
			<button :class="{ active: important == true }" @click="pinTask(task)" class="pin-button myAnimation"><font-awesome-icon icon="bookmark" /></button>
			<div class="todo-del">
				<div>
					<!-- Delete button with onclick delete emit command -->
					<button @click="singleDeleteTask(true, task)" class="del">&times;</button>
					<!--<button @click="$emit('singleDelete', task.id, task.title)" class="del">&times;</button>-->
				</div>
			</div>
		</div>
	</div>
	
</template>

<script>
export default {
	name: "todoItem",
	props: {
		task: {
			type: Object,
			required: true,
		}
	},
	data() {
		return {
			// This needs adjusting. 4 is the current ID but needs to be from db or something
			editDelay: false,
			important: this.task.pinned,
		}
	},
	directives: {
		// Directive to focus an a element when inserted.
		focus: {
			// directive definition
			inserted: function (el) {
				el.focus()
			}
		}
	},
	computed: {
		
	},
	methods: {
		/* global eventBus */
		editMode(task) {
			this.beforeEditCache = task.title;	// Store the original string in case user cancels
			task.editing = true;
		},
		editComplete(task) {
			// Once the user has confirmed their edit, run a few checks before accepting the new input.

			// Create a delay for this function. This prevent multiple launch of it within 200ms.
			if (this.editDelay == false) {
				// Enable the delay.
				this.editDelay = true;				

				// Reset delay flag after 200ms. Had to bind this because this isn't preserved in setTimeout.
				setTimeout(function() {
					this.editDelay = false;
				}.bind(this), 200);

				// Now let's look at the edit...

				// If the new edit is a empty string, cancel and return to old task title.
				// Opportunity for improvement here. Perhaps ask the user if they want to delete it instead?
				
				// If the entered title is the same as before, do nothing, no need for an emit.
				if (task.title == this.beforeEditCache) {
					// nope, don't need to do anything.
				}
				else if (task.title.trim().length == 0) {
					let conf = confirm("Please confirm you'd like to delete the following task:\nID: "+task.id+"\nTitle: "+this.beforeEditCache);
					if (conf == true) {
						this.singleDeleteTask(false, task)
					}
					else {
						// If user doesn't confirm deletion, return to previous state. Don't allow whitespace-only
						task.title = this.beforeEditCache;
					}
				}
				else {
					// Confirmed we can make the update
					eventBus.$emit('updateTaskTitle', task, task.title);
				}
			}
			// Only commit to the emit (lol) if has been confirmed.
			// Always set the edit flag back to false.
			task.editing = false;
			
		},
		editCancel(task) {
			task.title = this.beforeEditCache;
			task.editing = false;
		},
		singleDeleteTask(confirm, task) {
			eventBus.$emit('singleDelete', confirm, task.id, task.title)
		},
		pinTask(task) {
			// Update the local component flag for the task being pinned.
			this.important = !this.important;

			// Now commit an event for the task being pinned or unpinned.
			if (this.important) {
				eventBus.$emit('pinTask', task);
			} else {
				eventBus.$emit('unpinTask', task);
			}
		},
		markCompleted(task) {
			//alert(state)
			eventBus.$emit('updateTaskStatus', task);
		}
	},
	created() {
			
			if (this.task.pinned) {
				//alert(this.task.id)
			}

			/*
			return false;
			*/
	}
}
</script>

<style lang="scss" scoped>
	@import url("https://cdnjs.cloudflare.com/ajax/libs/animate.css/3.5.2/animate.min.css");

	.todo-space {
		width: 100%;
		background: none;
		height: auto;
		border-bottom: 1px solid black;
		display: flex;
		margin-bottom: 5px;
		//margin-top: 15px;

		/*
		display: flex;
		align-items: center;
		justify-content: space-between;
		font-size: 16px;
		border-top: 1px solid lightgrey;
		padding-top: 14px;
		margin-bottom: 14px;
		*/
	}
	.todo-content {
		width: calc(100% - 50px);
		float: left;
		line-height: 30pt;
		min-height: 50px;
	}
	.todo-del {
		width: 50px;
		float: left;
		height: 100%;
		border-right: 1px solid black;
	}
	.todo-item {
		min-height: 20px;
	}
	.todo-item p {
		-webkit-transition: color 0.3s;
		transition: color 0.3s;
		margin: 0;
	}
	.is-complete p {
		text-decoration: line-through;
		color: rgba(255, 255, 255, 0.25);
	}
	.del {
		background: rgb(52, 58, 63);
		color: silver;
		border: none;
		cursor: pointer;
		padding: 15px 0;
		width: 100%;
		height: 100%;
		float: right;
		border-top-left-radius: 15%;
		margin: 0;
		font-size: 14pt;
		line-height: 15pt;
	}
	.del:hover { background: rgb(45, 50, 54); }
	input[type='checkbox'] {
		margin-left: 5px;
		margin-top: 10px;
		float: left;
		width:25px;
		height:25px;
	}
	
	.clearfix {
		overflow: auto;
	}
	/* Styling for the label and edit field */
	.todo-item-left { // later
		display: flex;
		align-items: center;
	}
	.todo-item-label {
		padding: 0 5px;
		/*border: 1px solid white;*/
		margin-left: 12px;
		float: left;
		
	}
	.todo-item-edit {
		font-size: 12pt;
		padding:12px 6px;
		color: silver;
		margin-left: 10px;
		margin-right: 10px;
		line-height: normal;
		width: calc(100% - 50px);
		float: left;
		background-color: rgb(52, 58, 63);
		
		border: 0px solid #ccc; //override defaults
		
		font-family: 'Avenir', Helvetica, Arial, sans-serif;
		font-style: italic;
		&:focus {
		outline: none;
		}
	}
	.pin-button {
		height: auto !important;
		background: none;
		border: none;
		opacity: 0.1;
	}
	.pin-button:hover {
		opacity: 0.3;
	}
	.pin-button.active {
		opacity: 1;
		color: black;
	}
</style>