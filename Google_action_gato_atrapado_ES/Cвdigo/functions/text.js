    module.exports = {
      es:{
          translation: {
            WELCOME_MSG:  '<speak> <audio src="https://actions.google.com/sounds/v1/weather/thunder_crack.ogg"/> Bienvenido a gato atrapado. Deberás enfrentarte a una serie de desafíos para escapar de una casa, mientras vas descubriendo extrañas pistas sobre un felino. '
            + ' <audio src="soundbank://soundlibrary/animals/amzn_sfx_cat_long_meow_1x_01"/> ¿Crees que serás capaz? '
            + 'Para iniciar tu aventura puedes elegir entre nuevo juego, reiniciar juego, continuar juego o ayuda. </speak>',
            INIT_MSG: 'Te despiertas sudando, presa de una pesadilla. Parece que estuvieras en tu cama, en tu habitación, pero hay algo que no cuadra del todo. ' 
                      + 'La poca luz que entra por la ventana te permite ver un interruptor en la pared... ¿Qué quieres hacer?',
            CONTINUE_MSG: 'Hola, %s. Llevas %p puntos y estás en %r. Puedes examinar la habitación para ver lo que puedes hacer. ',
            NO_RETURN_MSG: 'No estás en ninguna habitación. Quizás puedes empezar un nuevo juego. ',
            NAME_MSG: 'Te llamas %s. Puedes seguir explorando la habitación en la que te encuentras. ',
            NO_NAME_MSG: 'Aún no tienes nombre. Quizás puedes comenzar una nueva partida.',
            CHANGE_MSG: 'De acuerdo. Tu nuevo nombre es %s. ¿Qué quieres hacer ahora?',
            SHORT_HELP_MSG: 'El juego tiene cuatro controles básicos: mirar, coger, soltar y usar. Puedes mirar en cualquier dirección y a cualquier objeto. Puedes coger o soltar algunos de los objetos que encuentras. También puede ser útil usar un objeto con otro objeto o usar un objeto en sí mismo. '
                        + ' Algunos ejemplos son: mirar norte, mirar cama, coger martillo, soltar llave, usar linterna, usar llave en puerta. Para escuchar todos los controles, pide la ayuda larga. ',
            HELP_MSG: 'Para jugar debes tener en cuenta que existen dos tipos de objetos: aquellos que puedes guardar en el inventario, como una linterna o una llave, y aquellos que permanecen en la habitación, como una cama, un cuadro... ' 
                      +'En el caso de los objetos que no pueden ser almacenados, puedes decir inspeccionar o mirar para obtener más información sobre los mismos. Para aquellos objetos que sí puedes guardar, puedes decir coger, soltar o usar. '
                      +' Para explorar la habitación, puedes mirar en cualquier dirección: norte, sur, este, oeste, arriba y abajo. Esto te dará la información necesaria para inspeccionar los objetos que veas del modo explicado. ' 
                      +' Puedes combinar dos objetos que tengas en el inventario o usar un objeto del inventario con uno de la habitación diciendo, por ejemplo: usar llave en puerta o combinar pilas y linterna. '
                      + ' Puedes ir de una habitación a otra, diciendo ir a y el nombre de la habitación. También puedes obtener una pista, preguntar dónde estás, cómo te llamas, cuántos puntos tienes, cambiar tu nombre o saber qué tienes en el inventario. '
                      + ' Algunos ejemplos de las posibles acciones son: mirar arriba, mirar cama, coger llave, soltar llave, usar carta (hay objetos del inventario que pueden usarse por sí solos; en este caso leería la carta), usar llave en puerta, '
                      + ' usar pilas con linterna, ir a baño, dónde estoy, qué tengo en el inventario, dame una pista, cómo me llamo, cambiar nombre, cuál es mi puntuación... Si necesitas que te repita los controles vuelve a solicitar ayuda. '
                      + 'Si no, puedes seguir con tu partida explorando la habitación o empezar un nuevo juego. ',
            DEFAULT_MSG: 'No hay %s que examinar. ¿Qué quieres hacer? ',
            DEFAULT2_MSG: 'No ves interés en hacer eso. Puedes probar con otro objeto. ',
            DEFAULT_TAKE_MSG: '%s no es algo que puedas coger. Puedes intentarlo con objetos que estén en la habitación. ',
            DEFAULT_RELEASE_MSG: '%s no es algo que puedas soltar. Puedes intentarlo con objetos que estén en el inventario. ',
            TAKE_OBJECTS_MSG: 'No puedes coger %s. Quizás puedas examinarlo si está en la habitación en la que te encuentras.',
            RELEASE_OBJECTS_MSG: 'No puedes soltar %s. Quizás puedas examinarlo si está en la habitación en la que te encuentras.',
            NO_GAME_SAVED: 'No tienes ninguna partida guardada. Empieza una nueva.',
            ENDED_GAME: 'La partida anterior fue finalizada. Empieza una nueva.',
            USER_VERIFICATION: 'No puedo guardar tus datos porque eres un usuario invitado. Prueba a registrarte en tu cuenta de Google para que tus partidas se guarden. Después puedes volver a intentarlo o empezar una nueva partida. ',
            UNDEFINED: 'No se han guardado tus datos correctamente. Puede deberse a la configuración de tu cuenta de Google. Puedes probar a activar la casilla Incluir el historial de Chrome en el menú Actividad en la Web y en Aplicaciones. Después puedes volver a intentarlo o empezar un nuevo juego. ',
            CAT_GIVE_MSG: 'Debes darle entre uno y cuatro objetos al gato. ',
            REPROMPT_MSG: 'Dime qué quieres hacer ahora.'
          }
      }
  }