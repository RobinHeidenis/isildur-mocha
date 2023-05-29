import { Runner } from "mocha";

const constants = Runner.constants;
const { EVENT_RUN_END, EVENT_SUITE_END } = constants;
export { constants, EVENT_RUN_END, EVENT_SUITE_END }; // These constants are nice to have directly like this, instead of having to import them from the Mocha Runner object
