<template>
  <div>
    <AddTask v-on:add-task="addTask"/>
    <taskList v-bind:taskList="taskList" v-on:updateList="updateList" />
  </div>
</template>

<script>
import taskList from '../components/taskList';
import AddTask from '../components/addTask';

import { compareAsc, format } from 'date-fns'
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
      format, compareAsc,
      // Empty array for now
      beforeEditCache: '',
      taskList: [
        {
          'id': 0,
          'title': "One Lorem ipsum dolor sit amet",
          'completed': false,
          'editing': false,
          'added': "2019.10.15",
          'lastEdit': false
        },
        {
          'id': 1,
          'title': "Two Lorem ipsum dolor sit amet",
          'completed': true,
          'editing': false,
          'added': "2019.10.15",
          'lastEdit': false
        },
      ]
    }
  },
  methods: {
    deleteTask(index, taskTitle) {
      // Confirm delete with the user

      
      let conf = confirm("Please confirm you want to delete the following task:\n\nID: "+index+"\nTitle: "+taskTitle);
      if (conf == true) {
        //this.taskList.splice(index, 1) //Note to self, this SHOULD work, but has some weird effects. For example, deleting from a list of three starting with two, then going to delete 3 outputs an error.
        //this.taskList.splice(task => task.id === index, 1) // Similar to above. Deleting two first (success), then deleting three seems to delete one instead. Odd.

        // Gone with a filter route for now until performance becomes a concern. See above comments.
        this.taskList = this.taskList.filter(task => task.id !== index)
        
      }
      

      //this.taskList = taskList.filter(task => task.id !== index)
    },
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
    // Used to check all elements in the list
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
    // When created, do something?
    eventBus.$on('myDelete', (id, title) => this.deleteTask(id, title));
    eventBus.$on('checkAllTasks', () => this.checkAllTasks());
    eventBus.$on('updateTaskTitle', (id, newTitle) => this.updateTaskTitle(id, newTitle));
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
