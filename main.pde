// Global variables
int x, y;
int rotate, rrotate;
int players;
int[] coords = new int[2];

// Setup the Processing Canvas
void setup() {
  size( 400, 400 );
  strokeWeight( 10 );
  frameRate( 30 );
  x = mouseX;
  y = mouseY;
  coords[0] = 300;
  coords[1] = 300;
  rotate = 0;
  rrotate = 0;
}

// Functions


void player() {
  this.x = coords[0];
  this.y = coords[1];
}

void display() {
           pushMatrix();
           translate(this.x, this.y);
           rectMode(CENTER);
           noStroke();
           fill(70, 70, 70);
           rect(0, 0, 20, 20);
           popMatrix();
       }

void edges() {
if(this.x < 10) {
               coords[0] = 10;
           }
           if(this.x > 550) {
               coords[0] = 550;
           }
           if(this.y < 10) {
               coords[1] = 10;
           }
           if(this.y > 550) {
               coords[1] = 550;
           }
}

void update() {

        if(keyPressed) {
          if(key == UP) {
            coords[1] -- ;
        }} 
            
        if(keyPressed) {
          if(key == DOWN) {
            coords[1] ++ ;
        }}
        
        if(keyPressed) {
          if(key == LEFT) {
            coords[0] -- ;
        }} 
            
        if(keyPressed) {
          if(key == RIGHT) {
            coords[0] ++ ;
        }}
}


// Main draw loop
void draw() {
  background(255);
  
  player();
  update(); 
  display();
  edges();

}


// Update Mouse Position
void mouseMoved(){
  x = mouseX;
  y = mouseY;  
}
