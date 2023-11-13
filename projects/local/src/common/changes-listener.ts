import {ChangeDto} from "@ben-ryder/lfb-common";

export type ChangesListener = (changes: ChangeDto[]) => void;
