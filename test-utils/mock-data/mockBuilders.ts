import faker from "faker";
import { Card, Player } from "../../server/models";
import { CardTypes, CardValues } from "../../server/models/enums";
import { CardType, CardValue } from "../../server/models/enums/types";
import { getEnumValues } from "../../server/utils/mappers";

/**
 * Creates a mock `Player` object.
 * @param overrides Any properties to add or override on the object
 */
export function buildPlayer(overrides: Partial<Player> = {}): Player {
  return {
    id: faker.random.uuid(),
    name: faker.name.firstName(),
    ...overrides,
  } as Player;
}

/**
 * Creates a mock `Card` object by randomly generating a card. The
 * card's type and value will always be of the same "class" (Codenames, RED, "shark")
 * but will not necessarily always make sense (Uno, WILD, 0).
 * @param cardGroup The desired card group (Codenames, Uno, etc.)
 */
export function buildCard(cardGroup?: keyof typeof CardTypes): Card {
  const keys = Object.keys(CardTypes);
  const key = cardGroup || faker.random.arrayElement(keys);

  const type = faker.random.objectElement(CardTypes[key]) as CardType;
  let value: CardValue;

  if (Array.isArray(CardValues[key])) {
    value = faker.random.arrayElement(CardValues[key]);
  } else {
    value = faker.random.arrayElement(getEnumValues(CardValues[key]));
  }

  return new Card(type, value);
}
