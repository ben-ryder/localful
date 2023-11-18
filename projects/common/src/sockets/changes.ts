import {ChangesEvents} from "../schemas/changes/changes-events";

interface ChangesServerToClientEvents extends ChangesEvents {}

interface ChangesClientToServerEvents extends ChangesEvents {}

interface ChangesInterServerEvents {}

interface ChangesSocketData {}
