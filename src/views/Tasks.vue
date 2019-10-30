<template>
  <div>
    <div class="d-none container mt-5">
		<p>errorInfo code = {{ errorInfo.code }}</p>
		<p>errorInfo message = {{ errorInfo.message }}<br></p>
		<p>taskList.length = {{ taskList.length }}</p>
		<!--<b-button variant="success" @click="test()">{{ errorInfo.message }}</b-button>-->
    </div>
	<transition-group name="fade" enter-active-class="animated fadeIn" leave-active-class="animated fadeOut">
    <div class="errorSpace mt-5" v-if="displayLoading" v-bind:key="20">
        <div class="container text-center">
          <img class="mr-2" src="~@/assets/images/loading.gif" height="20" width="20"/><i>Please wait, attempting to find your tasks!</i>
        </div>
    </div>
	
    <div v-else v-bind:key="21">
		<div class="errorSpace mt-5" v-if="displayError">
			<div class="container">
				<b-alert show variant="dark">
					<p>Uh oh, seems we've run into an issue. Let's have a look:</p>
					<p>
						<b>Error Code:</b> {{ errorInfo.code }}<br>
						<b>API Response:</b> {{ errorInfo.message }}
					</p>
				</b-alert>
			</div>
		</div>
		<div v-else>
			<AddTask />
			<taskList v-bind:taskList="taskList" />
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
axios.defaults.baseURL = "http://localhost:8000/api"

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
    }
  },
  methods: {
    // Not currently used. Probably shouldn't be running too many methods in the view.
  },
  created() {
    // When created, collect all tasks in the database.
    axios.get('/tasks')
    	.then(response => {
			// When we have a response:
			
			//console.log(response.data);
        
			if (response.data) {
				this.errorInfo.code = 10;  // Confirm that the api returned data, used for some checks.
				this.errorInfo.message = "Success!"
			}
			this.displayLoading = false;

			// A (probably bad) fix for no longer having a default 'editing' property. This is a property we don't store in the database.
			for (let x in response.data) {
				response.data[x].editing = false;
			}

			this.taskList = response.data;
      	})
		.catch(error => {
			// When we have an error:

			//console.log(error);

			this.displayLoading = false;
			this.displayError = true;
			this.errorInfo.message = error.message;
			this.errorInfo.code = 1;
		})
    
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
</style>
