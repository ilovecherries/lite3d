# This is just an example to get you started. A typical binary package
# uses this file as the main entry point of the application.

from math import degToRad, sin, cos, tan
from sugar import collect
import nimraylib_now


const
  ZO = 0.025 / 4
  WIDTH = 400
  HEIGHT = 240

  
type
  LiteCamera = object
    position: Vector3
    rotation: Vector3
  Triangle = array[3, Vector3]
  Prism = object
    triangles: seq[Triangle]
    rotation: Vector3


proc `+`(v1: Vector3, v2: Vector3): Vector3 =
  return Vector3(
    x: v1.x + v2.x,
    y: v1.y + v2.y,
    z: v1.z + v2.z
  )

  
proc `-`(v1: Vector3, v2: Vector3): Vector3 =
  return Vector3(
    x: v1.x - v2.x,
    y: v1.y - v2.y,
    z: v1.z - v2.z
  )
  
  
proc `+=`(v1: var Vector3, v2: Vector3) =
  v1.x += v2.x
  v1.y += v2.y
  v1.z += v2.z


proc `-=`(v1: var Vector3, v2: Vector3) =
  v1.x -= v2.x
  v1.y -= v2.y
  v1.z -= v2.z


proc `//`(f: SomeNumber, f2: SomeNumber): SomeNumber =
  if f2 == 0:
    return 0
  else:
    return f / f2

    
proc draw(camera: LiteCamera, triangle: Triangle, rotation: Vector3) =
  let
    ox = WIDTH / 2
    oy = HEIGHT / 2
  var points = collect(newSeqOfCap(3)):
    for i in triangle:
      let zoom = i.z * ZO
      Vector2(x: ox + (i.x // zoom), y: oy + (i.y // zoom))
  echo points
  drawTriangle(points[0], points[1], points[2], Black)
  echo "hello"
  
  
proc rotate(vec: Vector3, axis: Vector3): Vector3 =
  func calc(ang: float, x: float, y: float): (float, float) =
    let
      r = degToRad(ang)
      s = sin(r)
      c = cos(r)
    return (x*c-y*s, y*c+x*s)
  result = vec
  (result.x, result.z) = calc(axis.x, result.x, result.z)
  (result.x, result.y) = calc(axis.y, result.x, result.y)
  (result.z, result.y) = calc(axis.z, result.z, result.y)

  
when isMainModule:
  initWindow(WIDTH, HEIGHT, "lite3d")
  let triangle: Triangle = [
    Vector3(x: 45, y: 45, z: 0),
    Vector3(x: -45, y: 45, z: 0),
    Vector3(x: 0, y: -45, z: 15)
  ]

  let camera = LiteCamera()
  
  while not windowShouldClose():
    beginDrawing:
      clearBackground(RayWhite)
      camera.draw(triangle, Vector3())
      
  closeWindow()
  
