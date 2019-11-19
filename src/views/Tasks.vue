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
	<div class="container mt-5">
		<hr class="my-4">
		<p>Vue-Slicksort Testing space:</p>
		<div class="root1">
			<SlickList :lockToContainerEdges="true" axis="x" lockAxis="x" v-model="items" class="SortableList row" @input="getChangeLists">
				<SlickItem v-for="(item, index) in items" class="SortableItem col-4" :index="index" :key="index">
					<div class="itemheader">{{ item.name }}</div>
					
					<div class="root2">
						<SlickList :lockToContainerEdges="true" class="list" v-model="item.itemArr" helperClass="stylizedHelper">
							<SlickItem class="list-item" v-for="(item, index) in item.itemArr" :index="index" :key="index">
								<span>{{ item }}</span>
							</SlickItem>
						</SlickList>
					</div>
				</SlickItem>
			</SlickList>
		</div>
	</div>
  </div>
</template>

<script>
import taskList from '../components/taskList';
import AddTask from '../components/addTask';

import axios from 'axios';

import { SlickList, SlickItem } from 'vue-slicksort'

// This will need changing once online. Currently in dev mode
axios.defaults.baseURL = "http://localhost:8000/api"

/* eslint-disable */

export default {
  name: 'Tasks',
  components: {
	taskList,
	AddTask,

	// Testing purposes
	SlickItem,
	SlickList,

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
	  items: [
		{
		  name: 'Shopping List',
		  itemArr: ['New Desktop PC', 'Updated Smartphone', 'Noise cancellation headphones', 'Example text that should be too long to fit on a single line but lets make it extra long anyway']
		},
		{
		  name: 'Movies to watch',
		  itemArr: ['Inception', 'King Kong']
		},
		{
		  name: 'TV shows to watch',
		  itemArr: ['Breaking Bad', 'Narcos', '30 Rock', 'The Simpsons', 'Game of Thrones']
		}
	  ]

	}
  },
  // Testing purposes methods
  methods: {
	  getChangeList (val) {
	  console.log(val, 'val')
	},
	getChangeLists (vals) {
	  console.log(vals, 'vals')
	}
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

.root1 {
	width: 100%;
	display: flex;
	height: 100%;
	box-sizing: border-box;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	background: #333;
}

.root2 {
	display: flex;
	height: 100%;
}

.list {
	max-height: 80vh;
	width: 100%;
	margin: 0 auto;
	padding: 0;
	overflow: auto;
	//background-color: #f3f3f3;
	//border: 1px solid #efefef;
	border-radius: 3;
}

.list-item {
	display: flex;
	align-items: center;
	width: 100%;
	padding: 20px;
	background-color: rgb(250, 250, 250);
	border-bottom: 1px solid #efefef;
	box-sizing: border-box;
	user-select: none;
	color: #333;
	font-weight: 400;
}

.stylizedHelper {
	background-color: #fbfbfb;
}

.SortableList {
	display: flex;
	width: 100%;
	white-space: nowrap;
	max-height: 80vh;
	margin: 0 auto;
	padding: 0;
	overflow: auto;
	background-color: #f3f3f3;
	border: 1px solid #efefef;
	border-radius: 3;
}

.SortableItem {
	display: inline;
	align-items: center;
	padding: 10px;
	background-color: #fff;
	border-bottom: 1px solid #efefef;
	box-sizing: border-box;
	user-select: none;
	color: #333;
	font-weight: 400;
	overflow: hidden;
}

.itemheader {
	width: 100%;
	padding: 10px;
	margin-bottom: 10px;
	font-weight: bold;
}

</style>