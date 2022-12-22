class AcGamePlayground{
    constructor(root){
        this.root = root;
        this.$playground = $(`<div class="ac-game-playground"></div>`);
        this.hide();
        this.root.$ac_game.append(this.$playground);
        this.start();
    }

    get_random_color(){
        let colors = ["red", "pink", "blue", "gray", "green"];
        return colors[Math.floor(Math.random() * 5)];
    }

    create_uuid(){
        let res = "";
        for(let i=0; i<8; i++){
            let x = parseInt(Math.floor(Math.random() * 10));
            res += x;
        }
        return res
    }

    start(){
        let that = this;
        let uuid = this.create_uuid();
        $(window).on(`resize.${uuid}`, function(){
            that.resize();
        });

        if(this.root.AcWingOS){
            this.root.AcWingOS.api.window.on_close(function(){
                $(window).off(`resize.${uuid}`);
            });
        }
    }

    resize(){
        this.width = this.$playground.width();
        this.height = this.$playground.height();
        let unit  = Math.min(this.width/16, this.height/9);
        this.width = unit * 16;
        this.height = unit * 9;
        this.scale = this.height;

        if(this.game_map) this.game_map.resize();
    }

    show(mode){
        let that = this;
        this.$playground.show();

        this.width = this.$playground.width();
        this.height = this.$playground.height();
        this.game_map = new GameMap(this);

        this.mode = mode;
        this.state = "waiting";  // waiting -> fighting -> over
        this.notice_board = new NoticeBoard(this);
        this.score_board = new ScoreBoard(this);
        this.player_count = 0;

        this.resize();

        this.players = [];
        this.players.push(new Player(this, this.width / 2 / this.scale, 0.5, 0.05, "white", 0.15, "me", this.root.settings.username, this.root.settings.photo));

        if(mode === "single mode"){
            for(let i = 0; i < 5; i++){
                this.players.push(new Player(this, this.width / 2 / this.scale, 0.5, 0.05, this.get_random_color(), 0.15, "robot"));
            }
        } else if(mode === "multi mode"){
            this.chat_field = new ChatField(this);
            this.mps = new MultiPlayerSocket(this);
            this.mps.uuid = this.players[0].uuid;

            this.mps.ws.onopen = function(){
                that.mps.send_create_player(that.root.settings.username, that.root.settings.photo);
            };
        }
    }

    hide(){
        while(this.players && this.players.length > 0){
            this.players[0].destory();
        }

        if(this.game_map){
            this.game_map.destory();
            this.game_map = null;
        }

        if(this.notice_board){
            this.notice_board.destory();
            this.notice_board = null;
        }

        if(this.score_board){
            this.score_board.destory();
            this.score_board = null;
        }

        this.$playground.empty();

        this.$playground.hide();
    }
}
