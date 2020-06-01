import { Action, Role } from "./enums/types";

interface PlayerInfo {
  name: string;
  role?: Role;
  team?: string;
}

class Player {
  #id: string;
  #name: string;

  role: Role;
  team: string;
  actions: Action[];
  active: boolean;

  constructor(playerInfo: PlayerInfo) {
    this.#id = `_${Math.random().toString(36).substring(2, 9)}`;
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

  toJSON(): object {
    const jsonObj = { ...this };
    const proto = Object.getPrototypeOf(this);

    Object.entries(Object.getOwnPropertyDescriptors(proto))
      .filter(([, descriptor]) => typeof descriptor.get === "function")
      .forEach(([key, descriptor]) => {
        // private properties (start with #) are automatically skipped
        if (descriptor && key[0] !== "_") {
          try {
            jsonObj[key] = this[key];
          } catch (error) {
            console.error(`Error calling setting property ${key}`, error);
          }
        }
      });

    return jsonObj;
  }
}

export default Player;
