import faker from "faker";
import { Player } from "../../server/models";

export function buildPlayer(overrides: Partial<Player> = {}): Player {
  return {
    id: faker.random.uuid(),
    name: faker.name.firstName(),
    ...overrides,
  } as Player;
}
