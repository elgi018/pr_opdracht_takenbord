import { iTask } from '../../../core/models/task.model';
import { signalStore, withComputed, withMethods, withState } from '@ngrx/signals';

interface TaskState {
  tasks: iTask[];
  loading: boolean;
  error: string | null;
}

const initialState: TaskState = {
  tasks: [],
  loading: false,
  error: null,
};

export const TaskStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withComputed(() => ({})),
  withMethods(() => ({}))
);
