define(['three'], function(THREE) {
  var id_gen_names = ['Jacob','Michael','Matthew','Joshua','Emily','Christopher','Nicholas','Hannah','Andrew','Joseph','Daniel','Tyler','Madison','William','Brandon','Ryan','John','Zachary','David','Anthony','Ashley','Sarah','Alexis','Samantha','James','Justin','Alexander','Jonathan','Jessica','Christian','Austin','Taylor','Elizabeth','Dylan','Ethan','Lauren','Benjamin','Noah','Alyssa','Samuel','Kayla','Robert','Abigail','Brianna','Olivia','Emma','Nathan','Cameron','Kevin','Thomas','Jose','Hunter','Jordan','Kyle','Megan','Grace','Victoria','Rachel','Anna','Sydney','Destiny','Morgan','Caleb','Jennifer','Jason','Logan','Aaron','Jasmine','Haley','Kaitlyn','Julia','Eric','Nicole','Brian','Amanda','Gabriel','Katherine','Natalie','Hailey','Adam','Jack','Isaiah','Alexandra','Juan','Luis','Connor','Charles','Elijah','Isaac','Savannah','Chloe','Rebecca','Stephanie','Steven','Evan','Jared','Sean','Timothy','Maria','Luke','Cody','Sophia','Nathaniel','Alex','Seth','Mackenzie','Allison','Isabella','Mason','Amber','Mary','Danielle','Richard','Carlos','Angel','Patrick','Devin','Gabrielle','Bryan','Jordan','Cole','Jackson','Brooke','Ian','Garrett','Michelle','Sierra','Katelyn','Trevor','Andrea','Jesus','Madeline','Sara','Kimberly','Courtney','Chase','Erin','Brittany','Vanessa','Adrian','Jacqueline','Jenna','Caroline','Faith','Mark','Blake','Makayla','Sebastian','Antonio','Bailey','Paige','Lucas','Shelby','Melissa','Jeremy','Kaylee','Gavin','Miguel','Julian','Dakota','Christina','Alejandro','Trinity','Jesse','Dalton','Bryce','Caitlin','Mariah','Tanner','Autumn','Marissa','Kenneth','Stephen','Jake','Victor','Spencer','Angela','Breanna','Catherine','Zoe','Briana','Jada','Laura','Claire','Alexa','Kelsey','Kathryn','Marcus','Leslie','Paul','Alexandria','Brendan','Jeremiah','Xavier','Sabrina','Isabel','Mia','Jeffrey','Molly','Leah','Katie','Tristan','Cheyenne','Gabriella','Jalen','Jorge','Edward','Cassandra','Tiffany','Riley','Wyatt','Colton','Joel','Erica','Maxwell','Lindsey','Kylie','Diana','Amy','Cassidy','Mikayla','Ariana','Aidan','Travis','Shane','Margaret','Colin','Dominic','Carson','Vincent','Kelly','Derek','Miranda','Oscar','Grant','Maya','Eduardo','Peter','Henry','Melanie','Parker','Hayden','Collin','George','Bradley','Audrey','Jade','Mitchell','Gabriela','Devon'];
  var id_gen_counter = Math.floor(Math.random() * id_gen_names.length);

  function generateId() {
    id_gen_counter = (id_gen_counter + 1) % id_gen_names.length;
    return id_gen_names[id_gen_counter];
  }

  function isFloat(value) {
    if (!value.toString().match(/^-?[0-9]+([.][0-9]+)?$/)) return false;  // if not 123.4567
    return true;
  }

  function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++ ) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

  function makeTextSprite( message, parameters ) {
    if ( parameters === undefined ) parameters = {};
    
    var fontface = parameters.hasOwnProperty("fontface") ? 
      parameters["fontface"] : "Arial";
    
    var fontsize = parameters.hasOwnProperty("fontsize") ? 
      parameters["fontsize"] : 18;
    
    var backgroundColor = parameters.hasOwnProperty("backgroundColor") ?
      parameters["backgroundColor"] : { r:255, g:255, b:255, a:1.0 };
       
    var canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    var context = canvas.getContext('2d');
    context.font = fontsize + "px " + fontface;
      
    // get size data (height depends only on font size)
    var metrics = context.measureText( message );
    var textWidth = metrics.width;
    
    // background color
    context.fillStyle   = "rgba(" + backgroundColor.r + "," + backgroundColor.g + ","
                    + backgroundColor.b + "," + backgroundColor.a + ")";    
    // text color
    context.fillStyle = "rgba(0, 0, 0, 1.0)";
    context.fillText( message, 0, fontsize);
    
    // canvas contents will be used for a texture
    var texture = new THREE.Texture(canvas) 
    texture.needsUpdate = true;
    var spriteMaterial = new THREE.SpriteMaterial( { map: texture } );
    var sprite = new THREE.Sprite( spriteMaterial );
    sprite.scale.set(10,10,1.0);
    return sprite;  
  }


  return {
    generateId: generateId,
    isFloat: isFloat,
    getRandomColor: getRandomColor,
    makeTextSprite: makeTextSprite,
  }
});