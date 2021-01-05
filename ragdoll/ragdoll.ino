#include <Arduino_LSM9DS1.h>

#define dislikeZ -14

#define shakeZ 2.7

#define turnRightY 57
#define turnLeftY 30

#define flexIncreaseComedy 300
#define flexDecreaseComedy 560
#define flexIncreaseHorror 320
#define flexDecreaseHorror 625
#define flexIncreaseRomance 280
#define flexDecreaseRomance 625
#define flexIncreaseDrama 460
#define flexDecreaseDrama 650
#define flexIncreaseAdventure 300
#define flexDecreaseAdventure 630

#define minButtonLongPressDuration 1500
#define minPressSensorLongPressDuration 2000

#define intervalButton 50
#define pressSensorInterval 50
#define buttonPin 13

#define pressSensorPin A0
#define flex1 A1
#define flex2 A2
#define flex3 A3
#define flex4 A4
#define flex5 A5

int flex1value;
int flex2value;
int flex3value;
int flex4value;
int flex5value;

float accelerometerX, accelerometerY, accelerometerZ, x, y, z, totalAcceleration;
float magneticX, magneticY, magneticZ;

int buttonStatePrevious;
int pressSensorStatePrevious;
                      
unsigned long buttonLongPressMillis;
unsigned long previousButtonMillis;// Timestamp of the latest reading
unsigned long buttonPressDuration;// Time the button is pressed in ms
unsigned long currentMillis;// Number of seconds since the Arduino has started
    
unsigned long pressSensorLongPressMillis;                // Time in ms when we the button was pressed                      
unsigned long previousPressSensorMillis;                 // Timestamp of the latest reading
unsigned long pressSensorPressDuration;                  // Time the button is pressed in ms
unsigned long currentMillisPressSensor; 

bool buttonStateLongPress;
bool idleFlag;
bool pressSensorStateLongPress;

void setup() {
  
  Serial.begin(9600);
  while(!Serial);

  if (!IMU.begin())
  {
    Serial.println("Failed to initialize IMU!");    
    while(1);
  }
   
  pinMode(buttonPin, INPUT); //button sensor in D13

  flex1value, flex2value, flex3value, flex4value, flex5value = 0; 

  x,y,z,totalAcceleration = 0;

  buttonStatePrevious = LOW;
  buttonStateLongPress = false;
  idleFlag=true;

  pressSensorStatePrevious = LOW;  
  pressSensorStateLongPress = false; 
}

void loop() {
  currentMillis = millis();    // store the current time    
  readButtonState();
  
  if (idleFlag){ //if idle state is on, then nothing happens
    Serial.println("rd_standby");
    delay(1000); //prevents repetitive messages
  }  
  else //if idle state is off, then sensors work
  {      
    IMU.readAcceleration(accelerometerX, accelerometerY,accelerometerZ); //reads accelerometer
    IMU.readMagneticField(magneticX, magneticY, magneticZ); //reads magnetometer    
    delay(60); //avoids bouncing    
          
    if((magneticZ < dislikeZ)) //if enough dislike movement happens
    {
      Serial.println("dislike"); //sends dislike action
      delay(1000); //prevents repetitive messages           
    }
    else {//if the movement is not a dislike, then checks if accelerometer is measuring a shake
      for (int i=0;i<10;i++){ //takes a sample of 10 readings for x,y,z axis         
        x += accelerometerX;
        y += accelerometerY;
        z += accelerometerZ;
        delay(1); 
      }
      x /=10;//calculates average for each axis
      y /=10;//calculates average for each axis       
      z /=10;//calculates average for each axis
      totalAcceleration = sqrt(x*x + y*y + z*z); //calculates acceleration of the movement       
      if (totalAcceleration > shakeZ){ //checks if the the single variable is higher than a predefined level of shaking
        Serial.println("shake"); //if the shake is big enough, sends shake action
        delay(1000); //prevents repetitive messages          
      }        
    }           
    if((magneticY<turnLeftY)) //if enough left movement happens
    {
      Serial.println("turn_left"); //sends left action
      delay(900); //prevents repetitive messages           
    }  
    else if((magneticY>turnRightY)) //if enough right movement happens
    {
      Serial.println("turn_right"); //sends right action
      delay(1000); //prevents repetitive messages           
    }
    
    currentMillisPressSensor = millis(); //time for press sensor
    readPressSensorState();

    flex1value = analogRead(flex1); //comedy flex sensor
    if (flex1value<flexIncreaseComedy) //if comedy if flexed up
    {
      Serial.println("increase_comedy"); //sends increase comedy action
      delay(1250); //prevents repetitive messages
    }
    else if (flex1value>flexDecreaseComedy) //if comedy if flexed down
    {
      Serial.println("decrease_comedy"); //sends decrease comedy action
      delay(1250); //prevents repetitive messages
    }

    flex2value = analogRead(flex2); //horror flex sensor
    if (flex2value<flexIncreaseHorror) //if horror if flexed up
    {
      Serial.println("increase_horror"); //sends increase horror action
      delay(1250); //prevents repetitive messages
    }
    else if (flex2value>flexDecreaseHorror) //if horror if flexed down
    {
      Serial.println("decrease_horror"); //sends decrease horror action
      delay(1250); //prevents repetitive messages
    }

    flex3value = analogRead(flex3); //romance flex sensor
    if (flex3value<flexIncreaseRomance) //if romance if flexed up
    {
      Serial.println("increase_romance"); //sends increase romance action
      delay(1250); //prevents repetitive messages
    }
    else if (flex3value>flexDecreaseRomance) //if romance if flexed down
    {
      Serial.println("decrease_romance"); //sends decrease romance action
      delay(1250); //prevents repetitive messages
    }

    flex4value = analogRead(flex4); //drama flex sensor
    if (flex4value<flexIncreaseDrama) //if drama if flexed up
    {
      Serial.println("decrease_drama"); //sends increase drama action
      delay(1250); //prevents repetitive messages
    }
    else if (flex4value>flexDecreaseDrama) //if drama if flexed down
    {
      Serial.println("increase_drama"); //sends decrease drama action
      delay(1250); //prevents repetitive messages
    }

    flex5value = analogRead(flex5); //adventure flex sensor
    if (flex5value<flexIncreaseAdventure) //if adventure if flexed up
    {
      Serial.println("increase_adventure"); //sends increase adventure action
      delay(1250); //prevents repetitive messages
    }
    else if (flex5value>flexDecreaseAdventure) //if adventure if flexed down
    {
      Serial.println("decrease_adventure"); //sends decrease adventure action
      delay(1250); //prevents repetitive messages
    }
  }
}

void readButtonState() {

  // If the difference in time between the previous reading is larger than intervalButton
  if(currentMillis - previousButtonMillis > intervalButton) {
    
    // Read the digital value of the button (LOW/HIGH)
    int buttonState = digitalRead(buttonPin);    

    // If the button has been pushed AND
    // If the button wasn't pressed before AND
    // IF there was not already a measurement running to determine how long the button has been pressed
    if (buttonState == HIGH && buttonStatePrevious == LOW && !buttonStateLongPress) {
      buttonLongPressMillis = currentMillis;
      buttonStatePrevious = HIGH;      
    }
    // Calculate how long the button has been pressed
    buttonPressDuration = currentMillis - buttonLongPressMillis;

    // If the button is pressed AND
    // If there is no measurement running to determine how long the button is pressed AND
    // If the time the button has been pressed is larger or equal to the time needed for a long press
    if (buttonState == HIGH && !buttonStateLongPress && buttonPressDuration >= minButtonLongPressDuration) {
      buttonStateLongPress = true;
      if (idleFlag == true){
        Serial.println("rd_active");
      }
      idleFlag=!idleFlag;
    }
      
    // If the button is released AND
    // If the button was pressed before
    if (buttonState == LOW && buttonStatePrevious == HIGH) {
      buttonStatePrevious = LOW;
      buttonStateLongPress = false;     
    }    
    // store the current timestamp in previousButtonMillis
    previousButtonMillis = currentMillis;
  }
}

void readPressSensorState() {

  // If the difference in time between the previous reading is larger than pressSensorInterval
  if(currentMillisPressSensor - previousPressSensorMillis > pressSensorInterval) {
    
    // Read the digital value of the button (LOW/HIGH)
    int pressSensorState = analogRead(pressSensorPin);          

    // If the button has been pushed AND
    // If the button wasn't pressed before AND
    // IF there was not already a measurement running to determine how long the button has been pressed
    if ((pressSensorState > 900) && pressSensorStatePrevious == LOW && !pressSensorStateLongPress) {       
      pressSensorLongPressMillis = currentMillisPressSensor;
      pressSensorStatePrevious = HIGH;      
    }

    // Calculate how long the button has been pressed
    pressSensorPressDuration = currentMillisPressSensor - pressSensorLongPressMillis;

    // If the button is pressed AND
    // If there is no measurement running to determine how long the button is pressed AND
    // If the time the button has been pressed is larger or equal to the time needed for a long press
    if ((pressSensorState > 900) && !pressSensorStateLongPress && pressSensorPressDuration >= minPressSensorLongPressDuration) {
      pressSensorStateLongPress = true;
      Serial.println("explanation");
      delay(800); //prevents repetitive messages
    }
      
    // If the button is released AND
    // If the button was pressed before
    if ((pressSensorState < 900) && pressSensorStatePrevious == HIGH) {
      pressSensorStatePrevious = LOW;
      pressSensorStateLongPress = false;      

      // If there is no measurement running to determine how long the button was pressed AND
      // If the time the button has been pressed is smaller than the minimal time needed for a long press
      // Note: The video shows:
      //       if (!pressSensorStateLongPress && pressSensorPressDuration < minPressSensorLongPressDuration) {
      //       since pressSensorStateLongPress is set to FALSE on line 75, !pressSensorStateLongPress is always TRUE
      //       and can be removed.
      if (pressSensorPressDuration < minPressSensorLongPressDuration) {
        Serial.println("play");
        delay(800); //prevents repetitive messages
      }
    }    
    // store the current timestamp in previousPressSensorMillis
    previousPressSensorMillis = currentMillisPressSensor;
  }
}
