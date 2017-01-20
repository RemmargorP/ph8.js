define(function() {
  var id_gen_names = ['Jacob','Michael','Matthew','Joshua','Emily','Christopher','Nicholas','Hannah','Andrew','Joseph','Daniel','Tyler','Madison','William','Brandon','Ryan','John','Zachary','David','Anthony','Ashley','Sarah','Alexis','Samantha','James','Justin','Alexander','Jonathan','Jessica','Christian','Austin','Taylor','Elizabeth','Dylan','Ethan','Lauren','Benjamin','Noah','Alyssa','Samuel','Kayla','Robert','Abigail','Brianna','Olivia','Emma','Nathan','Cameron','Kevin','Thomas','Jose','Hunter','Jordan','Kyle','Megan','Grace','Victoria','Rachel','Anna','Sydney','Destiny','Morgan','Caleb','Jennifer','Jason','Logan','Aaron','Jasmine','Haley','Kaitlyn','Julia','Eric','Nicole','Brian','Amanda','Gabriel','Katherine','Natalie','Hailey','Adam','Jack','Isaiah','Alexandra','Juan','Luis','Connor','Charles','Elijah','Isaac','Savannah','Chloe','Rebecca','Stephanie','Steven','Evan','Jared','Sean','Timothy','Maria','Luke','Cody','Sophia','Nathaniel','Alex','Seth','Mackenzie','Allison','Isabella','Mason','Amber','Mary','Danielle','Richard','Carlos','Angel','Patrick','Devin','Gabrielle','Bryan','Jordan','Cole','Jackson','Brooke','Ian','Garrett','Michelle','Sierra','Katelyn','Trevor','Andrea','Jesus','Madeline','Sara','Kimberly','Courtney','Chase','Erin','Brittany','Vanessa','Adrian','Jacqueline','Jenna','Caroline','Faith','Mark','Blake','Makayla','Sebastian','Antonio','Bailey','Paige','Lucas','Shelby','Melissa','Jeremy','Kaylee','Gavin','Miguel','Julian','Dakota','Christina','Alejandro','Trinity','Jesse','Dalton','Bryce','Caitlin','Mariah','Tanner','Autumn','Marissa','Kenneth','Stephen','Jake','Victor','Spencer','Angela','Breanna','Catherine','Zoe','Briana','Jada','Laura','Claire','Alexa','Kelsey','Kathryn','Marcus','Leslie','Paul','Alexandria','Brendan','Jeremiah','Xavier','Sabrina','Isabel','Mia','Jeffrey','Molly','Leah','Katie','Tristan','Cheyenne','Gabriella','Jalen','Jorge','Edward','Cassandra','Tiffany','Riley','Wyatt','Colton','Joel','Erica','Maxwell','Lindsey','Kylie','Diana','Amy','Cassidy','Mikayla','Ariana','Aidan','Travis','Shane','Margaret','Colin','Dominic','Carson','Vincent','Kelly','Derek','Miranda','Oscar','Grant','Maya','Eduardo','Peter','Henry','Melanie','Parker','Hayden','Collin','George','Bradley','Audrey','Jade','Mitchell','Gabriela','Devon'];
  var id_gen_counter = Math.floor(Math.random() * id_gen_names.length);

  function generateId() {
    id_gen_counter = (id_gen_counter + 1) % id_gen_names.length;
    return id_gen_names[id_gen_counter];
  }

  return {
    generateId: generateId
  }
});