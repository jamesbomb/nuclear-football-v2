<template>
	<div
		class="modalTermination"
		@keydown="handleKeyPress"
		tabindex="0"
	>
		<div class="modal-content pulsing-box-shadow">
			<h2>Disarmare le testate? 🚀</h2>
			<p>Premere S/N</p>
		</div>
	</div>
</template>

<script>
export default {
	name: "TerminateNavigationModal",
	data: () => {},
	mounted() {
		this.$el.focus();
	},
	methods: {
		handleKeyPress(event) {
		if (event.key === "s" || event.key === "S") {
			this.$emit("closeModal");
			this.$emit("abort");
		} else if (event.key === "n" || event.key === "N") {
			this.$emit("closeModal");
		}
	},
	},
};
</script>

<style scoped>
.modalTermination {
	position: fixed;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	color: white;
	display: flex;
	justify-content: center;
	align-items: center;
	border-radius: 15px;
}
.modal-content {
	padding: 20px;
	border-radius: 5px;
	text-align: center;
	background-color: rgba(255, 255, 255, 0.1);
}
h2 {
	font-size: 3rem;
}
p {
	font-size: 2rem;
}
@keyframes boxShadowPulse {
	0% {
		box-shadow: 0 0 31px 20px yellow;
	}
	50% {
		box-shadow: 0 0 50px 30px yellow;
	}
	100% {
		box-shadow: 0 0 31px 20px yellow;
	}
}

.pulsing-box-shadow {
	box-shadow: 0 0 31px 20px yellow;
	animation: boxShadowPulse 1.5s ease-in-out infinite;
}
</style>
