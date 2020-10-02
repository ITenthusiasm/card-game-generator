import { Player } from "..";

describe("Player", () => {
  test("All players are instantiated with unique id's", () => {
    const playerList = [...Array(20)].map(() => new Player({ name: "name" }));
    const uniqueIds = playerList
      .map(p => p.id)
      .filter((v, i, a) => a.indexOf(v) === i);

    expect(uniqueIds.length).toBe(playerList.length);
  });

  test("JSON-ified player objects still give access to getter properties", () => {
    const player = new Player({ name: "name" });
    const convertedPlayer = JSON.parse(JSON.stringify(player));

    expect(convertedPlayer.id).toEqual(expect.any(String));
    expect(convertedPlayer.name).toBe(player.name);
  });
});
