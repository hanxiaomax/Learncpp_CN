---
title: 9.11 - 按引用返回和按地址返回
alias: 9.11 - 按引用返回和按地址返回
origin: /return-by-reference-and-return-by-address/
origin_title: "9.11 — Return by reference and return by address"
time: 2022-9-12
type: translation
tags:
- reference
- address
- return
---

??? note "Key Takeaway"

- 引用返回的对象必须存在于返回引用的函数的作用域之外，否则将导致悬空引用。永远不要通过引用返回局部变量
- 不要按引用返回非const的局部静态变量
- 如果函数返回一个引用，并且该引用用于初始化或赋值给一个非引用变量，则返回值将被复制(就像它是通过value返回的一样)。



在上节课中，我们介绍过，当实参[[pass-by-value|按值传递]]时，实参的值会被**拷贝**一份到[[parameters|形参]]。 对于基本类型来说（拷贝开销小），这没有什么问题。但是对于[[class-type|类类型]]来说，拷贝开销通常会很大（例如 `std::string`)。通过[[pass-by-reference|按引用传递]]（通常为`const`）或按[[pass-by-address|按地址传递]]可以避免这种开销。

在按值返回时，我们会遇到类似的情况：返回值的副本被传递回调用者。如果函数的返回类型是类类型，则代价可能很高。

```cpp
std::string returnByValue(); // 返回 std::string 的拷贝(expensive)
```

## 按引用返回

在将类类型传递回调用者的情况下，我们可能(也可能不)希望[[return-by-reference|按引用返回]]。通过引用返回返回一个绑定到被返回对象的引用，这样就避免了对返回值进行复制。要通过引用返回，只需将函数的返回值定义为引用类型:

```cpp
std::string&       returnByReference(); // returns a reference to an existing std::string (cheap)
const std::string& returnByReferenceToConst(); // returns a const reference to an existing std::string (cheap)
```

下面例程展示了其原理：

```cpp
#include <iostream>
#include <string>

const std::string& getProgramName() // 返回const引用
{
    static const std::string s_programName { "Calculator" }; // 静态持续时间，持续到程序结束


    return s_programName;
}

int main()
{
    std::cout << "This program is named " << getProgramName();

    return 0;
}
```

程序打印：

```
This program is named Calculator
```

因为 `getProgramName()` 返回 const 引用，所以 `return s_programName` 执行时，`getProgramName()` 会返回 const 引用到 `s_programName` (避免了拷贝对象)。调用者可以使用该引用来访问 `s_programName` 的值，从而将其打印出来。

## 按引用返回的对象其持续时间必须超过函数调用本身

使用按引用返回最需要注意的事是：程序员必须确保被引用的对象比返回引用的函数寿命长。否则，返回的引用将称为[[dangling|悬垂]]引用(引用一个已被销毁的对象)，使用该引用将导致[[undefined-behavior|未定义行为]]。

在上面的 程序中，因为 `s_programName` 具有[[static-storage-duration|静态存储持续时间]]，所以它的知道程序结束才会被销毁。当`main`函数访问该返回的引用时，它实际访问的是 `s_programName`，这时是没有问题的，在这个时间点上它还没有被销毁。

接下来，修改上面的程序，看看函数返回悬垂引用的情况下会发生什么：

```cpp
#include <iostream>
#include <string>

const std::string& getProgramName()
{
    const std::string programName { "Calculator" }; // now a local variable, destroyed when function ends

    return programName;
}

int main()
{
    std::cout << "This program is named " << getProgramName();

    return 0;
}```


该程序的运行结果是未定义的。当 `getProgramName()` 返回时，一个引用绑定到了局部变量 `programName` 。也正是因为该变量是一个局部变量，它具有[[automatic-storage-duration|自动存储持续时间]]，它会在函数末尾被销毁，所以返回的引用就是会是一个悬垂引用，在`main`函数中使用该悬垂引用会导致未定义行为。

如果试图通过引用返回局部变量，现代编译器将产生警告或错误(因此，上面的程序甚至可能无法编译)，但编译器有时在检测更复杂的情况时会遇到麻烦。


!!! warning "注意"

	==引用返回的对象必须存在于返回引用的函数的作用域之外，否则将导致悬空引用。永远不要通过引用返回局部变量。==

## 不要按引用返回非const的局部静态变量

在上面的例子中，我们按引用返回的是一个const的局部静态变量，并以此来演示按引用传递的方式。但是，按引用返回非const的静态变量并不符合习惯，通常应该避免这么做。这么做会有什么问题？请看下面的程序：

```cpp
#include <iostream>
#include <string>

const int& getNextId()
{
    static int s_x{ 0 }; // 注意: 变量是非const的
    ++s_x; // 生成下一个id
    return s_x; // 按引用返回
}

int main()
{
    const int& id1 { getNextId() }; // id1 是一个引用
    const int& id2 { getNextId() }; // id2 是一个引用

    std::cout << id1 << id2 << '\n';

    return 0;
}
```

程序打印：

```
22
```

之所以这样是因为 `id1` 和 `id2` 引用的是同一个对象(即静态变量 `s_x`)，所以任何对该变量的修改(例如 `getNextId()`)，都会影响到所有引用。通过const引用返回静态局部值的程序经常出现的另一个问题是，没有标准化的方法将`s_x` 重置回默认状态。这样的程序必须使用非惯用的解决方案(例如重置参数)，或者只能通过退出和重新启动程序来重置。

虽然上面的例子有点傻，但程序员有时会为了优化目的而尝试上面的做法，然后程序就不能按预期工作了。

!!! success "最佳实践"

	避免返回对非const局部静态变量的引用。

如果通过引用返回的局部变量的创建成本很高(因此不必每次函数调用都重新创建该变量)，则有时会返回对 const 局部静态变量的const引用。但这是罕见的。

==返回一个指向const全局变量的const引用有时也是一种用于封装对全局变量访问的方式==。我们在课程[[6-8-Why-non-const-global-variables-are-evil|6.8 - 为什么非 const 全局变量是魔鬼]]中讨论这个问题。如果有意且谨慎地使用，这也是可以的。

## 使用返回的引用来访问/初始化普通变量时会创建拷贝

如果函数返回一个引用，并且该引用用于初始化或赋值给一个非引用变量，则返回值将被复制(就像它是通过value返回的一样)。

```cpp
#include <iostream>
#include <string>

const int& getNextId()
{
    static int s_x{ 0 };
    ++s_x;
    return s_x;
}

int main()
{
    const int id1 { getNextId() }; // id1 is a normal variable now and receives a copy of the value returned by reference from getNextId()
    const int id2 { getNextId() }; // id2 is a normal variable now and receives a copy of the value returned by reference from getNextId()

    std::cout << id1 << id2 << '\n';

    return 0;
}
```

在上面的例子中，`getNextId()` 返回的是一个引用，但是 `id1` 和 `id2` 都是非引用的普通变量。这种情况下，返回的引用绑定的值会被拷贝到这个普通变量，因此程序打印：

```
12
```

当然，这也违背了通过引用返回值的目的。

还需要注意的是，如果程序返回一个悬垂引用，则该引用在复制之前一直悬空，这将导致[[undefined-behavior|未定义行为]]：

```cpp
#include <iostream>
#include <string>

const std::string& getProgramName() // will return a const reference
{
    const std::string programName{ "Calculator" };

    return programName;
}

int main()
{
    std::string name { getProgramName() }; // makes a copy of a dangling reference
    std::cout << "This program is named " << name << '\n'; // undefined behavior

    return 0;
}
```


## 返回’s okay to return reference parameters by reference

There are quite a few cases where returning objects by reference makes sense, and we’ll encounter many of those in future lessons. However, there is one useful example that we can show now.

If a parameter is passed into a function by reference, it’s safe to return that parameter by reference. This makes sense: in order to pass an argument to a function, the argument must exist in the scope of the caller. When the called function returns, that object must still exist in the scope of the caller.

Here is a simple example of such a function:

```cpp
#include <iostream>
#include <string>

// Takes two std::string objects, returns the one that comes first alphabetically
const std::string& firstAlphabetical(const std::string& a, const std::string& b)
{
	return (a < b) ? a : b; // We can use operator< on std::string to determine which comes first alphabetically
}

int main()
{
	std::string hello { "Hello" };
	std::string world { "World" };

	std::cout << firstAlphabetical(hello, world) << '\n';

	return 0;
}
```

COPY

This prints:

```
Hello
```

In the above function, the caller passes in two std::string objects by const reference, and whichever of these strings comes first alphabetically is passed back by const reference. If we had used pass by value and return by value, we would have made up to 3 copies of std::string (one for each parameter, one for the return value). By using pass by reference/return by reference, we can avoid those copies.

## The caller can modify values through the reference

When an argument is passed to a function by non-const reference, the function can use the reference to modify the value of the argument.

Similarly, when a non-const reference is returned from a function, the caller can use the reference to modify the value being returned.

Here’s an illustrative example:

```cpp
#include <iostream>

// takes two integers by non-const reference, and returns the greater by reference
int& max(int& x, int& y)
{
    return (x > y) ? x : y;
}

int main()
{
    int a{ 5 };
    int b{ 6 };

    max(a, b) = 7; // sets the greater of a or b to 7

    std::cout << a << b << '\n';

    return 0;
}
```

COPY

In the above program, `max(a, b)` calls the `max()` function with `a` and `b` as arguments. Reference parameter `x` binds to argument `a`, and reference parameter `y` binds to argument `b`. The function then determines which of `x` (`5`) and `y` (`6`) is greater. In this case, that’s `y`, so the function returns `y`(which is still bound to `b`) back to the caller. The caller then assigns the value `7` to this returned reference.

Therefore, the expression `max(a, b) = 7` effectively resolves to `b = 7`.

This prints:

```
57
```

## Return by address

Return by address works almost identically to return by reference, except a pointer to an object is returned instead of a reference to an object. Return by address has the same primary caveat as return by reference -- the object being returned by address must outlive the scope of the function returning the address, otherwise the caller will receive a dangling pointer.

The major advantage of return by address over return by reference is that we can have the function return `nullptr` if there is no valid object to return. For example, let’s say we have a list of students that we want to search. If we find the student we are looking for in the list, we can return a pointer to the object representing the matching student. If we don’t find any students matching, we can return `nullptr` to indicate a matching student object was not found.

The major disadvantage of return by address is that the caller has to remember to do a `nullptr` check before dereferencing the return value, otherwise a null pointer dereference may occur and undefined behavior will result. Because of this danger, return by reference should be preferred over return by address unless the ability to return “no object” is needed.

!!! success "最佳实践"

	Prefer return by reference over return by address unless the ability to return “no object” (using `nullptr`) is important.