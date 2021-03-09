module.exports = [
  "api/index",
  "api/modules",
  {
    "type": "category",
    "label": "Enumerations",
    "items": [
      "api/enums/clientstate"
    ]
  },
  {
    "type": "category",
    "label": "Classes",
    "items": [
      "api/classes/client",
      "api/classes/clientsockettransportlayer",
      "api/classes/clienttransportlayer",
      "api/classes/core",
      "api/classes/game",
      "api/classes/gamecomponent",
      "api/classes/invalidactionerror",
      "api/classes/phase",
      "api/classes/server",
      "api/classes/serversockettransportlayer",
      "api/classes/servertransportlayer"
    ]
  },
  {
    "type": "category",
    "label": "Interfaces",
    "items": [
      "api/interfaces/clientconfig",
      "api/interfaces/phaseclass",
      "api/interfaces/rootcomponentprops"
    ]
  }
];