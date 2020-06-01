import Game from "./Game";
import { Player, Card } from "../models";
import { DeckTypes, Roles, Actions, CardTypes } from "../models/enums";
import { Action } from "../models/enums/types";

interface Code {
  word: string;
  number: number;
}

interface CodenamesCard extends Card {
  revealed: boolean;
}

interface CodenamesState {
  active: boolean;
  cards: CodenamesCard[];
  codes: {
    [CardTypes.Codenames.RED]: Code[];
    [CardTypes.Codenames.BLUE]: Code[];
  };
  guesses: number;
  winningTeam: CardTypes.Codenames.RED | CardTypes.Codenames.BLUE;
  error: string;
}

/** Class representing a Codenames Game */
class Codenames extends Game {
  protected _state: CodenamesState;

  /** The index of the currently active player */
  #playerIndex: number;

  constructor(players: Player[]) {
    super(DeckTypes.CODENAMES, players);
    this._state = {} as CodenamesState;
  }

  start(): CodenamesState {
    const { RED, BLUE } = CardTypes.Codenames;

    // Validate players
    if (!this.playersValid) {
      const errorMessage = "Invalid Player setup";
      console.error(errorMessage);
      this._state.error = errorMessage;

      return this._state;
    }

    // Shuffle decke and grab cards
    this._deck.shuffle();
    this._state.cards = this._deck.draw(this._deck.size) as CodenamesCard[];

    // Initialize codes
    this._state.codes = { [RED]: [], [BLUE]: [] };

    // Determine if red or blue goes first
    const redAmount = this._state.cards.filter(c => c.type === RED);
    const blueAmount = this._state.cards.filter(c => c.type === BLUE);

    if (redAmount > blueAmount) {
      this.#playerIndex = this._players.findIndex(p => p.team === RED);
    } else {
      this.#playerIndex = this._players.findIndex(p => p.team === BLUE);
    }

    this._players[this.#playerIndex].active = true;
    this._players[this.#playerIndex].actions = [Actions.Codenames.GIVE_CODE];

    // Start the game
    this._state.active = true;

    console.log("Game started!");
    return this._state;
  }

  private get playersValid(): boolean {
    const players = this._players;
    const { CODEMASTER } = Roles.Codenames;
    const { RED, BLUE } = CardTypes.Codenames;

    // Verify that there's only 1 red and blue codemaster respectively
    return (
      players.filter(p => p.role === CODEMASTER && p.team === RED).length ===
        1 &&
      players.filter(p => p.role === CODEMASTER && p.team === BLUE).length === 1
    );
  }

  handleAction(player: Player, action: Action, item: Card | Code): any {
    if (!this._state.active) {
      console.error("Error: Game is not active.");
      return this._state;
    }

    if (!player.active || !player.actions.includes(action)) {
      // Maybe needs a warning message... Or maybe UI can do that.
      console.error(`Illegal action from player ${player.name} ignored.`);
      return this._state;
    }

    switch (action) {
      case Actions.Codenames.GIVE_CODE: {
        const code = item as Code;
        this._state.codes[player.team].push(code);
        this._state.guesses = code.number + 1;

        this._players[this.#playerIndex].actions = [Actions.Codenames.REVEAL];

        console.log(`Player ${player.name} gave code: `, code);
        return this._state;
      }
      case Actions.Codenames.REVEAL: {
        const card = item as Card;
        const gameCard = this._state.cards.find(c => c.value === card.value);
        gameCard.revealed = true;

        if (player.team === gameCard.type) {
          this._state.guesses--;
        } else {
          this._state.guesses = 0;
        }

        console.log(`Player ${player.name} revealed card: `, card);

        if (this.winConditionReached) {
          const gameCards = this._state.cards;
          const { RED, BLUE, BLACK } = CardTypes.Codenames;

          if (!gameCards.filter(c => c.type === RED).some(c => !c.revealed)) {
            this._state.winningTeam = RED;
          } else if (
            !gameCards.filter(c => c.type === BLUE).some(c => !c.revealed)
          ) {
            this._state.winningTeam = BLUE;
          } else if (gameCards.find(c => c.type === BLACK).revealed) {
            this._state.winningTeam = player.team === RED ? BLUE : RED;
          }

          console.log(`Team ${this._state.winningTeam} wins!`);
          this.end();
        } else if (!this._state.guesses) {
          this.setNextPlayer();
        }

        return this._state;
      }
      default: {
        console.error(`Action ${action} not supported.`);
        return this._state;
      }
    }
  }

  private setNextPlayer(move = 1): void {
    const totalPlayers = this._players.length;

    if (move > totalPlayers) {
      console.log(`Cannot move more than ${totalPlayers} players forward.`);
      return;
    }
    if (move <= 0) {
      console.log(`You must move at least 1 player forward.`);
      return;
    }

    // Set the current player inactive. Then set the next player active.
    this._players[this.#playerIndex].active = false;

    this.#playerIndex = (this.#playerIndex + move) % totalPlayers;
    this._players[this.#playerIndex].active = true;
    this._players[this.#playerIndex].actions = [Actions.Codenames.GIVE_CODE];
  }

  private get winConditionReached(): boolean {
    const gameCards = this._state.cards;
    const { RED, BLUE, BLACK } = CardTypes.Codenames;

    return (
      !gameCards.filter(c => c.type === RED).some(c => !c.revealed) ||
      !gameCards.filter(c => c.type === BLUE).some(c => !c.revealed) ||
      gameCards.find(c => c.type === BLACK).revealed
    );
  }

  end(): void {
    this._state.active = false;
    console.log("Game ended!");
  }

  /** The teams supported in the game */
  static get teams(): string[] {
    // Because the Codenames teams are invariably linked to the card types, they are based on the card types.
    return [CardTypes.Codenames.RED, CardTypes.Codenames.BLUE];
  }
}

export default Codenames;
