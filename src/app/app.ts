import { Component, signal } from '@angular/core';
import { NavBarComponent } from './shared/nav-bar/nav-bar.component';
import { TaskBoardComponent } from './features/task-board/task-board.component';

@Component({
  selector: 'app-root',
  imports: [NavBarComponent, TaskBoardComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected readonly title = signal('takenbord');
}
