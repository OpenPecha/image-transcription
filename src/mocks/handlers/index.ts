import { groupHandlers } from './group.handler';
import { userHandlers } from './user.handler';
import { taskHandlers } from './task.handler';

export const handlers = [
    ...groupHandlers,
    ...userHandlers,
    ...taskHandlers,
];