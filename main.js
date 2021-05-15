window.onload = main

let refreshInProcess = false

let avatar, border

function main() {
	initSettings()
	updateCanvas()

	document.querySelectorAll(".params input[type=checkbox]").forEach(i => {
		if (refreshInProcess) {
			return
		}
		i.addEventListener("click", updateCanvas)
	})

	document.querySelectorAll(".params input[type=range], .params input[type=color]").forEach(i => {
		i.addEventListener("input", e => {
			if (refreshInProcess) {
				return
			}
			let label = document.querySelector(`label[for="${e.target.id}"] span`)
			if (label) {
				label.innerHTML = e.target.value
			}
			updateCanvas()
		})
	})
}


function initSettings() {
	refreshInProcess = true

	border = document.querySelector("#border")
	// let avatar = document.querySelector("#avatar1")
	// let avatar = document.querySelector("#avatar2")

	avatar = document.querySelector("#avatar3")


	let canvas = document.querySelector("canvas")
	let cropRadius = document.querySelector("#circularCropRadius")
	cropRadius.value = cropRadius.max = canvas.width / 2

	document.querySelector("#zoom").value = 1
	document.querySelector("#rotation").value = 0

	// Will only work if zoom value set to 1, have to be fixed later :/
	let offsetX = document.querySelector("#offsetX")
	offsetX.value = 0
	offsetX.max = avatar.naturalWidth - 1
	offsetX.min = -avatar.naturalWidth + 1

	let offsetY = document.querySelector("#offsetY")
	offsetY.value = 0
	offsetY.max = avatar.naturalHeight - 1
	offsetY.min = -avatar.naturalHeight + 1

	refreshInProcess = false
}

function updateCanvas() {
	let canvas = document.querySelector("canvas")

	let drawBorder = document.querySelector("#drawBorder").checked
	let circularCrop = document.querySelector("#circularCrop").checked
	let circularCropRadius = document.querySelector("#circularCropRadius").value
	let backgroundColor = document.querySelector("#backgroundColor").checked ? document.querySelector("#backgroundColorValue").value : null
	let antiAliasing = document.querySelector("#antiAliasing").checked
	let zoom = document.querySelector("#zoom").valueAsNumber
	let rotation = document.querySelector("#rotation").valueAsNumber
	let offsetX = document.querySelector("#offsetX").valueAsNumber
	let offsetY = document.querySelector("#offsetY").valueAsNumber

	// Set to 512 by default in HTML, have to update in the future to adapt to various file size when file picker will be implemented.
	let canvasWidth = canvas.width //= drawBorder ? border.naturalWidth : avatar.naturalWidth // this second option may generate problems if circularCrop is enabled :/
	let canvasHeight = canvas.height //= drawBorder ? border.naturalHeight : avatar.naturalHeight
	let avatarWidth = avatar.naturalWidth
	let avatarHeight = avatar.naturalHeight

	let x = canvasWidth / 2 - avatarWidth / 2 * zoom
	let y = canvasHeight / 2 - avatarHeight / 2 * zoom

	let ctx = canvas.getContext("2d")

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

	ctx.translate(canvasWidth / 2 + offsetX, canvasHeight / 2 + offsetY)
	ctx.rotate((Math.PI / 180) * rotation)
	ctx.translate(-canvasWidth / 2, -canvasHeight / 2)

	ctx.drawImage(avatar, x, y, avatarWidth * zoom, avatarHeight * zoom)

	while (restoreCount) {
		ctx.restore()
		restoreCount--
	}

	if (drawBorder) {
		ctx.drawImage(border, 0, 0)
	}
}