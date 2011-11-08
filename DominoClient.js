/**
* @author Paul Allen http://www.paulallen.com.jm
*/
(function(window, undefined){
	
var document = window.document;

var DominoClient = function(cards){

  this.cards = cards;
   
};
	
DominoClient.cardNames = {
		
		0: 'blank',
		1: 'one',
		2: 'two',
		3: 'three',
		4: 'four',
		5: 'five',
		6: 'six',
}
	
DominoClient.prototype.createCard = function(one, two) {
	var node = document.createElement("div");
	var cardString = 'domino ' + DominoClient.cardNames[one] + ' ' + DominoClient.cardNames[two];
	node.appendChild( document.createTextNode( cardString ) );
	node.setAttribute('class', cardString );
	return node;
}

window.DominoClient = DominoClient;

})(window);

