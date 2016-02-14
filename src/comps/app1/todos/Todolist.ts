import {Component, provide, Injector, Provider} from 'angular2/core';
import {HTTP_PROVIDERS, Http} from "angular2/http";
import {TodosService, IDataStore, TodoItemModel} from "./TodoService";
import {TodoItem} from "./Todoitem";
import {Observable} from "rxjs/Observable";
import {TodoAction} from "./actions/TodoAction";
import {AppStore} from "angular2-redux-util/dist/index";
import TodoStatsModel from "./TodoStatsModel";

type channelTodoObservable = Observable<TodoItem>;
type channelTodosObservable = Observable<Array<channelTodoObservable>>;

@Component({
    // an example of how to provide a service manually that depends on other services
    // as well as example of factory
    // providers: [
    //     provide(TodosService, {
    //         useFactory: (todoAction, http, todoStatsModel, appStore) => {
    //             return new todoAction(TodoAction, http, todoStatsModel, appStore)
    //         },
    //         deps: [TodoAction, Http, TodoStatsModel, AppStore]
    //     })
    // ]
    selector: 'todo-list',
    template: `
                <section class="todoapp">
                  <header class="header">
                    <h1>your to-do's</h1>
                    <input class="new-todo" placeholder="What needs to be done?"
                    autofocus [(ngModel)]="newItem" (keyup.enter)="addItem(newItem)">
                    <button class="btn btn-default btn-lg" (click)="addItem(newItem)">Add todo</button>
                  </header>
                  <section class="main">
                    <ul class="todo-list">
                      <li *ngFor="#item of m_dataStore">
                        <todo-item [item]="item" (done)="removeItem($event)" (edit)="editItem($event)">
                        </todo-item>
                      </li>
                    </ul>
                  </section>
                </section>
    `,
    styleUrls: ['../comps/app1/todos/Todolist.css'],
    directives: [TodoItem],
})
export class TodoList {
    newItem = '';
    private m_dataStore:any = [];
    private addItem:Function;
    private editItem:Function;
    private removeItem:Function;

    constructor(private todoService:TodosService, private todoAction:TodoAction, private appStore:AppStore) {
        // todoAction.service = todoService;

        this.todoService.loadTodosRemote((status:number)=> {
            if (status == -1) {
                // ignore errors
                return;
            }
        });


        //
        // var myProvider = new Provider(TodosService, {
        //     useFactory: (todoAction, http, todoStatsModel, appStore) => {
        //         return new todoAction(TodoAction, HTTP_PROVIDERS, todoStatsModel, appStore)
        //     },
        //     deps: [TodoAction, Http, TodoStatsModel, AppStore]
        // });

        // var injector =  Injector.resolveAndCreate(
        //     [TodosService, TodoAction, HTTP_PROVIDERS, TodoStatsModel, provide(AppStore, {useValue: new AppStore('')})])
        // var myTodoService:TodosService = injector.get(TodosService)
        // myTodoService.sayHello('Sean');

        // var injector =  Injector.resolveAndCreate([myProvider, TodoAction, Http, TodoStatsModel, AppStore]);


        // var injector =  Injector.resolveAndCreate([myProvider]);
        // injector.get(TodosService)

        // var inj2 = Injector.resolve([myProvider]);
        // var f = injector.instantiateResolved(mySrv);



        appStore.subscribe((path, prev, store) => {
            this.m_dataStore = store;
            this.newItem = '';
        }, 'todos', true);

        this.addItem = todoAction.createDispatcher(appStore, todoAction.addTodo);
        this.removeItem = todoAction.createDispatcher(appStore, todoAction.removeTodo);
        this.editItem = todoAction.createDispatcher(appStore, todoAction.editTodo);
    }
}