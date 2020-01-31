<template>
	<div>
		<div class="container-fluid">
			<!--<input autocomplete="off" type="text" class="todo-input" name="title" @keyup.enter="addTask" v-model="title" placeholder="What needs doing boss?">-->
			<!-- new version -->
			<input autocomplete="off" type="text" class="todo-input" name="title" @keyup.enter="addTaskToList" v-model="title" placeholder="What needs doing boss?">
			<!-- Submit button if preferred, but keep in mind we need to add the form element back and include a @submit="addTask" for it to launch when submit is pressed -->
			<!--<input type="submit" value="Submit" class="btn">-->
		</div>
	</div>
</template>

<script>
import { format } from 'date-fns'

// import uuid from 'uuid';
export default {
	name: "AddTask",
	data() {
		return {
			format,
			// This needs adjusting. 4 is the current ID but needs to be from db or something
			//currentID: 5,
			title: ''
		}
	},
	methods: {
		/* global eventBus */
		
		addTask(e) {
			e.preventDefault();
			
			// Check to see if the entered title is empty. Skip if empty. Potentially return error to user here.
			// This works by using the trim function to remove any whitespace. If there is only whitespace, the length will be 0.
			if (this.title.trim().length == 0) {
				return false
			}
			else {
				let dateTime = format(new Date(), 'yyyy-MM-dd-hh-mm-ss')
				const newTask = {

					// Identifiers
					// (ID is auto increment in laravel api)
					title: this.title,
					// User order is defined by the taskList component, not here.

					// Timestamp stuff
					added: dateTime,
					lastEdit: dateTime,

					// Flags
					editing: false,
					completed: false,
					pinned: false,
				}
				// emit to event bus
				eventBus.$emit('addTask', newTask);

				// Clear the entered title once submitted and increment the id.
				this.title = '';
				this.currentID+=1;
				return true;
			}
		},
		addTaskToList(e) {

			e.preventDefault();
			
			// Check to see if the entered title is empty. Skip if empty. Potentially return error to user here.
			// This works by using the trim function to remove any whitespace. If there is only whitespace, the length will be 0.
			if (this.title.trim().length == 0) {
				return false;
			}
			else {
				let dateTime = format(new Date(), 'yyyy-MM-dd-hh-mm-ss')
				const newTask = {

					// Identifiers
					// (ID is auto increment in laravel api)
					order: this.currentID+=1,
					title: this.title
				}
				this.$store.commit('addListItem', newTask)

				// Clear the entered title once submitted and increment the id.
				this.title = '';
				this.currentID+=1;
				return true;
			}
			
		}
	}
}
</script>

<style lang="scss" scoped>

	form { display: flex; }
	input[type="text"] {
		flex: 10;
		border: 0 solid #b7b7b7;
		
	}
	input[type="submit"] { flex: 2; }


	.todo-input {
		width: 100%;
		padding: 10px 20px;
		font-size: 18px;
		
		
		&:focus {
		outline: 0;
		}

		background-color: rgb(52, 58, 63);
		border-radius: 3px;
	}
	.btn {
	display: inline-block;
	border: none;
	background: #555;
	color: #fff;
	cursor: pointer;
	height: 100%;
	padding: 8.5px 0;
	margin-left: 10px;
  }
  .btn:hover {
	background: #666;
  }

</style>