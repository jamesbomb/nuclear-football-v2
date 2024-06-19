<template>
  <div id="map-container">
    <div id="map"></div>
    <div id="text-box">
      <h2>{{ title }}</h2>
      <div class="grid-container">
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
          <span>Est:</span>
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
          <span>Nord:</span>
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
import * as d3 from "d3";
import { geoPath, geoMercator } from "d3-geo";
import * as topojson from "topojson-client";
import { toLatLon } from "utm";
import Marker from "./components/Marker.vue";

export default {
  name: "App",
  components: {
    Marker,
  },
  data() {
    return {
      width: window.innerWidth,
      height: window.innerHeight,
      projection: null,
      path: null,
      svg: null,
      markers: [
        { name: "London", latitude: 51.5074, longitude: -0.1276 },
        { name: "Washington DC", latitude: 38.9072, longitude: -77.0369 },
        { name: "Rome", latitude: 41.9028, longitude: 12.4964 },
      ],
      zoneNumber: "",
      zoneLetter: "",
      easting: "",
      northing: "",
      currentInput: "",
      title: "COORDINATE DI PARTENZA",
      insertingTarget: false,
    };
  },
  methods: {
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
    resizeMap() {
      this.width = window.innerWidth;
      this.height = window.innerHeight;

      d3.select("#map").select("svg").remove();
      this.drawMap();
    },
    drawMap() {
      this.projection = geoMercator()
        .scale(250)
        .translate([this.width / 2.5, this.height / 1.5]);

      this.path = geoPath().projection(this.projection);

      this.svg = d3
        .select("#map")
        .append("svg")
        .attr("width", this.width)
        .attr("height", this.height)
        .style("background-color", "#000"); // Set background color to black

      d3.json("src/data/countries-topo.json").then((world) => {
        this.svg
          .append("path")
          .datum(topojson.feature(world, world.objects.countries))
          .attr("d", this.path)
          .attr("fill", "#333")
          .attr("stroke", "#ccc");

        this.drawMarkers();
      });

      d3.json("src/data/states-topo.json").then((world) => {
        this.svg
          .append("path")
          .datum(topojson.mesh(world, world.objects.states, (a, b) => a !== b))
          .attr("d", this.path)
          .attr("fill", "none")
          .attr("stroke", "#ccc");
      });
    },
    drawMarkers() {
      this.markers.forEach((marker) => {
        const [cx, cy] = this.projection([marker.longitude, marker.latitude]);
        this.svg
          .append("circle")
          .attr("cx", cx)
          .attr("cy", cy)
          .attr("r", 5)
          .attr("fill", "red")
          .attr("stroke", "black")
          .attr("stroke-width", 1);
      });
    },
    handleEnter() {
      try {
        const { latitude, longitude } = toLatLon(
          parseFloat(this.easting),
          parseFloat(this.northing),
          parseInt(this.zoneNumber),
          this.zoneLetter.toUpperCase()
        );
        this.markers.push({ latitude, longitude });
        this.drawMarkers();
        this.resetInputFields();
      } catch (error) {
        alert(
          "Errore nella conversione delle coordinate. Verifica i valori inseriti."
        );
      }
    },
    resetInputFields() {
      this.zoneNumber = "";
      this.zoneLetter = "";
      this.easting = "";
      this.northing = "";
      if (this.insertingTarget) {
        this.title = "Inserire coordinata bersaglio";
      } else {
        this.title = "Inserire nuova coordinata";
      }
      this.$refs.zoneNumberInput.focus();
    },
    handleKeydown(event) {
      if (event.ctrlKey && event.key === "s") {
        this.title = "Inserimento terminato";
        this.insertingTarget = true;
      }
    },
  },
  mounted() {
    this.drawMap();
    window.addEventListener("resize", this.resizeMap);
    window.addEventListener("keydown", this.handleKeydown);
    this.$refs.zoneNumberInput.focus();
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.resizeMap);
    window.removeEventListener("keydown", this.handleKeydown);
  },
};
</script>

<style>
body,
html,
#app,
#map-container,
#map {
  width: 100%;
  height: 100%;
  margin: 0 !important;
  max-width: unset !important;
  padding: 0 !important;
}
#map-container {
  position: relative;
  width: 100%;
  height: 100%;
  font-size: 16px;
}
#app {
  overflow: hidden;
  position: absolute;
  left: 0;
  top: 0;
}
#map {
  background-color: #000;
  position: absolute;
  left: 0;
  top: 0;
}
#text-box {
  position: absolute;
  bottom: 10px;
  left: 50%;
  transform: translateX(-50%);
  background-color: rgba(255, 255, 255, 0.8);
  padding: 0 4rem 1rem 4rem;
  border-radius: 5px;
  text-align: center;
  width: 22rem;
}
.grid-container {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.5rem;
  justify-items: flex-start;
  max-width: 20rem;
  margin-left: 1rem;
}
.grid-label {
  width: 4rem;
  display: flex;
  align-items: center;
  text-align: left;
  gap: 0.2rem;
}
.grid-label span {
  min-width: 4rem;
}
.zone-number {
  width: 1rem;
}
.zone-letter {
  width: 1rem;
}
.easting {
  width: 3.5rem;
}
.northing {
  width: 3.5rem;
}
#text-box input {
  padding: 5px;
  text-align: center;
}
#text-box p {
  margin-top: 10px;
}
svg {
  width: 100%;
  height: 100%;
}
</style>
