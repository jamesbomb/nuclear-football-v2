<template>
    <div id="countdown-message">
      <p>Premere CTRL+A per disarmare le testate</p>
    </div>
  </template>
  
  <script>
  export default {
    name: "TerminateLaunch",
  };
  </script>
  
  <style scoped>
  #countdown-message {
    position: absolute;
    bottom: 10px;
    left: 50%;
    transform: translateX(-50%);
    background-color: rgba(255, 255, 255, 0.4);
    padding: 0.5rem;
    border-radius: 10px;
    text-align: center;
    font-family: 'Courier New', Courier, monospace;
  }
  #countdown-message p {
    margin: 0;
    color: white;
  }
  </style>
  