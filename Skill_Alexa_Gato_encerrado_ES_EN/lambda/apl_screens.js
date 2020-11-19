const util = require('./util')
const languageStrings = require('./text')

// This document contains functions to get the different screens during the game

module.exports = {
    // Launch screen
    launchScreen(handlerInput, header, hint){
        if(util.supportsAPL(handlerInput)) {
        handlerInput.responseBuilder
          .addDirective({
            type: 'Alexa.Presentation.APL.RenderDocument',
            document: require('./documents/launchScreen.json'), 
            datasources: {
                    launchData: {
                        type: 'object',
                        properties: {
                            headerTitle: header,
                            hintString: hint,
                        },
                        transformers: [{
                            inputPath: 'hintString',
                            transformer: 'textToHint',
                        }]
                    },
                },
            });
        }  
    },
    // Screen of the room where the player is located
    getRoom(handlerInput, room, url, title1, title2){
        if(util.supportsAPL(handlerInput)) {
        handlerInput.responseBuilder
          .addDirective({
            type: 'Alexa.Presentation.APL.RenderDocument',
            document: require('./documents/room.json'), 
            datasources: {
                    launchData: {
                        type: 'object',
                        properties: {
                            headerTitle: room,
                            img: url,
                            title1: title1,
                            title2: title2
                        }
                    },
                },
            });
        }
    },
    // Screen of the side of the room the player is looking at
    getRoomSides(handlerInput, room_title, url, title1, title2, title3){
        if(util.supportsAPL(handlerInput)) {
        handlerInput.responseBuilder
          .addDirective({
            type: 'Alexa.Presentation.APL.RenderDocument',
            document: require('./documents/room-sides.json'), 
            datasources: {
                    launchData: {
                        type: 'object',
                        properties: {
                            headerTitle: room_title,
                            img: url,
                            title1: title1,
                            title2: title2,
                            title3: title3
                        }
                    },
                },
            });
        }  
    },
    // Screen of the inventory
    getInventory(handlerInput, inventory, title, imgs, title1, title2){
        if(util.supportsAPL(handlerInput)) {
            handlerInput.responseBuilder
            .addDirective({
                type: 'Alexa.Presentation.APL.RenderDocument',
                document: require('./documents/inventory.json'), 
                datasources: {
                    
                    listTemplate1Metadata: {
                        type: 'object',
                        objectId: 'lt1Metadata',
                        backgroundImage: {
                            contentDescription: null,
                            smallSourceUrl: null,
                            largeSourceUrl: null,
                            sources: [
                                {
                                    url: "https://soundgato.s3.eu-west-3.amazonaws.com/inventory.jpg",
                                    size: "small",
                                    widthPixel: 0,
                                    heightPixels: 0
                                },
                                {
                                    url: "https://soundgato.s3.eu-west-3.amazonaws.com/inventory.jpg",
                                    size: "large",
                                    widthPixels: 0,
                                    heightPixels: 0
                                }
                            ]
                        },
                        title: title,
                        title1: title1,
                        title2: title2
                    },
                    listTemplate1ListData: {
                        type: "list",
                        listId: "lt1Sample",
                        totalNumberOfItems: inventory.length,
                        listPage: {
                            listItems: [
                            {
                                listItemIdentifier: inventory[0],
                                ordinalNumber: 1,
                                textContent: {
                                    primaryText: {
                                        type: "PlainText",
                                        text: inventory[0]
                                    }
                                },
                                image: {
                                    contentDescription: null,
                                    smallSourceUrl: null,
                                    largeSourceUrl: null,
                                    sources: [
                                        {
                                            url: imgs[inventory[0]],
                                            size: "small",
                                            widthPixels: 0,
                                            heightPixels: 0
                                        },
                                        {
                                            url: imgs[inventory[0]],
                                            size: "large",
                                            widthPixels: 0,
                                            heightPixels: 0
                                        }
                                    ]
                                },
                                token: inventory[0]
                            },
                            {
                                listItemIdentifier: inventory[1],
                                ordinalNumber: 2,
                                textContent: {
                                    primaryText: {
                                        type: "PlainText",
                                        text: inventory[1]
                                    }
                                },
                                image: {
                                    contentDescription: null,
                                    smallSourceUrl: null,
                                    largeSourceUrl: null,
                                    sources: [
                                        {
                                            url: imgs[inventory[1]],
                                            size: "small",
                                            widthPixels: 0,
                                            heightPixels: 0
                                        },
                                        {
                                            url: imgs[inventory[1]],
                                            size: "large",
                                            widthPixels: 0,
                                            heightPixels: 0
                                        }
                                    ]
                                },
                                token: inventory[1]
                            },
                            {
                                listItemIdentifier: inventory[2],
                                ordinalNumber: 3,
                                textContent: {
                                    primaryText: {
                                        type: "PlainText",
                                        text: inventory[2]
                                    }
                                },
                                image: {
                                    contentDescription: null,
                                    smallSourceUrl: null,
                                    largeSourceUrl: null,
                                    sources: [
                                        {
                                            url: imgs[inventory[2]],
                                            size: "small",
                                            widthPixels: 0,
                                            heightPixels: 0
                                        },
                                        {
                                            url: imgs[inventory[2]],
                                            size: "large",
                                            widthPixels: 0,
                                            heightPixels: 0
                                        }
                                    ]
                                },
                                token: inventory[2]
                            },
                            {
                                listItemIdentifier: inventory[3],
                                ordinalNumber: 4,
                                textContent: {
                                    primaryText: {
                                        type: "PlainText",
                                        text: inventory[3]
                                    }
                                },
                                image: {
                                    contentDescription: null,
                                    smallSourceUrl: null,
                                    largeSourceUrl: null,
                                    sources: [
                                        {
                                            url: imgs[inventory[3]],
                                            size: "small",
                                            widthPixels: 0,
                                            heightPixels: 0
                                        },
                                        {
                                            url: imgs[inventory[3]],
                                            size: "large",
                                            widthPixels: 0,
                                            heightPixels: 0
                                        }
                                    ]
                                },
                                token: inventory[3]
                            },
                            {
                                listItemIdentifier: inventory[4],
                                ordinalNumber: 5,
                                textContent: {
                                    primaryText: {
                                        type: "PlainText",
                                        text: inventory[4]
                                    }
                                },
                                image: {
                                    contentDescription: null,
                                    smallSourceUrl: null,
                                    largeSourceUrl: null,
                                    sources: [
                                        {
                                            url: imgs[inventory[4]],
                                            size: "small",
                                            widthPixels: 0,
                                            heightPixels: 0
                                        },
                                        {
                                            url: imgs[inventory[4]],
                                            size: "large",
                                            widthPixels: 0,
                                            heightPixels: 0
                                        }
                                    ]
                                },
                                token: inventory[4]
                            },
                            {
                                listItemIdentifier: inventory[5],
                                ordinalNumber: 6,
                                textContent: {
                                    primaryText: {
                                        type: "PlainText",
                                        text: inventory[5]
                                    }
                                },
                                image: {
                                    contentDescription: null,
                                    smallSourceUrl: null,
                                    largeSourceUrl: null,
                                    sources: [
                                        {
                                            url: imgs[inventory[5]],
                                            size: "small",
                                            widthPixels: 0,
                                            heightPixels: 0
                                        },
                                        {
                                            url: imgs[inventory[5]],
                                            size: "large",
                                            widthPixels: 0,
                                            heightPixels: 0
                                        }
                                    ]
                                },
                                token: inventory[5]
                            },
                            {
                                listItemIdentifier: inventory[6],
                                ordinalNumber: 7,
                                textContent: {
                                    primaryText: {
                                        type: "PlainText",
                                        text: inventory[6]
                                    }
                                },
                                image: {
                                    contentDescription: null,
                                    smallSourceUrl: null,
                                    largeSourceUrl: null,
                                    sources: [
                                        {
                                            url: imgs[inventory[6]],
                                            size: "small",
                                            widthPixels: 0,
                                            heightPixels: 0
                                        },
                                        {
                                            url: imgs[inventory[6]],
                                            size: "large",
                                            widthPixels: 0,
                                            heightPixels: 0
                                        }
                                    ]
                                },
                                token: inventory[6]
                            },
                            {
                                listItemIdentifier: inventory[7],
                                ordinalNumber: 8,
                                textContent: {
                                    primaryText: {
                                        type: "PlainText",
                                        text: inventory[7]
                                    }
                                },
                                image: {
                                    contentDescription: null,
                                    smallSourceUrl: null,
                                    largeSourceUrl: null,
                                    sources: [
                                        {
                                            url: imgs[inventory[7]],
                                            size: "small",
                                            widthPixels: 0,
                                            heightPixels: 0
                                        },
                                        {
                                            url: imgs[inventory[7]],
                                            size: "large",
                                            widthPixels: 0,
                                            heightPixels: 0
                                        }
                                    ]
                                },
                                token: inventory[7]
                            },
                            {
                                listItemIdentifier: inventory[8],
                                ordinalNumber: 9,
                                textContent: {
                                    primaryText: {
                                        type: "PlainText",
                                        text: inventory[8]
                                    }
                                },
                                image: {
                                    contentDescription: null,
                                    smallSourceUrl: null,
                                    largeSourceUrl: null,
                                    sources: [
                                        {
                                            url: imgs[inventory[8]],
                                            size: "small",
                                            widthPixels: 0,
                                            heightPixels: 0
                                        },
                                        {
                                            url: imgs[inventory[8]],
                                            size: "large",
                                            widthPixels: 0,
                                            heightPixels: 0
                                        }
                                    ]
                                },
                                token: inventory[8]
                            },
                            {
                                listItemIdentifier: inventory[9],
                                ordinalNumber: 10,
                                textContent: {
                                    primaryText: {
                                        type: "PlainText",
                                        text: inventory[9]
                                    }
                                },
                                image: {
                                    contentDescription: null,
                                    smallSourceUrl: null,
                                    largeSourceUrl: null,
                                    sources: [
                                        {
                                            url: imgs[inventory[9]],
                                            size: "small",
                                            widthPixels: 0,
                                            heightPixels: 0
                                        },
                                        {
                                            url: imgs[inventory[9]],
                                            size: "large",
                                            widthPixels: 0,
                                            heightPixels: 0
                                        }
                                    ]
                                },
                                token: inventory[9]
                            },
                            {
                                listItemIdentifier: inventory[10],
                                ordinalNumber: 11,
                                textContent: {
                                    primaryText: {
                                        type: "PlainText",
                                        text: inventory[10]
                                    }
                                },
                                image: {
                                    contentDescription: null,
                                    smallSourceUrl: null,
                                    largeSourceUrl: null,
                                    sources: [
                                        {
                                            url: imgs[inventory[10]],
                                            size: "small",
                                            widthPixels: 0,
                                            heightPixels: 0
                                        },
                                        {
                                            url: imgs[inventory[10]],
                                            size: "large",
                                            widthPixels: 0,
                                            heightPixels: 0
                                        }
                                    ]
                                },
                                token: inventory[10]
                            },
                            {
                                listItemIdentifier: inventory[11],
                                ordinalNumber: 12,
                                textContent: {
                                    primaryText: {
                                        type: "PlainText",
                                        text: inventory[11]
                                    }
                                },
                                image: {
                                    contentDescription: null,
                                    smallSourceUrl: null,
                                    largeSourceUrl: null,
                                    sources: [
                                        {
                                            url: imgs[inventory[11]],
                                            size: "small",
                                            widthPixels: 0,
                                            heightPixels: 0
                                        },
                                        {
                                            url: imgs[inventory[11]],
                                            size: "large",
                                            widthPixels: 0,
                                            heightPixels: 0
                                        }
                                    ]
                                },
                                token: inventory[11]
                            },
                            {
                                listItemIdentifier: inventory[12],
                                ordinalNumber: 13,
                                textContent: {
                                    primaryText: {
                                        type: "PlainText",
                                        text: inventory[12]
                                    }
                                },
                                image: {
                                    contentDescription: null,
                                    smallSourceUrl: null,
                                    largeSourceUrl: null,
                                    sources: [
                                        {
                                            url: imgs[inventory[12]],
                                            size: "small",
                                            widthPixels: 0,
                                            heightPixels: 0
                                        },
                                        {
                                            url: imgs[inventory[12]],
                                            size: "large",
                                            widthPixels: 0,
                                            heightPixels: 0
                                        }
                                    ]
                                },
                                token: inventory[12]
                            },
                            {
                                listItemIdentifier: inventory[13],
                                ordinalNumber: 14,
                                textContent: {
                                    primaryText: {
                                        type: "PlainText",
                                        text: inventory[13]
                                    }
                                },
                                image: {
                                    contentDescription: null,
                                    smallSourceUrl: null,
                                    largeSourceUrl: null,
                                    sources: [
                                        {
                                            url: imgs[inventory[13]],
                                            size: "small",
                                            widthPixels: 0,
                                            heightPixels: 0
                                        },
                                        {
                                            url: imgs[inventory[13]],
                                            size: "large",
                                            widthPixels: 0,
                                            heightPixels: 0
                                        }
                                    ]
                                },
                                token: inventory[13]
                            },
                            {
                                listItemIdentifier: inventory[14],
                                ordinalNumber: 15,
                                textContent: {
                                    primaryText: {
                                        type: "PlainText",
                                        text: inventory[14]
                                    }
                                },
                                image: {
                                    contentDescription: null,
                                    smallSourceUrl: null,
                                    largeSourceUrl: null,
                                    sources: [
                                        {
                                            url: imgs[inventory[14]],
                                            size: "small",
                                            widthPixels: 0,
                                            heightPixels: 0
                                        },
                                        {
                                            url: imgs[inventory[14]],
                                            size: "large",
                                            widthPixels: 0,
                                            heightPixels: 0
                                        }
                                    ]
                                },
                                token: inventory[14]
                            },
                            {
                                listItemIdentifier: inventory[15],
                                ordinalNumber: 16,
                                textContent: {
                                    primaryText: {
                                        type: "PlainText",
                                        text: inventory[15]
                                    }
                                },
                                image: {
                                    contentDescription: null,
                                    smallSourceUrl: null,
                                    largeSourceUrl: null,
                                    sources: [
                                        {
                                            url: imgs[inventory[15]],
                                            size: "small",
                                            widthPixels: 0,
                                            heightPixels: 0
                                        },
                                        {
                                            url: imgs[inventory[15]],
                                            size: "large",
                                            widthPixels: 0,
                                            heightPixels: 0
                                        }
                                    ]
                                },
                                token: inventory[15]
                            },
                            {
                                listItemIdentifier: inventory[16],
                                ordinalNumber: 17,
                                textContent: {
                                    primaryText: {
                                        type: "PlainText",
                                        text: inventory[16]
                                    }
                                },
                                image: {
                                    contentDescription: null,
                                    smallSourceUrl: null,
                                    largeSourceUrl: null,
                                    sources: [
                                        {
                                            url: imgs[inventory[16]],
                                            size: "small",
                                            widthPixels: 0,
                                            heightPixels: 0
                                        },
                                        {
                                            url: imgs[inventory[16]],
                                            size: "large",
                                            widthPixels: 0,
                                            heightPixels: 0
                                        }
                                    ]
                                },
                                token: inventory[16]
                            },
                            {
                                listItemIdentifier: inventory[17],
                                ordinalNumber: 18,
                                textContent: {
                                    primaryText: {
                                        type: "PlainText",
                                            text: inventory[17]
                                    }
                                },
                                image: {
                                    contentDescription: null,
                                    smallSourceUrl: null,
                                    largeSourceUrl: null,
                                    sources: [
                                        {
                                            url: imgs[inventory[17]],
                                            size: "small",
                                            widthPixels: 0,
                                            heightPixels: 0
                                        },
                                        {
                                            url: imgs[inventory[17]],
                                            size: "large",
                                            widthPixels: 0,
                                            heightPixels: 0
                                        }
                                    ]
                                },
                                token: inventory[17]
                            },
                            {
                                listItemIdentifier: inventory[18],
                                ordinalNumber: 19,
                                textContent: {
                                    primaryText: {
                                        type: "PlainText",
                                        text: inventory[18]
                                    }
                                },
                                image: {
                                    contentDescription: null,
                                    smallSourceUrl: null,
                                    largeSourceUrl: null,
                                    sources: [
                                        {
                                            url: imgs[inventory[18]],
                                            size: "small",
                                            widthPixels: 0,
                                            heightPixels: 0
                                        },
                                        {
                                            url: imgs[inventory[18]],
                                            size: "large",
                                            widthPixels: 0,
                                            heightPixels: 0
                                        }
                                    ]
                                },
                                token: inventory[18]
                            },
                            {
                                listItemIdentifier: inventory[19],
                                ordinalNumber: 20,
                                textContent: {
                                    primaryText: {
                                        type: "PlainText",
                                        text: inventory[19]
                                    }
                                },
                                image: {
                                    contentDescription: null,
                                    smallSourceUrl: null,
                                    largeSourceUrl: null,
                                    sources: [
                                        {
                                            url: imgs[inventory[19]],
                                            size: "small",
                                            widthPixels: 0,
                                            heightPixels: 0
                                        },
                                        {
                                            url: imgs[inventory[19]],
                                            size: "large",
                                            widthPixels: 0,
                                            heightPixels: 0
                                        }
                                    ]
                                },
                                token: inventory[19]
                            },
                            {
                                listItemIdentifier: inventory[20],
                                ordinalNumber: 21,
                                textContent: {
                                    primaryText: {
                                        type: "PlainText",
                                        text: inventory[20]
                                    }
                                },
                                image: {
                                    contentDescription: null,
                                    smallSourceUrl: null,
                                    largeSourceUrl: null,
                                    sources: [
                                        {
                                            url: imgs[inventory[20]],
                                            size: "small",
                                            widthPixels: 0,
                                            heightPixels: 0
                                        },
                                        {
                                            url: imgs[inventory[20]],
                                            size: "large",
                                            widthPixels: 0,
                                            heightPixels: 0
                                        }
                                    ]
                                },
                                token: inventory[20]
                            },
                            {
                                listItemIdentifier: inventory[21],
                                ordinalNumber: 22,
                                textContent: {
                                    primaryText: {
                                        type: "PlainText",
                                        text: inventory[21]
                                    }
                                },
                                image: {
                                    contentDescription: null,
                                    smallSourceUrl: null,
                                    largeSourceUrl: null,
                                    sources: [
                                        {
                                            url: imgs[inventory[21]],
                                            size: "small",
                                            widthPixels: 0,
                                            heightPixels: 0
                                        },
                                        {
                                            url: imgs[inventory[21]],
                                            size: "large",
                                            widthPixels: 0,
                                            heightPixels: 0
                                        }
                                    ]
                                },
                                token: inventory[21]
                            }
                            ]
                                
                            }
                        }
                    }       
            });
        }    
    },
    // Final Screen
    // It shows if the player has won or lost
    getEnd(handlerInput, title, text, getName, getPoints){
        if(util.supportsAPL(handlerInput)) {
                handlerInput.responseBuilder
                .addDirective({
                    type: 'Alexa.Presentation.APL.RenderDocument',
                    document: require('./documents/end.json'), 
                    datasources: {
                        bodyTemplate1Data: {
                            type: 'object',
                            objectId: 'bt1Sample',
                            title: title,
                            textContent: {
                                primaryText: {
                                    type: "PlainText",
                                    text: text,
                                    name: getName,
                                    points: getPoints
                                }
                            }
                        }
                    },
                });
            }    
    }
}