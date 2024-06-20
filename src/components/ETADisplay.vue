<template>
  <div>
    <h2>ETA per gli obiettivi</h2>
    <ul>
      <li
        v-for="eta in etas"
        :key="eta.id"
      >
        {{ eta.label }}: {{ eta.time }} minuti
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: "ETADisplay",
  props: {
    etas: Array,
  },
};
</script>

<style scoped>
div {
  position: absolute;
  right: 0;
  top: 0;
  background-color: white;
  padding: 20px;
  border-radius: 5px;
}
ul {
  list-style: none;
  padding: 0;
}
li {
  margin: 5px 0;
}
</style>
