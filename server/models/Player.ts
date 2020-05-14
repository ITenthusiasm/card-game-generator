import { Action, Role } from "./enums/types";

interface PlayerInfo {
  name: string;
  role?: Role;
  team?: string;
}

class Player {
  #id: string;
  #name: string;
  #role?: Role;

  team: string;
  actions: Action[];
  active: boolean;

  constructor(playerInfo: PlayerInfo) {
    this.#id = `_${Math.random().toString(36).substring(2, 9)}`;
    this.#name = playerInfo.name;
    this.#role = playerInfo.role;
    this.team = playerInfo.team;
  }

  get id(): string {
    return this.#id;
  }

  get name(): string {
    return this.#name;
  }

  get role(): Role {
    return this.#role;
  }
}

export default Player;
