/*global Vue, todoStorage */

(function (exports) {

  'use strict';

  var filters = {
    all: function (todo) {
      return true;
    },
    active: function (todo) {
      return !todo.completed;
    },
    completed: function (todo) {
      return todo.completed;
    }
  };

  exports.app = new Vue({

    // the root element that will be compiled
    el: '#todoapp',

    // data
    data: {
      todos: todoStorage.fetch(),
      newTodo: '',
      editedTodo: null,
      filter: 'all'
    },

    watch: {
      todos: {
        handler: function (todos) {
          todoStorage.save(todos)
        },
        deep: true
      }
    },

    // a custom directive to wait for the DOM to be updated
    // before focusing on the input field.
    // http://vuejs.org/guide/directives.html#Writing_a_Custom_Directive
    directives: {
      'todo-focus': function (el, value) {
        if (value) {
          el.focus()
        }
      }
    },

    // computed property
    // http://vuejs.org/guide/computed.html
    computed: {
      filterTodos: function () {
        return this.todos.filter(filters[this.filter]);
      },
      remaining: function () {
        return this.todos.filter(filters.active).length;
      },
      allDone: {
        get: function () {
          return this.remaining === 0
        },
        set: function (value) {
          this.todos.forEach(function (todo) {
            todo.completed = value
          })
        }
      }
    },
    filters: {
      pluralize: function (n) {
        return n <= 1 ? 'item' : 'items'
      }
    },

    // methods that implement data logic.
    // note there's no DOM manipulation here at all.
    methods: {

      addTodo: function () {
        var value = this.newTodo && this.newTodo.trim();
        if (!value) {
          return;
        }
        this.todos.push({ title: value, completed: false });
        this.newTodo = '';
      },

      removeTodo: function (todo) {
        this.todos.splice(this.todos.indexOf(todo), 1)
      },

      editTodo: function (todo) {
        this.beforeEditCache = todo.title;
        this.editedTodo = todo;
      },

      doneEdit: function (todo) {
        if (!this.editedTodo) {
          return;
        }
        this.editedTodo = null;
        todo.title = todo.title.trim();
        if (!todo.title) {
          this.removeTodo(todo);
        }
      },

      cancelEdit: function (todo) {
        this.editedTodo = null;
        todo.title = this.beforeEditCache;
      },

      removeCompleted: function () {
        this.todos = this.todos.filter(filters.active);
      }
    }
  });

  app.filters = filters;

})(window);