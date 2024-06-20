<template>
    <div class="modal">
      <div class="modal-content">
        <h2>Vuoi terminare la navigazione?</h2>
        <p>Premi S per sì, N per no.</p>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'TerminateNavigationModal',
  };
  </script>
  
  <style scoped>
  .modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .modal-content {
    background: white;
    padding: 20px;
    border-radius: 5px;
    text-align: center;
  }
  </style>
  