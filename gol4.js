$(document).ready(function() {
  console.log("gol4.js loaded...");

  canvas = document.getElementById('board');
  ctx = canvas.getContext('2d');

  width = 200;
  height = 200;

  update_board_size(width, height);

  speed = 0.1; // updates per second
  lifetime = 5; // updates before death
  total_updates = 0;
  max_world_length = 1000;
  shift_sequence = false;

  interval = false;

  dead = []; // bring out yer dead
  create = []; // filling this later with life to create

  place_initial_lifeform();

  $("#start").click(function() {
    place_initial_lifeform();
    parsed_sequence = parse_sequence_into_game_logic();

    if (parsed_sequence) {
      // start game loop
      interval = setInterval(gameloop, speed*1000);
    } else {
      console.log("ERROR");
    }
  });

  $("#pause").click(function() {
    if (interval) {
      clearInterval(interval);
    }
  });

  $("#reset").click(reset_board);
});

function update_board_size(w, h) {
  console.log("Changed board size to " + w + "x" + h);

  $("#canvas-div").css("width", "" + w + "px");
  $("#canvas-div").css("height", "" + h + "px");

  $("#board").css("width", "" + w + "px");
  $("#board").css("height", "" + h + "px");

  ctx.scale(4, 4);
  ctx.translate(-75, -75)
}

var world = [];

function put_pixel(x, y, life) {
  if (world.length > max_world_length) {
    return;
  }

  if (world_has(x, y)) {
    return;
  }

  ctx.fillStyle = "rgba(0, 0, 0, 1)";
  ctx.fillRect(x, y, 1, 1);

  var p = {};
  p.x = x;
  p.y = y;
  p.life = life;

  world.push(p);
}

function kill_pixel(x, y) {
  var has_index = world_has(x, y);

  if (has_index) {
    ctx.fillStyle = "rgba(255, 255, 255, 1)";
    ctx.fillRect(x, y, 1, 1);

    world.splice(has_index, 1);
  }
}

function place_initial_lifeform(x, y) {
  var middle_x = Math.round(width / 2);
  var middle_y = Math.round(height / 2);

  // place a 2x2 lifeform

  // top-left
  put_pixel(middle_x, middle_y, lifetime);

  // top-right
  put_pixel(middle_x+1, middle_y, lifetime);

  // bottom-left
  put_pixel(middle_x, middle_y+1, lifetime);

  // bottom-right
  put_pixel(middle_x+1, middle_y+1, lifetime);
}

// Called every update
function gameloop() {
  // Loop through all pixels in the world
  for (var i=0; i<world.length; i++) {
    var p = world[i];

    // age the pixel
    p.life -= 1;

    if (p.life == 0) {
      dead.push(p);
      continue;
    }

    // top-left
    var what = parsed_sequence[0];
    handle(i, p, p.x-1, p.y-1, what);


    // top-middle
    var what = parsed_sequence[1];
    handle(i, p, p.x, p.y-1, what);

    // top-right
    var what = parsed_sequence[2];
    handle(i, p, p.x+1, p.y-1, what);

    // right
    var what = parsed_sequence[3];
    handle(i, p, p.x+1, p.y, what);

    // bottom-right
    var what = parsed_sequence[4];
    handle(i, p, p.x+1, p.y+1, what);

    // bottom-middle
    var what = parsed_sequence[5];
    handle(i, p, p.x, p.y+1, what);

    // bottom-left
    var what = parsed_sequence[6];
    handle(i, p, p.x-1, p.y+1, what);

    // left
    var what = parsed_sequence[7];
    handle(i, p, p.x-1, p.y, what);

  }

  // Remove the dead
  console.log("DEATH COUNT: " + dead.length);
  for (var i=0; i<dead.length; i++) {
    kill_pixel(dead[i].x, dead[i].y);
  }

  // Create the new
  for (var i=0; i<create.length; i++) {
    var p = create[i];
    put_pixel(p.x, p.y, p.life);
  }

  total_updates += 1;

  console.log(total_updates);
  console.log("World Size: " + world.length)
  console.log("Dead Count: " + dead.length);
  console.log("Create Count: " + create.length);

  create = [];
  dead = [];


  if (world.length > max_world_length) {
    clearInterval(interval);
    console.log("STOPPING TO CONSERVE RAM");
  }

  // Shift the Sequence
  // console.log(parsed_sequence);
  if (shift_sequence) {
    parsed_sequence.unshift(parsed_sequence.pop());
  }
}

// Parse sequence into game logic
function parse_sequence_into_game_logic() {
  var length = 9;
  var valid_numbers = [0, 1, 2, 3];
  var parsed_sequence = [];

  var sequence = $("#sequence").val();

  if (sequence.length != length) {
    return false;
  }

  var end = parseInt(sequence.substring(sequence.length-1));
  console.log("END " + end)
  if (end == 0) {
    shift_sequence = false;
  } else if (end == 1) {
    shift_sequence = true;
  } else {
    return false;
  }

  for (var i=0; i<length-1; i++) {
    var sub = parseInt(sequence.substring(i, i+1));

    if (!valid_numbers.includes(sub)) {
      return false;
    } else {
      parsed_sequence.push(sub);
    }
  }

  return parsed_sequence;
}

function reset_board() {
  if (interval) {
    clearInterval(interval);
  }

  for (var i=0; i<world.length; i++) {
    var x = world[i].x;
    var y = world[i].y;

    ctx.fillStyle = "rgba(255, 255, 255, 1)";
    ctx.fillRect(x, y, 1, 1);
  }

  world = [];

  total_updates = 0;
}

function neighbor(x, y) {
  return world_has(x, y);
}

function world_has(x, y) {
  for (var i=0; i<world.length; i++) {
    if (world[i].x == x && world[i].y == y) {
      return i;
    }
  }

  return false;
}

// handles interaction between pixel and neighbor according to sequence
function handle(i, p, nx, ny, s) {
  var who = neighbor(nx, ny);
  var what = s;

  if (who) {
    if (what == 0) {
      dead.push(p);
    } else if (what == 1) {
      world[i].life += who.life;
      dead.push(who);
    } else if (what == 3) {
      // nothing
    }
  } else {
    if (what == 2) {
      var c = {};
      c.x = nx;
      c.y = ny;
      c.life = world[i].life/2;
      create.push(c);

      world[i].life = world[i].life / 2;
    }
  }
}
