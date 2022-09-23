---
title: 20.x - 小结与测试
alias: 20.x - 小结与测试
origin: /chapter-11-comprehensive-quiz/
origin_title: "20.x — Chapter 20 comprehensive quiz"
time: 2022-7-5
type: translation
tags:
- summary
---
**Chapter review**

Exception handling provides a mechanism to decouple handling of errors or other exceptional circumstances from the typical control flow of your code. This allows more freedom to handle errors when and how ever is most useful for a given situation, alleviating many (if not all) of the messiness that return codes cause.

A **throw** statement is used to raise an exception. **Try blocks** look for exceptions thrown by the code written or called within them. These exceptions get routed to **catch blocks**, which catch exceptions of particular types (if they match) and handle them. By default, an exception that is caught is considered handled.

Exceptions are handled immediately. If an exception is raised, control jumps to the nearest enclosing try block, looking for catch handlers that can handle the exception. If no try block is found or no catch blocks matches, the stack will be unwound until a handler is found. If no handler is found before the entire stack is unwound, the program will terminate with an unhandled exception error.

Exceptions of any data type can be thrown, including classes.

Catch blocks can be configured to catch exceptions of a particular data type, or a catch-all handler can be set up by using the ellipses (…). A catch block catching a base class reference will also catch exceptions of a derived class. All of the exceptions thrown by the standard library are derived from the std::exception class (which lives in the exception header), so catching a `std::exception` by reference will catch all standard library exceptions. The what() member function can be used to determine what kind of std::exception was thrown.

Inside a catch block, a new exception may be thrown. Because this new exception is thrown outside of the try block associated with that catch block, it won’t be caught by the catch block it’s thrown within. Exceptions may be rethrown from a catch block by using the keyword throw by itself. Do not rethrow an exception using the exception variable that was caught, otherwise object slicing may result.

Function try blocks give you a way to catch any exception that occurs within a function or an associated member initialization list. These are typically only used with derived class constructors.

You should never throw an exception from a destructor.

The **noexcept** exception specifier can be used to denote that a function is no-throw/no-fail.

Finally, exception handling does have a cost. In most cases, code using exceptions will run slightly slower, and the cost of handling an exception is very high. You should only use exceptions to handle exceptional circumstances, not for normal error handling cases (e.g. invalid input).