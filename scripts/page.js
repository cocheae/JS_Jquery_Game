// ===================== Fall 2021 EECS 493 Assignment 2 =====================
// This starter code provides a structure and helper functions for implementing
// the game functionality. It is a suggestion meant to help you, and you are not
// required to use all parts of it. You can (and should) add additional functions
// as needed or change existing functions.

// ==============================================
// ============ Page Scoped Globals Here ========
// ==============================================

// Div Handlers
let game_window;

// Game Object Helpers
let AST_OBJECT_REFRESH_RATE = 15;
let maxPersonPosX = 1218;
let maxPersonPosY = 658;
let PERSON_SPEED = 5;                // Speed of the person
let vaccineOccurrence = 20000;       // Vaccine spawns every 20 seconds
let vaccineGone = 5000;              // Vaccine disappears in 5 seconds
let maskOccurrence = 15000;          // Masks spawn every 15 seconds
let maskGone = 5000;                 // Mask disappears in 5 seconds
// Movement Helpers
var LEFT = false;
var RIGHT = false;
var UP = false;
var DOWN = false;
var touched = false;

// ==============================================
// ============ Functional Code Here ============
// ==============================================


let diff;   //This var holds the diff
let volume_level; //holds the vol
var game_over_flag = false;
var game_over_score = 10;
let maxAstroidX = 1280;
let maxAstroidY = 720;

// var first_time = 'true';
let first_time;

// Main
$(document).ready(function () {
  // ====== Startup ====== 
  
  game_window = $('.game-window');
  player = $('.player');
  person = $('.player img');
  comet_class = $('.curAstroid');
  comet = $('#original_troid');

  
  
  settings_behavior();

  $('#go_bt').click(function(){
    $('#GO_container').css("display", "none");
    $('#main_menu').css("display","flex");
    game_over_score = 0;
  });

  $('#play_bt').click(start_game);

  $('#go_trigger').change(game_over);

  collision();
  
});






function collision(){
  if (isColliding(comet_class, player)){
    console.log("collision triggered");
  }
}



function left(){
  var newPos = parseInt(player.css("left")) - PERSON_SPEED;
  if (newPos < 0){
    newPos = 0;
  }
  person.attr("src", "src/player/player_left.gif");
  player.css("left", newPos);
}

function right(){
  var newPos = parseInt(player.css("left")) + PERSON_SPEED;
  if (newPos > maxPersonPosX){
    newPos = maxPersonPosX;
  }
  person.attr("src", "src/player/player_right.gif");
  player.css("left", newPos);
}

function up(){
  var newPos = parseInt(player.css("top")) - PERSON_SPEED;
  if (newPos < 0){
    newPos = 0;
  }
  person.attr("src", "src/player/player_up.gif");
  player.css("top", newPos);
}

function down(){
  var newPos = parseInt(player.css("top")) + PERSON_SPEED;
  if (newPos > maxPersonPosY){
    newPos = maxPersonPosY;
  }
  person.attr("src", "src/player/player_down.gif");
  player.css("top", newPos);
}

function moveDown (){
  if (LEFT && UP){left(); up();}
  else if (LEFT && DOWN){left(); down();}
  else if (RIGHT && UP){right(); up();}
  else if (RIGHT && DOWN){right(); down();}
  else if (LEFT){left();}
  else if (RIGHT){right();}
  else if (UP){up();}
  else if (DOWN){down();}
  collision();
}

function game_on(){
  $('#GR_container').css("display", "flex");
  setTimeout(function(){
    $(window).keyup();
    $(window).keydown(moveDown);
    $('#GR_container').css("display", "none");
  }, 3000);
}



function tutorial(){
  if (first_time == 'true'){
    $('#tut_container').css("display", "flex");
    first_time = 'false';
  }
}

function game_over(){
  front_page(false);
  $('#score_display').html(game_over_score);
}

function settings_behavior(){
  $('#volume').on('input', change_vol);

  $('.set_bt').click(choose_diff);

  $('#settings_bt').click(function(){
    $('#settings_container').css("display", "flex");
  });
  
  $('#close_bt').click(function(){
    $('#settings_container').css("display", "none");
  });
}

function start_game(){
  front_page(true);
  first_time = $('#tut_on').val();
  if (first_time == 'true'){
    $('#tut_on').val('false');
    $('#tut_container').css("display","flex");
    $('#start_btn').click(function(){
      $('#tut_container').css("display","none");
      game_on();
    });
  } else{ game_on(); }
  
  // $('#go_trigger').val(true);
  // $('#go_trigger').change();
}

function front_page(disapear){
  if (disapear){
    $('#main_menu').css("display","none");
    $('#menu_bck').css("display", "none");
    $('#header').css("display", "none");
  }
  else{
    $('#GO_container').css("display","flex" );
    $('#menu_bck').css("display", "");
    $('#header').css("display", "");
  }
}

function choose_diff(event){
  diff = event.target.id;
  switch (diff){
    case "easy":
      $('#easy').css("border-color", "yellow");
      $('#normal').css("border-color", "");
      $('#hard').css("border-color", "");
      break;
    case "normal":
        $('#easy').css("border-color", "");
        $('#normal').css("border-color", "yellow");
        $('#hard').css("border-color", "");
      break;
    case "hard":
      $('#easy').css("border-color", "");
      $('#normal').css("border-color", "");
      $('#hard').css("border-color", "yellow");
      break;
  }

}

function change_vol(event){
  volume_level = $('#volume').val();
  $('#val').html(volume_level);
}


// Keydown event handler
document.onkeydown = function(e) {
    if (e.key == 'ArrowLeft') LEFT = true;
    if (e.key == 'ArrowRight') RIGHT = true;
    if (e.key == 'ArrowUp') UP = true;
    if (e.key == 'ArrowDown') DOWN = true;
    moveDown;
}

// Keyup event handler
document.onkeyup = function (e) {
    if (e.key == 'ArrowLeft') LEFT = false;
    if (e.key == 'ArrowRight') RIGHT = false;
    if (e.key == 'ArrowUp') UP = false;
    if (e.key == 'ArrowDown') DOWN = false;
    person.attr("src","src/player/player.gif");
}


//===================================================

// ==============================================
// =========== Utility Functions Here ===========
// ==============================================

// Are two elements currently colliding?
function isColliding(o1, o2) {
  return isOrWillCollide(o1, o2, 0, 0);
}

// Will two elements collide soon?
// Input: Two elements, upcoming change in position for the moving element
function willCollide(o1, o2, o1_xChange, o1_yChange){
  return isOrWillCollide(o1, o2, o1_xChange, o1_yChange);
}

// Are two elements colliding or will they collide soon?
// Input: Two elements, upcoming change in position for the moving element
// Use example: isOrWillCollide(paradeFloat2, person, FLOAT_SPEED, 0)
function isOrWillCollide(o1, o2, o1_xChange, o1_yChange){
  const o1D = { 'left': o1.offset().left + o1_xChange,
        'right': o1.offset().left + o1.width() + o1_xChange,
        'top': o1.offset().top + o1_yChange,
        'bottom': o1.offset().top + o1.height() + o1_yChange
  };
  const o2D = { 'left': o2.offset().left,
        'right': o2.offset().left + o2.width(),
        'top': o2.offset().top,
        'bottom': o2.offset().top + o2.height()
  };
  // Adapted from https://developer.mozilla.org/en-US/docs/Games/Techniques/2D_collision_detection
  if (o1D.left < o2D.right &&
    o1D.right > o2D.left &&
    o1D.top < o2D.bottom &&
    o1D.bottom > o2D.top) {
     // collision detected!
     return true;
  }
  return false;
}

// Get random number between min and max integer
function getRandomNumber(min, max){
  return (Math.random() * (max - min)) + min;
}


// Element.remove()

function coordinates(){
  this.startX= 0;
  this.endX=0;
  this.startY= 0;
  this.endY= 0;
}

function zero_locked(position){
  var choose = parseInt(getRandomNumber(1,5));

  switch (choose){
    case 1:
      position.startX=-50;
      position.endX=parseInt(getRandomNumber(-50,maxAstroidX));
      position.startY=parseInt(getRandomNumber(-50,maxAstroidY));
      position.endY=parseInt(getRandomNumber(-50,maxAstroidY));
      break;
    
    case 2:
      position.startX=parseInt(getRandomNumber(-50,maxAstroidX));;
      position.endX=parseInt(getRandomNumber(-50,maxAstroidX));;
      position.startY=-50;
      position.endY=parseInt(getRandomNumber(-50,maxAstroidY));
      break;
    case 3:
      position.startX=parseInt(getRandomNumber(-50,maxAstroidX));
      position.endX=maxAstroidX
      position.startY=parseInt(getRandomNumber(-50,maxAstroidY));
      position.endY=parseInt(getRandomNumber(-50,maxAstroidY));
      break;
    
    case 4:
      position.startX=parseInt(getRandomNumber(-50,maxAstroidX));;
      position.endX=parseInt(getRandomNumber(-50,maxAstroidX));;
      position.startY=maxAstroidY;
      position.endY=parseInt(getRandomNumber(-50,maxAstroidY));
      break;
  }
  return position; 
}

function virus(piece){
  this.piece=piece;
  this.coord=zero_locked(new coordinates);
  
  this.fixer=function(){
    this.piece.css("top", this.coord.startY);
    this.piece.css("left", this.coord.startX);
  }

  this.done=function(){
    var y = parseInt(this.piece.css("top")) == parseInt(this.coord.endY);
    var x = parseInt(this.piece.css("left")) == parseInt(this.coord.endX);

    return x || y;
  }

}

var comets = new Array;

function clone_fabric(){
  var i_d = 'cloneX';
  for(var i=1; i<8; ++i){
    // var id_c = i_d.replace("X",i);
    var clone = comet.clone().attr('id',i_d.replace("X",i));
    var covid = new virus(clone);
    covid.fixer;
    covid.piece.appendTo(comet_class);
    comets.push(covid);
    // .appendTo(comet_class);
  }
}

function animation(comet, top_end, left_end){

  comet.animate({top:top_end, left:left_end}, 5000);

}








