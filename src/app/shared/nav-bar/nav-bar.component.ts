import { Component, inject, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { TaskSummaryComponent } from '../../features/task-summary/task-summary.component';
import { TaskStore } from '../../features/task-board/store/task.store';

@Component({
  selector: 'app-nav-bar',
  imports: [MatButtonModule, MatIconModule, TaskSummaryComponent],
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.scss',
})
export class NavBarComponent implements OnInit {
  ngOnInit(): void {}
}
