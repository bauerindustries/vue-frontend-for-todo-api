const TodosApp = {
  data() {
    return {
      // todo_API_URI: 'http://localhost:3000/todos/',
      todo_API_URI: 'https://todos-rest-api-demo.onrender.com/todos/',
      isLoading: false,
      enteredTodoText: '',
      todos: [],
      editedTodoId: null,
      buttonPlaceholder: 'Add a new to-do item...',
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

        this.todos.unshift(newTodo);
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
      // reset input, placeholder text & button legend
      this.editedTodoId = null;
      this.enteredTodoText = '';
      this.buttonLegend = 'Save';
      this.buttonPlaceholder = 'Add a new to-do item...';
      this.focusOnInput();
    },

    focusOnInput() {
      this.$refs.theInput.focus();
    },

    // edit
    startEditTodo(todoId) {
      this.buttonPlaceholder = 'Enter the updated text...';
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
    this.focusOnInput();
  },
};

Vue.createApp(TodosApp).mount('#todos-app');
