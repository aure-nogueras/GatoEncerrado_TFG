const IMG_ES_URLS = {
  "alcohol": "https://soundgato.s3.eu-west-3.amazonaws.com/alcohol.png",
  "pilas": "https://soundgato.s3.eu-west-3.amazonaws.com/batteries.jpg",
  "radiografía": "https://soundgato.s3.eu-west-3.amazonaws.com/bones.png",
  "cuenco": "https://soundgato.s3.eu-west-3.amazonaws.com/bowl.png",
  "llaves coche": "https://soundgato.s3.eu-west-3.amazonaws.com/car_key.png",
  "tarjeta": "https://soundgato.s3.eu-west-3.amazonaws.com/card.png",
  "gato": "https://soundgato.s3.eu-west-3.amazonaws.com/cat.png",
  "comida de gato": "https://soundgato.s3.eu-west-3.amazonaws.com/cat_food.jpg",
  "silla": "https://soundgato.s3.eu-west-3.amazonaws.com/chair.png",
  "linterna": "https://soundgato.s3.eu-west-3.amazonaws.com/flashlight.jpg",
  "llave dorada": "https://soundgato.s3.eu-west-3.amazonaws.com/golden_key.png",
  "martillo": "https://soundgato.s3.eu-west-3.amazonaws.com/hammer.png",
  "llave": "https://soundgato.s3.eu-west-3.amazonaws.com/key.jpg",
  "carta": "https://soundgato.s3.eu-west-3.amazonaws.com/letter.png",
  "ratón de juguete": "https://soundgato.s3.eu-west-3.amazonaws.com/mouse.jpg",
  "nota": "https://soundgato.s3.eu-west-3.amazonaws.com/note.png",
  "foto": "https://soundgato.s3.eu-west-3.amazonaws.com/photo.jpg",
  "veneno": "https://soundgato.s3.eu-west-3.amazonaws.com/poison.png",
  "mando garaje": "https://soundgato.s3.eu-west-3.amazonaws.com/remote_control.png",
  "destornillador": "https://soundgato.s3.eu-west-3.amazonaws.com/screwdriver.png",
  "papel higiénico": "https://soundgato.s3.eu-west-3.amazonaws.com/toilet_paper.png",
  "ovillo de lana": "https://soundgato.s3.eu-west-3.amazonaws.com/wool.png",
  "reproductor": "https://soundgato.s3.eu-west-3.amazonaws.com/mp3.png",
  "papel": "https://soundgato.s3.eu-west-3.amazonaws.com/paper.jpg"
};
const IMG_EN_URLS = {
  "rubbing alcohol": "https://soundgato.s3.eu-west-3.amazonaws.com/alcohol.png",
  "batteries": "https://soundgato.s3.eu-west-3.amazonaws.com/batteries.jpg",
  "bone scan": "https://soundgato.s3.eu-west-3.amazonaws.com/bones.png",
  "bowl": "https://soundgato.s3.eu-west-3.amazonaws.com/bowl.png",
  "car keys": "https://soundgato.s3.eu-west-3.amazonaws.com/car_key.png",
  "card": "https://soundgato.s3.eu-west-3.amazonaws.com/card.png",
  "cat": "https://soundgato.s3.eu-west-3.amazonaws.com/cat.png",
  "cat food": "https://soundgato.s3.eu-west-3.amazonaws.com/cat_food.jpg",
  "chair": "https://soundgato.s3.eu-west-3.amazonaws.com/chair.png",
  "flashlight": "https://soundgato.s3.eu-west-3.amazonaws.com/flashlight.jpg",
  "golden key": "https://soundgato.s3.eu-west-3.amazonaws.com/golden_key.png",
  "hammer": "https://soundgato.s3.eu-west-3.amazonaws.com/hammer.png",
  "key": "https://soundgato.s3.eu-west-3.amazonaws.com/key.jpg",
  "letter": "https://soundgato.s3.eu-west-3.amazonaws.com/letter.png",
  "toy mouse": "https://soundgato.s3.eu-west-3.amazonaws.com/mouse.jpg",
  "note": "https://soundgato.s3.eu-west-3.amazonaws.com/note.png",
  "photo": "https://soundgato.s3.eu-west-3.amazonaws.com/photo.jpg",
  "poison": "https://soundgato.s3.eu-west-3.amazonaws.com/poison.png",
  "garage control": "https://soundgato.s3.eu-west-3.amazonaws.com/remote_control.png",
  "screwdriver": "https://soundgato.s3.eu-west-3.amazonaws.com/screwdriver.png",
  "toilet paper": "https://soundgato.s3.eu-west-3.amazonaws.com/toilet_paper.png",
  "ball of wool": "https://soundgato.s3.eu-west-3.amazonaws.com/wool.png",
  "player": "https://soundgato.s3.eu-west-3.amazonaws.com/mp3.png",
  "paper": "https://soundgato.s3.eu-west-3.amazonaws.com/paper.jpg"
};

module.exports = {
    es:{
        translation: {
          IMGS: IMG_ES_URLS,
          HINT: 'nuevo juego',
          WELCOME_MSG:  '<audio src="soundbank://soundlibrary/nature/amzn_sfx_lightning_strike_02"/> <voice name="Enrique"> Bienvenido a gato encerrado. Deberás enfrentarte a una serie de desafíos para escapar de una casa, mientras vas descubriendo extrañas pistas sobre un felino. '
                    + ' <audio src="soundbank://soundlibrary/animals/amzn_sfx_cat_long_meow_1x_01"/> ¿Crees que serás capaz? '
                    + 'Para iniciar tu aventura puedes elegir entre nuevo juego, reiniciar juego, continuar juego o ayuda. </voice>',
          INIT_MSG: 'Te despiertas sudando, presa de una pesadilla. Parece que estuvieras en tu cama, en tu habitación, pero hay algo que no cuadra del todo. ' 
                    + 'La poca luz que entra por la ventana te permite ver un interruptor en la pared...',
          CONTINUE_MSG: 'Hola, %s. Llevas %s puntos y estás en %s.',
          NO_RETURN_MSG: 'No estás en ninguna habitación',
          RETURN_MSG: 'Mostrando la habitación en la que te encuentras',
          NAME_MSG: 'Te llamas %s',
          NO_NAME_MSG: 'Aún no tienes nombre',
          CHANGE_MSG: 'De acuerdo. Tu nuevo nombre es %s',
          SHORT_HELP_MSG: 'El juego tiene cuatro controles básicos: mirar, coger, soltar y usar. Puedes mirar en cualquier dirección y a cualquier objeto. Puedes coger o soltar algunos de los objetos que encuentras. También puede ser útil usar un objeto con otro objeto o usar un objeto en sí mismo. '
                        + ' Algunos ejemplos son: mirar norte, mirar cama, coger martillo, soltar llave, usar linterna, usar llave en puerta. Para escuchar todos los controles, pide la ayuda larga. ',
          HELP_MSG: 'Para jugar debes tener en cuenta que existen dos tipos de objetos: aquellos que puedes guardar en el inventario, como una linterna o una llave, y aquellos que permanecen en la habitación, como una cama, un cuadro... ' 
                    +'En el caso de los objetos que no pueden ser almacenados, puedes decir inspeccionar o mirar para obtener más información sobre los mismos. Para aquellos objetos que sí puedes guardar, puedes decir coger, soltar o usar. '
                    +' Para explorar la habitación, puedes mirar en cualquier dirección: norte, sur, este, oeste, arriba y abajo. Esto te dará la información necesaria para inspeccionar los objetos que veas del modo explicado. ' 
                    +' Puedes combinar dos objetos que tengas en el inventario o usar un objeto del inventario con uno de la habitación diciendo, por ejemplo: usar llave en puerta o combinar pilas y linterna. '
                    + ' Puedes ir de una habitación a otra, diciendo ir a y el nombre de la habitación. También puedes obtener una pista, preguntar dónde estás, cómo te llamas, cuántos puntos tienes, cambiar tu nombre o saber qué tienes en el inventario. '
                    + ' Algunos ejemplos de las posibles acciones son: mirar arriba, mirar cama, coger llave, soltar llave, usar carta (hay objetos del inventario que pueden usarse por sí solos; en este caso leería la carta), usar llave en puerta, '
                    + ' usar pilas con linterna, ir a baño, dónde estoy, qué tengo en el inventario, dame una pista, cómo me llamo, cambiar nombre, cuál es mi puntuación... Si necesitas que te repita los controles vuelve a solicitar ayuda. ',
          DEFAULT_MSG: 'No hay %s que examinar.',
          DEFAULT2_MSG: 'No ves interés en hacer eso. ',
          DEFAULT_TAKE_MSG: '%s no es algo que puedas coger',
          DEFAULT_RELEASE_MSG: '%s no es algo que puedas soltar',
          TAKE_OBJECTS_MSG: 'No puedes coger %s. Quizás puedas examinarlo si está en la habitación en la que te encuentras.',
          RELEASE_OBJECTS_MSG: 'No puedes soltar %s. Quizás puedas examinarlo si está en la habitación en la que te encuentras.',
          GOODBYE_MSG: '¡Hasta luego!',
          ERROR_MSG: 'Lo siento, no te he entendido. Prueba otra vez.',
          REPROMPT_MSG: 'Te dejo un momento para pensar.',
          WIN_MSG: '¡Has conseguido escapar!',
          LOSE_MSG: '¡Oh, has perdido!',
          GET_NAME_MSG: 'Nombre: %s',
          GET_POINTS_MSG: 'Puntuación: %s puntos',
          TITLE_MSG: 'Gato encerrado',
          BUTTON_CLUE: 'Pista',
          BUTTON_INVENTORY: 'Ver inventario',
          BUTTON_ROOM: 'Ver habitación',
          BUTTON_RELOAD: 'Recargar inventario',
          NO_GAME_SAVED: 'No tienes ninguna partida guardada. Empieza una nueva.',
          ENDED_GAME: 'La partida anterior fue finalizada. Empieza una nueva.'
        }
    },
    en:{
        translation: {
          IMGS: IMG_EN_URLS,
          HINT: 'new game',
          WELCOME_MSG: '<audio src="soundbank://soundlibrary/nature/amzn_sfx_lightning_strike_02"/> <voice name="Matthew"> Welcome to locked cat. You will face many challenges to escape from a house while you discover weird clues about a cat. '
                    + ' <audio src="soundbank://soundlibrary/animals/amzn_sfx_cat_long_meow_1x_01"/> Do you think you are brave enough? '
                    + " To start you can choose between new game, restart game, continue game or help. </voice>",
          INIT_MSG: "You wake up sweating, due to a terrible nightmare. It's like you were in your bed, in your room, but there's something weird about it. " 
                    + 'The low light coming in through the window lets you see a switch on the wall...',
          CONTINUE_MSG: 'Hello, %s. You have %s points and you are in the %s.',
          NO_RETURN_MSG: 'You are not in any room',
          RETURN_MSG: 'Showing the room you are in',
          NAME_MSG: 'Your name is %s',
          NO_NAME_MSG: "You still don't have a name",
          CHANGE_MSG: 'Perfect. Your new name is %s',
          SHORT_HELP_MSG: 'The game has four basic controls: look, take, drop and use. You can look in any direction and you can look any object. You can take and drop some of the objects. It can also be useful to use an object with another object or to use an object itself. '
                        + 'Some of the examples are: look north, look bed, take hammer, drop key, use flashlight, use key in door. If you want to know all the controls, ask for the long help. ',
          HELP_MSG: "To play you need to know that there are two types of objects: those you can keep in the inventory, like a flashlight or a key, and those you can't take out of the room, like a bed, a painting... " 
                    +"You can look or examine the objects you can't save in the inventory to obtain more information about them. For those objects you can keep, you can say take, drop or use. "
                    +' To explore the room, you can look in any direction: north, south, east, west, up and down. This will give you enough information to examine the objects you see. ' 
                    +' You can combine two objects of the inventory or use one object of the inventory with an object of the room. For example, you can say: use key in door or combine lantern with batteries. '
                    + " You can go to another room saying: go to and the name of the room. Furthermore, you can obtain a clue, ask where are you, what's in your inventory, what's your name, what's your score or change your name.. "
                    + " Some examples of the actions you can do: look up, look bed, take key, drop key, use letter (some objects of the inventory can be used individually; in this case we would read the letter), use key in door, "
                    + " combine batteries and flashlight, go to the bathroom, where am I, what's in my inventory, give me a clue, what's my name, what's my score, change name... "
                    + ' If you need the controls to be repeated, ask for help again.',
          DEFAULT_MSG: 'There is no %s.',
          DEFAULT2_MSG: 'There is nothing to examine in that object. ',
          DEFAULT_TAKE_MSG: "%s is something you can't take",
          DEFAULT_RELEASE_MSG: "%s is something you can't drop",
          TAKE_OBJECTS_MSG: "You can't take %s. Maybe you can look at it if it's in the same room as you.",
          RELEASE_OBJECTS_MSG: "You can't drop %s. Maybe you can look at it if it's in the same room as you.",
          WHERE_MSG: "You are in %s",
          GOODBYE_MSG: 'See you!',
          ERROR_MSG: "Sorry, I haven't understood you. Try again.",
          REPROMPT_MSG: 'I let you think for a second.',
          WIN_MSG: 'You escaped!',
          LOSE_MSG: 'Oh, you lost!',
          GET_NAME_MSG: 'Name: %s',
          GET_POINTS_MSG: 'Points: %s points',
          TITLE_MSG: 'Locked cat',
          BUTTON_CLUE: 'Clue',
          BUTTON_INVENTORY: 'See inventory',
          BUTTON_ROOM: 'Back to room',
          BUTTON_RELOAD: 'Reload inventory',
          NO_GAME_SAVED: "You don't have any saved game. Start a new one.",
          ENDED_GAME: 'The previous game is over. Start a new one.'
        }
        
    }
}