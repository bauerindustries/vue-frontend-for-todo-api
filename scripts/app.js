const TodosApp = {
  data() {
    return {
      // todo_API_URI: 'http://localhost:3000/todos/',
      todo_API_URI: 'https://todos-rest-api-demo.onrender.com/todos',
      isLoading: false,
      enteredTodoText: '',
      todos: [],
      editedTodoId: null,
      buttonLegend: 'Save',
    };
  },

  methods: {
    async saveTodo(event) {
      event.preventDefault();

      if (!this.editedTodoId) {
        // create a new todo
        let response;

        try {
          response = await fetch(this.todo_API_URI, {
            method: 'POST',
            body: JSON.stringify({
              text: this.enteredTodoText,
            }),
            headers: {
              'Content-Type': 'application/json',
            },
          });
        } catch (error) {
          alert('Something went wrong!');
          return;
        }

        if (!response.ok) {
          alert('Something went wrong!');
          return;
        }

        const responseData = await response.json();

        const newTodo = {
          text: this.enteredTodoText,
          _id: responseData.createdTodo.id,
        };

        this.todos.push(newTodo);
      } else {
        // update existing todo
        const todoId = this.editedTodoId;

        let response;

        try {
          response = await fetch(this.todo_API_URI + todoId, {
            method: 'PATCH',
            body: JSON.stringify({
              text: this.enteredTodoText,
            }),
            headers: {
              'Content-Type': 'application/json',
            },
          });
        } catch (error) {
          alert('Something went wrong!');
          return;
        }

        if (!response.ok) {
          alert('Something went wrong!');
          return;
        }

        const responseData = await response.json();

        const index = this.todos.findIndex(function (todo) {
          return todo._id === todoId;
        });

        const updatedTodo = {
          _id: this.editedTodoId,
          text: this.enteredTodoText,
        };

        this.todos[index] = updatedTodo;
      }
      // reset input & button legend
      this.editedTodoId = null;
      this.enteredTodoText = '';
      this.buttonLegend = 'Save';
    },

    // edit
    startEditTodo(todoId) {
      this.editedTodoId = todoId;
      const index = this.todos.findIndex(function (todo) {
        return todo._id === todoId;
      });
      this.enteredTodoText = this.todos[index].text;
      this.buttonLegend = 'Update';
    },

    // delete
    async deleteTodo(todoId) {
      let response;

      try {
        response = await fetch(this.todo_API_URI + todoId, {
          method: 'DELETE',
        });
      } catch (error) {
        alert('Something went wrong!');
        return;
      }

      if (!response.ok) {
        alert('Something went wrong!');
        return;
      }

      this.todos = this.todos.filter(function (todo) {
        return todo._id !== todoId;
      });
    },
  },
  // get todos from db via API
  async created() {
    this.isLoading = true;
    // async created() {
    let response;
    try {
      response = await fetch(this.todo_API_URI);
    } catch (error) {
      alert('Something went wrong!');
      this.isLoading = false;
      return;
    }

    this.isLoading = false;

    if (!response.ok) {
      alert('Something went wrong!');
      return;
    }

    const responseData = await response.json();
    this.todos = responseData.todos;
  },
};

Vue.createApp(TodosApp).mount('#todos-app');
