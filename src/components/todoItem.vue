<template>
	
	<div class="todo-item" :key="task.id" v-bind:class="{'is-complete':task.completed}">
		<div class="todo-space clearfix">
			<div class="todo-content">
				<input type="checkbox" v-model="task.completed">
				<div v-if="!task.editing" @dblclick="editMode(task)" class="todo-item-label"><p>{{task.title}}</p></div>
				<input v-else class="todo-item-edit" @blur="editComplete(task)" @keyup.enter="editComplete(task)" @keyup.esc="editCancel(task)" v-focus type="text"  v-model="task.title">
			</div>
			<div class="todo-del">
				<!-- Delete button with onclick delete emit command -->
				<button @click="singleDeleteTask(task)" class="del">&times;</button>
				<!--<button @click="$emit('singleDelete', task.id, task.title)" class="del">&times;</button>-->
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
	methods: {
		/* global eventBus */
		
		/*
		markComplete() {
			this.task.completed = !this.task.completed;
		},*/
		editMode(task) {
			this.beforeEditCache = task.title;	// Store the original string in case user cancels
			task.editing = true;
		},
		editComplete(task) {
			// Once the user has confirmed their edit, run a few checks before accepting the new input.

			// Create a delay for this function. This prevent multiple launch of it within 200ms.
			if (!this.editDelay) {
				// Enable the delay.
				this.editDelay = true;
				// Reset delay flag after 200ms.
				setTimeout(function() { this.editDelay = false; }, 200);

				// Now let's look at the edit.

				// If the new edit is a empty string, cancel and return to old task title.
				// Opportunity for improvement here. Perhaps ask the user if they want to delete it instead?
				if (task.title.trim().length == 0) {
					task.title = this.beforeEditCache;
				}
				else if (task.title != this.beforeEditCache) {
					// If the entered title is the same as before, do nothing, no need for an emit.
					eventBus.$emit('updateTaskTitle', task.id, task.title);
				}
			}
			task.editing = false;
			
		},
		editCancel(task) {
			task.title = this.beforeEditCache;
			task.editing = false;
		},
		singleDeleteTask(task) {
			eventBus.$emit('singleDelete', task.id, task.title)
		}
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
		color: rgba(000,000,000,0.3);
	}
	.del {
		background: silver;
		color: white;
		border: none;
		cursor: pointer;
		padding: 15px 0;
		width: 100%;
		height: 100%;
		float: right;
		border-top-left-radius: 15%;
	}
	.del:hover { background: grey; }
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
		padding: 0px;
		border: 1px solid white;
		margin-left: 12px;
		float: left;
		
	}
	.todo-item-edit {
		font-size: 12pt;
		line-height: 20pt;
		padding:12px 0;
		color: #2c3e50;
		margin-left: 10px;
		margin-right: 10px;
		line-height: normal;
		width: calc(100% - 50px);
		float: left;
		border: 1px solid #ccc; //override defaults
		font-family: 'Avenir', Helvetica, Arial, sans-serif;
		font-style: italic;
		&:focus {
		outline: none;
		}
	}
</style>