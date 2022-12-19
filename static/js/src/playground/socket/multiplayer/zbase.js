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
            } else if(event === "move_to"){
                that.receive_move_to(uuid, data.tx, data.ty);
            } else if(event === "shoot_fireball"){
                that.receive_shoot_fireball(uuid, data.tx, data.ty, data.ball_uuid);
            } else if(event === "attack"){
                that.receive_attack(uuid, data.attackee_uuid, data.x, data.y, data.angle, data.damage, data.ball_uuid);
            } else if(event === "blink"){
                that.receive_blink(uuid, data.tx, data.ty);
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

    send_move_to(tx, ty){
        let that = this;
        this.ws.send(JSON.stringify({
            'event': "move_to",
            'uuid': that.uuid,
            'tx': tx,
            'ty': ty,
        }));
    }

    get_player(uuid){
        let players = this.playground.players;
        for(let i=0; i<players.length; i++){
            let player = players[i];
            if(player.uuid === uuid){
                return player;
            }
        }
        return null;
    }

    receive_move_to(uuid, tx, ty){
        let player = this.get_player(uuid);

        if(player){
            player.move_to(tx, ty);
        }
    }

    send_shoot_fireball(tx, ty, ball_uuid){
        let that = this;
        this.ws.send(JSON.stringify({
            'event': "shoot_fireball",
            'uuid': that.uuid,
            'tx': tx,
            'ty': ty,
            'ball_uuid': ball_uuid,
        }));
    }

    receive_shoot_fireball(uuid, tx, ty, ball_uuid){
        let player = this.get_player(uuid);

        if(player){
            let fireball = player.shoot_fireball(tx, ty);
            fireball.uuid = ball_uuid;
        }
    }

    send_attack(attackee_uuid, x, y, angle, damage, ball_uuid){
        let that = this;
        this.ws.send(JSON.stringify({
            'event': "attack",
            'uuid': that.uuid,
            'attackee_uuid': attackee_uuid,
            'x': x,
            'y': y,
            'angle': angle,
            'damage': damage,
            'ball_uuid': ball_uuid,
        }));
    }

    receive_attack(uuid, attackee_uuid, x, y, angle, damage, ball_uuid){
        let attacker = this.get_player(uuid);
        let attackee = this.get_player(attackee_uuid);
        if(attacker && attackee){
            attackee.receive_attack(x, y, angle, damage, ball_uuid, attacker);
        }
    }

    send_blink(tx, ty){
        let that = this;
        this.ws.send(JSON.stringify({
            'event': "blink",
            'uuid': that.uuid,
            'tx': tx,
            'ty': ty,
        }));
    }

    receive_blink(uuid, tx, ty){
        let player = this.get_player(uuid);
        if(player){
            player.blink(tx, ty);
        }
    }

}
