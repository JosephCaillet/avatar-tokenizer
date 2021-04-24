window.onload = main

function main() {
	let border = document.querySelector("#border")
	let avatar = document.querySelector("#avatar2")

	let canvas = document.querySelector("canvas")

	let w = canvas.width = border.naturalWidth
	let h = canvas.height = border.naturalHeight

	let zoom = 1.1
	let rotate = 15
	let offsetX = -20
	let offsetY = -10
	let x = w/2-w/2*zoom + offsetX
	let y = h/2-h/2*zoom + offsetY

	let ctx = canvas.getContext("2d")

	// ctx.imageSmoothingEnabled = false // add option to turn this off ?
	ctx.save()

	ctx.translate(w/2, h/2)
	ctx.rotate((Math.PI / 180) * rotate)
	ctx.translate(-w/2, -h/2)

	ctx.drawImage(avatar, x, y, w*zoom, h*zoom) // does an optimisation for zoom=1 may be usefull?

	ctx.restore()

	ctx.drawImage(border, 0, 0)
}