<template>
  <div class="passwordPrompt pulsing-box-shadow">
    <h2>Inserire il codice di lancio</h2>
    <input
      v-model="password"
      type="text"
      placeholder=""
      @keyup.enter="handleSubmit"
      ref="launchCode"
    />
    <p>Premere Invio per avviare il lancio</p>
  </div>
</template>

<script>
export default {
  name: 'PasswordPrompt',
  data() {
    return {
      password: ''
    }
  },
  mounted() {
    this.$refs.launchCode.focus()
  },
  methods: {
    handleSubmit() {
      this.$emit('submit', this.password)
    }
  }
}
</script>

<style scoped>
.passwordPrompt {
  font-family: 'Courier New', Courier, monospace;
  position: absolute;
  bottom: 10px;
  left: 50%;
  transform: translateX(-50%);
  background-color: rgba(255, 128, 128, 0.3);
  color: white;
  padding: 0 0.5rem 0 0.5rem;
  border-radius: 15px;
  text-align: center;
  width: 30rem;
  display: flex;
  flex-flow: column nowrap;
  align-items: center;
  height: 10rem;
  justify-content: center;
  font-family: 'Courier New', Courier, monospace;
  padding-top: 0.1rem;
}
h2 {
  margin: 0 0 0.8rem 0;
  font-size: 1.7rem;
}
p {
  font-size: 1.3rem;
  margin: 1rem 0 0 0;
}
.passwordPrompt input {
  margin-top: 0.5rem;
  padding: 0.5rem;
  width: 80%;
  font-size: 1rem;
}
@keyframes boxShadowPulse {
  0% {
    box-shadow: 0 0 2px 2px red;
  }
  50% {
    box-shadow: 0 0 7px 10px red;
  }
  100% {
    box-shadow: 0 0 2px 2px red;
  }
}

.pulsing-box-shadow {
  box-shadow: 0 0 7px 10px red;
  animation: boxShadowPulse 3.5s ease-in-out infinite;
}
</style>
