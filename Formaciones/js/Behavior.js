/**
 * Clase Comportamiento
 * @param {Phaser.Game} game referencia al juego
 * @param {type} posx
 * @param {type} posy
 * @param {type} key
 * @param {type} frame
 * @param {type} target
 * @returns {Behavior}
 */

function Behavior(game, posx, posy, key, frame, target) {
    /**
     * crea referencia a sprite
     */
    this.sprite = game.add.sprite(posx, posy, key)
    this.target = target;
    this.game = game;

    /*
     * agrega sprite al juego
     */
    this.game.physics.enable(this.sprite, Phaser.Physics.ARCADE);


    /**
     *  Variables utiles para el comportamiento 
     */
    this.esp_speed = 0;
    this.max_speed = 0;
    this.min_speed = 0;
    this.min_distance = 0;
    this.max_distance = 0;

    return this;


}

Behavior.prototype.constructor = Behavior;

/**
 * Metodo abstracto que deben reescribir en clase hija
 * @returns {undefined}
 */

Behavior.prototype.update = function () {

};