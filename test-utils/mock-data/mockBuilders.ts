import faker from "faker";
import { Card, Player } from "../../server/models";
import { CardTypes, CardValues } from "../../server/models/enums";
import { CardType, CardValue } from "../../server/models/enums/types";
import { getEnumValues } from "../../server/utils/mappers";

export function buildPlayer(overrides: Partial<Player> = {}): Player {
  return {
    id: faker.random.uuid(),
    name: faker.name.firstName(),
    ...overrides,
  } as Player;
}

export function buildCard(): Card {
  const cardClasses = Object.keys(CardTypes);
  const cardClass = faker.random.arrayElement(cardClasses);

  const type = faker.random.objectElement(CardTypes[cardClass]) as CardType;
  let value: CardValue;

  if (Array.isArray(CardValues[cardClass])) {
    value = faker.random.arrayElement(CardValues[cardClass]);
  } else {
    value = faker.random.objectElement(getEnumValues(CardValues[cardClass]));
  }

  return new Card(type, value);
}
