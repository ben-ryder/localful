import {ChangesEvents} from "../schemas/changes/changes-events.js";

interface ChangesServerToClientEvents extends ChangesEvents {}

interface ChangesClientToServerEvents extends ChangesEvents {}

interface ChangesInterServerEvents {}

interface ChangesSocketData {}
