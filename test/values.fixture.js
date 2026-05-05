export const componentBuilderResult = `import { testBeforeOnPlayerPlaceEvent } from "../../events/blocks/test/beforeOnPlayerPlaceEvent";
import { testOnPlayerInteractEvent } from "../../events/blocks/test/onPlayerInteractEvent";
import { testOnRedstoneUpdateEvent } from "../../events/blocks/test/onRedstoneUpdateEvent";

/**
 * Componente: mccc:test
 * Descripción: xd
 * Addon: New Addon
 */

export const testComponent = {
    beforeOnPlayerPlace: testBeforeOnPlayerPlaceEvent,\n\tonPlayerInteract: testOnPlayerInteractEvent,\n\tonRedstoneUpdate: testOnRedstoneUpdateEvent
}`

export const componentImportsBuilderResult = `import { testBeforeOnPlayerPlaceEvent } from "../../events/blocks/test/beforeOnPlayerPlaceEvent";
import { testOnPlayerInteractEvent } from "../../events/blocks/test/onPlayerInteractEvent";
import { testOnRedstoneUpdateEvent } from "../../events/blocks/test/onRedstoneUpdateEvent";
import { testOnEntityFallOnEvent } from "../../events/blocks/test/onEntityFallOnEvent";`

export const componentEventsBuilderResult = "beforeOnPlayerPlace: testBeforeOnPlayerPlaceEvent,\n\tonPlayerInteract: testOnPlayerInteractEvent"