<template>
    <header class="header">
        <div class="start-space">
            <div class="nav" id="nav">
                <router-link to='/'>Home</router-link>
                <router-link to='/tasks'>Tasks</router-link>
                <router-link to='/register'>Register</router-link>
                <router-link to='/login'>Login</router-link>
            </div>
            
        </div>
        <div class="middle-space">
            <h1></h1>
        </div>
        <div class="end-space">
            <router-link to='/'>
                <div class="logo" />
            </router-link>
        </div>
    </header>
</template>

<script>
export default {
    name: "Header"
}
</script>

<style lang="scss" scoped>
    $assets: '~@/assets/';

    .header {
        background: rgb(52, 58, 63);
        color: #fff;
        text-align: center;
        padding: 0;
        display: flex;
        justify-content: space-between;
        height: 75px;
        
    }
    .header a {
        color: #fff;
    }
    .logo {
        height: 75px;
        width: 187.5px;
        background: url( $assets + "/images/logo1.svg") no-repeat center;
        background-size: 100%;
        float: left;
        background-color: rgb(47, 52, 57);
    }
    .logo:hover {
        background-color: rgb(42, 47, 51);
        cursor: pointer;
    }
    .start-space {
        font-size: 16pt;
    }
    .nav * {  
        height: 75px;
        padding: 20px 0;
        width: 100px;
        text-align: center;
    }
    .nav *:hover {
        background-color: rgb(42, 47, 51);
        text-decoration: none;
        
    }
    .router-link-exact-active {
        background-color: rgb(47, 52, 57);
        padding-top:25px;
        border-bottom: 4px solid grey;
    }

</style>