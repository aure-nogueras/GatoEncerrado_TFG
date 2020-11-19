module.exports = {
    es:{
        translation: {
          WELCOME_MSG:  'Bienvenido a tu aventura. Puedes elegir entre nuevo juego, reiniciar juego o ayuda. También puedes preguntar dónde estoy, cómo me llamo, cuántos puntos tengo o qué hay en el inventario para comprobar si tienes alguna partida anterior a medias.',
          INIT_MSG: 'Te despiertas sudando, presa de una pesadilla. Parece que estuvieras en tu cama, en tu habitación, pero hay algo que no cuadra del todo. ' 
                    + 'La poca luz que entra por la ventana te permite ver un interruptor en la pared...',
          NAME_MSG: 'Te llamas %s',
          NO_NAME_MSG: 'Aún no tienes nombre',
          CHANGE_MSG: 'De acuerdo. Tu nuevo nombre es %s',
          HELP_MSG: 'Para jugar debes tener en cuenta que existen dos tipos de objetos: aquellos que puedes guardar en el inventario, como una linterna o una llave, y aquellos que permanecen en la habitación, como una cama, un cuadro... ' 
                    +'En el caso de los objetos que no pueden ser almacenados, puedes decir inspeccionar o mirar para obtener más información sobre los mismos. Para aquellos objetos que sí puedes guardar, puedes decir coger, soltar o usar. '
                    +' Para explorar la habitación, puedes mirar en cualquier dirección: norte, sur, este, oeste, arriba y abajo. Esto te dará la información necesaria para inspeccionar los objetos que veas del modo explicado. ' 
                    +' Puedes usar un objeto del inventario con uno de la habitación diciendo, por ejemplo: usar llave en puerta. '
                    + ' También puedes obtener una pista, preguntar dónde estás, cómo te llamas, cuántos puntos tienes, cambiar tu nombre o saber qué tienes en el inventario. '
                    + ' Algunos ejemplos de las posibles acciones son: mirar arriba, mirar cama, coger llave, soltar llave, usar llave en puerta, '
                    + ' dónde estoy, qué tengo en el inventario, dame una pista, cómo me llamo, cambiar nombre, cuál es mi puntuación... Si necesitas que te repita los controles vuelve a solicitar ayuda. ',
          DEFAULT_MSG: 'No hay %s o no hay nada que examinar en dicho objeto.',
          GOODBYE_MSG: '¡Hasta luego!',
          ERROR_MSG: 'Lo siento, no te he entendido. Prueba otra vez.',
          REPROMPT_MSG: 'Te dejo un momento para pensar.'
        }
    },
    en:{
        translation: {
          WELCOME_MSG:  "Welcome to your adventure. You can choose new game, restart game or help. You can also ask where am I, what's my name, what's my score or what's in my inventory to check if you have a previous game unfinished.",
          INIT_MSG: "You wake up sweating, due to a terrible nightmare. It's like you were in your bed, in your room, but there's something weird about it. " 
                    + 'The low light coming in through the window lets you see a switch on the wall...',
          NAME_MSG: 'Your name is %s',
          NO_NAME_MSG: "You still don't have a name",
          CHANGE_MSG: 'Perfect. Your new name is %s',
          HELP_MSG: "To play you need to know that there are two types of objects: those you can keep in the inventory, like a lantern or a key, and those you can't take out of the room, like a bed, a painting... " 
                    +"You can look or examine the objects you can't save in the inventory to obtain more information about them. For those objects you can keep, you can say take, drop or use. "
                    +' To explore the room, you can look in any direction: north, south, east, west, up and down. This will give you enough information to examine the objects you see. ' 
                    +' You can use one object of the inventory with an object of the room. For example, you can say: use key in door. '
                    + " Furthermore, you can obtain a clue, ask where are you, what's in your inventory, what's your name, what's your score or change your name. "
                    + " Some examples of the actions you can do: look up, look bed, take key, drop key, use key in door, "
                    + " where am I, what's in my inventory, give me a clue, what's my name, what's my score, change name... "
                    + ' If you need the controls to be repeated, ask for help again.',
          DEFAULT_MSG: 'There is no % or there is nothing to examine in that object.',
          GOODBYE_MSG: 'See you!',
          ERROR_MSG: "Sorry, I haven't understood you. Try again.",
          REPROMPT_MSG: 'I let you think for a second.'
        }
        
    }
}