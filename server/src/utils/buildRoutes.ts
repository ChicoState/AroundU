import { Router, RequestHandler } from 'express';

type RouteConfig = {
  path: string;
  method: 'get' | 'post' | 'put' | 'delete';
  validator: RequestHandler;
  middleware: RequestHandler[];
  controller: RequestHandler;
};

const buildRoutes = (routes: RouteConfig[]): Router => {
  const router = Router();
  routes.forEach((route) => {
    const { method, path, validator, middleware, controller } = route;
    router[method](path, validator, ...middleware, controller);
  });
  return router;
};

export default buildRoutes;
