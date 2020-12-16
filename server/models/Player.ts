import { Action, Role } from "./enums/types";
import { convertToJSON } from "../utils/mappers";
import { randomString } from "../utils/algorithms";

interface PlayerInfo {
  name: string;
  role?: Role;
  team?: string;
}

class Player {
  #id: string;
  #name: string;

  role?: Role;
  team?: string;
  actions?: Action[];
  active: boolean;

  constructor(playerInfo: PlayerInfo) {
    this.#id = `_${randomString()}`;
    this.#name = playerInfo.name;
    this.role = playerInfo.role;
    this.team = playerInfo.team;
  }

  get id(): string {
    return this.#id;
  }

  get name(): string {
    return this.#name;
  }

  toJSON(): Record<string, any> {
    return convertToJSON(this);
  }
}

export default Player;
