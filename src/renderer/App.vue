<template>
  <div id="map-container">
    <div id="map"></div>
    <div v-if="state === STATES.START_COORDINATE" id="text-box">
      <h2>{{ title }}</h2>
      <CoordinateInput
        :title="title"
        @submit="handleStartCoordinate"
        @pushMarker="pushMarker($event)"
      />
    </div>
    <div v-if="state === STATES.TARGET_COORDINATES" id="text-box">
      <h2>{{ title }}</h2>
      <CoordinateInput
        :title="title"
        @submit="handleTargetCoordinate"
        @pushMarker="pushMarker($event)"
      />
    </div>
    <div v-if="state === STATES.PASSWORD" id="text-box">
      <PasswordPrompt @submit="handlePasswordSubmit" />
    </div>
    <ETADisplay :etas="etas" :isCountingDown="isCountingDown" />
    <!-- <SpeedDisplay :missiles="missileRefs" :isCountingDown="isCountingDown" /> -->
    <Radar />
    <IPScanner />
    <div v-if="isShowModal">
      <TerminateNavigationModal
        v-if="isShowModal"
        @closeModal="closeModal"
        @abort="handleAbort"
        :showDeactivationMessage="showDeactivationModal"
      />
    </div>
    <!-- <div v-if="showAbort">
	<TerminateLaunch />
	</div> -->
  </div>
</template>

<script>
import { defineComponent } from 'vue'
import * as d3 from 'd3'
import { geoPath, geoMercator } from 'd3-geo'
import * as topojson from 'topojson-client'
import { toLatLon } from 'utm'
// import Marker from './components/Marker.vue'
import CoordinateInput from './components/CoordinateInput.vue'
import PasswordPrompt from './components/PasswordPrompt.vue'
import ETADisplay from './components/ETADisplay.vue'
import TerminateNavigationModal from './components/TerminateNavigationModal.vue'
// import TerminateLaunch from './components/TerminateLaunch.vue'
// import SpeedDisplay from './components/SpeedDisplay.vue'
import Radar from './components/Radar.vue'
import IPScanner from './components/IPScanner.vue'

const STATES = {
  // START_COORDINATE: "START_COORDINATE",
  TARGET_COORDINATES: 'TARGET_COORDINATES',
  PASSWORD: 'PASSWORD',
  ETA_DISPLAY: 'ETA_DISPLAY'
  // TERMINATE_NAVIGATION: "TERMINATE_NAVIGATION",
}

export default defineComponent({
  name: 'App',
  components: {
    // Marker,
    CoordinateInput,
    PasswordPrompt,
    ETADisplay,
    TerminateNavigationModal,
    // SpeedDisplay
    Radar,
    IPScanner
    // TerminateLaunch
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
        { name: 'London', latitude: 51.5074, longitude: -0.1276 }
        // { name: "Washington DC", latitude: 38.9072, longitude: -77.0369 },
        // { name: "Rome", latitude: 41.9028, longitude: 12.4964 },
      ],
      zoneNumber: '',
      zoneLetter: '',
      easting: '',
      northing: '',
      currentInput: '',
      title: 'Inserire coordinate bersaglio',
      insertingTarget: false,
      nthRocket: 1,
      startCoordinate: { latitude: 51.5074, longitude: -0.1276 },
      etas: [],
      state: STATES.TARGET_COORDINATES,
      isShowModal: false,
      countdownInterval: null,
      showAbort: false,
      showDeactivationModal: false,
      isCountingDown: false,
      keyHandling: {
        ctrlSHandled: false,
        ctrlAHandled: false
      },
      missileRefs: []
    }
  },
  mounted() {
    this.drawMap()
    window.addEventListener('resize', this.resizeMap)
    window.addEventListener('keydown', this.handleKeydown)
    window.addEventListener('keyup', this.handleKeyup)
    this.drawMarkers()
  },
  // eslint-disable-next-line vue/no-deprecated-destroyed-lifecycle
  beforeDestroy() {
    window.removeEventListener('resize', this.resizeMap)
    window.removeEventListener('keydown', this.handleKeydown)
    window.removeEventListener('keyup', this.handleKeyup)
    this.drawMarkers()
    if (this.countdownInterval) {
      clearInterval(this.countdownInterval)
    }
  },
  methods: {
    resizeMap() {
      this.width = window.innerWidth
      this.height = window.innerHeight
      d3.select('#map').select('svg').remove()
      this.drawMap()
      this.drawMarkers()
    },
    drawMap() {
      this.projection = geoMercator()
        .scale(250)
        .translate([this.width / 2.5, this.height / 1.5])

      this.path = geoPath().projection(this.projection)

      this.svg = d3
        .select('#map')
        .append('svg')
        .attr('width', this.width)
        .attr('height', this.height)
        .style('background-color', '#000')

      d3.json('src/data/countries-topo.json').then((world) => {
        this.svg
          .append('path')
          .datum(topojson.feature(world, world.objects.countries))
          .attr('d', this.path)
          .attr('fill', '#111')
          .attr('stroke', 'lightblue')
      })

      d3.json('src/data/states-topo.json').then((world) => {
        this.svg
          .append('path')
          .datum(topojson.mesh(world, world.objects.states, (a, b) => a !== b))
          .attr('d', this.path)
          .attr('fill', 'none')
          .attr('stroke', 'lightblue')
        this.drawMarkers()
      })
    },
    pushMarker($event) {
      // console.log("pushMarker event", $event);
      this.markers.push($event)
      this.drawMarkers()
      // this.resetInputFields();
      this.calculateEtas()
    },
    drawMarkers() {
      if (!this.svg) return

      this.svg.selectAll('.marker').remove()

      this.markers.forEach((marker, index) => {
        const [cx, cy] = this.projection([marker.longitude, marker.latitude])
        this.svg
          .append('circle')
          .attr('class', 'marker')
          .attr('id', `marker-${index}`)
          .attr('cx', cx)
          .attr('cy', cy)
          .attr('r', 3)
          .attr('fill', index === 0 ? 'lightgreen' : 'red')
          .attr('stroke', 'black')
          .attr('stroke-width', 1)
      })
    },
    // handleStartCoordinate(coordinate) {
    // const { latitude, longitude } = toLatLon(
    // coordinate.easting,
    // coordinate.northing,
    // coordinate.zoneNumber,
    // coordinate.zoneLetter
    // );
    // this.startCoordinate = { latitude, longitude };
    // this.markers.push({
    // latitude,
    // longitude,
    // color: "green",
    // symbol: "circle",
    // });
    // this.drawMarkers();
    // this.state = STATES.TARGET_COORDINATES;
    // this.title = "Inserire coordinate bersaglio";
    // },
    handleTargetCoordinate(coordinate) {
      const { latitude, longitude } = toLatLon(
        coordinate.easting,
        coordinate.northing,
        coordinate.zoneNumber,
        coordinate.zoneLetter
      )
      this.markers.push({ latitude, longitude })
      this.drawMarkers()
      this.calculateEtas()
    },
    handlePasswordSubmit(password) {
      if (password === 'password') {
        // A7f2G6$r!46D@23<j81#?') {
        this.calculateEtas()
        this.startMissileAnimation()
        this.startCountdown()
        this.state = STATES.ETA_DISPLAY
        this.showAbort = true
      } else {
        // eslint-disable-next-line no-alert
        alert('Password errata. Riprova.')
      }
    },
    startMissileAnimation() {
      const startCoord = this.startCoordinate
      this.markers.slice(1).forEach((marker, index) => {
        const start = this.projection([
          startCoord.longitude,
          startCoord.latitude
        ])
        const end = this.projection([marker.longitude, marker.latitude])
        const missile = this.svg
          .append('image')
          .attr('id', `missile-${index}`)
          .attr('xlink:href', 'src/assets/missile.svg')
          .attr('width', 48)
          .attr('height', 48)
          .attr('x', start[0] - 24) // Center the missile horizontally
          .attr('y', start[1] - 48) // Position the missile so the bottom is at start[1]

        this.missileRefs.push(missile)

        const eta = this.etas[index].time // Get the time in seconds
        const duration = eta * 1000 // Convert seconds to milliseconds
        this.drawTrajectory(start, end, `trajectory-${index}`)
        this.animateMissile(missile, start, end, duration, index)
      })
    },
    drawTrajectory(start, end, trajectoryId) {
      const midX = (start[0] + end[0]) / 2
      const peakY = start[1] - 200 // Adjust for desired curve height

      const parabola = d3
        .line()
        .x((d) => d[0])
        .y((d) => d[1])
        .curve(d3.curveBasis)

      const points = d3.range(0, 1.01, 0.01).map((t) => {
        const x =
          start[0] * (1 - t) * (1 - t) + 2 * midX * t * (1 - t) + end[0] * t * t
        const y =
          start[1] * (1 - t) * (1 - t) +
          2 * peakY * t * (1 - t) +
          end[1] * t * t
        return [x, y]
      })

      this.svg
        .append('path')
        .attr('id', trajectoryId)
        .attr('d', parabola(points))
        .attr('fill', 'none')
        .attr('stroke', 'yellow')
        .attr('stroke-width', 2)
        .attr('stroke-dasharray', '5,5')
    },
    animateMissile(missile, start, end, duration, index) {
      const midX = (start[0] + end[0]) / 2
      const peakY = start[1] - 200 // Adjust for desired curve height

      const missileHeight = 48 // Height of the missile SVG
      const missileWidth = 48 // Width of the missile SVG

      missile
        .transition()
        .duration(duration)
        .ease(d3.easeLinear)
        .tween(`pathTween-${index}`, () => {
          return (t) => {
            const x =
              start[0] * (1 - t) * (1 - t) +
              2 * midX * t * (1 - t) +
              end[0] * t * t
            const y =
              start[1] * (1 - t) * (1 - t) +
              2 * peakY * t * (1 - t) +
              end[1] * t * t
            const angle =
              (Math.atan2(
                start[1] * (1 - (t + 0.01)) * (1 - (t + 0.01)) +
                  2 * peakY * (t + 0.01) * (1 - (t + 0.01)) +
                  end[1] * (t + 0.01) * (t + 0.01) -
                  y,
                start[0] * (1 - (t + 0.01)) * (1 - (t + 0.01)) +
                  2 * midX * (t + 0.01) * (1 - (t + 0.01)) +
                  end[0] * (t + 0.01) * (t + 0.01) -
                  x
              ) *
                180) /
              Math.PI

            missile
              .attr('x', x - missileWidth / 2)
              .attr('y', y - missileHeight / 2) // Adjust for missile center
              .attr('transform', `rotate(${angle + 90}, ${x}, ${y})`)

            // Check if the missile tip reached the destination
            if (t >= 1) {
              missile.remove()
              this.etas[index].label = `Missile ${index + 1}: Colpito`

              const marker = this.svg.select(`#marker-${index}`)
              if (marker) {
                marker.remove()
              }
              this.svg
                .append('line')
                .attr('x1', end[0] - 5)
                .attr('y1', end[1] - 5)
                .attr('x2', end[0] + 5)
                .attr('y2', end[1] + 5)
                .attr('stroke', 'red')
                .attr('stroke-width', 2)
                .attr('id', `marker-cross-${index}`)
              this.svg
                .append('line')
                .attr('x1', end[0] - 5)
                .attr('y1', end[1] + 5)
                .attr('x2', end[0] + 5)
                .attr('y2', end[1] - 5)
                .attr('stroke', 'red')
                .attr('stroke-width', 2)
                .attr('id', `marker-cross-${index}`)
            }
          }
        })
        .on('end', () => {
          if (this.etas.every((eta) => eta.time <= 0)) {
            this.scheduleShutdown()
          }
        })
    },
    calculateEtas() {
      const mach20Speed = 24696 / 3600 // Velocità in km/s
      const startCoord = this.startCoordinate
      const minimumTime = 240
      this.etas = this.markers.slice(1).map((marker, index) => {
        const distance = this.calculateDistance(
          startCoord.latitude,
          startCoord.longitude,
          marker.latitude,
          marker.longitude
        )
        let time = distance / mach20Speed // Time in seconds
        if (time < minimumTime) {
          time += minimumTime
        }
        return {
          id: index,
          label: `Missile ${index + 1}`,
          // time: time.toFixed(2),
          time: Math.floor(time)
          // originalTime: time, // Save the original time for resetting
        }
      })
    },
    startCountdown() {
      this.isCountingDown = true
      if (this.countdownInterval) {
        clearInterval(this.countdownInterval)
      }
      this.countdownInterval = setInterval(() => {
        this.etas = this.etas.map((eta) => {
          if (eta.time > 0) {
            eta.time -= 1
          } else if (eta.time < 0.01) {
            eta.label = `Missile ${eta.id + 1}: Colpito`
            eta.time = 0 // To avoid further counting
          }
          return eta
        })
        // if (this.etas.every((eta) => eta.time < 0)) {
        // clearInterval(this.countdownInterval);
        // this.shutdownRaspberryPi();
        // }
        if (this.etas.every((eta) => eta.time <= 0)) {
          clearInterval(this.countdownInterval)
          console.log('shutting down...')
          // window.electronAPI.shutdown()
          this.scheduleShutdown()
        }
      }, 1000)
    },
    handleKeydown(event) {
      if (event.ctrlKey && event.key === 's') {
        if (!this.keyHandling.ctrlSHandled) {
          this.state = STATES.PASSWORD
          this.keyHandling.ctrlSHandled = true
        }
      } else if (event.ctrlKey && event.key === 'a') {
        if (!this.keyHandling.ctrlAHandled) {
          this.isShowModal = true
          this.keyHandling.ctrlAHandled = true
        }
        // this.state = STATES.TERMINATE_NAVIGATION;
      } else {
        this.keyHandling.ctrlSHandled = false
        this.keyHandling.ctrlAHandled = false
      }
    },
    handleKeyup(event) {
      if (event.key === 'Control') {
        // Reset both flags when the control key is released
        this.keyHandling.ctrlSHandled = false
        this.keyHandling.ctrlAHandled = false
      }
    },
    closeModal() {
      this.isShowModal = false
    },
    handleAbort() {
      clearInterval(this.countdownInterval)
      this.etas.forEach((eta) => {
        if (eta.time >= 0) {
          eta.label = `Missile ${eta.id + 1}: Disarmato`
        }
      })
      this.isCountingDown = false
      this.showDeactivationModal = true // Keep the deactivation message visible.

      // Remove all missiles
      this.missileRefs.forEach((missile) => missile.remove())
      this.missileRefs = []

      console.log('App will close in 10 seconds...')
      this.scheduleShutdown()
    },
    calculateDistance(lat1, lon1, lat2, lon2) {
      const R = 6371 // Raggio della Terra in km
      const dLat = this.deg2rad(lat2 - lat1)
      const dLon = this.deg2rad(lon2 - lon1)
      const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(this.deg2rad(lat1)) *
          Math.cos(this.deg2rad(lat2)) *
          Math.sin(dLon / 2) *
          Math.sin(dLon / 2)
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
      const distance = R * c // Distanza in km
      return distance
    },
    deg2rad(deg) {
      return deg * (Math.PI / 180)
    },
    scheduleShutdown() {
      console.log('Scheduling shutdown...')
      console.log('App will close in 10 seconds...')
      setTimeout(() => {
        // eslint-disable-next-line no-shadow
        const { remote } = require('electron')
        const { app } = remote
        app.quit()
      }, 10000)
    }
  }
})
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
  cursor: none;
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
