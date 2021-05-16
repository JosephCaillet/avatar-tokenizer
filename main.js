window.onload = main

let refreshInProcess = false

let avatar
let border

let canvasWidth
let canvasHeight
let avatarWidth
let avatarHeight

function main() {
	initSettings()
	updateCanvas()

	// Listen for parameter changes
	document.querySelectorAll(".params input[type=checkbox]").forEach(i => {
		if (refreshInProcess) {
			return
		}
		i.addEventListener("click", updateCanvas)
	})

	document.querySelectorAll(".params input[type=range], .params input[type=color]").forEach(i => {
		i.addEventListener("input", e => {
			let label = document.querySelector(`label[for="${e.target.id}"] span`)
			if (label) {
				label.innerHTML = e.target.value
			}
			if (refreshInProcess) {
				return
			}
			updateCanvas()
		})
	})

	// Move avatar image in canvas on mouse drag
	let canvasDragEnabled, canvasDragX, canvasDragY, startX, startY

	document.querySelector("canvas").addEventListener("mousedown", e => {
		if (refreshInProcess) {
			return
		}
		canvasDragEnabled = true
		canvasDragX = e.screenX
		canvasDragY = e.screenY
		startX = document.querySelector("#offsetX").valueAsNumber
		startY = document.querySelector("#offsetY").valueAsNumber
	})

	document.querySelector("body").addEventListener("mouseup", e => {
		if (refreshInProcess || !canvasDragEnabled) {
			return
		}
		canvasDragEnabled = false
	})

	document.querySelector("body").addEventListener("mousemove", e => {
		if (refreshInProcess || !canvasDragEnabled) {
			return
		}
		let zoom = document.querySelector("#zoom").valueAsNumber
		document.querySelector("#offsetX").value = startX + (e.screenX - canvasDragX)/zoom
		document.querySelector("#offsetY").value = startY + (e.screenY - canvasDragY)/zoom
		// Refresh labels on offset sliders without refreshing the canvas
		refreshInProcess = true
		let event = new Event("input")
		document.querySelector("#offsetX").dispatchEvent(event)
		document.querySelector("#offsetY").dispatchEvent(event)
		updateCanvas()
		refreshInProcess = false
	})
}


function initSettings() {
	refreshInProcess = true

	border = document.querySelector("#border")
	// let avatar = document.querySelector("#avatar1")
	// let avatar = document.querySelector("#avatar2")

	avatar = document.querySelector("#avatar3")
	let canvas = document.querySelector("canvas")

	// Set to 512 by default in HTML, have to update in the future to adapt to various file size when file picker will be implemented.
	canvasWidth = canvas.width //= drawBorder ? border.naturalWidth : avatar.naturalWidth // this second option may generate problems if circularCrop is enabled :/
	canvasHeight = canvas.height //= drawBorder ? border.naturalHeight : avatar.naturalHeight
	avatarWidth = avatar.naturalWidth
	avatarHeight = avatar.naturalHeight


	let cropRadius = document.querySelector("#circularCropRadius")
	cropRadius.value = cropRadius.max = canvas.width / 2

	document.querySelector("#zoom").value = Math.min(canvasHeight / avatarHeight, canvasWidth / avatarWidth)
	document.querySelector("#rotation").value = 0

	// Will only work if zoom value set to 1, have to be fixed later :/
	let offsetX = document.querySelector("#offsetX")
	offsetX.value = 0
	offsetX.max = avatarWidth - 1
	offsetX.min = -avatarWidth + 1

	let offsetY = document.querySelector("#offsetY")
	offsetY.value = 0
	offsetY.max = avatarHeight - 1
	offsetY.min = -avatarHeight + 1

	refreshInProcess = false
}

function updateCanvas() {
	let canvas = document.querySelector("canvas")
	let ctx = canvas.getContext("2d")

	let drawBorder = document.querySelector("#drawBorder").checked
	let circularCrop = document.querySelector("#circularCrop").checked
	let circularCropRadius = document.querySelector("#circularCropRadius").value
	let backgroundColor = document.querySelector("#backgroundColor").checked ? document.querySelector("#backgroundColorValue").value : null
	let antiAliasing = document.querySelector("#antiAliasing").checked
	let zoom = document.querySelector("#zoom").valueAsNumber
	let rotation = Math.PI / 180 * document.querySelector("#rotation").valueAsNumber
	let offsetX = document.querySelector("#offsetX").valueAsNumber
	let offsetY = document.querySelector("#offsetY").valueAsNumber

	ctx.clearRect(0, 0, canvasWidth, canvasHeight)

	ctx.imageSmoothingEnabled = antiAliasing

	let restoreCount = 0

	if (circularCrop) {
		ctx.save()
		restoreCount++
		ctx.beginPath()
		ctx.arc(canvasWidth / 2, canvasHeight / 2, circularCropRadius, 0, 2 * Math.PI)
		ctx.clip()
	}

	if (backgroundColor) {
		ctx.save()
		restoreCount++
		ctx.fillStyle = backgroundColor
		ctx.fillRect(0, 0, canvasWidth, canvasHeight)
	}

	ctx.save()
	restoreCount++

	// translate to canvas center
	ctx.translate(canvasWidth / 2, canvasHeight / 2)
	// scale around canvas center
	ctx.scale(zoom, zoom)
	// Offest move
	ctx.translate(offsetX, offsetY)
	// Rotate around canvas center
	// Note: Because we do the translation before the rotation, the rotation will not be done relatively to the center of the canvas.
	// We could do operation in reverse order, but then the offset move will be done in a rotaded base.
	// As rotation is juged to be a less common operation, it has been decided to do the translation before the rotation.
	ctx.rotate(rotation)
	// Draw image in center
	ctx.drawImage(avatar, - avatarWidth / 2, - avatarHeight / 2)

	while (restoreCount) {
		ctx.restore()
		restoreCount--
	}

	if (drawBorder) {
		ctx.drawImage(border, 0, 0)
	}
}