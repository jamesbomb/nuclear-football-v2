<template>
  <div class="ipScanner">
    <div class="msg">Scanning</div>
    <div id="console">
      <p v-for="(line, index) in lines" :key="index">{{ line }}</p>
    </div>
  </div>
</template>
<script>
export default {
  name: 'IPScanner',
  data() {
    return {
      lines: [],
      intervalId: null,
      txt: [
        'FORCE: XX0022. ENCYPT://000.222.2345',
        'TRYPASS: ********* AUTH CODE: ALPHA GAMMA: 1___ PRIORITY 1',
        'RETRY: REINDEER FLOTILLA',
        'Z:> /FALKEN/GAMES/TICTACTOE/ EXECUTE -PLAYERS 0',
        '=====================================',
        'Priority 1 // local / scanning...',
        'scanning ports...',
        'BACKDOOR FOUND (23.45.23.12.00000000)',
        'BACKDOOR FOUND (13.66.23.12.00110000)',
        'BACKDOOR FOUND (13.66.23.12.00110044)',
        '...',
        '...',
        'BRUTE.EXE -r -z',
        '...locating vulnerabilities...',
        '...vulnerabilities found...',
        'MCP/> DEPLOY CLU',
        'SCAN: __ 0100.0000.0554.0080',
        'SCAN: __ 0020.0000.0553.0080',
        'SCAN: __ 0001.0000.0554.0550',
        'SCAN: __ 0012.0000.0553.0030',
        'SCAN: __ 0100.0000.0554.0080',
        'SCAN: __ 0020.0000.0553.0080',
        'INITIALIZING VECTOR SEQUENCE: PIVOT THROUGH NETWORK GATEWAYS'
        // 'ACCESSING DEEP SCAN PROTOCOLS FOR GLOBAL LAUNCH SITES...',
        // 'ENCRYPTED CHANNEL OPEN: LAUNCH SITE COORDINATES TRANSFER INITIATED',
        // 'HACKING SATELLITE COMM: INTERCEPTING GLOBAL COMMUNICATIONS...',
        // 'LAUNCH SITE DETECTED: ENCRYPTING COORDINATES FOR ANONYMIZATION',
        // 'DEPLOYING NETWORK SNIFFERS... SEARCHING FOR VULNERABLE BACKDOORS...',
        // 'FOUND VULNERABILITY: LAUNCH SITE GATEWAY 192.168.1.1 - EXPLOITING...',
        // 'CRACKING RSA ENCRYPTION KEYS THROUGH QUANTUM ALGORITHM',
        // 'LAUNCH SITE SERVER ROOT ACCESS GRANTED - EXTRACTING FILES',
        // 'INTERCEPTING TRANSMISSIONS: AUTH CODES FOR LAUNCH CONFIRMED',
        // 'OVERRIDE IN PROGRESS... LAUNCH CODES BEING MODIFIED',
        // 'NETWORK INFILTRATION COMPLETE - ACCESSING STRATEGIC MAPS',
        // 'DOWNLOADING LAUNCH PROTOCOLS AND FLIGHT PATHS',
        // 'BYPASSING SECURITY - INITIATING CYBER DEFENSE SHUTDOWN',
        // 'DEPLOYING MALWARE TO MASK INTRUSION FOOTPRINTS',
        // 'EXECUTING FINAL PHASE: LAUNCH SITE CONTROL OVERRIDE',
        // 'GLOBAL NETWORK ALERT: MULTIPLE LAUNCH SITES COMPROMISED',
        // 'CREATING LOGICAL BOMBS FOR AUTO DELETION OF TRACES',
        // 'MISSION ACCOMPLISHED: NEW LAUNCH SITES ADDED TO DATABASE'
      ]
    }
  },
  mounted() {
    this.intervalId = setInterval(this.updateScreen, 200)
  },
  beforeUnmount() {
    clearInterval(this.intervalId)
  },
  methods: {
    updateScreen() {
      this.txt.push(this.txt.shift()) // Shuffle the "txt" array
      this.lines = [...this.txt] // Update lines array to trigger reactivity
    }
  }
}
</script>
<style scoped lang="scss">
body {
  margin: 0;
  padding: 5vh 5vw;
  background: black;
  overflow: hidden;
}

* {
  box-sizing: border-box;
}

.ipScanner {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 25vmin;
  height: 30vmin;
}

p {
  font-family: monospace;
  font-weight: bold;
  font-size: 1.1vh;
  margin: 0;
  padding: 0;
  line-height: 1;
  color: #0ff; //limegreen;
  text-shadow: 0px 0px 10px #0ff; //limegreen;
}

.msg {
  font-family: monospace;
  font-weight: bold;
  text-transform: uppercase;
  font-size: 1vh;
  padding-top: 5vh;
  // background: red;
  // box-shadow: 0 0 30px red;
  text-shadow: 0 0 20px white;
  color: white;
  width: 20vw;
  height: 15vh;
  position: absolute;
  left: 50%;
  margin-left: -10vw;
  top: 50%;
  margin-top: -5vh;
  text-align: center;
  min-width: 200px;
  animation-name: blink;
  animation-duration: 0.6s;
  animation-iteration-count: infinite;
  animation-direction: alternate;
  animation-timing-function: linear;
}

@keyframes blink {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}
</style>
