class ChatField{
    constructor(playground){
        this.playground = playground;

        this.$history = $(`<div class="ac-game-chat-field-history">history</div>`);
        this.$input = $(`<input type="text" class="ac-game-chat-field-input">`);

        this.$history.hide();
        this.$input.hide();

        this.func_id = null;

        this.playground.$playground.append(this.$history);
        this.playground.$playground.append(this.$input);

        this.start();
    }

    start(){
        this.add_listening_events();
    }

    add_listening_events(){
        let that = this;
        this.$input.keydown(function(e){
            if(e.which === 27){
                that.hide_input();
                return false;
            } else if(e.which === 13){
                let username = that.playground.root.settings.username;
                let text = that.$input.val();
                if(text){
                    that.add_message(username, text);
                    that.$input.val("");
                    that.playground.mps.send_message(text);
                }
                return false;
            }
        });
    }

    render_message(message){
        return $(`<div>${message}</div>`);
    }

    add_message(username, text){
        this.show_history();
        let message = `[${username}]${text}`;
        this.$history.append(this.render_message(message));
        this.$history.scrollTop(this.$history[0].scrollHeight);
    }

    show_history(){
        let that = this;
        this.$history.fadeIn();

        if(this.func_id)
            clearTimeout(this.func_id);

        this.func_id = setTimeout(function(){
            that.$history.fadeOut();
            that.func_id = null;
        }, 3000);
    }

    show_input(){
        this.show_history();
        this.$input.show();
        this.$input.focus();
    }

    hide_input(){
        this.$input.hide();
        this.playground.game_map.$canvas.focus();
    }
}
