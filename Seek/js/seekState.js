/**
 * Created by pablo-user on 18/04/16.
 */

/*
SIEMPRE ME MUEVO A LA MAXIMA VELOCIDAD
Formulas para el seek behavior

 1. vector(desired velocity) = (target position) – (vehicle position)   :  se crea un vector desde el vehiculo hasta el target
 2. normalize vector(desired velocity)                                  :  se normaliza dicho vector, es decir, se lo lleva a un vector unitario con dicho sentido
 3. scale vector(desired velocity) to maximum speed                     :  se le da la magnitud de la maxima velocidad. Multiplicar por un scalar
 4. vector(steering force) = vector(desired velocity) – vector(current velocity)  se calcula la fuerza que dirigira el vehiculo al target.
 5. limit the magnitude of vector(steering force) to maximum force                se limita la fuerza a una maxima fuerza
 6. vector(new velocity) = vector(current velocity) + vector(steering force)      se calcula el nuevo vector de velocidad para el vehiculo
 7.  se la limita a la maxima velocidad
 */

    var game = new Phaser.Game(
        1024, 600, Phaser.AUTO, 'gameDiv',
        {preload: preload, create: create, update: update}
    );

    var vecReference = new Phaser.Point(0, 0);

    var misil;

    var target;


    function preload() {
        game.load.image('misil', 'assets/misil.png');
        game.load.image('target', 'assets/target.png');
    }

    function create(){
        game.stage.backgroundColor = "#FFFFFF";
        game.physics.startSystem(Phaser.Physics.ARCADE);

        misil = game.add.sprite(game.world.centerX, game.world.centerY, 'misil');
        misil.anchor.setTo(0.5, 0.5);
        misil.scale.setTo(0.2, 0.2);
        game.physics.enable(misil, Phaser.Physics.ARCADE);

        misil.MAX_SPEED = 300;
        misil.MAX_STEER = 4;
        misil.MAX_SPEED_SQ = misil.MAX_SPEED * misil.MAX_SPEED;
        misil.MAX_STEER_SQ = misil.MAX_STEER * misil.MAX_STEER;
        misil.body.collideWorldBounds = true;
        target = game.add.sprite(game.input.x, game.input.y, 'target');
        target.anchor.setTo(0.5, 0.5);
        target.scale.setTo(0.5,0.5);
    }

    function update(){
        target.position.setTo(game.input.x, game.input.y);

        seek(misil, target);
    }

     function seek(vehiculo, objetivo){
         //Obtengo la desired velocity

         var vectorDesired;
         vectorDesired = calcularDesiredVelocity(vehiculo, objetivo);

         //Obtengo el vector de fuerza
         var vectorSteeringForce;
         vectorSteeringForce = calcularSteeringForce(vehiculo, vectorDesired);

         //aplico el vector de fuerza al vehiculo

         aplicarVectorDeFuerza(vehiculo,vectorSteeringForce);

         vehiculo.rotation = vecReference.angle(vehiculo.body.velocity);
    }

function calcularDesiredVelocity(vehiculo,objetivo) {
     // Calculo el vector deseado = normalizado(POSICION TARGET - POSICION VEHICULO) * maximaVelocidad

     var vectorDesired;
     vectorDesired = ((Phaser.Point.subtract(objetivo.position, vehiculo.position)).normalize()).multiply(vehiculo.MAX_SPEED, vehiculo.MAX_SPEED);

     return vectorDesired;
 }

function calcularSteeringForce(vehiculo,vectorDesired){

    //Calculo el vector de fueza = vector deseado - velocidad actual del vehiculo
//steering = steering / mass la masa como se calucula???

    var vectorSteeringForce;
    vectorSteeringForce = Phaser.Point.subtract(vectorDesired, vehiculo.body.velocity);

//limito la magnitud del vector, es decir la fuerza que se le va a aplicar
    if (vectorSteeringForce.getMagnitudeSq() > vehiculo.MAX_STEER_SQ){
        vectorSteeringForce.setMagnitude(vehiculo.MAX_STEER);
    }
    return vectorSteeringForce;
}

function aplicarVectorDeFuerza(vehiculo,vectorSteeringForce){

    //Calculo la nueva velocidad y posicion del vehiculo sumando la posicion con el vector de fuerza
    vehiculo.body.velocity.add(vectorSteeringForce.x, vectorSteeringForce.y);

    //si la velocidad nueva es mayor a la maxima velocidad determinada, se deja la maxima.
    if (vehiculo.body.velocity.getMagnitudeSq() > vehiculo.MAX_SPEED_SQ){
        vehiculo.body.velocity.setMagnitude(vehiculo.MAX_SPEED);
    }
}