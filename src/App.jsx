import { useEffect, useState } from 'react'
import './App.css'
import { supabase } from './utils/supabase'

const initialTodos = [
  // { id: 2, text: '할일2', completed: false },
  // { id: 1, text: '할일1', completed: false },
]

function App() {
  const [todos, setTodos] = useState(initialTodos)
  const [inputValue, setInputValue] = useState('')
  
  /* 데이터 조회 (read)
  컴포넌트가 렌더링이 끝난 후 Supabase의 todos 테이블의 데이터를 가져온 후에
  setTodos를 활용하여 todos를 업데이트
  */

  useEffect(() => { 
    console.log("call fetchTodos()")
    fetchTodos();
  }, []);

  const fetchTodos = async () =>
  {
    try
    {
      let { data, error } = await supabase
        .from('todos')
        .select('*')

      if (error) {
        console.error(error);
        return;
      }
      setTodos(data || []);
    } catch(error)
    {
      console.error(error);
    }
  };

  /*
  데이터 추가 (Create)
  */
  async function addTodo(event) {
    event.preventDefault()
    /*
    const text = inputValue.trim()

    if (!text) return

    setTodos((currentTodos) => [
      { id: crypto.randomUUID(), text, completed: false },
      ...currentTodos,
    ])
      */
    try {
      const { data, error } = await supabase
        .from('todos')
        .insert([ { text: inputValue } ])
        .select();
      console.log(data);
      if (data && data.length > 0)
      {
        setTodos([data[0], ...todos]);
      }
    }
    catch(error)
    {
      console.error(error);
    }
  }
  

  async function toggleTodo(id) {
    try 
    {
      const todo = todos.find((t) => t.id === id);
      if (!todo)
         return;

      const completed = !(todo.completed ?? false);
      const { data, error } = await supabase
      .from('todos')
      .update({ completed })
      .eq('id', id)
      .select();

      if (error)
      {
         console.error(error);
         return;
      }

      if (data && data.length > 0)
      {
        setTodos((currentTodos) =>
          currentTodos.map((currentTodo) =>
            currentTodo.id === id ? data[0] : currentTodo,
          ),
        );
      }
    }
    catch (error)
    {
      console.error(error);
    }

  }

  async function deleteTodo(id) {
    // setTodos((currentTodos) => currentTodos.filter((todo) => todo.id !== id))

    try 
    {
      const { error } = await supabase
        .from('todos')
        .delete()
        .eq('id', id);
        if (error) {
          console.error(error);
          return;
        }
        setTodos(todos.filter((todo)=>todo.id !== id));
    }
    catch (error)
    {
      console.log(error);
    }
  }

  return (
    <main className="page">
      <section className="todo-card" aria-labelledby="todo-title">
        <header className="todo-header">
          <h1 id="todo-title">
            <span aria-hidden="true">🔥</span> Todo List
          </h1>
          <p>일정을 체계적으로 관리하세요</p>
        </header>

        <form className="todo-form" onSubmit={addTodo}>
          <label className="visually-hidden" htmlFor="new-todo">
            새로운 할 일
          </label>
          <input
            id="new-todo"
            type="text"
            value={inputValue}
            onChange={(event) => setInputValue(event.target.value)}
            placeholder="새로운 할 일을 입력하세요..."
            maxLength={100}
          />
          <button type="submit">추가</button>
        </form>

        <ul className="todo-list">
          {todos.map((todo) => (
            <li className="todo-item" key={todo.id}>
              <label className="todo-label">
                <input
                  type="checkbox"
                  checked={todo.completed}
                  onChange={() => toggleTodo(todo.id)}
                />
                <span className={todo.completed ? 'todo-text completed' : 'todo-text'}>
                  {todo.text}
                </span>
              </label>
              <button
                className="delete-button"
                type="button"
                onClick={() => deleteTodo(todo.id)}
                aria-label={`${todo.text} 삭제`}
              >
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M4 7h16M10 11v6m4-6v6M5.5 7l1 13h11l1-13M9 7V4h6v3" />
                </svg>
              </button>
            </li>
          ))}
        </ul>
      </section>
    </main>
  )
}

export default App
