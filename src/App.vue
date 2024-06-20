<!-- <template>
  <div id="map-container">
    <div id="map"></div>
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
</template> -->

<template>
  <div id="map-container">
    <div id="map"></div>
    <div
      v-if="state === STATES.START_COORDINATE"
      id="text-box"
    >
      <h2>{{ title }}</h2>
      <CoordinateInput
        :title="title"
        @submit="handleStartCoordinate"
        @pushMarker="pushMarker($event)"
        @changeState="changeState"
        />
        <!-- @resetInputFields="resetInputFields" -->
    </div>
    <div
      v-if="state === STATES.TARGET_COORDINATES"
      id="text-box"
    >
      <h2>{{ title }}</h2>
      <CoordinateInput
        :title="title"
        @submit="handleTargetCoordinate"
      />
    </div>
    <div
      v-if="state === STATES.PASSWORD"
      id="text-box"
    >
      <PasswordPrompt @submit="handlePasswordSubmit" />
    </div>
    <div v-if="state === STATES.ETA_DISPLAY">
      <ETADisplay :etas="etas" />
    </div>
    <div v-if="isShowModal">
      <TerminateNavigationModal @closeModal="closeModal" />
    </div>
  </div>
</template>

<script>
import * as d3 from "d3";
import { geoPath, geoMercator } from "d3-geo";
import * as topojson from "topojson-client";
import { toLatLon } from "utm";
import Marker from "./components/Marker.vue";
import CoordinateInput from "./components/CoordinateInput.vue";
import PasswordPrompt from "./components/PasswordPrompt.vue";
import ETADisplay from "./components/ETADisplay.vue";
import TerminateNavigationModal from "./components/TerminateNavigationModal.vue";

const STATES = {
  START_COORDINATE: "START_COORDINATE",
  TARGET_COORDINATES: "TARGET_COORDINATES",
  PASSWORD: "PASSWORD",
  ETA_DISPLAY: "ETA_DISPLAY",
  TERMINATE_NAVIGATION: "TERMINATE_NAVIGATION",
};

export default {
  name: "App",
  components: {
    Marker,
    CoordinateInput,
    PasswordPrompt,
    ETADisplay,
    TerminateNavigationModal,
  },
  data() {
    return {
      STATES,
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
      title: "INSERIRE COORDINATE DI SITO DI LANCIO",
      insertingTarget: false,
      nthRocket: 1,
      startCoordinate: null,
      etas: [],
      state: STATES.START_COORDINATE,
      isShowModal: false,
    };
  },
  mounted() {
    this.drawMap();
    window.addEventListener("resize", this.resizeMap);
    window.addEventListener("keydown", this.handleKeydown);
    if (this.markers.length > 0) {
      this.drawMarkers();
    }
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.resizeMap);
    window.removeEventListener("keydown", this.handleKeydown);
  },
  methods: {
    resizeMap() {
      this.width = window.innerWidth;
      this.height = window.innerHeight;

      d3.select("#map").select("svg").remove();
      this.drawMap();
      this.drawMarkers();
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
      });

      d3.json("src/data/states-topo.json").then((world) => {
        this.svg
          .append("path")
          .datum(topojson.mesh(world, world.objects.states, (a, b) => a !== b))
          .attr("d", this.path)
          .attr("fill", "none")
          .attr("stroke", "#ccc");

        this.drawMarkers();
      });
    },
    pushMarker($event) {
      // console.log("pushMarker event", $event);
      this.markers.push($event);
      this.drawMarkers();
      // this.resetInputFields();
    },
    drawMarkers() {
      if (!this.svg) return;

      this.markers.forEach((marker) => {
        const [cx, cy] = this.projection([
          marker.longitude,
          marker.latitude,
          marker.color,
          marker.symbol,
        ]);
        if (this.markers.symbol) {
          this.svg
            .appen("polygon")
            .attr("points", "-37.43,32.41 0,-32.41 37.43,32.41")
            .attr("fill", marker.color ?? "red")
            .attr("stroke", "black")
            .attr("stroke-width", 1);
        } else
          this.svg
            .append("circle")
            .attr("cx", cx)
            .attr("cy", cy)
            .attr("r", 5)
            .attr("fill", marker.color ?? "red")
            .attr("stroke", "black")
            .attr("stroke-width", 1);
      });
    },
    handleStartCoordinate(coordinate) {
      const { latitude, longitude } = toLatLon(
        coordinate.easting,
        coordinate.northing,
        coordinate.zoneNumber,
        coordinate.zoneLetter
      );
      this.startCoordinate = { latitude, longitude };
      this.markers.push({
        latitude,
        longitude,
        color: "green",
        symbol: "circle",
      });
      this.drawMarkers();
      this.state = STATES.TARGET_COORDINATES;
      this.title = "Inserire coordinate bersaglio";
    },
    handleTargetCoordinate(coordinate) {
      const { latitude, longitude } = toLatLon(
        coordinate.easting,
        coordinate.northing,
        coordinate.zoneNumber,
        coordinate.zoneLetter
      );
      this.markers.push({ latitude, longitude });
      this.drawMarkers();
    },
    handlePasswordSubmit(password) {
      if (password === "correct_password") {
        this.calculateEtas();
        this.state = STATES.ETA_DISPLAY;
      } else {
        alert("Password errata. Riprova.");
      }
    },
    handleKeydown(event) {
      // console.log("current state: ", this.state, event);
      if (event.ctrlKey && event.key === "s") {
        // console.log(event);
        // this.title = "Inserimento terminato";
        // this.insertingTarget = true;
        this.state = STATES.PASSWORD;
      } else if (event.ctrlKey && event.key === "a") {
        //show modal
        this.isShowModal = true;
        this.state = STATES.TERMINATE_NAVIGATION;
      }
    },
    closeModal() {
      this.isShowModal = false;
    },
    changeState(newState) {
      switch (newState) {
        case "TERMINATE_NAVIGATION":
          this.state = STATES.TERMINATE_NAVIGATION;
      }
    },
    calculateEtas() {
      const mach6Speed = 7174; // Velocità in km/h
      const startCoord = this.startCoordinate;
      this.etas = this.markers.slice(1).map((marker, index) => {
        const distance = this.calculateDistance(
          startCoord.latitude,
          startCoord.longitude,
          marker.latitude,
          marker.longitude
        );
        const time = (distance / mach6Speed) * 60; // Tempo in minuti
        return {
          id: index,
          label: `Obiettivo ${index + 1}`,
          time: time.toFixed(2),
        };
      });
    },
    calculateDistance(lat1, lon1, lat2, lon2) {
      const R = 6371; // Raggio della Terra in km
      const dLat = this.deg2rad(lat2 - lat1);
      const dLon = this.deg2rad(lon2 - lon1);
      const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(this.deg2rad(lat1)) *
          Math.cos(this.deg2rad(lat2)) *
          Math.sin(dLon / 2) *
          Math.sin(dLon / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      const distance = R * c; // Distanza in km
      return distance;
    },
    deg2rad(deg) {
      return deg * (Math.PI / 180);
    },
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
svg {
  width: 100%;
  height: 100%;
}
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
