import { useEffect } from 'react';

export default function TaskBar() {
  useEffect(() => {
    const myTaskbar = new Taskbar('taskbar-container');
    myTaskbar.addTask('app-1', 'Notepad');
    myTaskbar.addTask('app-2', 'Browser');
    myTaskbar.addTask('app-3', 'Terminal');
  }, []);

  return <div id="taskbar-container" className="taskbar" />;
}

interface TaskItem {
  id: string;
  title: string;
  active: boolean;
}

class Taskbar {
  private tasks: TaskItem[] = [];
  private container: HTMLElement;

  constructor(containerId: string) {
    const el = document.getElementById(containerId);
    if (!el) throw new Error('Container not found');
    this.container = el;
    this.render();
  }

  public addTask(id: string, title: string): void {
    this.tasks.push({ id, title, active: false });
    this.render();
  }

  public removeTask(id: string): void {
    this.tasks = this.tasks.filter(task => task.id !== id);
    this.render();
  }

  public activateTask(id: string): void {
    this.tasks.forEach(task => {
      task.active = task.id === id;
    });
    this.render();
  }

  private render(): void {
    this.container.innerHTML = '';

    for (const task of this.tasks) {
      const btn = document.createElement('button');
      btn.innerText = task.title;
      btn.className = task.active ? 'task-btn active' : 'task-btn';
      btn.onclick = () => this.activateTask(task.id);
      this.container.appendChild(btn);
    }
  }
}
