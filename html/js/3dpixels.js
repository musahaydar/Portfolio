let img;
let scale = 2.5;
let stretch = 0.02; 
let outline = false;

function preload() {
    img = loadImage("images/sprite.png");
}

function setup() {
    let canvas = createCanvas(img.width * scale, img.height * scale, WEBGL);
    canvas.parent("p5-container");
    img.loadPixels();
}

function draw() {
    translate(-scale * (img.width / 2), -scale * (img.height / 2));

    background(255);
    for (let col = 0; col < img.height; col += 1) {
        for (let row = 0; row < img.width; row += 1) {
            let idx = (row + (col * img.width)) * 4;
            if (img.pixels[idx + 3] !== 0) {
                fill(img.pixels[idx], img.pixels[idx + 1], img.pixels[idx + 2], img.pixels[idx + 3]);
                if (outline === false) {
                    stroke(img.pixels[idx], img.pixels[idx + 1], img.pixels[idx + 2], img.pixels[idx + 3]);
                }
                push()
                rotateY(sin(frameCount / 50));
                box(scale, scale, 15 * sin(frameCount / 100));
                pop()
            }
            translate(scale, 0);
        }
        translate(-scale * img.width, scale);
    }
    translate(0, -scale * img.height);
}