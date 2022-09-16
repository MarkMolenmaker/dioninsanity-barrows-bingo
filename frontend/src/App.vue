<template>
  <router-view/>
</template>

<style>
  html, body {
    margin: 0;
    padding: 0;
    width: 100%;
    height: auto;
    overflow: auto;
    overflow-x: hidden;
  }
  #app {
    position: absolute;
    top: 0; right: 0;
    width: 100%; height: 100%;
    overflow: auto;
    overflow-x: hidden;

    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #fff;

    background: rgb(35,41,63);
    background: -moz-radial-gradient(circle, rgba(35,41,63,1) 0%, rgba(9,13,31,1) 100%);
    background: -webkit-radial-gradient(circle, rgba(35,41,63,1) 0%, rgba(9,13,31,1) 100%);
    background: radial-gradient(circle, rgba(35,41,63,1) 0%, rgba(9,13,31,1) 100%);
    filter: progid:DXImageTransform.Microsoft.gradient(startColorstr="#23293f",endColorstr="#090d1f",GradientType=1);
  }
</style>
