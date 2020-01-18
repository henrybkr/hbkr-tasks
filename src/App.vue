<template>
  <div id="app">
    <Header />
    <div id="content">
      <router-view class="animated fadeIn"/>
    </div>
  </div>
</template>

<script>
import Header from './components/layout/Header';

export default {
  name:"app",
  components: {
    Header
  }
}
</script>

<style>
  * { 
    box-sizing: border-box;
    margin: 0;
    padding: 0;
    color: silver;
    
  }
  body {
    font-family: Arial, Helvetica, sans-serif;
    line-height: 1.4;
  }
  #content {
    background-color: rgb(66, 72, 79);
  }

  .clearfix:after {
    content: ".";
    display: block;
    clear: both;
    visibility: hidden;
    line-height: 0;
    height: 0;
}

.clearfix {
    display: inline-block;
}

html[xmlns] .clearfix {
    display: block;
}

* html .clearfix {
    height: 1%;
}
</style>
