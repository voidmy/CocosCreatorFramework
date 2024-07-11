import { BaseResponse } from "./WebRequestManager";


export class StartGameMsg extends BaseResponse {

    public data: GameState;
}

class Pos {
    XPos: number;
    YPos: number;
}

class Terraces {
    TerraceId: number;
    Pos: Pos;
    EndTimer: number;
}

class GameState {
    NowRate: number;
    NowScore: string;
    TerraceIndex: number;
    Terraces: Terraces[];
    Stop: boolean;
    Die: boolean;
    Buffs: any[];
}