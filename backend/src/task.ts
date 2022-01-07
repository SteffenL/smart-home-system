export interface TaskCallback<T> {
    completed(result: T): Promise<void>;
    errored(err: any): Promise<void>;
};

export interface Task {
    invoke(): Promise<void>;
}

export abstract class AbstractTask<T> implements Task {
    private _callback: TaskCallback<T>;

    public constructor(callback: TaskCallback<T>) {
        this._callback = callback;
    }

    public async invoke(): Promise<void> {
        let result;
        try {
            result = await this._do_invoke();
        } catch (err) {
            this._callback.errored(err);
            return;
        }
        this._callback.completed(result);
    }

    protected abstract _do_invoke(): Promise<T>;
}

export class TaskScheduler {
    private readonly _tasks: Task[] = [];
    private _timeout: NodeJS.Timeout;

    public constructor() {
        this._timeout = setTimeout(() => this._timeoutCallback());
    }

    public schedule(task: Task): void {
        this._tasks.push(task);
    }

    public scheduleRecurring(task: Task, interval: number, initialDelay: number = interval): void {
        setTimeout(() => this._repeatTask(task, interval), initialDelay);
    }

    private _repeatTask(task: Task, delay: number) {
        try {
            task.invoke();
            setTimeout(() => this._repeatTask(task, delay), delay);
        } catch (err) {
            console.error(err);
            setTimeout(() => this._repeatTask(task, delay), Math.max(delay, 5000));
        }
    }

    private _timeoutCallback() {
        let errored = false;
        try {
            const task = this._tasks.shift();
            if (task) {
                task.invoke();
            }
        } catch (err) {
            console.error(err);
            errored = true;
        }
        const delay = errored ? 5000 : 0;
        this._timeout = setTimeout(() => this._timeoutCallback(), delay);
    }
}
