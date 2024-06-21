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
      />
    </div>
    <div
      v-if="state === STATES.TARGET_COORDINATES"
      id="text-box"
    >
      <h2>{{ title }}</h2>
      <CoordinateInput
        :title="title"
        @submit="handleTargetCoordinate"
        @pushMarker="pushMarker($event)"
      />
    </div>
    <div
      v-if="state === STATES.PASSWORD"
      id="text-box"
    >
      <PasswordPrompt @submit="handlePasswordSubmit" />
    </div>
    <!-- <div v-if="state === STATES.ETA_DISPLAY"> -->
    <ETADisplay :etas="etas" :isCountingDown="isCountingDown" />
    <!-- </div> -->
    <div v-if="isShowModal">
      <TerminateNavigationModal @closeModal="closeModal" @abort="handleAbort" />
    </div>
    <!-- <div v-if="showAbort">
      <TerminateLaunch />
    </div> -->
  </div>
</template>

<script>
// import { exec } from 'child_process';
import * as d3 from "d3";
import { geoPath, geoMercator } from "d3-geo";
import * as topojson from "topojson-client";
import { toLatLon } from "utm";
import Marker from "./components/Marker.vue";
import CoordinateInput from "./components/CoordinateInput.vue";
import PasswordPrompt from "./components/PasswordPrompt.vue";
import ETADisplay from "./components/ETADisplay.vue";
import TerminateNavigationModal from "./components/TerminateNavigationModal.vue";
import TerminateLaunch from "./components/TerminateLaunch.vue";

const STATES = {
  // START_COORDINATE: "START_COORDINATE",
  TARGET_COORDINATES: "TARGET_COORDINATES",
  PASSWORD: "PASSWORD",
  ETA_DISPLAY: "ETA_DISPLAY",
  // TERMINATE_NAVIGATION: "TERMINATE_NAVIGATION",
};

export default {
  name: "App",
  components: {
    Marker,
    CoordinateInput,
    PasswordPrompt,
    ETADisplay,
    TerminateNavigationModal,
    TerminateLaunch
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
        // { name: "Washington DC", latitude: 38.9072, longitude: -77.0369 },
        // { name: "Rome", latitude: 41.9028, longitude: 12.4964 },
      ],
      zoneNumber: "",
      zoneLetter: "",
      easting: "",
      northing: "",
      currentInput: "",
      title: "Inserire coordinate bersaglio",
      insertingTarget: false,
      nthRocket: 1,
      startCoordinate: { latitude: 51.5074, longitude: -0.1276 },
      etas: [],
      state: STATES.TARGET_COORDINATES,
      isShowModal: false,
      countdownInterval: null,
      showAbort: false,
      isCountingDown: false,
    };
  },
  mounted() {
    this.drawMap();
    window.addEventListener("resize", this.resizeMap);
    window.addEventListener("keydown", this.handleKeydown);
    this.drawMarkers();
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.resizeMap);
    window.removeEventListener("keydown", this.handleKeydown);
    this.drawMarkers();
    if (this.countdownInterval) {
      clearInterval(this.countdownInterval);
    }
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
        .style("background-color", "#000");

      d3.json("src/data/countries-topo.json").then((world) => {
        this.svg
          .append("path")
          .datum(topojson.feature(world, world.objects.countries))
          .attr("d", this.path)
          .attr("fill", "#111")
          .attr("stroke", "lightblue");
      });

      d3.json("src/data/states-topo.json").then((world) => {
        this.svg
          .append("path")
          .datum(topojson.mesh(world, world.objects.states, (a, b) => a !== b))
          .attr("d", this.path)
          .attr("fill", "none")
          .attr("stroke", "lightblue");
        this.drawMarkers();
      });
    },
    pushMarker($event) {
      // console.log("pushMarker event", $event);
      this.markers.push($event);
      this.drawMarkers();
      // this.resetInputFields();
      this.calculateEtas();
    },
    drawMarkers() {
      if (!this.svg) return;

      this.svg.selectAll(".marker").remove();

      this.markers.forEach((marker, index) => {
        const [cx, cy] = this.projection([marker.longitude, marker.latitude]);
        if (index === 0) {
          // Primo marker: verde e cerchio
          this.svg
            .append("circle")
            .attr("class", "marker")
            .attr("cx", cx)
            .attr("cy", cy)
            .attr("r", 3)
            .attr("fill", "lightgreen")
            .attr("stroke", "black")
            .attr("stroke-width", 1);
        } else {
          // Marker successivi: rossi
          this.svg
            // .append("polygon")
            .append("circle")
            .attr("class", "marker")
            .attr("cx", cx)
            .attr("cy", cy)
            // .attr("points", "-5,10 0,-10 5,10")
            // .attr("transform", `translate(${cx},${cy})`)
            .attr("r", 3)
            .attr("fill", "red")
            .attr("stroke", "black")
            .attr("stroke-width", 1);
        }
      });
    },
    // handleStartCoordinate(coordinate) {
    //   const { latitude, longitude } = toLatLon(
    //     coordinate.easting,
    //     coordinate.northing,
    //     coordinate.zoneNumber,
    //     coordinate.zoneLetter
    //   );
    //   this.startCoordinate = { latitude, longitude };
    //   this.markers.push({
    //     latitude,
    //     longitude,
    //     color: "green",
    //     symbol: "circle",
    //   });
    //   this.drawMarkers();
    //   this.state = STATES.TARGET_COORDINATES;
    //   this.title = "Inserire coordinate bersaglio";
    // },
    handleTargetCoordinate(coordinate) {
      const { latitude, longitude } = toLatLon(
        coordinate.easting,
        coordinate.northing,
        coordinate.zoneNumber,
        coordinate.zoneLetter
      );
      this.markers.push({ latitude, longitude });
      this.drawMarkers();
      this.calculateEtas();
    },
    handlePasswordSubmit(password) {
      if (password === "vivalafiga") {
        this.startCountdown();
        this.calculateEtas();
        this.state = STATES.ETA_DISPLAY;
        this.showAbort = true;
      } else {
        alert("Password errata. Riprova.");
      }
    },
    calculateEtas() {
      const mach20Speed = 24696; // Velocità in km/h
      const startCoord = this.startCoordinate;
      this.etas = this.markers.slice(1).map((marker, index) => {
        const distance = this.calculateDistance(
          startCoord.latitude,
          startCoord.longitude,
          marker.latitude,
          marker.longitude
        );
        const time = (distance / mach20Speed) * 3600; // Time in seconds
        return {
          id: index,
          label: `Missile ${index + 1}`,
          // time: time.toFixed(2),
          time: Math.floor(time),
          // originalTime: time, // Save the original time for resetting
        };
      });
    },
    startCountdown() {
      this.isCountingDown = true;
      if (this.countdownInterval) {
        clearInterval(this.countdownInterval);
      }
      this.countdownInterval = setInterval(() => {
        this.etas = this.etas.map((eta) => {
          if (eta.time > 0) {
            eta.time--;
          } else if (eta.time === 0) {
            eta.label = `Missile ${eta.id + 1}: Colpito`;
            eta.time = -1; // To avoid further counting
          }
          return eta;
        });
        // if (this.etas.every((eta) => eta.time < 0)) {
        //   clearInterval(this.countdownInterval);
        //   this.shutdownRaspberryPi();
        // }
        if (this.etas.every((eta) => eta.time < 0)) {
          clearInterval(this.countdownInterval);
          window.electronAPI.shutdown();
        }
      }, 1000);
    },
    handleKeydown(event) {
      if (event.ctrlKey && event.key === "s") {
        this.state = STATES.PASSWORD;
      } else if (event.ctrlKey && event.key === "a") {
        this.isShowModal = true;
        // this.state = STATES.TERMINATE_NAVIGATION;
      }
    },
    closeModal() {
      this.isShowModal = false;
    },
    handleAbort() {
      clearInterval(this.countdownInterval);
      this.etas.forEach((eta) => {
        if (eta.time >= 0) {
          eta.label = `Missile ${eta.id + 1}: Disarmato`;
        }
      });
      this.isCountingDown = false;
      this.isShowModal = false;
      // this.shutdownRaspberryPi();
      window.electronAPI.shutdown();
    },
    // shutdownRaspberryPi() {
    //   exec('sudo shutdown -h now', (error, stdout, stderr) => {
    //     if (error) {
    //       console.error(`Error shutting down: ${error.message}`);
    //       return;
    //     }
    //     if (stderr) {
    //       console.error(`Stderr: ${stderr}`);
    //       return;
    //     }
    //     console.log(`Shutdown stdout: ${stdout}`);
    //   });
    // },
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
