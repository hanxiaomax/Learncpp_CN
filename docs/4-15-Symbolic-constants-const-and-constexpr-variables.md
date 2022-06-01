---
title: 4.15 - 符号常量 const 和 constexpr 变量
alias: 4.15 - 符号常量 const 和 constexpr 变量
origin: /const-constexpr-and-symbolic-constants/
origin_title: "4.15 -- Symbolic constants-const and constexpr variables"
time: 2022-5-24
type: translation
tags:
- const
- constexpr
---

??? note "关键点速记"
	- 

## Const 变量

到目前为止，我们看到的所有变量都是“非常量”——也就说它们的值可以在任何时间被改变，例如：

```cpp
int x { 4 }; // initialize x with the value of 4
x = 5; // change value of x to 5
```

不过，有时候需要将变量定义为不能改变。例如，地球的引力是`9.8 meters/second^2`，这个值不太可能会随时改变（如果真的会随时改变的话，你应该担心的就不是C++了）。所以将这个值定义为常量可以确保它不会被意外改变。

将变量定义为常量，只需要在类型前面或后面添加 `const` 关键字，例如：

```cpp
const double gravity { 9.8 };  // preferred use of const before type
int const sidesInSquare { 4 }; // "east const" style, okay, but not preferred
```


尽管 C++ 允许你在类型前面或者后面添加` const` 关键字，我们还是推荐你把它放在类型前面，这样看上去更像是正常的英语语法。

const 类型的变量通常被称为符号常量（与之相对的是字符串常量，字符串常量是没有名字的）。


## Const 变量必须初始化

const 变量**必须**在定义时初始化，此后你也不能通过赋值来改变它：

```cpp
int main()
{
    const double gravity; // error: const variables must be initialized
    gravity = 9.9; // error: const variables can not be changed

    return 0;
}
```

注意，const 变量可以使用其他类型的变量初始化（包括非const类型的变量）：

```cpp
#include <iostream>

int main()
{
    std::cout << "Enter your age: ";
    int age{};
    std::cin >> age;

    const int usersAge { age };

    // age is non-const and can be changed
    // usersAge is const and can not be changed

    std::cout << usersAge;

    return 0;
}
```


## 运行时常量和编译时常量

C++ 实际上有两种类型的常量。

[[runtime|运行时]]常量的初始化值必须在运行时才能解析（当程序运行时），下面的例子展示了运行时常量：


```cpp
#include <iostream>

void printInt(const int x) // x is a runtime constant because the value isn't known until the program is run
{
    std::cout << x;
}

int main()
{
    std::cout << "Enter your age: ";
    int age{};
    std::cin >> age;

    const int usersAge { age }; // usersAge is a runtime constant because the value isn't known until the program is run

    std::cout << "Your age is: ";
    printInt(usersAge);

    return 0;
}
```


上面程序中的`usersAge` 和 `x` 这样的变量，就是运行时常量，因为编译器不能确定它们的初始值，必须等到程序运行时才能确定。`usersAge` 的值依赖用户的输入（只有在运行时才能获取输入）而 `x` 的值依赖于传入函数的值（也只有在程序运行时才知道）。不过，一旦这些值被初始化之后，它们的值就不能再改变了。

编译时常量的初始化值，可以在[[compile-time|编译时]]就确定。下面的例子展示了编译时常量：

```cpp
const double gravity { 9.8 }; // the compiler knows at compile-time that gravity will have value 9.8
const int something { 1 + 2 }; // the compiler can resolve this at compiler time
```

编译时常量可以使编译器进行编译优化，这是运行时常量做不到的。例如，每当使用 `gravity` 的时候，编译器可以直接将其替换为字面量 9.8。

当你声明一个 const 变量的时候，编译器会自动追踪并判断它是运行时变量还是编译时bi you declare a const variable, the compiler will implicitly keep track of whether it’s a runtime or compile-time constant. In most cases, this doesn’t matter, but there are a few odd cases where C++ requires a compile-time constant instead of a run-time constant (we’ll cover these cases later as we introduce those topics).

## constexpr

To help provide more specificity, C++11 introduced the keyword **constexpr**, which ensures that a constant must be a compile-time constant:

```cpp
#include <iostream>

int main()
{
    constexpr double gravity { 9.8 }; // ok, the value of 9.8 can be resolved at compile-time
    constexpr int sum { 4 + 5 }; // ok, the value of 4 + 5 can be resolved at compile-time

    std::cout << "Enter your age: ";
    int age{};
    std::cin >> age;

    constexpr int myAge { age }; // compile error: age is a runtime constant, not a compile-time constant

    return 0;
}
```

COPY

!!! success "最佳实践"

	Any variable that should not be modifiable after initialization and whose initializer is known at compile-time should be declared as constexpr.  

	Any variable that should not be modifiable after initialization and whose initializer is not known at compile-time should be declared as const.

In reality, developers often skip making local variables in short/trivial functions const, because there is little chance of accidentally modifying a value.

Note that literals are also implicitly constexpr, as the value of a literal is known at compile-time.

## 常量表达式

A constant expression is an expression that can be evaluated at compile-time. For example:

```cpp
#include <iostream>

int main()
{
	std::cout << 3 + 4; // 3 + 4 evaluated at compile-time

	return 0;
}
```

COPY

In the above program, because the literal values `3` and `4` are known at compile-time, the compiler can evaluate the expression `3 + 4` at compile-time and substitute in the resulting value `7`. That makes the code faster because `3 + 4` no longer has to be calculated at runtime.

Constexpr variables can also be used in constant expressions:

```cpp
#include <iostream>

int main()
{
	constexpr int x { 3 };
	constexpr int y { 4 };
	std::cout << x + y; // x + y evaluated at compile-time

	return 0;
}
```

COPY

In the above example, because `x` and `y` are constexpr, the expression `x + y` is a constant expression that can be evaluated at compile-time. Similar to the literal case, the compiler can substitute in the value `7`.

## Constexpr 字符串

If you try to define a `constexpr std::string`, your compiler will generate an error:

```cpp
#include <iostream>
#include <string>

using namespace std::literals;

int main()
{
    constexpr std::string name{ "Alex"s }; // compile error

    std::cout << "My name is: " << name;

    return 0;
}
```

COPY

This happens because `constexpr std::string` isn’t supported in C++17 or earlier, and only has minimal support in C++20. If you need constexpr strings, use `std::string_view` instead:

```cpp
#include <iostream>
#include <string_view>

using namespace std::literals;

int main()
{
    constexpr std::string_view name{ "Alex"sv }; // ok: std::string_view can be constexpr

    std::cout << "My name is: " << name;

    return 0;
}
```

COPY

!!! info "相关内容"

	<>

We cover std::string view in lesson [[11-7-An-introduction-to-std-string_view|11.7 - std::string_view 简介]]

## const 变量的命名

Some programmers prefer to use all upper-case names for const variables. Others use normal variable names with a ‘k’ prefix. However, we will use normal variable naming conventions, which is more common. Const variables act exactly like normal variables in every case except that they can not be assigned to, so there’s no particular reason they need to be denoted as special.

## Const 类型的函数形参和返回值

Const can also be used with function parameters:

```cpp
#include <iostream>

void printInt(const int x)
{
    std::cout << x;
}

int main()
{
    printInt(5); // 5 will be used as the initializer for x
    printInt(6); // 6 will be used as the initializer for x

    return 0;
}
```


Making a function parameter const enlists the compiler’s help to ensure that the parameter’s value is not changed inside the function. Note that we did not provide an explicit initializer for our const parameter -- the value of the argument in the function call will be used as the initializer in this case.

When arguments are passed by value, we generally don’t care if the function changes the value of the parameter (since it’s just a copy that will be destroyed at the end of the function anyway). For this reason, we usually don’t const parameters passed by value. But later on, we’ll talk about other kinds of function parameters (where changing the value of the parameter will change the value of the argument passed in). For these other types of parameters, use of const is important.

!!! success "最佳实践"

	Function parameters for arguments passed by value should not be made const.

A function’s return value may also be made const:

```cpp
#include <iostream>

const int getValue()
{
    return 5;
}

int main()
{
    std::cout << getValue();

    return 0;
}
```


However, since the returned value is a copy, there’s little point in making it const.

!!! success "最佳实践"

	Don’t use const with return by value.

## 避免使用对象形式的预处理器宏用于符号常量


In lesson [[2-10-Introduction-to-the-preprocessor|2.10 - 预处理器简介]], you learned that object-like macros have two forms -- one that doesn’t take a substitution parameter (generally used for conditional compilation), and one that does have a substitution parameter. We’ll talk about the case with the substitution parameter here. That takes the form:

`#define` identifier substitution_text

Whenever the preprocessor encounters this directive, any further occurrence of _identifier_ is replaced by _substitution_text_. The identifier is traditionally typed in all capital letters, using underscores to represent spaces.

Consider the following snippet:

```cpp
#define MAX_STUDENTS_PER_CLASS 30
int max_students { numClassrooms * MAX_STUDENTS_PER_CLASS };
```

When you compile your code, the preprocessor replaces all instances of MAX_STUDENTS_PER_CLASS with the literal value 30, which is then compiled into your executable.

So why not use `#define` to make symbolic constants? There are (at least) three major problems.

First, because macros are resolved by the preprocessor, all occurrences of the macro are replaced with the defined value just prior to compilation. If you are debugging your code, you won’t see the actual value (e.g. `30`) -- you’ll only see the name of the symbolic constant (e.g. `MAX_STUDENTS_PER_CLASS`). And because these `#defined` values aren’t variables, you can’t add a watch in the debugger to see their values. If you want to know what value `MAX_STUDENTS_PER_CLASS` resolves to, you’ll have to find the definition of `MAX_STUDENTS_PER_CLASS` (which could be in a different file). This can make your programs harder to debug.

Second, macros can have naming conflicts with normal code. For example:

```cpp
#include "someheader.h"
#include <iostream>

int main()
{
    int beta { 5 };
    std::cout << beta;

    return 0;
}
```


If `someheader.h` happened to `#define` a macro named _beta_, this simple program would break, as the preprocessor would replace the int variable beta’s name with whatever the macro’s value was. This is normally avoided by using all caps for macro names, but it can still happen.

Thirdly, macros don’t follow normal scoping rules, which means in rare cases a macro defined in one part of a program can conflict with code written in another part of the program that it wasn’t supposed to interact with.

!!! warning "注意"

	Avoid using `#define` to create symbolic constants macros. Use const or constexpr variables instead.

## 在多个文件中共用符号常量

In many applications, a given symbolic constant needs to be used throughout your code (not just in one location). These can include physics or mathematical constants that don’t change (e.g. pi or Avogadro’s number), or application-specific “tuning” values (e.g. friction or gravity coefficients). Instead of redefining these every time they are needed, it’s better to declare them once in a central location and use them wherever needed. That way, if you ever need to change them, you only need to change them in one place.

There are multiple ways to facilitate this within C++ we cover this topic in full detail in lesson [6.9 -- Sharing global constants across multiple files (using inline variables)](https://www.learncpp.com/cpp-tutorial/sharing-global-constants-across-multiple-files-using-inline-variables/).

## 使用常量来避免“魔术数字” 

A magic number is a literal (usually a number) that either has an unclear meaning or is used multiple times.

The following snippet shows an example of a magic number with an unclear meaning:

```cpp
constexpr int maxStudentsPerSchool{ numClassrooms * 30 };
```


What does the literal 30 mean in this context? Although you can probably guess that in this case it’s the maximum number of students per class, it’s not totally obvious. In more complex programs, it can be very difficult to infer what a hard-coded number represents, unless there’s a comment to explain it.

Fortunately, we can use symbolic constants to disambiguate magic numbers:

```cpp
constexpr int maxStudentsPerClass { 30 }; // now obvious what 30 is
constexpr int maxStudentsPerSchool{ numClassrooms * maxStudentsPerClass };
```


Using magic numbers is generally considered bad practice because, in addition to not providing context as to what they are being used for, they pose problems if the value needs to change. Let’s assume that the school buys new desks that allow them to raise the class size from 30 to 35, and our program needs to reflect that. Consider the following program:

```cpp
constexpr int maxStudents{ numClassrooms * 30 };
setMax(30);
```


To update our program to use the new classroom size, we’d have to update the constant 30 to 35. But what about the call to `setMax()`? Does that 30 have the same meaning as the other 30? If so, it should be updated. If not, it should be left alone, or we might break our program somewhere else. If you do a global search-and-replace, you might inadvertently update the argument of setMax() when it wasn’t supposed to change. So you have to look through all the code for every instance of the literal 30, and then determine whether it needs to change or not. That can be seriously time consuming (and error prone).

The following code (using symbolic constants) makes it much clearer that these two uses of the value 30 are not related:

```cpp
constexpr int maxStudentsPerClass { 30 }; // now obvious what 30 is
constexpr int totalStudents{ numClassrooms * maxStudentsPerClass };

constexpr int maxNameLength{ 30 };
setMax(maxNameLength); // now obvious this 30 is used in a different context
```

Magic numbers aren’t always numbers -- they can also be strings or other types.

Note that literals used only once, and in obvious contexts, are not considered “magic”. The values -1, 0, 0.0, and 1 are often used in contexts that are obvious:

```cpp
int idGenerator { 0 };         // fine: we're starting our id generator with value 0
idGenerator = idGenerator + 1; // fine: we're just incrementing our generator
```


Other numbers may also be obvious in context (and thus, not considered magic):

```cpp
int kmtoM(int km) { return km * 1000; } // fine: it's obvious 1000 is a conversion factor
```


!!! success "最佳实践"

	在代码中避免魔术数字 (使用常量来代替)。