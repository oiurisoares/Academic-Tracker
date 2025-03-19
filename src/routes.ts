import { Router } from 'express';

const router: Router = Router();
const routePaths: string[] = [];

routePaths.forEach(async (path) => {
    const routeModule = await import(`./routes/${path.split('/')[1]}Routes`);
    router.use(path, routeModule.default);
});

export default router;
