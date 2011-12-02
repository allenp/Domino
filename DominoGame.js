 /**
 * Domino Game
 * Author Paul Allen http://paulallen.com.jm
 * Copyright 2011, Paul Allen
 * Licensed under the MIT or GPL Version 2 licenses.
 * Date: November 15 2011
 *
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software to deal in the Software without
 * restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */


(function(window, undefined){

    var DominoGame = function() {
        this.gameid = this.newId();
        this.deck = [];
        this.players = [];
        this.currentPlayer = null;
        this.playstack = [];  

        //initialize the deck
        var d = 0;
        for(l = 0; l <= 6; ){ //i love you
            for(r = l; r <= 6; r++, d++){
                this.deck[d] = new DominoGame.Domino(l,r);
            }
            l++;
        }
    };

    DominoGame.prototype.newId = function() {
        var i = Math.random() * (100 - 10) + 10;
        i = ''.replace.apply(i, ['.', '']);
        return i;
    }

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
              this.players[i] = new Player( i + 1, null, this.deck.slice(i*7, (i*7)+7) );
            }
        }
    }

    DominoGame.prototype.whichPlayer = function(){
        if(this.currentPlayer == null){
            var d = new DominoGame.Domino(6,6);
            var length = this.players.length;
            for(var j = 0; j < length; j++)
            {
                if(this.players[j].has(d))
                {
                    this.currentPlayer = j;
                }
            }
            if(this.currentPlayer == null)
                this.currentPlayer = 0;
        }
        return this.currentPlayer;
    }

    //internal function: called with .call or .apply
    function chooseNextPlayer(){
        var length = this.players.length;
        if(this.playstack.length == 0) return this.whichPlayer();
        var startingPos = this.currentPlayer;
        for( var i = ( this.currentPlayer + 1 ) % length; i != startingPos ; i = (i + 1) % length)
        {
            if(this.players[i].canPlay(this.playstack[0].left(), this.playstack[this.playstack.length - 1].right()))
            {
              this.currentPlayer = i;
              break;
            }
            else
            {
                console.log("I cant play (player: " + this.players[i].id + ")");
            }
        }
        return this.currentPlayer;
    }
     
    DominoGame.prototype.makePlay = function( player, card, head ){ 
        if(player !== this.currentPlayer){ return false; }
        if(this.playstack.length === 0){
            this.playstack.push(card);
        }
        else { 
            if( head > 0 ){
              c = this.playstack[0].left();
              if( c == card.left() ){
                  card.flip();
                  this.playstack.unshift(card);
              }
              else if( c == card.right() ){
                  this.playstack.unshift(card);
              }
              else { return false; }
            }
            else if( head <= 0 ){
              c = this.playstack[this.playstack.length - 1].right();
              if( c == card.left() ){
                this.playstack.push(card);
              }
              else if( c == card.right() ){
                card.flip();
                this.playstack.push(card);
              }
              else { return false; }
            }
        }
        this.players[player].makePlay(card);
        
        if(this.whoWon() == -1)
            chooseNextPlayer.call(this);
        return true;
    }

    DominoGame.prototype.headsAndTails = function() {
        if(this.playstack.length === 0) 
            return null;
        var r =  { 
                    head: this.playstack[0].left(),
                    tail: this.playstack[this.playstack.length - 1].right()
                  };
        return r;
    }

    DominoGame.prototype.gameCanPlay = function(){
        var canPlay = false;
        if(this.playstack.length === 0){ return true; }
        var startingPos = this.currentPlayer;
        var length = this.players.length;
        for( var i = 0; i < length; i++)
        {
            if(this.players[i].canPlay(this.playstack[0].left(), this.playstack[this.playstack.length - 1].right()))
            {
                canPlay = true;
                break;
            }
        }
        return canPlay;
    }
    
    DominoGame.prototype.whoWon = function(){
        var startingPos = this.currentPlayer;
        var length = this.players.length;
        var startingPos = this.currentPlayer;
        for( var i = startingPos; (i + 1) % length != startingPos ; i = (i + 1) % length)
        {
            if(this.players[i].cards.length == 0)
            {
              return i;
            }
        }
        
        if(this.gameCanPlay() == false)
        {
        
            console.log("game blocked");
            _lowest = 0;
            _hands = [];
            _hands.push(this.players[0].countHand());
            _occurrences = 1;
            
            for(var i = 1, length = this.players.length; i < length; i++)
            {
                _hands.push(this.players[i].countHand());
                if(_hands[_lowest] > _hands[i]) {
                    _lowest = i;
                    _occurrences = 1;
                }
                
                if(_hands[_lowest] == _hands[i]) {
                    _occurrences += 1;
                }
                    
            }
            
            if(_occurrences == 1)
                return _lowest;
        }
        
        return -1;
    }

    /*!
     * Domino 
     */
    DominoGame.Domino = function( le, ri ) {

        if(le < 0 || le > 6 || ri < 0 || ri > 6) {
            throw new Error("Invalid arguments supplied for domino: (0 - 6)");
        }
        
        this.left = function(){ return le; }
        this.right = function(){ return ri; }
        this.orientation = function(){ return 1; }    
        this.id = this.newId();
        
        this.flip = function() { 
            or = this.orientation();
            if(or > 0){ //or > 0 is normal orientation so flip now
                this.left = function(){ return ri; }
                this.right = function(){ return le; }
            }else{
                this.left = function(){ return le; }
                this.right = function(){ return ri; }
            }
            
            this.orientation = function() { return or * -1; }
        }

        this.equals = function( left, right ) {
            if(right == null) {
                if(left.orientation() != this.orientation()) {
                    if(this.left() == left.right() && this.right() == left.left())
                        return true;
                }
                else {
                    if(this.left() == left.left() && this.right() == left.right())
                        return true;
                }
            }
            else
                if(this.left() == left && this.right() == right)
                    return true;
            return false;
        }
        
    }

    DominoGame.Domino.prototype.canMatch = function(left, right) {
        l = this.left();
        r = this.right();
        if( l == left ) return 1;
        if( r == left ) return 2;
        if( r == right ) return 3;
        return 0;
    }

    DominoGame.Domino.prototype.newId = function() {
        var i = Math.random() * (100 - 10) + 10;
        i = ''.replace.apply(i, ['.', '']);
        return i;
    }


    /*!

    Player Object

    */
    function Player( /* int */ id, /* string */ name, /* array */ cards ) {
        this.id = id;
        this.name = name || "Player " + this.id;
        this.cards = cards;
    }

    Player.prototype.canPlay = function(/* int */ left, /* int */ right ) {
        var count = this.cards.length;
        for(i = 0; i < count; i++) {
            if(this.cards[i].canMatch(left,right)) {
               return true;
            }
        }
        
        //if we get here we didnt find a match
        return false;
    }

    Player.prototype.whatToPlay = function(left, right) {
        var count = this.cards.length;
        var canplay = [];
        
        for(i = 0; i < count; i++) {
            if(this.cards[i].canMatch(left,right) > 0) {
                canplay.push(this.cards[i]);
            }
        }
        return canplay;
    }

    Player.prototype.makePlay = function( left, right ) {
        var length = this.cards.length;
        for(var i = 0; i < length; i++) {
            if(this.cards[i].equals(left,right)) {
                this.cards.splice(i,1);
                console.log("Player " + this.id + " plays: " + left.left() + " " + left.right());
                break;
            }
        }
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
    
    Player.prototype.countHand = function() {
        var length = this.cards.length;
        if(length == 0) return 0;
        var count = 0;
        for(i = 0; i < length; i++){
            count += card.left() + card.right();
        }
        return count;
    }

    //expose game
    window.Game = DominoGame;

})(window);
