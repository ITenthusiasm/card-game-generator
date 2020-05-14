import * as CardTypes from "../CardTypes";
import * as CardValues from "../CardValues";
import * as Actions from "../Actions";
import * as Roles from "../Roles";

export type CardType = CardTypes.Classic | CardTypes.Uno | CardTypes.Codenames;

export type CardValue = CardValues.Classic | CardValues.Uno | string;

export type Action = Actions.Classic | Actions.Codenames | Actions.Uno;

export type Role = Roles.Codenames;
