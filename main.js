window.onload = main

function main() {
	let border = document.querySelector("#border")
	let avatar = document.querySelector("#avatar2")

	let canvas = document.querySelector("canvas")

	let w = canvas.width = border.naturalWidth
	let h = canvas.height = border.naturalHeight

	let zoom = 1.1
	let offsetX = 0
	let offsetY = 0
	let x = w/2-w/2*zoom + offsetX
	let y = h/2-h/2*zoom + offsetY

	let ctx = canvas.getContext("2d")

	// ctx.imageSmoothingEnabled = false // add option to turn this off ?

	ctx.drawImage(avatar, x, y, w*zoom, h*zoom) // does an optimisation for zoom=1 may be usefull?

	ctx.drawImage(border, 0, 0)
}