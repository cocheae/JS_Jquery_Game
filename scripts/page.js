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
var mask_on_game=false;
var vax_on_game=false;


var final_score=0;

const diff_default=800;   //This var holds the diff
const speed_default=3;
const danger_default=20;
const vol_default = 0.5;
// ==============================================
// ============ Functional Code Here ============
// ==============================================



var diff=diff_default;
var game_level=1;
var speed_init=speed_default;
var covid_danger_init=danger_default;
var volume_level_init=vol_default;

var speed=speed_init;
var covid_danger=covid_danger_init;
var volume_level=volume_level_init;


var game_over_flag = false;
var game_over_score = 0;


let maxAstroidX = 1280;
let maxAstroidY = 720;
var timeouts = [];
var ready_to_play=false;
var masked_on=false;
var die_sound = new Audio('src/audio/die.mp3'); 
var collect_sound = new Audio('src/audio/collect.mp3'); 

// var first_time = 'true';
let first_time;

// Main
$(document).ready(function () {
  // ====== Startup ====== 
  
  game_window = $('.game-window');
  player = $('.player');
  person = $('.player img');

  cdc = $('.asteroidSection');
  covid19=$('.curAstroid');

 
  
  
  settings_behavior();
  $('#normal').css("border-color", "yellow");

  $('#go_bt').click(function(){
    $('#GO_container').css("display", "none");
    $('#main_menu').css("display","flex");
  });

  $('#play_bt').click(start_game);

  $('#go_trigger').change(game_over);

  $('#covid_danger_num').html(covid_danger_init);
  $('#covid_level').html(game_level);

  
  
});


function sanitize(){
  var contanimant = $('.curAstroid');

  for(var i=1; i< contanimant.length; ++i){
    var viral = $('#'+contanimant[i].id);
    viral.remove();
  }

  final_score = game_over_score;
  game_over_score = 0;
  game_over_flag=false;
  covid_danger=covid_danger_init;
  game_level=1;
  speed=speed_init;
  $('#covid_danger_num').html(covid_danger_init);
  $('#covid_level').html(game_level);
  $('#score_num').html(game_over_score);
  

  // player.css('top','300px');
  // player.css('left','600px');

}





function left(){
  if (game_over_flag || ready_to_play==false){
    return;
  }
  var newPos = parseInt(player.css("left")) - PERSON_SPEED;
  if (newPos < 0){
    newPos = 0;
  }
  if(masked_on)
    person.attr("src","src/player/player_masked_left.gif");
  else
    person.attr("src", "src/player/player_left.gif");




  player.css("left", newPos);

  player_mask_beh();

  player_vax_beh();



}

function right(){
  if (game_over_flag || ready_to_play==false){
    return;
  }
  var newPos = parseInt(player.css("left")) + PERSON_SPEED;
  if (newPos > maxPersonPosX){
    newPos = maxPersonPosX;
  }
  if(masked_on)
    person.attr("src","src/player/player_masked_right.gif");
  else
    person.attr("src", "src/player/player_right.gif");



  player.css("left", newPos);

  player_mask_beh();

  player_vax_beh();
}

function up(){
  if (game_over_flag || ready_to_play==false){
    return;
  }
  var newPos = parseInt(player.css("top")) - PERSON_SPEED;
  if (newPos < 0){
    newPos = 0;
  }
  if(masked_on)
    person.attr("src","src/player/player_masked_up.gif");
  else
    person.attr("src", "src/player/player_up.gif");


  player.css("top", newPos);

  player_mask_beh();

  player_vax_beh();


}

function down(){
  if (game_over_flag || ready_to_play==false){
    return;
  }
  var newPos = parseInt(player.css("top")) + PERSON_SPEED;
  if (newPos > maxPersonPosY){
    newPos = maxPersonPosY;
  }

  if(masked_on)
    person.attr("src","src/player/player_masked_down.gif");
  else
    person.attr("src", "src/player/player_down.gif");




  player.css("top", newPos);

  player_mask_beh();

  player_vax_beh();



}

function player_vax_beh(){
  if(vax_on_game){
    if(isColliding(player,$('#vax'))){
      vax_on_game=false;
      $('#vax').remove();
      collect_sound.play();
      covid_danger += 2;
      ++game_level;
      speed+= 0.2;
      
      $('#covid_danger_num').html(covid_danger);
      $('#covid_level').html(game_level);
    }
  }
}

function player_mask_beh(){
  if(mask_on_game){
    if(isColliding(player,$('#mask'))){
      mask_on_game=false;
      $('#mask').remove();
      masked_on=true;
      collect_sound.play();
      person.attr("src","src/player/player_masked_left.gif");
    }
  }
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

}

function game_on(){
  $('#GR_container').css("display", "flex");
  setTimeout(function(){
    $(window).keyup(function(){
      if (game_over_flag) return; 
      if(masked_on)
        person.attr("src","src/player/player_masked.gif");
      else
        person.attr("src","src/player/player.gif");
    });

    $('#GR_container').css("display", "none");
    $(window).keydown(moveDown);
    spawn();
    turn_mask_on();
    turn_vax_on();
    ready_to_play=true;
  }, 3000);

  setInterval(function(){
    if(game_over_flag)
      clearInterval();
    else if (ready_to_play && !game_over_flag){
      game_over_score += 40;
      final_score=game_over_score
      $('#score_num').html(game_over_score);
    }
  },500);


  // game_over_score=0;

}



function tutorial(){
  if (first_time == 'true'){
    $('#tut_container').css("display", "flex");
    first_time = 'false';
  }
}

function game_over(){
  front_page(false);
  
  person.attr("src", 'src/player/player.gif');
  player.css('top', '300px');
  player.css('left', '620px');
  sanitize();
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
  } else{ game_on();}

  // ready_to_play=true;
  
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
    $('#score_display').html(final_score);
  }
}

function choose_diff(event){
  // diff = ;
  switch (event.target.id){
    case "easy":
      diff = 100; //100milliseconds
      speed = 1; //speed of asteroids
      speed_init = 1; //speed of asteroids
      covid_danger=10;
      covid_danger_init=10;
      $('#easy').css("border-color", "yellow");
      $('#normal').css("border-color", "");
      $('#hard').css("border-color", "");
      $('#covid_danger_num').html(covid_danger_init);
      break;
    case "normal":
      diff = 800; //100milliseconds
      speed = 3; //speed of asteroids
      speed_init = 3; //speed of asteroids
      covid_danger=20;
      covid_danger_init=20;
        $('#easy').css("border-color", "");
        $('#normal').css("border-color", "yellow");
        $('#hard').css("border-color", "");
        $('#covid_danger_num').html(covid_danger_init);
      break;
    case "hard":
      diff = 600; //100milliseconds
      speed = 5; //speed of asteroids
      speed_init = 5; //speed of asteroids
      covid_danger=30;
      covid_danger_init=30;
      $('#easy').css("border-color", "");
      $('#normal').css("border-color", "");
      $('#hard').css("border-color", "yellow");
      $('#covid_danger_num').html(covid_danger_init);
      break;
  }

}

function change_vol(){
  volume_level = parseInt($('#volume').val()) / 100;
  $('#val').html($('#volume').val());

  die_sound.volume=volume_level;
  collect_sound.volume=volume_level;

}


// Keydown event handler
document.onkeydown = function(e) {
    if (e.key == 'ArrowLeft') LEFT = true;
    if (e.key == 'ArrowRight') RIGHT = true;
    if (e.key == 'ArrowUp') UP = true;
    if (e.key == 'ArrowDown') DOWN = true;
}

// Keyup event handler
document.onkeyup = function (e) {
    if (e.key == 'ArrowLeft') LEFT = false;
    if (e.key == 'ArrowRight') RIGHT = false;
    if (e.key == 'ArrowUp') UP = false;
    if (e.key == 'ArrowDown') DOWN = false;
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


var id_index=1;
// var covid_movement=0.5*speed;
var pick;

function createStrain(){
  console.log("creating strain...");
  var variant = covid19.clone(); variant.attr('id', 'clone'+id_index);
  variant.append("<img src='src/covidstriod.png'/>");
  variant.appendTo(cdc);
  
  var strain = $('#clone'+id_index);
  ++id_index; 
  
  strain.css('height', '62px');
  strain.css('width', '62px');  
  pick = zero_locked(strain);

  var rand = parseInt(getRandomNumber(0,3));

  if(pick==0){
    var timeout = setInterval(function(){


      if(handler_0(rand, strain)){
        strain.remove();
        clearInterval();
      }



    },AST_OBJECT_REFRESH_RATE);

    
    timeouts.push(timeout);
  }
  if(pick==1){
    var timeout = setInterval(function(){
      if(handler_1(rand, strain)){
        strain.remove();
        clearInterval();
      }
    },AST_OBJECT_REFRESH_RATE);
    timeouts.push(timeout);
  }
  if(pick==2){
    var timeout = setInterval(function(){
      if(handler_2(rand, strain)){
        strain.remove();
        clearInterval();
      }
    },AST_OBJECT_REFRESH_RATE);
    timeouts.push(timeout);
  }
  if(pick==3){
    var timeout = setInterval(function(){
      if(handler_3(rand, strain)){
        strain.remove();
        clearInterval();
      }
    },AST_OBJECT_REFRESH_RATE);
    timeouts.push(timeout);
  }
  

}//createStrain

function zero_locked(strain){
  switch(parseInt(getRandomNumber(1,20)) % 5){
    case 0:
      strain.attr('value',0);
      strain.css("top", '0px');
      strain.css("left", parseInt(getRandomNumber(0, maxAstroidX))+'px');
      return 0;
    case 1:
      strain.attr('value',1);
      strain.css("top", maxAstroidY+'px');
      strain.css("left", parseInt(getRandomNumber(0, maxAstroidX))+'px');
      return 1;
    case 2:
      strain.attr('value',2);
      strain.css('top',parseInt(getRandomNumber(0, maxAstroidY))+'px');
      strain.css('left','0px');
      return 2;
    case 3:
      strain.attr('value',3);
      strain.css('top',parseInt(getRandomNumber(0, maxAstroidY))+'px'); //anywhere on the Y axis
      strain.css('left',maxAstroidX+'px'); //bottom
      return 3;
    case 4:
      return zero_locked(strain);
  }
}

function handler_0(rand, strain){
    switch(rand){
      case 0:
        return covid_down(strain);
      case 1:
        return covid_down(strain) || covid_left(strain);
      case 2:
        return covid_down(strain) || covid_right(strain); 
  }
}

function handler_1(rand, strain){
  switch(rand){
    case 0:
      return covid_up(strain);
    case 1:
      return covid_up(strain) || covid_left(strain);
    case 2:
      return covid_up(strain) || covid_right(strain); 
  }
}

function handler_2(rand, strain){
  switch(rand){
    case 0:
      return covid_right(strain);
    case 1:
      return covid_right(strain) || covid_up(strain);
    case 2:
      return covid_right(strain) || covid_down(strain); 
  }
}

function handler_3(rand, strain){
  switch(rand){
    case 0:
      return covid_left(strain);
    case 1:
      return covid_left(strain) || covid_up(strain);
    case 2:
      return covid_left(strain) || covid_down(strain); 
  }
}

function spawn(){

  setTimeout(function(){
    if(game_over_flag!=true && $('.curAstroid').length < 8 && ready_to_play==true){

      createStrain();
    }
    spawn();
  },diff);



}//precipitaion


var covid_movement = 0.5*speed;
function covid_left(strain){
  // var covid_movement = 1*speed;
  strain.css('left', parseInt(strain.css('left'))-covid_movement);
  if(isColliding(strain,player)){
    // console.log("strain:", strain.position(), "player:", player.position());
    if (masked_on){
      masked_on=false;
      return true;
    }
    else
      quarantine();
    return false;
  }
  if(parseInt(strain.css('left')) <= 0)
    return true;

  return false;
}
function covid_right(strain){
  // var covid_movement = 0.5*speed;
  strain.css('left', parseInt(strain.css('left'))+covid_movement);
  if(isColliding(strain,player)){
    // console.log("strain:", strain.position(), "player:", player.position());
    if (masked_on){
      masked_on=false;
      return true;
    }
    else
      quarantine();
    return false;
  }
  if(parseInt(strain.css('left')) >= maxAstroidX)
    return true;

  return false;
}

function covid_up(strain){
  // var covid_movement = 0.5*speed;
  strain.css('top', parseInt(strain.css('top'))-covid_movement);
  if(isColliding(strain,player)){
    // console.log("strain:", strain.position(), "player:", player.position());
    if (masked_on){
      masked_on=false;
      return true;
    }else
      quarantine();
    return false;
  }
  if(parseInt(strain.css('top')) <= 0)
    return true;

  return false;
}

function covid_down(strain){
  // var covid_movement = 0.5*speed;
  strain.css('top', parseInt(strain.css('top'))+covid_movement);

  if(isColliding(strain,player)){
    // console.log("strain:", strain.position(), "player:", player.position());
    if (masked_on){
      masked_on=false;
      return true;
    }
    else
      quarantine();
    return false;
  }
  if(parseInt(strain.css('top')) >= maxAstroidY)
    return true;

  return false;
}


function quarantine(){
  die_sound.play();
  for(var i=0; i < timeouts.length; i++){
    clearTimeout(timeouts[i]);
  }
  timeouts=[];
  game_over_flag=true;
  ready_to_play=false;

  person.attr('src', 'src/player/player_touched.gif');

  setTimeout(game_over,2000);

}


function masks_factory(){
  mask_on_game=true;
  var mask_factory = covid19.clone(); mask_factory.attr('id', 'mask');
  mask_factory.append("<img src='src/mask.gif'/>");
  mask_factory.appendTo(cdc);

  var mask = $('#mask');
  var mask_y = parseInt(getRandomNumber(5,maxAstroidY-30));
  var mask_x = parseInt(getRandomNumber(5,maxAstroidX-80));
  mask.css('top', mask_y);
  mask.css('left', mask_x);

  setTimeout(function(){
    if(mask_on_game){
      mask_on_game=false;
      mask.remove();
    }
    
    
  } , maskGone);


}


function turn_mask_on(){
  setInterval(function(){
    if(!mask_on_game && !masked_on && ready_to_play)
      masks_factory();
    else if(game_over_flag)
      clearInterval();
  },maskOccurrence);
}


function vax_factory(){
  vax_on_game=true;
  var vax_factory = covid19.clone(); vax_factory.attr('id', 'vax');
  vax_factory.append("<img src='src/vacc.gif'/>");
  vax_factory.appendTo(cdc);

  var vax = $('#vax');
  var vax_y = parseInt(getRandomNumber(5,maxAstroidY-30));
  var vax_x = parseInt(getRandomNumber(5,maxAstroidX-80));
  vax.css('top', vax_y);
  vax.css('left', vax_x);

  setTimeout(function(){
    if(vax_on_game){
      vax_on_game=false;
      vax.remove();
    }
  } , vaccineGone);
}


function turn_vax_on(){
  setInterval(function(){
    if(!vax_on_game && ready_to_play)
      vax_factory();
    else if(game_over_flag)
      clearInterval();
  },vaccineOccurrence);
}