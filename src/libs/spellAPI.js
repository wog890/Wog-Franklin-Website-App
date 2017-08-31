// Private ------------------------------------------------------------------------------------

var _ = require('./underscore');

//Casting Constants
const casting = {
	INSTANTANEOUS: 0,
	RANDOM: 1
}

//Effect Constants
const effects = {
	END_GAME: 0,
	RANDOM: 1,
	REMOVE: 2
}

//Element Constants
const elements = {
	NONE: 0,
	RANDOM: 1
}

/*new Spell(id, casting, damage, effects, element, movement, name, pattern, power)*/
/*new Effect(id, fieldPos)*/
/*new Movement(start, end)*/
var spells = [
	new Spell(-1, casting.RANDOM, -1, [new Effect(effects.RANDOM), -1], elements.RANDOM, new Movement(-1, -1), 'Random', [], -1),
	new Spell(0, casting.INSTANTANEOUS, 0, [new Effect(effects.REMOVE, 1)], elements.NONE, new Movement(1, 1), 'Deflect', [2,1,4], 1),
	new Spell(1, casting.INSTANTANEOUS, 0, [new Effect(effects.END_GAME, 4)], elements.NONE, new Movement(1, 4), 'Disarm', [0,1,4,3,0], 1)
];

function Effect(id, fieldPos) {
	this.id = id;
	this.fieldPos = fieldPos;
}

function Movement(start, end) {
	this.end = end;
	this.start = start;
}

function Spell(id, casting, damage, effects, element, movement, name, pattern, power) {
	this.id = id;
	this.casting = casting;
	this.damage = damage;
	this.effects = effects;
	this.element = element;
	this.movement = movement;
	this.name = name;
	this.pattern = pattern;
	this.power = power;
}

// Public -------------------------------------------------------------------------------------

var _public = {};

_public.casting = casting;
_public.effects = effects;
_public.elements = elements;

/* 	getSpell(pattern)
	Get a spell from the provided drawn pattern.
	- pattern (Array): Array of integers representing the drawn pattern.
	- RETURN (Spell): Spell object (above function Spell) off spell with the matching pattern. If
		no spell is found the failure spell is returned.
*/
_public.getSpell = function(pattern) {
  var spell = spells[0];
  var success;
  for(var i = 0, j = spells.length; i < j; i++) {
    if (pattern.length === spells[i].pattern.length) {
      success = true;
      for (var k = 0, l = pattern.length; k < l; k++) {
        if (pattern[k] !== spells[i].pattern[k]) {
          success = false;
          break;
        }
      }
      if (success) {
        spell = spells[i];
        break;
      }
    }
  }
  return spell;
};

module.exports = _public;