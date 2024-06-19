<template>
    <circle
      :cx="cx"
      :cy="cy"
      r="5"
      fill="red"
      stroke="black"
      stroke-width="1"
    />
  </template>
  
  <script>
  export default {
    name: "Marker",
    props: {
      latitude: {
        type: Number,
        required: true,
      },
      longitude: {
        type: Number,
        required: true,
      },
      projection: {
        type: Function,
        required: true,
      },
    },
    computed: {
      cx() {
        return this.projection([this.longitude, this.latitude])[0];
      },
      cy() {
        return this.projection([this.longitude, this.latitude])[1];
      },
    },
  };
  </script>
  
  <style scoped>
  /* Customize your marker styles here */
  </style>
  