import { useEffect } from "react"
import { useTasks } from "../context/TasksContext"
import TaskCard from "../components/TaskCard";

function TasksPage() {

    const { getTasks, tasks } = useTasks();
    useEffect(() => {
        getTasks();
    }, []);

    if (tasks.length == 0) return (<h1>no tasks</h1>)
    return (
        <div className="grid grid-cols-3 gap-2 my-1 ml-1">
            {tasks.map((task) => (
                <TaskCard task={task} key={task._id} />
            ))}

        </div>
    )
}
export default TasksPage