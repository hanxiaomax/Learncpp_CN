---
title: 20.x - 小结与测试
alias: 20.x - 小结与测试
origin: /chapter-20-comprehensive-quiz/
origin_title: "20.x — Chapter 20 comprehensive quiz"
time: 2022-7-5
type: translation
tags:
- summary
---

- 异常处理提供了将错误处理或异常情况处理流程与正常流程代码解耦的一种机制。这样一来程序员就可以根据实际情况，更加自如地处理错误，同时还可以在很大程度上缓解由基于返回错误码的方式处理异常所带来的问题。
- **throw**语句可以用来抛出一个异常。**Try 语句块**则会关注其块内代码是否抛出异常。一旦有异常抛出，这些异常就会被重定向到对应的**catch 语句块**中，不同类型的语句块可以捕获对应类型的异常并对其进行处理。默认情况下，异常只要被捕获，就可以认为是处理了。
- 异常会被立即处理——一旦异常被抛出，控制流会立即跳转到距离该Try语句块最近，且能够处理该异常的catch语句块。如果抛出异常的语句不位于任何try语句块中，则异常会沿着函数调用栈上送，如果在整个函数栈中都没有能够找到可用的异常处理逻辑，程序就会因为**异常未处理**eExceptions are handled immediately. If an exception is raised, control jumps to the nearest enclosing try block, looking for catch handlers that can handle the exception. If no try block is found or no catch blocks matches, the stack will be unwound until a handler is found. If no handler is found before the entire stack is unwound, the program will terminate with an unhandled exception error.

Exceptions of any data type can be thrown, including classes.

Catch blocks can be configured to catch exceptions of a particular data type, or a catch-all handler can be set up by using the ellipses (…). A catch block catching a base class reference will also catch exceptions of a derived class. All of the exceptions thrown by the standard library are derived from the std::exception class (which lives in the exception header), so catching a `std::exception` by reference will catch all standard library exceptions. The what() member function can be used to determine what kind of std::exception was thrown.

Inside a catch block, a new exception may be thrown. Because this new exception is thrown outside of the try block associated with that catch block, it won’t be caught by the catch block it’s thrown within. Exceptions may be rethrown from a catch block by using the keyword throw by itself. Do not rethrow an exception using the exception variable that was caught, otherwise object slicing may result.

Function try blocks give you a way to catch any exception that occurs within a function or an associated member initialization list. These are typically only used with derived class constructors.

You should never throw an exception from a destructor.

The **noexcept** exception specifier can be used to denote that a function is no-throw/no-fail.

Finally, exception handling does have a cost. In most cases, code using exceptions will run slightly slower, and the cost of handling an exception is very high. You should only use exceptions to handle exceptional circumstances, not for normal error handling cases (e.g. invalid input).