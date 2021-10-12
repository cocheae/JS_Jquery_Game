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

// var first_time = 'true';
let first_time;

// Main
$(document).ready(function () {
  // ====== Startup ====== 
  
  game_window = $('.game-window');
  player = $('.player');
  person = $('.player img');

  
  


  
  do settings_behavior();
    while(false);

  $('#go_bt').click(function(){
    $('#GO_container').css("display", "none");
    $('#main_menu').css("display","flex");
    game_over_score = 0;
  });
  
  $('#go_trigger').change(game_over);
  $('#tut_container').change(tutorial);
  $('#start_btn').click(function(){
    $('#tut_container').css("display","");
  });


  
});


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
  // console.log("trigerred!");
  if (LEFT && UP){left(); up();}
  else if (LEFT && DOWN){left(); down();}
  else if (RIGHT && UP){right(); up();}
  else if (RIGHT && DOWN){right(); down();}
  else if (LEFT){left();}
  else if (RIGHT){right();}
  else if (UP){up();}
  else if (DOWN){down();}

}

function tutorial(){
  if (first_time == 'true'){
    $('#tut_container').css("display", "flex");
    first_time = 'false';

    setTimeout(function(){
      // console.log("I'm waiting");
      $('#GR_container').css("display", "none");
      $(window).keydown(moveDown);
    }, 3000);
    
  }
}

function game_over(){
  $('#GO_container').css("display","flex" );
  $('#menu_bck').css("display", "");
  $('#header').css("display", "");
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
  $('#play_bt').click(function(){
    $('#main_menu').css("display","none");
    $('#menu_bck').css("display", "none");
    $('#header').css("display", "none");
    first_time = $('#tut_on').val();
    $('#tut_on').change();
    $('#GR_container').css("display", "flex");
    if (first_time =='false'){
      setTimeout(function(){
        $('#GR_container').css("display", "none");
        $(window).keydown(moveDown);
      }, 3000);
    }
    $('#tut_on').val('false');

    // $('#go_trigger').val(true);
    // $('#go_trigger').change();
  });

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