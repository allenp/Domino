/**
@author Paul Allen http://paulallen.com.jm
**/


(function(window, undefined){

var DominoGame = function() {
	this.gameid = null;
	this.deck = [];
	this.players = [];
	this.currentPlayer = null;
	this.tableOfPlays = [];
	
	//initialize the deck
	var d = 0;
	for(l = 0; l <= 6; ){ //i love you
		for(r = l; r <= 6; r++, d++){
			this.deck[d] = new DominoGame.Domino(l,r);
		}
		l++;
	}
	this.nextStep = function(){ }
};

DominoGame.prototype.shuffle = function(){
	var temp = null;
	for(i = 0; i < 28; i++){
	  r = Math.floor(Math.random() * 28);
	  temp = this.deck[r]; this.deck[r] = this.deck[i];
	  this.deck[i] = temp;
	}
}

DominoGame.prototype.deal = function(){
	if(this.players.length != 4){
		for(i = 0; i < 4; i++){
		  this.players[i] = new Player( i, null, this.deck.slice(i*7, (i*7)+7) );
		}
	}
}

DominoGame.WhichPlayer = function()[
  return this.currentPlayer;
}
 
DominoGame.MakePlay = function( player, playercard, playercardside, tablecard, tablecardside ){

}

/*!

 Domino Object
 
*/
DominoGame.Domino = function( left, right ) {

	//immutable properties of the domino
	if(left < 0 || left > 6 || right < 0 || right > 6) {
		throw new Error("Invalid arguments supplied for domino: (0 - 6)");
	}
	
	this.left = function(){ return left; }
	this.right = function(){ return right; }
	
	
}

DominoGame.Domino.prototype.canMatch = function(left, right) {
  l = this.left();
  r = this.right();
  return l === left || l === right || r === left || r === right;
}

/*!

Player Object

*/
function Player( /* int */ id, /* string */ name, /* array */ cards ) {
  this.id = id || 1;
  this.name = name || "Player " + this.id;
  this.cards = cards;
}

Player.prototype.canPlay = function(/* int */ left, /* int */ right ) {
  var count = this.cards.length;
  for(i = 0; i < count; i++){
	if(this.cards[i].canMatch(left,right)) {
	   return true;
	}
  }
  //if we get here we didnt find a match
  return false;
}

Player.prototype.has = function( card ) {
  var count = this.cards.length;
  for(i = 0; i < count; i++){
	if(this.cards[i].equals(card)){
	   return true;
	}
  }
  //if we get here we didnt find a match
  return false;
}

//expose game
window.DominoGame = DominoGame;

})(window);
