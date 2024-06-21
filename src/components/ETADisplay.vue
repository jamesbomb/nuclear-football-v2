<template>
  <div>
    <h2>ETA</h2>
    <ul>
      <li
        v-for="eta in etas"
        :key="eta.id"
      >
        {{ eta.label }}: {{ formatTime(eta.time) }}
      </li>
      <p v-if="isCountingDown">Premere CTRL+A per disarmare le testate</p>
    </ul>
  </div>
</template>

<script>
export default {
  name: "ETADisplay",
  props: {
    etas: Array,
    isCountingDown: Boolean,
  },
  methods: {
    formatTime(seconds) {
      if (seconds < 0) {
        return "Colpito";
      }
      const hours = Math.floor(seconds / 3600);
      const minutes = Math.floor((seconds % 3600) / 60);
      const secs = Math.floor(seconds % 60);
      return `${hours.toString().padStart(2, "0")}:${minutes
        .toString()
        .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
    },
  },
};
</script>

<style scoped>
div {
  font-family: "Courier New", Courier, monospace;
  background-color: rgba(255, 255, 255, 0.07);
  position: absolute;
  right: 0;
  top: 0;
  padding: 20px;
  border-radius: 5px;
  color: white;
}
ul {
  list-style: none;
  padding: 0;
}
li {
  margin: 5px 0;
}
p {
  color: white;
}
</style>
