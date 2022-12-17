class MultiPlayerSocket{
    constructor(playground){
        this.playground = playground;

        this.ws = new WebSocket("wss://app2987.acapp.acwing.com.cn/wss/multiplayer/");

        this.start();
    }

    start(){
        this.receive();
    }

    receive(){
        let that = this;
        this.ws.onmessage = function(e){
            let data = JSON.parse(e.data);
            let uuid = data.uuid;
            if(uuid === that.uuid) return false;

            let event = data.event;
            if(event === "create_player"){
                that.receive_create_player(uuid, data.username, data.photo);
            }
        }
    }

    send_create_player(username, photo){
        let that = this;
        this.ws.send(JSON.stringify({
            'event': "create_player",
            'uuid': that.uuid,
            'username': username,
            'photo': photo,
        }));
    }

    receive_create_player(uuid, username, photo){
        let player = new Player(
            this.playground,
            this.playground.width / 2 / this.playground.scale,
            0.5,
            0.05,
            "white",
            0.15,
            "enemy",
            username,
            photo
        );
        player.uuid = uuid;
        this.playground.players.push(player);
    }

}
