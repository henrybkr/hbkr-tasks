<template>
  <div>
    <AddTask />
    <taskList v-bind:taskList="taskList" />
  </div>
</template>

<script>
import taskList from '../components/taskList';
import AddTask from '../components/addTask';

//import axios from 'axios';

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
      taskList: [
        {
          'id': 0,
          'title': "This is the first example task!",
          'completed': false,
          'editing': false,
          'added': "2017-01-01-10-00-00",
          'lastEdit': "2017-01-01-10-00-00"
        },
        {
          'id': 1,
          'title': "And this is the second example task which is completed.",
          'completed': true,
          'editing': false,
          'added': "2018-01-01-10-00-00",
          'lastEdit': "2018-01-01-10-00-00"
        },
      ]
    }
  },
  methods: {
    // Not currently used. Probably shouldn't be running too many methods in the view.
  },
  created() {
    // When created, do something?
    
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
