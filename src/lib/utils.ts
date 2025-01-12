import { MOCK_TASKS } from "@/constants/constants";
import { Todo } from "@/types";

let idCounter = 1;

export function getRandomTasks(count: number, status: string): Todo[] {
  const filteredTasks = MOCK_TASKS;
  const shuffledTasks = filteredTasks.sort(() => 0.5 - Math.random());

  let resultTasks = shuffledTasks.slice(0, count);

  while (resultTasks.length < count) {
    const remainingCount = count - resultTasks.length;
    const tasksToAdd = shuffledTasks.slice(0, remainingCount);
    resultTasks = [...resultTasks, ...tasksToAdd];
  }

  return resultTasks.map((task) => {
    const newId = idCounter++;
    return {
      id: newId.toString(),
      name: task.name,
      labels: task.labels,
      status: status,
      priority: task.priority,
      assignee: task.assignee,
      dueDate: task.due_date,
      createdAt: task.created_at,
      updatedAt: task.updated_at,
      text: task.comment,
    };
  });
}
