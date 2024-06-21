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
            placeholder="__"
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
            placeholder="_"
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
            placeholder="______"
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
            placeholder="_______"
            required
          />
        </label>
      </div>
      <p>Premere Invio per confermare</p>
      <p><b>Premere CTRL+S per terminare l'inserimento</b></p>
    </div>
  </div>
</template>

<script>
import { toLatLon } from "utm";

export default {
  name: "CoordinateInput",
  props: {
    title: String,
    onSubmit: Function,
  },
  data() {
    return {
      zoneNumber: "",
      zoneLetter: "",
      easting: "",
      northing: "",
      title: "",
    };
  },
  mounted() {
    this.$refs.zoneNumberInput.focus();
    window.addEventListener("keyup", (event) => {
      if (event.key === "Enter" && this.northing.length === 7) {
        this.handleEnter();
      }
    });
    this.resetInputFields();
  },
  beforeDestroy() {
    window.removeEventListener("keyup", (event) => {
      if (event.key === "Enter" && this.northing.length === 7) {
        this.handleEnter();
      }
    });
  },
  methods: {
    handleSubmit() {
      this.onSubmit({
        zoneNumber: this.zoneNumber,
        zoneLetter: this.zoneLetter.toUpperCase(),
        easting: this.easting,
        northing: this.northing,
      });
      // $this.emit('resetInputFields')
      this.resetInputFields();
      this.$refs.zoneNumberInput.focus();
    },
    resetInputFields() {
      this.zoneNumber = "";
      this.zoneLetter = "";
      this.easting = "";
      this.northing = "";
      this.title = "Inserire coordinata bersaglio";
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
        // console.log("inserito northing");
        // this.handleEnter();
      }
    },
    handleEnter() {
      try {
        const { latitude, longitude } = toLatLon(
          parseFloat(this.easting),
          parseFloat(this.northing),
          parseInt(this.zoneNumber),
          this.zoneLetter.toUpperCase()
        );
        // console.log({ latitude, longitude });
        this.$emit("pushMarker", {
          latitude,
          longitude,
        });
        this.resetInputFields();
      } catch (error) {
        console.error(error);
        alert(
          "Errore nella conversione delle coordinate. Verifica i valori inseriti."
        );
      }
    },
    handleBackspace(event, field) {
      // console.log(event, field);
      if (event.key === "Backspace" && this[field].length === 0) {
        // console.log("backspace");
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
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  background-color: rgba(255, 255, 255, 0.4);
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
}

#text-box h2 {
  margin: 0.5rem 0;
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
  color: #000;
}
.grid-label span {
  min-width: 4rem;
}
.zone-number {
  width: 2rlh;
}
.zone-letter {
  width: 1.5rlh;
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
  margin-bottom: 0.5rem;
}
#text-box p {
  margin: 0;
  color: white;
}
</style>
