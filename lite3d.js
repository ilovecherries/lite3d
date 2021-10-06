const ZORDER = 0.025 / 4

// these are for the camera i think
var cx=-40, cy=20, cz=-80, rx=60, ry=0, rz=0

// also another awful thing i did in order to not cause conflict with rx, ry,
// rz being used for the camera was that i made all of those variables have
// an underscore in the functions lol

const outline = true
const wireframe = true

function degToRad(x) {
		return x * (Math.PI / 180)
}

// xyz coords, xyz origin, xyz rotation
function DrawTri3D(ctx, x1, y1, z1, x2, y2, z2, x3, y3, z3, ox, oy, oz, _x, _y, _z) {
		var x = [0, 0, 0], y = [0, 0, 0], z = [0, 0, 0]
		x[0] = x1 ; x[1] = x2 ; x[2] = x3;
		y[0] = y1 ; y[1] = y2 ; y[2] = y3;
		z[0] = z1 ; z[1] = z2 ; z[2] = z3;
		for (var i = 0; i < 3; i++) {
				x[i] -= ox ; y[i] -= oy ; z[i] -= oz;
				[x[i], z[i]] = RotMath(_x, x[i], z[i]);
				[x[i], y[i]] = RotMath(_y, x[i], y[i]);
				[z[i], y[i]] = RotMath(_z, z[i], y[i]);
				x[i] += ox ; y[i] += oy ; z[i] += oz;
				// coords
				x[i] -= cx ; y[i] -= cy ; z[i] -= cz;
				// rotation
				[x[i], z[i]] = RotMath(rx, x[i], z[i]);
				[x[i], y[i]] = RotMath(ry, x[i], y[i]);
				[z[i], y[i]] = RotMath(rz, z[i], y[i]);				
		}
		// i will only support this... seeing how i never actually used the
		// filled triangle in my rendering since it looked ugly
		if (wireframe || outline) {
				for (var i = 2; i >= 0; i--) {
						var j = (i + 1) % 3
						ctx.beginPath()
						ctx.strokeStyle = 'black'
						ctx.moveTo(200 + SD(x[i], (z[i]*ZORDER)), 120+SD(y[i], (z[i]*ZORDER)))
						ctx.lineTo(200 + SD(x[j], (z[j]*ZORDER)), 120+SD(y[j], (z[j]*ZORDER)))
						ctx.stroke()
				}
		}
}

function DrawPrism(ctx, x, y, z, p, sd, h, rx, ry, rz) {
		var sl = p/sd, a = sl/(2*Math.tan(Math.PI/sd))
		for (var i = sd; i >= 0; i--) {
				var r = degToRad(i*(360/sd)+45)
				var jx = Math.cos(r)*a+x, jy=Math.sin(r)*r+y
				var px = Math.cos(r+degToRad(360/sd))*a+x
				var py = Math.sin(r+degToRad(360/sd))*a+y
				DrawTri3D(ctx, x, y, z+h/2, jx, jy, z+h/2, px, py, z+h/2, x, y, z, rx, ry, rz)
				DrawTri3D(ctx, px, py, z+h/2, jx, jy, z+h/2, px, py, z+h/2, x, y, z, rx, ry, rz)
				DrawTri3D(ctx, jx, jy, z+h/2, jx, jy, z+h/2, px, py, z+h/2, x, y, z, rx, ry, rz)
				// why did i do this twice lol
				DrawTri3D(ctx, x, y, z+h/2, jx, jy, z+h/2, px, py, z+h/2, x, y, z, rx, ry, rz)
		}
}

function MovCam(x, y, z, _x, _y, _z) {
		cx += x ; cy += y ; cz += z
		rx += _x ; ry += _y ; rz += _z
}

function RotMath(ang, x, y) {
		var r = degToRad(ang)
		var s = Math.sin(r), c = Math.cos(r)
		return [x*c-y*s, y*c+x*s]
}

// i think this stood for safe divide
function SD(a, b) {
		if (b == 0) return 0
		return a / b
}

// ok now let's draw to the canvas !!!

var r = 0

function draw() {
		var ctx = document.getElementById('canvas').getContext('2d')
		r += 1
		ctx.globalCompositeOperation = 'destination-over';
		ctx.clearRect(0, 0, 400, 240); // clear canvas
		DrawPrism(ctx, 0, 30, 0, 190, 4, 100, 0, r, 0)
		DrawTri3D(ctx, 3, 0, 9, -3, 0, 3, 0, -3, 3, 1, 1, 1, 0, r, 0)
		window.requestAnimationFrame(draw)
}

// window.requestAnimationFrame(draw)

draw()
