import React from 'react';
import io from 'socket.io-client';
import { v4 as uuidv4 } from 'uuid';

class App extends React.Component {
  state = {
    tasks: [
      {id: 1, name: 'Shoping'},
      {id: 2, name: 'Walk the dog'}
    ],
    taskName: ''
  }
  componentDidMount() {
    this.socket = io.connect('http://localhost:8000');
    this.socket.on('addTask', task => {
      this.addTask(task);
    });
    this.socket.on('removeTask', deleteTask => {
      this.removeTask(deleteTask);
    });
    this.socket.on('updateData', allTasks => {
      this.updateTasks(allTasks);
    });
  }

  removeTask(task, status) {
    const { tasks } = this.state;
    this.setState({
      tasks: tasks.filter(item => item.id !== task.id)
    });
    if(status !== undefined) {
      this.socket.emit('removeTask', task);
    }
  }

  submitForm(event) {
    event.preventDefault();
    const id = uuidv4();
    this.addTask({id: id, name: this.state.taskName});
    this.socket.emit('addTask', ({id: id, name: this.state.taskName}));
    this.setState({taskName: ''});
  }

  addTask(task) {
    this.setState({tasks: [...this.state.tasks, task]});
  }

  updateTasks(allTasks) {
    this.setState({tasks: allTasks});
  }
 
  render() {
    const { tasks, taskName } = this.state;
    return (
      <div className="App">
        <header>
          <h1>ToDoList.app</h1>
        </header>
        <section className="tasks-section" id="tasks-section">
          <h2>Tasks</h2>
          <ul className="tasks-section__list" id="tasks-list">
            {tasks.map(task => (
              <li key={task.id} className="task">{task.name} <button className="btn btn--red" onClick={() => this.removeTask(task, 'local')}>Remove</button></li>
            ))}
          </ul>
          <form id="add-task-form">
            <input className="text-input" autocomplete="off" type="text" placeholder="Type your description" id="task-name" value={taskName} onChange={(event) => {this.setState({taskName: event.target.value})}}/>
            <button className="btn" type="submit" onClick={(event) => this.submitForm(event)}>Add</button>
          </form>
        </section>
      </div>
  );
  }
}

export default App;
