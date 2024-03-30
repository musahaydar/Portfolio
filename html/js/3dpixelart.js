let img;
let moon;
let ghost;
let depthmap;

let spr_select;
let outline_chkbox;
let depthmap_chkbox;
let rotate_chkbox;

//===------ parameters -------===//
let scale = 5;
let depth = 2; // pixels, if not using depth map
let rot_angle = 35; // degrees

//===----- feature flags -----===//
let outline = false;
let rotate = true;
let use_depth_map = true;

function preload() {
    // ok to hardcode these image links with ".." since this is run in "/pages" dir
    moon = loadImage("../images/sprites/sprite.png");
    ghost = loadImage("../images/sprites/ghost.png");
    depthmap = loadImage("../images/sprites/sprite_depth_map.png");
}

function setup() {
    moon.loadPixels();
    ghost.loadPixels();
    depthmap.loadPixels();
    img = moon;

    let canvas = createCanvas(img.width * scale * 1.5, img.height * scale * 1.5, WEBGL);
    canvas.parent("p5-container");

    angleMode(DEGREES);

    // create UI elements
    let ui_pos_x = img.width * scale * 2.05;
    let ui_pos_y = img.height * scale * 1.7;
    let incr = 20; // pixels
    spr_select = createSelect();
    spr_select.parent("p5-ui");
    spr_select.option('Moon');
    spr_select.option('Ghost');
    spr_select.option('Moon Depth Map');
    spr_select.selected('Moon');

    ui_pos_y += 10;
    outline_chkbox = createCheckbox(" show outline", outline);
    outline_chkbox.parent("p5-ui");
    depthmap_chkbox = createCheckbox(" use depthmap", use_depth_map);
    depthmap_chkbox.parent("p5-ui");
    rotate_chkbox = createCheckbox(" rotate sprite", rotate);
    rotate_chkbox.parent("p5-ui");
}

function draw() {
    // uncomment me for mouse-look control :)
    orbitControl(1, 1, 1);

    // use select box
    let dmap = set_selection() && depthmap_chkbox.checked();

    // set initial transform to be top left corner
    translate(-scale * (img.width / 2), -scale * (img.height / 2));

    // canvas reset
    background(240);

    for (let col = 0; col < img.height; col += 1) {
        for (let row = 0; row < img.width; row += 1) {
            let idx = (row + (col * img.width)) * 4;

            // draw if the pixel has a non-zero transparency
            if (img.pixels[idx + 3] !== 0) {

                // set the color
                fill(img.pixels[idx], img.pixels[idx + 1], img.pixels[idx + 2], img.pixels[idx + 3]);
                if (outline_chkbox.checked() === false) {
                    noStroke();
                } else {
                    stroke(0)
                }

                // rotate the pixel
                push();
                // rotate about the middle, so we'll consider it the 0th row
                let rrow = row - (img.width/2);
                let angle = rot_angle * sin(frameCount);
                if (rotate_chkbox.checked()) {
                    let r = (rrow * scale);
                    let delta_z = r * sin(angle);
                    let delta_x = r - (delta_z / tan(angle));
                    translate(-delta_x, 0, delta_z)
                    rotateY(-angle);
                }

                // draw the pixel
                if (dmap) {
                    box(scale, scale, (((depthmap.pixels[idx] / 32) * 2) + 1) * scale);
                } else {
                    box(scale, scale, depth * scale);
                }
                pop();
            }
            translate(scale, 0);
        }
        translate(-scale * img.width, scale);
    }
}

// returns true if the depthmap is available for this sprite
function set_selection() {
    if (spr_select.selected() === "Moon") {
        img = moon;
    } else if  (spr_select.selected() === "Ghost") {
        img = ghost;
        return false;
    } else if  (spr_select.selected() === "Moon Depth Map") {
        img = depthmap;
    }
    return true
}