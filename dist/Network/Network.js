/***************************************/
/*
/*  Connection Manager 
/*  For handling the actual p2p connections
/*
****************************************/

function ConnectionManager(syncStateManager) {

    this.peer = null;
    this.connections = new Map(); // Peer Id to connection
    this.playerList = new Map();
    this.options = { 
                        debug: 0,
                        config: {
                            iceServers: [
                                { urls : "stun:stun.l.google.com:19302" },
                                { urls : "turn:0.peerjs.com:3478",   username : "peerjs", credential : "peerjsp" }
                            ],
                            sdpSemantics: 'unified-plan'
                        }
                    };
    this.messageHandler = new MessageHandler(this);
    this.syncStateManager = syncStateManager;

}

ConnectionManager.prototype.init = function (isHost, nickname, callback) {

    if (this.peer && connectionManager.peer._open) {
        return;
    } else if (this.peer) {
        this.peer.reconnect();
        return;
    }
    
    this.peer = new Peer(this.options);

    let manager = this;

    this.peer.on('open', function(id) {
        console.log('Peer ID is: ' + id);
        let player = new Player(isHost, nickname, id);
        manager.playerList.set(id, player);
        callback(player);
    });

    this.peer.on('connection', function(connection) {
        manager.connections.set(connection.peer, connection);
        manager.attachConnectionHandlers(connection);
    });

    syncMultiplayerStates = true;
    let syncStateManager = this.syncStateManager;
    syncStateManager.onUpdateFinished = function() {
        manager.sendMessage(new Message(MessageType.UPDATE_SYNC_STATE, syncStateManager.localSyncState));
    }
}

ConnectionManager.prototype.connectToHost = function (id, connectionReadyCallback) {
    let connectionToHost = this.peer.connect(id);
    this.connections.set(id, connectionToHost);
    this.attachConnectionHandlers(connectionToHost);
    connectionToHost.on('open', connectionReadyCallback);
}

ConnectionManager.prototype.attachConnectionHandlers = function (connection) {

    let manager = this;
	connection.on('data', function(data) {
        manager.messageHandler.onMessage(data);
    });

    connection.on('close', function(data) {
        console.log(data);
    });

    connection.on('error', function(data) {
        console.log(data);
    });

}

ConnectionManager.prototype.sendMessage = function (message) {

    connectionManager.connections.forEach(async (connection, id) => { 

        // Apparently the connection opened event gets fired before the connection is actually ready to send messages
        // Despite what the docs say: 'Emitted when the connection is established and ready-to-use.'
        // Therefore if the connection has not been set to open when the open event is fired we need to gracefully handle that

        let max = 5;
        let delayMs = 500;
        let p = Promise.reject();

        for(var i=0; i<max; i++) {
            p = p.catch(() => {
                if (connection.open) {
                    connection.send(message.serialize());
                } else {
                    throw new Error("Connection not open yet");
                }
            }).catch(reason => {
                return new Promise(function(resolve, reject) {
                    setTimeout(reject.bind(null, reason), delayMs); 
                });
            });
        }
    });

}

var connectionManager = new ConnectionManager(gameSyncState);

/***************************************/
/*
/*  Message Handler
/*  For handling messages sent once the 
/*  connection is established
/*
****************************************/

function MessageHandler(manager) {
    this.connectionManager = manager;
}

MessageHandler.prototype.onMessage = function (message) {


    console.log('Received', message);

    message = Message.prototype.deserialize(message);

    if (message.messageType == MessageType.CLIENT_PLAYER) {
        this.connectionManager.playerList.set(message.data.peerId, message.data);
        updatePlayerList();
        this.connectionManager.sendMessage(new Message(MessageType.PLAYER_LIST, new PlayerList(this.connectionManager.playerList)))
    } else if (message.messageType == MessageType.PLAYER_LIST) {
        this.connectionManager.playerList = message.data.playerList;
        updatePlayerList();
    } else if (message.messageType == MessageType.UPDATE_SYNC_STATE) {
        this.connectionManager.syncStateManager.mergeNewRemoteSyncState(message.data)
    }

}


/***************************************/
/*
/*  Message Objects
/*
****************************************/

function Message(type, data, isSending = true) {
    this.messageType = type;
    this.data = isSending ? data.serialize() : this.typeToPayload(type, data);
}

Message.prototype.typeToPayload = function(type, data) {

    switch(type) {
        case MessageType.CLIENT_PLAYER     : return Player.prototype.deserialize(data);
        case MessageType.PLAYER_LIST       : return PlayerList.prototype.deserialize(data);
        case MessageType.UPDATE_SYNC_STATE : return SyncState.prototype.deserialize(data);
    }

}

Message.prototype.deserialize = function(message) {
    message = JSON.parse(message);
    return new Message(message.messageType, message.data, false)
}

Message.prototype.serialize = function() {
    return JSON.stringify(this);
}

const MessageType = {
    CLIENT_PLAYER     : 'CLIENT_PLAYER',
    PLAYER_LIST       : 'PLAYER_LIST',
    UPDATE_SYNC_STATE : 'UPDATE_SYNC_STATE'
};

function Player(isHost, nickname, peerId) {
    this.isHost = isHost;
    this.nickname = nickname;
    this.peerId = peerId;
}

Player.prototype.serialize = function() {
    return JSON.stringify(this);
}

Player.prototype.deserialize = function(data) {
    data = JSON.parse(data);
    return new Player(data.isHost, data.nickname, data.peerId);
}

function PlayerList(playerList) {
    this.playerList = playerList;
}

PlayerList.prototype.serialize = function() {
    return JSON.stringify(Array.from(this.playerList));
}

PlayerList.prototype.deserialize = function(data) {
    data = JSON.parse(data);
    return new PlayerList(new Map(data));
}

// Functions for SyncState from EmulationCoreHacks.js

SyncState.prototype.serialize = function() {
    return JSON.stringify(this);
}

SyncState.prototype.deserialize = function(data) {
    data = JSON.parse(data);
    let syncState = new SyncState();

    syncState.badge1      = data.badge1;
    syncState.badge2      = data.badge2;
    syncState.badge3      = data.badge3;
    syncState.badge4      = data.badge4;
    syncState.badge5      = data.badge5;
    syncState.badge6      = data.badge6;
    syncState.badge7      = data.badge7;
    syncState.badge8      = data.badge8;
    syncState.hm01        = data.hm01;
    syncState.hm02        = data.hm02;
    syncState.hm03        = data.hm03;
    syncState.hm04        = data.hm04;
    syncState.hm05        = data.hm05;
    syncState.hm06        = data.hm06;
    syncState.hm07        = data.hm07;
    syncState.hm08        = data.hm08;
    syncState.magmaEmblem = data.magmaEmblem;
    syncState.devonScope  = data.devonScope;
    syncState.basementKey = data.basementKey;
    syncState.storeageKey = data.storeageKey;
    syncState.goGoggles   = data.goGoggles;

    return syncState;
}

/***************************************/
/*
/*  Helper Functions
/*  mostly for the UI
/*
****************************************/


function connectAsClient() {

    let linkCode = document.getElementById("networkLinkCode").value;

    if (!linkCode) {

        M.toast({html: 'Input Link Code From Host', displayLength:5000});

    }

    connectionManager.init(false, document.getElementById("networkNickname").value, (player) => onClientConnectionOpened(linkCode, player));
}

function onClientConnectionOpened(linkCode, player) {
    connectionManager.connectToHost(linkCode, () => onConnectToHostSuccess(player));
    updatePlayerList();
}

function onConnectToHostSuccess(player) {
    connectionManager.sendMessage(new Message(MessageType.CLIENT_PLAYER, player))
}

function connectAsHost() {

    M.toast({html: 'Starting Connection...', displayLength:5000});
    connectionManager.init(true, document.getElementById("networkNickname").value, onHostConnectionOpened);

}

function onHostConnectionOpened(player) {

    document.getElementById("networkLinkCode").value = player.peerId;
    updatePlayerList();

}

function updatePlayerList() {

    let playerListElement = document.getElementById("playerList");
    playerListElement.innerHTML = "";

    connectionManager.playerList.forEach(player => {
        playerListElement.appendChild(createPlayerTag(player.nickname, player.isHost))
    });
    
}

function createPlayerTag(nickname, isHost) {

    let el = document.createElement("li");
    el.classList.add("collection-item");
    el.classList.add("avatar");
    el.classList.add(isHost ? "host" : "client")

    let backgrounds = ['#A0CDED', '#CDECAD', '#FFFAAE', '#FFC29F', '#F19A9C', '#AF8FC1'];

    let hashNumber = Math.abs(getHash(nickname.toUpperCase())) + 78;

    let bgCol = backgrounds[hashNumber % 6];
    backgrounds.splice(hashNumber % 6, 1);
    let bgCol2 = backgrounds[(hashNumber + (hashNumber % 7)) % 5];
    let shiny = hashNumber % 4069 == 998 ? 'shiny/' : '';

    el.innerHTML = "<img class='circle'" + 
                   " src='https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/" + shiny + (hashNumber % 1009) + ".png'" + 
                   "style='background:" + "linear-gradient(197deg, " + bgCol + '40' + " 0%, " + bgCol + '70' + " 35%, " + bgCol2 + '96' + " 100%); transform: scale(1.3);outline: solid 1px " + bgCol + ";box-shadow: 0 3px 10px rgb(0 0 0 / 41%);'>" +
                   "<span>" + nickname + "<span>"  + 
                   "<p>" + (isHost ? "Hosting" : "Connected") + "</p>";
    return el;
}

function toggleLinkCodeVisibility() {
    let linkCodeElement = document.getElementById("networkLinkCode");
    linkCodeElement.type = linkCodeElement.type == "password" ? "text" : "password";
}

function copyLinkCodeToClipboard() {
    let copyText = document.getElementById("networkLinkCode");
    copyText.select();
    copyText.setSelectionRange(0, 99999);
    navigator.clipboard.writeText(copyText.value);
}
