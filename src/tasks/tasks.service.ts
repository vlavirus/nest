import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";

import { CreateTaskDto } from "./dto/create-task.dto";
import { TaskRepository } from "./task.repository";
import { Task } from "./task.entity";
import { TaskStatus } from "./task-status.enum";
import { GetTasksFilterDto } from "./dto/get-tasks-filter.dto";

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(TaskRepository)
    private taskRepository: TaskRepository,
  ) {}

  async getTasks(filterDto: GetTasksFilterDto): Promise<Task[]> {
    return await this.taskRepository.getTasks(filterDto);
  }

  // private tasks: Task[] = [];
  //
  // getAllTasks(): Task[] {
  //   return this.tasks;
  // }
  //
  // getTasksWithFilters(filterDto: GetTasksFilterDto) {
  //   const { status, search } = filterDto;
  //
  //   let tasks = this.getAllTasks();
  //
  //   if (status) {
  //     tasks = tasks.filter((task) => task.status === status);
  //   }
  //
  //   if (search) {
  //     tasks = tasks.filter(
  //       (task) =>
  //         task.title.includes(search) || task.description.includes(search),
  //     );
  //   }
  //
  //   return tasks;
  // }
  //
  async getTaskById(id: number): Promise<Task> {
    const found = await this.taskRepository.findOne(id);

    if (!found) {
      throw new NotFoundException(`Task with ID "${id}" not found`);
    }

    return found;
  }

  async createTask(createTaskDto: CreateTaskDto): Promise<Task> {
    return this.taskRepository.createTask(createTaskDto);
  }

  // createTask(createTaskDto: CreateTaskDto): Task {
  //   const { title, description } = createTaskDto;
  //
  //   const task: Task = {
  //     id: uuidv1(),
  //     title,
  //     description,
  //     status: TaskStatus.OPEN,
  //   };
  //
  //   this.tasks.push(task);
  //   return task;
  // }

  async deleteTask(id: number): Promise<void> {
    const res = await this.taskRepository.delete(id);

    if (res.affected === 0) {
      throw new NotFoundException(`Task with ID "${id}" not found`);
    }

    console.log(res);
  }

  async updateTaskStatus(id: number, status: TaskStatus): Promise<Task> {
    const task = await this.getTaskById(id);
    task.status = status;
    await task.save();
    return task;
  }

  // updateTaskStatus(id: string, status: TaskStatus): Task {
  //   const task = this.getTaskById(id);
  //   task.status = status;
  //   return task;
  // }
}
