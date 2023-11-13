import {ChangeDto} from "@localful/common";

export type ChangesListener = (changes: ChangeDto[]) => void;
