export interface Task {
    invoke(): Promise<void>;
}

export abstract class AbstractTask implements Task {
    public abstract invoke(): Promise<void>;
}
