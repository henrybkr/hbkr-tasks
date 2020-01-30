<template>
	<div class="mainTasksContainer">
		<div class="d-none container mt-5">
			<p>errorInfo code = {{ errorInfo.code }}</p>
			<p>errorInfo message = {{ errorInfo.apiResponse }}<br></p>
			<p>taskList.length = {{ taskList.length }}</p>
			<!--<b-button variant="success" @click="test()">{{ errorInfo.feedback }}</b-button>-->
		</div>
		<transition-group name="fade" enter-active-class="animated fadeIn" leave-active-class="animated fadeOut">
			<div class="loadingSpace" v-if="displayLoading" v-bind:key="20">
				<div class="container p-4 loadingMessage">
					<img class="mb-1" src="~@/assets/images/loading.gif" height="40" width="40"/>
					<i>loading your tasks...</i>
				</div>
			</div>
		</transition-group>

		<transition-group name="fade" enter-active-class="animated fadeIn" leave-active-class="animated fadeOut">
			<div v-if="!displayLoading" v-bind:key="21">
				<div class="errorSpace" v-if="displayError">
					<div class="container">
						<b-alert show variant="dark" class="mt-5 clearfix w-100">
							<h3 class="alert-heading">Uh oh, seems we've run into an issue. Let's have a look:</h3>
							<hr>
							<div v-if="errorInfo.code">
								<p class=" text-dark mb-0 pb-0"><b class="text-dark">Error Code:</b> {{ errorInfo.code }}<br></p>
							</div>
							<div v-if="errorInfo.apiResponse">
								<p class=" text-dark mb-0 pb-0"><b class="text-dark">API Response:</b> {{ errorInfo.apiResponse }}<br></p>
							</div>
							<div v-if="errorInfo.feedback">
								<p class="text-dark"><b class="text-dark">Feedback:</b> {{ errorInfo.feedback }}</p>
							</div>
							<!-- Reload button -->
							<b-button @click="loadTasks()"><font-awesome-icon icon="redo"/></b-button>
							
						</b-alert>
					</div>
				</div>
				<div v-else>
					<AddTask class="pt-4"/>
					<taskList class="pt-4" v-bind:taskList="taskList" />
				</div>
			</div>
		</transition-group>	
	</div>
</template>

<script>
import taskList from '../components/taskList';
import AddTask from '../components/addTask';

import axios from 'axios';

// This will need changing once online. Currently in dev mode
axios.defaults.baseURL = "http://localhost:8001/api"

/* eslint-disable */

export default {
  name: 'Tasks',
  components: {
	taskList,
	AddTask,

  },
  data() {
	return {
		taskList: [],                   		// Empty array for now
		errorInfo: [
			{ code: 0 },
			{ message: "No response" },   	// Default values, which will fail to display lists
		],
		displayError: false,
		displayLoading: true,
		
		// Testing purposes
		flag: true,
	}
  },
  computed: {
	  
  },
  // Testing purposes methods
  methods: {
	

	// Function to load tasks on command from the rest api.
	loadTasks() {
		// Change loading state
		this.displayLoading = true;


		axios.get('/tasks')
		.then(response => {
			// When we have a response:

			//console.log(response.data);
		
			if (response.data) {
				
				this.errorInfo.code = 10;  // Confirm that the api returned data, used for some checks.
				this.errorInfo.apiResponse = "Success"
				this.errorInfo.feedback = "Response was successfully received."
			}
			this.displayLoading = false;
			this.displayError = false;

			// A (probably bad) fix for no longer having a default 'editing' property. This is a property we don't store in the database.
			for (let x in response.data) {
				response.data[x].editing = false;
			}

			this.taskList = response.data;
	  	})
		.catch(error => {
			// When we have an error:
			const response = error.response
			

			this.displayLoading = false;
			this.displayError = true;
			this.errorInfo.apiResponse = error.message;
			

			if (error.message == "Network Error") {
				this.errorInfo.feedback = "Struggling to communicate with the API, is it running?"
				this.errorInfo.code = 0;
			}
			else {
				this.errorInfo.code = error.response.status;

				// Switch case for error status deciding feedback string
				switch(response.status) {
					case 500:
						this.errorInfo.feedback = "Communicating with API but failing to retrieve records. Perhaps the database link is down?"

				}
			}
		})
	}

  },
  created() {
	// When created, collect all tasks in the database.
	this.loadTasks();
	
	}
}
</script>

<style lang="scss" scoped>
@import url("https://cdnjs.cloudflare.com/ajax/libs/animate.css/3.5.2/animate.min.css");
body {
	font-family: Arial, Helvetica, sans-serif;
	line-height: 1.4;
	box-sizing: border-box;
	margin: 0;
	padding: 0;
}

.btn {
	display: inline-block;
	border: none;
	background: #555;
	color: #fff;
	padding: 7px 20px;
	cursor: pointer;
}

.btn:hover {
	background: #666;
}

.mainTasksContainer {
	min-height: calc(100vh - 75px);
	background-color: rgb(66, 72, 79);
}
.loadingSpace {
	width: 100%;
	height: auto;

	position: absolute;
}
.loadingMessage {
	display: flex;
	justify-content: space-between;
	align-items: center;
	flex-direction: column;
	opacity: 0.6;

	/* Disable selecting */
	user-select: none;
	-moz-user-select: none;
}

</style>