export class Game_A{
    constructor(id, AcWingOS, access, refresh){
        this.id = id;
        this.AcWingOS = AcWingOS;
        this.$ac_game = $('#'+id);
        this.access = access;
        this.refresh = refresh;

        this.settings = new Settings(this);
        this.menu = new AcGameMenu(this);
        this.playground = new AcGamePlayground(this);
        this.start();
    }

    start(){}
}
