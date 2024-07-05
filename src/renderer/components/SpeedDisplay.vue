<template>
  <div>
    <h2>Informazioni</h2>
    <ul>
      <li v-for="missile in missiles" :key="missile.id">
        <template v-if="missile">
          <!-- {{ eta.label }}: {{ formatTime(eta.time) }} -->
          <p v-if="isCountingDown">
            Velocità missile {{ missile.id }}: {{ missile.velocity }}
          </p>
        </template>
        <template v-else> {{ eta.label }} </template>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'SpeedDisplay',
  props: {
    missiles: Array,
    isCountingDown: Boolean
  },
  methods: {},
  watch: {
    missiles(newVal) {
      console.log(newVal)
    }
  }
}
</script>

<style scoped>
div {
  font-family: 'Courier New', Courier, monospace;
  background-color: rgba(255, 255, 255, 0.07);
  position: absolute;
  right: 0;
  bottom: 0;
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
