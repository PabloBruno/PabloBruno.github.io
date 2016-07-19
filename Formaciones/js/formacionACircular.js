var game = new Phaser.Game(800, 600, Phaser.AUTO, 'divGame', {preload: preload, create: create, update: update});


function preload() {
    game.load.image('lider', 'assets/nave1.png');
    game.load.image('seguidor', 'assets/nave2.png');
}

var lider;
var seguidor = [];
var cursors;
var modo = true;
max_speed = 500;
max_force = 60;
min_speed = 0;
min_distance = 30;
max_distance = 50;
distancia_limite = 60;
var angulo;
var r = 10;      //130
var killKey, cambiarModo, nuevosSeguidores;


function create() {
    game.physics.startSystem(Phaser.Physics.ARCADE);

    lider = game.add.sprite(game.world.centerX, game.world.centerY, 'lider');

    game.physics.enable(lider, Phaser.Physics.ARCADE);
    lider.anchor.setTo(0.5, 0.5);
    lider.scale.setTo(0.6, 0.6);
    lider.body.collideWorldBounds = true;

    var n;

    var seguidorN;

    for (n = 0; n < 10; n++) {
        seguidorN = new Behavior_Separation(game, Math.random() * 800, Math.random() * 600, 'seguidor', 3, null);
        game.physics.enable(seguidorN, Phaser.Physics.ARCADE);
        seguidorN.sprite.anchor.setTo(0.5, 0.5);
        seguidorN.sprite.scale.setTo(0.6, 0.6);
        seguidor.push(seguidorN);
    }

    cursors = game.input.keyboard.createCursorKeys();
    killKey = game.input.keyboard.addKey(Phaser.Keyboard.Z);
    cambiarModo = game.input.keyboard.addKey(Phaser.Keyboard.C);
    nuevosSeguidores = game.input.keyboard.addKey(Phaser.Keyboard.X);

    angulo = 360 / seguidor.length;


}

function update() {

    lider.body.velocity.x = 0;
    lider.body.velocity.y = 0;
    lider.body.angularVelocity = 0;


    if (game.input.keyboard.isDown(Phaser.Keyboard.LEFT)) {
        lider.body.angularVelocity = -200;
    }
    else if (game.input.keyboard.isDown(Phaser.Keyboard.RIGHT)) {
        lider.body.angularVelocity = 200;
    }

    if (game.input.keyboard.isDown(Phaser.Keyboard.UP)) {
        game.physics.arcade.velocityFromAngle(lider.angle, 40, lider.body.velocity);
    }

    killKey.onDown.add(kill, this);

    for (var n = 0; n < seguidor.length; n++) {
        seguidor[n].sprite.update();

    }

    if (seguidor.length > 1) {
        var dis = distanciaEntre(seguidor[0], seguidor[1].sprite.body.x, seguidor[1].sprite.body.y);
        if (dis < distancia_limite) {
            r = ((distancia_limite) / (Math.sin((angulo / 2) * Math.PI / 180)));
        }
    }


    cambiarModo.onDown.add(modoInverso, this);
    nuevosSeguidores.onDown.add(añadirSeguidor, this);

    if (modo)
        AFormation(lider, seguidor);
    else
        circularFormation(lider, seguidor);

//    separation(lider, seguidor);

}

modoInverso = function () {
    modo = !modo
}

function isEven(value) {
    return (value % 2 == 0);
}

kill = function () {
    seguidor[0].sprite.kill();
    seguidor.splice(0, 1);
    cantElementos--;
    vector.splice(0, 1);
    angulo = 360 / seguidor.length;
    console.log(seguidor.length)

}

añadirSeguidor = function () {
    var seguidorN = new Behavior_Separation(game, Math.random() * 800, Math.random() * 600, 'seguidor', 3, null);

    game.physics.enable(seguidorN, Phaser.Physics.ARCADE);
    seguidorN.sprite.anchor.setTo(0.5, 0.5);
    seguidorN.sprite.scale.setTo(0.6, 0.6);
    seguidorN.sprite.angle = lider.angle;
    seguidor.push(seguidorN);

    angulo = 360 / seguidor.length;

    console.log(seguidor.length)

}


function AFormation (lider, seguidores){

    var angulo1 = 240 + lider.angle;  //para hacer la ormacion en a
    var angulo2 = 120 + lider.angle;
    var anguloNuevo = angulo1;
    var distanciaN = 0;
    var n, inicio = 0;
    for (n = inicio; n < seguidor.length; n++) {
        if (isEven(n)) {
            anguloNuevo = angulo1;
            distanciaN += 100;
            // console.log(distanciaN);
        } else {
            anguloNuevo = angulo2;
        }
        var x = lider.x + (distanciaN * Math.cos((anguloNuevo * Math.PI) / 180));

        var y = lider.y + (distanciaN * Math.sin((anguloNuevo * Math.PI) / 180));
        seguidores[n].sprite.body.angularVelocity = lider.body.angularVelocity;

        arrive(seguidores[n], x, y);

    }

}

function circularFormation(lider,seguidores){

var anguloNuevo=lider.angle;
var n;
    for (n=0;n<seguidor.length;n++)
    {
        
        //anguloNuevo=angulo*n;
        var x = lider.x + (r * Math.cos( (anguloNuevo*Math.PI)/180));

        var y = lider.y +(r * Math.sin((anguloNuevo*Math.PI)/180 ));

       // seguidores[n].sprite.rotationDirection.x=x;
       // seguidores[n].sprite.body.rotation=y;
        seguidores[n].sprite.body.angularVelocity=lider.body.angularVelocity;
        arrive(seguidores[n],x,y);
anguloNuevo+=angulo;

    }
}

function separationSeguidores(seguidores) {


    for (var i = 0; i < seguidores.length; i++)
    {
        var vectorSeparation = new Phaser.Point(0,0);
        var cant_invasores = 0;
        //var =[];

        for (var n=0; n <seguidores.length; n++) {
            var target=seguidores[i];
        if (this !== target)
        {
            //console.log(this.sprite.body);
            
            var distancia = this.distanciaEntre(target);
            //console.log(distancia);
            if (distancia < this.max_distance)
            {
                //aca tiene q reducir
                //vectorSeparation = Phaser.Point.subtract(this.sprite.position, target.sprite.position);
                //vectorSeparation = vectorSeparation.add(vectorSeparation.x, vectorSeparation.y);

                vectorSeparation.x += target.sprite.body.x - this.sprite.body.x;

                vectorSeparation.y += target.sprite.body.y - this.sprite.body.y;
                
                vectorSeparation.x *=-1;
                vectorSeparation.y *=-1;
                //this.sprite.body.velocity.x+=vectorSeparation.x;
                //this.sprite.body.velocity.y+=vectorSeparation.y;
                //vecinos++;
                vectorSeparation = vectorSeparation.normalize();
                vectorSeparation.x*=distancia;
                //console.log(this.max_distance/distancia);
                vectorSeparation.y*=distancia;
            }
        }
        }
        if (cant_invasores != 0){
            vector_alejamiento.x /= cant_invasores;
            vector_alejamiento.y /= cant_invasores;
            // vector_alejamiento.multiply(-1,-1);
            vector_alejamiento.normalize().multiply(max_force,max_force);
        }
        seguidores[i].body.velocity=vector_alejamiento;

    }

}



function separation(lider, seguidores) {

    var vector_alejamiento = new Phaser.Point(0, 0);
    var cant_integrantes = seguidores.length;

    var cant_invasores = 0;
    var n;
    var posInvasores=[];
    for (n = 0; n < cant_integrantes; n++) {
        if (this.invade_mi_area(lider,seguidores[n])) {
            toAgent = Phaser.Point.subtract(seguidores[n].sprite.body.position, lider.body.position)
            vector_alejamiento.add(toAgent.x, toAgent.y);
            cant_invasores++;
            posInvasores.push(n);
        }

    }

    if (cant_invasores != 0) {
        vector_alejamiento.x /= cant_invasores;
        vector_alejamiento.y /= cant_invasores;
        vector_alejamiento.normalize();
    }
    for (n = 0; n < posInvasores.length; n++) {
        seguidores[posInvasores[n]].sprite.body.velocity.add(vector_alejamiento.x * max_force, vector_alejamiento.y* max_force);
    }

}

function invade_mi_area (sprite1,compa){
      var invade = false;

        if (Phaser.Point.distance(sprite1.body.position,compa.sprite.body.position) <= distancia_limite){
            invade = true;
        }
        return invade;
    }



function arrive(seguidor,x,y){
    //Obtengo la desired velocity
    var vectorDesired;
    vectorDesired = calcularDesiredVelocity(seguidor,x,y);

    //Obtengo el vector de fuerza
    var vectorSteeringForce;
    vectorSteeringForce = calcularSteeringForce(vectorDesired,seguidor);

    //aplico el vector de fuerza al this.sprite
    aplicarVectorDeFuerza(vectorSteeringForce,seguidor);

    //  this.sprite.rotation = vecReference.angle(this.sprite.body.velocity);
}

function calcularDesiredVelocity(seguidor,x,y) {
    // Calculo el vector deseado = normalizado(POSICION TARGET - POSICION this.sprite) * maximaVelocidad

    var distancia=distanciaEntre(seguidor,x,y);
    
    var angle = angleBetween(seguidor,x,y);       //
    //console.log(angle);
    var vectorDesired=seguidor.sprite.body.velocity;
    if(distancia<max_distance)
    {
        //aca tiene q reducir
        vectorDesired = ((Phaser.Point.subtract((new Phaser.Point(x,y)), seguidor.sprite.position)).normalize()).multiply(distancia, distancia);
    }
    else
    {
        vectorDesired = ((Phaser.Point.subtract((new Phaser.Point(x,y)), seguidor.sprite.position)).normalize()).multiply(max_speed, max_speed);
    }
//    console.log(vectorDesired);
    return vectorDesired;
}

function calcularSteeringForce (vectorDesired,seguidor){

    //Calculo el vector de fueza = vector deseado - velocidad actual del sprite
//steering = steering / mass la masa como se calucula???

    var vectorSteeringForce;
    vectorSteeringForce = Phaser.Point.subtract(vectorDesired, seguidor.sprite.body.velocity);


    //limito la magnitud del vector, es decir la fuerza que se le va a aplicar
    if (vectorSteeringForce.getMagnitudeSq() > (max_force*max_force))
    {
        vectorSteeringForce.setMagnitude(max_force);
    }
    //console.log(vectorSteeringForce);
    return vectorSteeringForce;
}

function aplicarVectorDeFuerza(vectorSteeringForce,seguidor) {

    //Calculo la nueva velocidad y posicion del sprite sumando la posicion con el vector de fuerza
    seguidor.sprite.body.velocity.add(vectorSteeringForce.x, vectorSteeringForce.y);

    //si la velocidad nueva es mayor a la maxima velocidad determinada, se deja la maxima.
    if (seguidor.sprite.body.velocity.getMagnitudeSq() > (max_speed * max_speed)) {
        seguidor.sprite.body.velocity.setMagnitude(max_speed);
    }
}

function distanciaEntre(seguidor,x,y){
    var dx = x - seguidor.sprite.x;
    var dy = y - seguidor.sprite.y;
    return Math.sqrt((dx * dx) + (dy * dy));
}

function angleBetween(seguidor,x,y) {
    var dx = x - seguidor.sprite.x;
    var dy = y - seguidor.sprite.y;

    return Math.atan2(dy, dx);
 }