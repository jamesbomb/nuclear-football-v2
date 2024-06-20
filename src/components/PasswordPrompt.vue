<template>
    <div>
      <h2>Inserisci la password</h2>
      <input
        v-model="password"
        type="password"
        placeholder="Password"
        @keyup.enter="handleSubmit"
      />
    </div>
  </template>
  
  <script>
  export default {
    name: 'PasswordPrompt',
    data() {
      return {
        password: '',
      };
    },
    methods: {
      handleSubmit() {
        this.$emit('submit', this.password);
      },
    },
  };
  </script>
  
  <style scoped>
  div {
    text-align: center;
    margin-top: 20px;
  }
  input {
    padding: 5px;
  }
  </style>
  