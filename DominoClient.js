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
	
DominoClient.prototype.createCard = function(card) {
    var node = document.createElement("div");
    var cardString = 'domino ' + DominoClient.cardNames[card.left()] + ' ' + DominoClient.cardNames[card.right()];
    if(card.left() != card.right())
        if(card.orientation() > 0)
            cardString += ' ' + 'r270';
         else if(card.orientation() < 0)
            cardString += ' ' + 'r90';
    node.appendChild( document.createTextNode( cardString ) );
    node.setAttribute('class', cardString );
    return node;
}

window.DominoClient = DominoClient;

})(window);

