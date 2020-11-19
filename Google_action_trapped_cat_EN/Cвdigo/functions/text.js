module.exports = {
    en:{
        translation: {
          WELCOME_MSG:  '<speak> <audio src="https://actions.google.com/sounds/v1/weather/thunder_crack.ogg"/> Welcome to locked cat. You will face many challenges to escape from a house while you discover weird clues about a cat. '
          + ' <audio src="soundbank://soundlibrary/animals/amzn_sfx_cat_long_meow_1x_01"/> Do you think you are brave enough? '
          + " To start you can choose between new game, restart game, continue game or help. </speak>",
          INIT_MSG: "You wake up sweating, due to a terrible nightmare. It's like you were in your bed, in your room, but there's something weird about it. " 
                    + 'The low light coming in through the window lets you see a switch on the wall... What do you want to do next? ',
          CONTINUE_MSG: 'Hello, %s. You have %p points and you are in the %r. You can examine the room to see what you can do. ',
          NO_RETURN_MSG: 'You are not in any room',
          NAME_MSG: 'Your name is %s. You can keep exploring the room. ',
          NO_NAME_MSG: "You still don't have a name. Maybe you can start a new game. ",
          CHANGE_MSG: 'Perfect. Your new name is %s. What do you want to do next? ',
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
          DEFAULT_MSG: 'There is no %s. What do you want to do? ',
          DEFAULT2_MSG: 'There is nothing to examine in that object. You can try with another one. ',
          DEFAULT_TAKE_MSG: "%s is something you can't take. You can try it with the objects in the room. ",
          DEFAULT_RELEASE_MSG: "%s is something you can't drop. You can try it with objects you have in the inventory. ",
          TAKE_OBJECTS_MSG: "You can't take %s. Maybe you can look at it if it's in the same room as you.",
          RELEASE_OBJECTS_MSG: "You can't drop %s. Maybe you can look at it if it's in the same room as you.",
          NO_GAME_SAVED: "You don't have any saved game. Start a new one.",
          ENDED_GAME: 'The previous game is over. Start a new one.',
          USER_VERIFICATION: "I can't save your data because you are a guest. Login with your Google account to save the game. Then you can try again or start a new game. ",
          UNDEFINED: "Your data wasn't stored correctly. It may be due to the settings of your Google account. You can try to activate the checkbox Include Chrome history in the Web and App Activity menu. Then you can try again or start a new game. ",
          CAT_GIVE_MSG: "You must give the cat between one and four objects. ",
          REPROMPT_MSG: 'Tell me what you want to do now.',    
        }
        
    }
}