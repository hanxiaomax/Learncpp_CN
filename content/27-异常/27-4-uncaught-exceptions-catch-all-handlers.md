---
title: 27-4-uncaught-exceptions-catch-all-handlers
aliases: 27-4-uncaught-exceptions-catch-all-handlers
origin: 
origin_title: 27-4-uncaught-exceptions-catch-all-handlers
time: 2025-04-01 
type: translation-under-construction
tags:
---
# 27.4 — Uncaught exceptions and catch-all handlers

[*Alex*](https://www.learncpp.com/author/Alex/ "View all posts by Alex")

October 25, 2008, 12:07 pm PDT
September 12, 2024

By now, you should have a reasonable idea of how exceptions work. In this lesson, we’ll cover a few more interesting exception cases.

Uncaught exceptions

When a function throws an exception that it does not handle itself, it is making the assumption that a function somewhere down the call stack will handle the exception. In the following example, mySqrt() assumes someone will handle the exception that it throws -- but what happens if nobody actually does?

Here’s our square root program again, minus the try block in main():

```cpp
#include <iostream>
#include <cmath> // for sqrt() function

// A modular square root function
double mySqrt(double x)
{
    // If the user entered a negative number, this is an error condition
    if (x < 0.0)
        throw "Can not take sqrt of negative number"; // throw exception of type const char*

    return std::sqrt(x);
}

int main()
{
    std::cout << "Enter a number: ";
    double x;
    std::cin >> x;

    // Look ma, no exception handler!
    std::cout << "The sqrt of " << x << " is " << mySqrt(x) << '\n';

    return 0;
}
```

Now, let’s say the user enters -4, and mySqrt(-4) raises an exception. Function mySqrt() doesn’t handle the exception, so the program looks to see if some function down the call stack will handle the exception. main() does not have a handler for this exception either, so no handler can be found.

When no exception handler for a function can be found, std::terminate() is called, and the application is terminated. In such cases, the call stack may or may not be unwound! If the stack is not unwound, local variables will not be destroyed, and any cleanup expected upon destruction of said variables will not happen!

Warning

The call stack may or may not be unwound if an exception is unhandled.

If the stack is not unwound, local variables will not be destroyed, which may cause problems if those variables have non-trivial destructors.

As an aside…

Although it might seem strange to not unwind the stack in such a case, there is a good reason for not doing so. An unhandled exception is generally something you want to avoid at all costs. If the stack were unwound, then all of the debug information about the state of the stack that led up to the throwing of the unhandled exception would be lost! By not unwinding, we preserve that information, making it easier to determine how an unhandled exception was thrown, and fix it.

When an exception is unhandled, the operating system will generally notify you that an unhandled exception error has occurred. How it does this depends on the operating system, but possibilities include printing an error message, popping up an error dialog, or simply crashing. Some OSes are less graceful than others. Generally this is something you want to avoid!

Catch-all handlers

And now we find ourselves in a conundrum:

- Functions can potentially throw exceptions of any data type (including program-defined data types), meaning there is an infinite number of possible exception types to catch.
- If an exception is not caught, your program will terminate immediately (and the stack may not be unwound, so your program may not even clean up after itself properly).
- Adding explicit catch handlers for every possible type is tedious, especially for the ones that are expected to be reached only in exceptional cases!

Fortunately, C++ also provides us with a mechanism to catch all types of exceptions. This is known as a **catch-all handler**. A catch-all handler works just like a normal catch block, except that instead of using a specific type to catch, it uses the ellipses operator (…) as the type to catch. For this reason, the catch-all handler is also sometimes called an “ellipsis catch handler”

If you recall from lesson [20.5 -- Ellipsis (and why to avoid them)](https://www.learncpp.com/cpp-tutorial/ellipsis-and-why-to-avoid-them/), ellipses were previously used to pass arguments of any type to a function. In this context, they represent exceptions of any data type. Here’s an simple example:

```cpp
#include <iostream>

int main()
{
	try
	{
		throw 5; // throw an int exception
	}
	catch (double x)
	{
		std::cout << "We caught an exception of type double: " << x << '\n';
	}
	catch (...) // catch-all handler
	{
		std::cout << "We caught an exception of an undetermined type\n";
	}
}
```

Because there is no specific exception handler for type int, the catch-all handler catches this exception. This example produces the following result:

```cpp
We caught an exception of an undetermined type

```

The catch-all handler must be placed last in the catch block chain. This is to ensure that exceptions can be caught by exception handlers tailored to specific data types if those handlers exist.

Often, the catch-all handler block is left empty:

```cpp
catch(...) {} // ignore any unanticipated exceptions
```

This will catch any unanticipated exceptions, ensuring that stack unwinding occurs up to this point and preventing the program from terminating, but does no specific error handling.

Using the catch-all handler to wrap main()

One use for the catch-all handler is to wrap the contents of main():

```cpp
#include <iostream>

struct GameSession
{
    // Game session data here
};

void runGame(GameSession&)
{
    throw 1;
}

void saveGame(GameSession&)
{
    // Save user's game here
}

int main()
{
    GameSession session{};

    try
    {
        runGame(session);
    }
    catch(...)
    {
        std::cerr << "Abnormal termination\n";
    }

    saveGame(session); // save the user's game (even if catch-all handler was hit)

    return 0;
}
```

In this case, if runGame() or any of the functions it calls throws an exception that is not handled, it will be caught by this catch-all handler. The stack will be unwound in an orderly manner (ensuring destruction of local variables). This will also prevent the program from terminating immediately, giving us a chance to print an error of our choosing and save the user’s state before exiting.

Tip

If your program uses exceptions, consider using a catch-all handler in main, to help ensure orderly behavior if an unhandled exception occurs.

If an exception is caught by the catch-all handler, you should assume the program is now in some indeterminate state, perform cleanup immediately, and then terminate.

Debugging unhandled exceptions

Unhandled exceptions are an indication that something unexpected has happened, and we probably want to diagnose why an unhandled exception was thrown in the first place. Many debuggers will (or can be configured to) break on unhandled exceptions, allowing us to view the stack at the point where the unhandled exception was thrown. However, if we have a catch-all handler, then all exceptions are handled, and (because the stack is unwound) we lose useful diagnostic information.

Therefore, in debug builds, it can be useful to disable the catch-all handler. We can do this via conditional compilation directives.

Here’s one way to do that:

```cpp
#include <iostream>

struct GameSession
{
    // Game session data here
};

void runGame(GameSession&)
{
    throw 1;
}

void saveGame(GameSession&)
{
    // Save user's game here
}

class DummyException // a dummy class that can't be instantiated
{
    DummyException() = delete;
}; 

int main()
{
    GameSession session {}; 

    try
    {
        runGame(session);
    }
#ifndef NDEBUG // if we're in release node
    catch(...) // compile in the catch-all handler
    {
        std::cerr << "Abnormal termination\n";
    }
#else // in debug mode, compile in a catch that will never be hit (for syntactic reasons)
    catch(DummyException)
    {
    }
#endif

    saveGame(session); // save the user's game (even if catch-all handler was hit)

    return 0;
}
```

Syntactically, a try block requires at least one associated catch block. So if the catch-all handler is conditionally compiled out, we either need to conditionally compile out the try block, or we need to conditionally compile in another catch block. It’s cleaner to do the latter.

For this purpose, we create class `DummyException` which can’t be instantiated because it has a deleted default constructor and no other constructors. When `NDEBUG` is defined, we compile-in a catch handler to catch an exception of type `DummyException`. Since we can’t create a `DummyException`, this catch handler will never catch anything. Therefore any exceptions that reach this point will not be handled.

\[Next lesson

27.5Exceptions, classes, and inheritance\](https://www.learncpp.com/cpp-tutorial/exceptions-classes-and-inheritance/)
[Back to table of contents](/)
\[Previous lesson

27.3Exceptions, functions, and stack unwinding\](https://www.learncpp.com/cpp-tutorial/exceptions-functions-and-stack-unwinding/)

*Previous Post*[27.3 — Exceptions, functions, and stack unwinding](https://www.learncpp.com/cpp-tutorial/exceptions-functions-and-stack-unwinding/)

*Next Post*[27.5 — Exceptions, classes, and inheritance](https://www.learncpp.com/cpp-tutorial/exceptions-classes-and-inheritance/)

\[wpDiscuz\](javascript:void(0);)

Insert

You are going to send email to

Send

Move Comment

Move
