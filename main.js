window.onload = main

function main() {
	let border = document.querySelector("#border")
	// let avatar = document.querySelector("#avatar1")
	let avatar = document.querySelector("#avatar2")

	let canvas = document.querySelector("canvas")

	let drawBorder = false
	let circularCorp = true
	let circularCropRadius = 0
	let zoom = 1.1
	let rotate = 15
	let offsetX = -20
	let offsetY = -10

	let w = canvas.width = drawBorder ? border.naturalWidth : avatar.naturalWidth // this second option may generate problems if circularCrop is enabled :/
	let h = canvas.height = drawBorder ? border.naturalHeight : avatar.naturalHeight

	let x = w / 2 - w / 2 * zoom + offsetX
	let y = h / 2 - h / 2 * zoom + offsetY

	let ctx = canvas.getContext("2d")

	// ctx.imageSmoothingEnabled = false // add option to turn this off ?
	ctx.save()

	ctx.translate(w / 2, h / 2)
	ctx.rotate((Math.PI / 180) * rotate)
	ctx.translate(-w / 2, -h / 2)

	if (circularCorp) {
		ctx.save()
		ctx.beginPath()
		circularCorp = w/2
		ctx.arc(w / 2, h / 2, circularCorp, 0, 2 * Math.PI)
		ctx.clip()
	}

	ctx.drawImage(avatar, x, y, w * zoom, h * zoom) // does an optimisation for zoom=1 may be usefull?

	ctx.restore()

	if (circularCorp) {
		ctx.restore()
	}

	if (drawBorder) {
		ctx.drawImage(border, 0, 0)
	}
}