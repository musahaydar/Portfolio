let img;
let scale = 2.5;
let depth = 3;
let outline = false;

function preload() {
    img = loadImage("images/sprite.png");
    depthmap = loadImage("images/sprite_depth_map.png");
}

function setup() {
    let canvas = createCanvas(img.width * scale, img.height * scale, WEBGL);
    canvas.parent("p5-container");
    img.loadPixels();
    depthmap.loadPixels();
    angleMode(DEGREES);
}

function draw() {
    orbitControl(1, 1, 0);

    rotateY(15);
    background(255);
    translate(-scale * (img.width / 2), -scale * (img.height / 2));

    for (let col = 0; col < img.height; col += 1) {
        for (let row = 0; row < img.width; row += 1) {
            let idx = (row + (col * img.width)) * 4;
            if (img.pixels[idx + 3] !== 0) {
                fill(img.pixels[idx], img.pixels[idx + 1], img.pixels[idx + 2], img.pixels[idx + 3]);
                if (outline === false) {
                    stroke(img.pixels[idx], img.pixels[idx + 1], img.pixels[idx + 2], img.pixels[idx + 3]);
                }
                push()
                let rrow = ceil(row - (img.width/2));
                let angle = 28 * sin(frameCount);
                translate(0, 0, tan(angle) * scale * rrow);
                rotateY(-angle);
                box(scale, scale, (((depthmap.pixels[idx] / 32) * 2) + 1) * scale);
                pop()
            }
            translate(scale, 0);
        }
        translate(-scale * img.width, scale);
    }
    translate(0, -scale * img.height);
}