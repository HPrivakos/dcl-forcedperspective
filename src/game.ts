const physicsCast = PhysicsCast.instance
const input = Input.instance
const camera = new Camera()

const wall1 = new Entity()
wall1.addComponent(new BoxShape())
wall1.addComponent(
  new Transform({
    position: new Vector3(16, 4, 31),
    scale: new Vector3(32, 8, 1),
    rotation: new Vector3(0, 0, 0).toQuaternion()
  })
)
wall1.getComponentOrCreate(Material).albedoColor = Color4.Red()
engine.addEntity(wall1)

const wall2 = new Entity()
wall2.addComponent(new BoxShape())
wall2.addComponent(
  new Transform({
    position: new Vector3(31, 4, 16),
    scale: new Vector3(32, 8, 1),
    rotation: new Vector3(90, 0, 0).toQuaternion()
  })
)
wall2.getComponentOrCreate(Material).albedoColor = Color4.Blue()
engine.addEntity(wall2)

const wall3 = new Entity()
wall3.addComponent(new BoxShape())
wall3.addComponent(
  new Transform({
    position: new Vector3(16, 4, 1),
    scale: new Vector3(32, 8, 1),
    rotation: new Vector3(0, 0, 0).toQuaternion()
  })
)
wall3.getComponentOrCreate(Material).albedoColor = Color4.Green()
engine.addEntity(wall3)

const wall4 = new Entity()
wall4.addComponent(new BoxShape())
wall4.addComponent(
  new Transform({
    position: new Vector3(1, 4, 16),
    scale: new Vector3(32, 8, 1),
    rotation: new Vector3(90, 0, 0).toQuaternion()
  })
)
wall4.getComponentOrCreate(Material).albedoColor = Color4.Yellow()
engine.addEntity(wall4)

const floor = new Entity()
floor.addComponent(new BoxShape())
floor.addComponent(
  new Transform({
    position: new Vector3(16, 0, 16),
    scale: new Vector3(32, 1, 32),
    rotation: new Vector3(0, 0, 0).toQuaternion()
  })
)
floor.getComponentOrCreate(Material).albedoColor = Color4.Gray()
engine.addEntity(floor)

@Component('MindFuckComponent')
class MindFuckComponent {
  initialDistance: number = 0
  constructor(initialDistance: number) {
    this.initialDistance = initialDistance
  }
}
class MindFuckSystem {
  update(dt: number) {
    if (!ball.hasComponent(MindFuckComponent)) return
    const initialDistance = ball.getComponent(MindFuckComponent).initialDistance
    const rayFromCamera = physicsCast.getRayFromCamera(1000)

    physicsCast.hitAll(rayFromCamera, (e) => {
      const entities = e.entities.filter((a) => a.entity.entityId !== ball.uuid)
      if (entities.length === 0 || entities.length > 1) return
      const entity = entities[0]
      const scale = ball.getComponent(Transform).scale
      const vectorHitPoint = new Vector3(entity.hitPoint.x, entity.hitPoint.y, entity.hitPoint.z)
      ball.getComponent(Transform).position = vectorHitPoint
      ball.getComponent(Transform).scale.setAll(calculateDistance(camera.position, vectorHitPoint) / initialDistance)
    })
  }
}
engine.addSystem(new MindFuckSystem())

const ball = new Entity()
ball.addComponent(new SphereShape())
ball.addComponent(new Transform({ position: new Vector3(16, 2, 16), scale: new Vector3(1, 1, 1) }))
engine.addEntity(ball)
ball.addComponent(
  new OnPointerDown(
    (e) => {
      log(ball.uuid)
      if (!ball.hasComponent(MindFuckComponent))
        ball.addComponent(
          new MindFuckComponent(
            calculateDistance(camera.position, ball.getComponent(Transform).position) /
              ball.getComponent(Transform).scale.x
          )
        )
      else ball.removeComponent(MindFuckComponent)
      log(ball.hasComponent(MindFuckComponent))
    },
    { distance: 1000 }
  )
)

function calculateDistance(point1: Vector3, point2: Vector3): number {
  const x = Math.pow(point2.x - point1.x, 2)
  const y = Math.pow(point2.y - point1.y, 2)
  const z = Math.pow(point2.z - point1.z, 2)
  return Math.sqrt(x + y + z)
}
