---
title: 12.x - 小结与测试
alias: 12.x - 小结与测试
origin: /chapter-11-comprehensive-quiz/
origin_title: "12.x — Chapter 12 comprehensive quiz"
time: 2022-4-8
type: translation
tags:
- summary
---

Another chapter down! The next chapter is the best one, and you’re almost there! There’s just this pesky quiz to get past…

Function arguments can be passed by value, reference or address. Use pass by value for fundamental data types and enumerators. Use pass by reference for structs, classes, or when you need the function to modify an argument. Use pass by address for passing pointers or built-in arrays. Make your pass by reference and address parameters const whenever possible.

Values can be returned by value, reference, or address. Most of the time, return by value is fine, however return by reference or address can be useful when working with dynamically allocated data, structs, or classes. If returning by reference or address, remember to make sure you’re not returning something that will go out of scope.

Function pointers allow us to pass a function to another function. This can be useful to allow the caller to customize the behavior of a function, such as the way a list gets sorted.

Dynamic memory is allocated on the heap.

The call stack keeps track of all of the active functions (those that have been called but have not yet terminated) from the start of the program to the current point of execution. Local variables are allocated on the stack. The stack has a limited size. `std::vector` can be used to implement stack-like behavior.

A recursive function is a function that calls itself. All recursive functions need a termination condition.

Command line arguments allow users or other programs to pass data into our program at startup. Command line arguments are always C-style strings, and have to be converted to numbers if numeric values are desired.

Ellipsis allow you to pass a variable number of arguments to a function. However, ellipsis arguments suspend type checking, and do not know how many arguments were passed. It is up to the program to keep track of these details.

Lambda functions are functions that can be nested inside other functions. They don’t need a name and are very useful in combination with the algorithms library.