<template>
  <div>
    <AddTask />
    <taskList v-bind:taskList="taskList" />
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
      // Empty array for now
      taskList: []
    }
  },
  methods: {
    // Not currently used. Probably shouldn't be running too many methods in the view.
  },
  created() {
    // When created, collect all tasks in the database.
    axios.get('/tasks')
      .then(response => {
        //console.log(response.data);
        
        this.taskList = response.data;
      })
      .catch(error => {
        console.log(error);
      })
  }
}
</script>

<style lang="scss" scoped>

  @import url("https://cdnjs.cloudflare.com/ajax/libs/animate.css/3.5.2/animate.min.css");

  * { 
    box-sizing: border-box;
    margin: 0;
    padding: 0;
    
  }
  body {
    font-family: Arial, Helvetica, sans-serif;
    line-height: 1.4;
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
