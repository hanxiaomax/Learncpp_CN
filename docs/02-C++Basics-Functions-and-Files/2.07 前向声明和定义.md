> [!INFO] 原文信息：
> - 链接：[2.7 — Forward declarations and definitions](https://www.learncpp.com/cpp-tutorial/forward-declarations/)
> - 作者：[_ALEX_](https://www.learncpp.com/author/Alex/ "View all posts by Alex")  
> - 2022-5-19

# 2.7 前向声明和定义

Take a look at this seemingly innocent sample program:

```cpp
#include <iostream>

int main()
{
    std::cout << "The sum of 3 and 4 is: " << add(3, 4) << '\n';
    return 0;
}

int add(int x, int y)
{
    return x + y;
}
```


You would expect this program to produce the result:

```
The sum of 3 and 4 is: 7
```

But in fact, it doesn’t compile at all! Visual Studio produces the following compile error:

```
add.cpp(5) : error C3861: 'add': identifier not found
```

The reason this program doesn’t compile is because the compiler compiles the contents of code files sequentially. When the compiler reaches the function call to _add_ on line 5 of _main_, it doesn’t know what _add_ is, because we haven’t defined _add_ until line 9! That produces the error, _identifier not found_.

Older versions of Visual Studio would produce an additional error:

```
add.cpp(9) : error C2365: 'add'; : redefinition; previous definition was 'formerly unknown identifier'
```

This is somewhat misleading, given that _add_ wasn’t ever defined in the first place. Despite this, it’s useful to generally note that it is fairly common for a single error to produce many redundant or related errors or warnings.

> [!TIP] 最佳实践
> When addressing compile errors in your programs, always resolve the first error produced first and then compile again.

To fix this problem, we need to address the fact that the compiler doesn’t know what add is. There are two common ways to address the issue.

## Option 1: Reorder the function definitions

One way to address the issue is to reorder the function definitions so _add_ is defined before _main_:

```cpp
#include <iostream>

int add(int x, int y)
{
    return x + y;
}

int main()
{
    std::cout << "The sum of 3 and 4 is: " << add(3, 4) << '\n';
    return 0;
}
```

COPY

That way, by the time _main_ calls _add_, the compiler will already know what _add_ is. Because this is such a simple program, this change is relatively easy to do. However, in a larger program, it can be tedious trying to figure out which functions call which other functions (and in what order) so they can be declared sequentially.

Furthermore, this option is not always possible. Let’s say we’re writing a program that has two functions _A_ and _B_. If function _A_ calls function _B_, and function _B_ calls function _A_, then there’s no way to order the functions in a way that will make the compiler happy. If you define _A_ first, the compiler will complain it doesn’t know what _B_ is. If you define _B_ first, the compiler will complain that it doesn’t know what _A_ is.

## Option 2: Use a forward declaration

We can also fix this by using a 前向声明（[[前向声明(forward declaration)]]）

A forward declaration allows us to tell the compiler about the existence of an identifier _before_ actually defining the identifier.

In the case of functions, this allows us to tell the compiler about the existence of a function before we define the function’s body. This way, when the compiler encounters a call to the function, it’ll understand that we’re making a function call, and can check to ensure we’re calling the function correctly, even if it doesn’t yet know how or where the function is defined.

To write a forward declaration for a function, we use a declaration statement called a function prototype. The function prototype consists of the function header (the function’s return type, name, and parameter types), terminated with a semicolon. The function body is not included in the prototype.

Here’s a function prototype for the _add_ function:

```cpp
int add(int x, int y); // function prototype includes return type, name, parameters, and semicolon.  No function body!
```

COPY

Now, here’s our original program that didn’t compile, using a function prototype as a forward declaration for function _add_:

```cpp
#include <iostream>

int add(int x, int y); // forward declaration of add() (using a function prototype)

int main()
{
    std::cout << "The sum of 3 and 4 is: " << add(3, 4) << '\n'; // this works because we forward declared add() above
    return 0;
}

int add(int x, int y) // even though the body of add() isn't defined until here
{
    return x + y;
}
```

Now when the compiler reaches the call to _add_ in main, it will know what _add_ looks like (a function that takes two integer parameters and returns an integer), and it won’t complain.

It is worth noting that function prototypes do not need to specify the names of the parameters. In the above code, you can also forward declare your function like this:

```cpp
int add(int, int); // valid function prototype
```


However, we prefer to name our parameters (using the same names as the actual function), because it allows you to understand what the function parameters are just by looking at the prototype. Otherwise, you’ll have to locate the function definition.

> [!TIP] 最佳实践
> When defining function prototypes, keep the parameter names. You can easily create forward declarations by copy/pasting your function’s prototype and adding a semicolon.

## Forgetting the function body

New programmers often wonder what happens if they forward declare a function but do not define it.

The answer is: it depends. If a forward declaration is made, but the function is never called, the program will compile and run fine. However, if a forward declaration is made and the function is called, but the program never defines the function, the program will compile okay, but the linker will complain that it can’t resolve the function call.

Consider the following program:

```cpp
#include <iostream>

int add(int x, int y); // forward declaration of add() using function prototype

int main()
{
    std::cout << "The sum of 3 and 4 is: " << add(3, 4) << '\n';
    return 0;
}

// note: No definition for function add
```

COPY

In this program, we forward declare _add_, and we call _add_, but we never define _add_ anywhere. When we try and compile this program, Visual Studio produces the following message:

```
Compiling...
add.cpp
Linking...
add.obj : error LNK2001: unresolved external symbol "int __cdecl add(int,int)" (?add@@YAHHH@Z)
add.exe : fatal error LNK1120: 1 unresolved externals
```

As you can see, the program compiled okay, but it failed at the link stage because _int add(int, int)_ was never defined.

Other types of forward declarations

Forward declarations are most often used with functions. However, forward declarations can also be used with other identifiers in C++, such as variables and user-defined types. Variables and user-defined types have a different syntax for forward declaration, so we’ll cover these in future lessons.

## Declarations vs. definitions

In C++, you’ll frequently hear the words “declaration” and “definition” used, and often interchangeably. What do they mean? You now have enough fundamental knowledge to understand the difference between the two.

A definition actually implements (for functions or types) or instantiates (for variables) the identifier. Here are some examples of definitions:

```cpp
int add(int x, int y) // implements function add()
{
    int z{ x + y }; // instantiates variable z

    return z;
}
```

COPY

A definition is needed to satisfy the _linker_. If you use an identifier without providing a definition, the linker will error.

The **one definition rule** (or ODR for short) is a well-known rule in C++. The ODR has three parts:

1.  Within a given _file_, a function, variable, type, or template can only have one definition.
2.  Within a given _program_, a variable or normal function can only have one definition. This distinction is made because programs can have more than one file (we’ll cover this in the next lesson).
3.  Types, templates, inline functions, and inline variables are allowed to have identical definitions in different files. We haven’t covered what most of these things are yet, so don’t worry about this for now -- we’ll bring it back up when it’s relevant.

Violating part 1 of the ODR will cause the compiler to issue a redefinition error. Violating ODR part 2 will likely cause the linker to issue a redefinition error. Violating ODR part 3 will cause undefined behavior.

Here’s an example of a violation of part 1:

```cpp
int add(int x, int y)
{
     return x + y;
}

int add(int x, int y) // violation of ODR, we've already defined function add
{
     return x + y;
}

int main()
{
    int x;
    int x; // violation of ODR, we've already defined x
}
```

COPY

Because the above program violates ODR part 1, this causes the Visual Studio compiler to issue the following compile errors:

```
project3.cpp(9): error C2084: function 'int add(int,int)' already has a body
project3.cpp(3): note: see previous definition of 'add'
project3.cpp(16): error C2086: 'int x': redefinition
project3.cpp(15): note: see declaration of 'x'
```

>[!INFO] 扩展阅读
>Functions that share an identifier but have different parameters are considered to be distinct functions. We discuss this further in lesson [8.9 -- Introduction to function overloading](https://www.learncpp.com/cpp-tutorial/introduction-to-function-overloading/)

A declaration is a statement that tells the _compiler_ about the existence of an identifier and its type information. Here are some examples of declarations:

```cpp
int add(int x, int y); // tells the compiler about a function named "add" that takes two int parameters and returns an int.  No body!
int x; // tells the compiler about an integer variable named x
```

A declaration is all that is needed to satisfy the compiler. This is why we can use a forward declaration to tell the compiler about an identifier that isn’t actually defined until later.

In C++, all definitions also serve as declarations. This is why _int x_ appears in our examples for both definitions and declarations. Since _int x_ is a definition, it’s a declaration too. In most cases, a definition serves our purposes, as it satisfies both the compiler and linker. We only need to provide an explicit declaration when we want to use an identifier before it has been defined.

While it is true that all definitions are declarations, the converse is not true: not all declarations are definitions. An example of this is the function prototype -- it satisfies the compiler, but not the linker. These declarations that aren’t definitions are called pure declarations. Other types of pure declarations include forward declarations for variables and type declarations (you will encounter these in future lessons, no need to worry about them now).

The ODR doesn’t apply to pure declarations (it’s the _one definition rule_, not the _one declaration rule_), so you can have as many pure declarations for an identifier as you desire (although having more than one is redundant).

> [!NOTE] 作者注
> In common language, the term “declaration” is typically used to mean “a pure declaration”, and “definition” is used to mean “a definition that also serves as a declaration”. Thus, we’d typically call _int x;_ a definition, even though it is both a definition and a declaration.