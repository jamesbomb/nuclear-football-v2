<template>
  <div>
    <div id="text-box">
      <h2>{{ title }}</h2>
      <div class="flex-container">
        <label class="grid-label">
          <span>Zona:</span>
          <input
            class="zone-number"
            v-model="zoneNumber"
            @input="validateZoneNumber"
            @keydown="handleBackspace($event, 'zoneNumber')"
            ref="zoneNumberInput"
            type="text"
            maxlength="2"
            placeholder="00"
            required
          />
        </label>
        <label class="grid-label">
          <span>Lettera:</span>
          <input
            class="zone-letter"
            v-model="zoneLetter"
            @input="validateZoneLetter"
            @keydown="handleBackspace($event, 'zoneLetter')"
            ref="zoneLetterInput"
            type="text"
            maxlength="1"
            placeholder="T"
            required
          />
        </label>
        <label class="grid-label">
          <span>Easting:</span>
          <input
            class="easting"
            v-model="easting"
            @input="validateEasting"
            @keydown="handleBackspace($event, 'easting')"
            ref="eastingInput"
            type="text"
            maxlength="6"
            placeholder="000000"
            required
          />
        </label>
        <label class="grid-label">
          <span>Northing:</span>
          <input
            class="northing"
            v-model="northing"
            @input="validateNorthing"
            @keydown="handleBackspace($event, 'northing')"
            @keyup.enter="handleEnter"
            ref="northingInput"
            type="text"
            maxlength="7"
            placeholder="0000000"
            required
          />
        </label>
      </div>
      <p>Premi invio per confermare</p>
    </div>
  </div>
</template>

<script>
export default {
  name: "CoordinateInput",
  props: {
    title: String,
    onSubmit: Function,
  },
  data() {
    return {
      zoneNumber: null,
      zoneLetter: "",
      easting: null,
      northing: null,
    };
  },
  mounted() {
    this.$refs.zoneNumberInput.focus();
  },
  methods: {
    handleSubmit() {
      this.onSubmit({
        zoneNumber: this.zoneNumber,
        zoneLetter: this.zoneLetter,
        easting: this.easting,
        northing: this.northing,
      });
      this.resetInputFields();
    },
    resetInputFields() {
      this.zoneNumber = "";
      this.zoneLetter = "";
      this.easting = "";
      this.northing = "";
      if (this.insertingTarget) {
        this.title = "Inserire coordinata bersaglio";
      } else {
        this.title = "Inserire nuova coordinata bersaglio n. " + this.nthRocket;
      }
      this.$refs.zoneNumberInput.focus();
    },
    validateZoneNumber() {
      if (this.zoneNumber.length === 2) {
        this.$refs.zoneLetterInput.focus();
      }
    },
    validateZoneLetter() {
      if (this.zoneLetter.length === 1) {
        this.$refs.eastingInput.focus();
      }
    },
    validateEasting() {
      if (this.easting.length === 6) {
        this.$refs.northingInput.focus();
      }
    },
    validateNorthing() {
      if (this.northing.length === 7) {
        console.log("inserito northing");
        this.handleEnter();
      }
    },
    handleBackspace(event, field) {
      if (event.key === "Backspace" && this[field].length === 0) {
        switch (field) {
          case "zoneLetter":
            this.$refs.zoneNumberInput.focus();
            break;
          case "easting":
            this.$refs.zoneLetterInput.focus();
            break;
          case "northing":
            this.$refs.eastingInput.focus();
            break;
        }
      }
    },
  },
};
</script>

<style scoped>
#text-box {
  position: absolute;
  bottom: 10px;
  left: 50%;
  transform: translateX(-50%);
  background-color: rgba(255, 255, 255, 0.8);
  padding: 0 1rem 1rem 1rem;
  border-radius: 5px;
  text-align: center;
  width: 35rem;
  display: flex;
  flex-flow: column nowrap;
  align-items: center;
}
.flex-container {
  display: flex;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.5rem;
  justify-items: flex-start;
}
.grid-label {
  width: 4rem;
  display: flex;
  flex-flow: column nowrap;
  text-align: center;
  align-items: center;
  gap: 0.2rem;
  min-width: max-content;
}
.grid-label span {
  min-width: 4rem;
}
.zone-number {
  width: 2rlh;
}
.zone-letter {
  width: 1rlh;
  text-transform: uppercase;
}
.easting {
  width: 6rlh;
}
.northing {
  width: 7rlh;
}
#text-box input {
  padding: 5px;
  text-align: center;
  font-size: 2rem;
}
#text-box p {
  margin-top: 10px;
}
</style>
