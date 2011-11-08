
mice.onmousedown = function(e) {
  e.preventDefault();

  var oldMove = document.onmousemove
  document.onmousemove = function (e) {
  }

  var oldUp = document.onmouseup
  document.onmouseup = function(e) {
    document.onmousemove = oldMove
    document.onmouseup = oldUp
  }

}

function getPos(e) {
  var x = 0, y = 0;
  while(e != null) {
    x += e.offsetLeft;
    y += e.offsetTop;
    e = e.offsetParent;
  }
  return {x:x, y:x}
}

function getRelPos(to, event) {
  var pos = getPos(to);
  return {
    x : event.pageX - pos.x,
	y : event.pageY - pos.y
  }
}