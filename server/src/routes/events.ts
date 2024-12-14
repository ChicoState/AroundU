import buildRoutes from '@/utils/buildRoutes';
import { processPostEvents, processGetEvents } from '@/controllers/events';
import { validatePostEvents, validateGetEvents } from '@/validators/events';
import authenticationHandler from '@/middleware/auth';

const eventsRoutes = buildRoutes([
  {
    method: 'post',
    path: '/events',
    validator: validatePostEvents,
    middleware: [authenticationHandler],
    controller: processPostEvents,
  },
  {
    method: 'get',
    path: '/events',
    validator: validateGetEvents,
    middleware: [],
    controller: processGetEvents,
  },
]);

export default eventsRoutes;
