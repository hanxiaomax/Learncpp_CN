---
title: 6.3 - 局部变量
alias: 6.3 - 局部变量
origin: /local-variables/
origin_title: "6.3 — Local variables"
time: 2022-6-4
type: translation
tags:
- local variables
- storage duration
- linkage
---

> [!note] "Key Takeaway"
> - 函数参数也是局部变量
> - 标识符有多种属性：存储持续时间、生命周期、链接
> - 局部变量的存储持续时间和它的生命周期是一样的，它具有自动存储持续时间，所以也称为**自动变量**
> - 局部变量的链接属性为无链接，每个声明都指代的是一个唯一的对象
> - 作用域和链接性看上去有点类似。其实不然，作用域定义了一个单独的声明在哪里可以被访问，而链接性定义了多个声明是否指代同一个对象。
> - 变量应该被定义在尽可能小的作用域中
> - 使用一个专门的语句块来限制一个变量的作用域是没必要的，不要这样做。如果一定有必要，最好还是提炼成一个单独的函数


在 [[2-5-Introduction-to-local-scope|2.5 - 局部作用域]] 中，我们介绍了局部变量——定义在函数内部的变量（包括函数参数）。

C++中并没有一个专门属性能够将变量定义为局部变量。局部变量区别于其他变量的属性有很多，我们会在后面的章节中介绍这些不同的属性。

在[[2-5-Introduction-to-local-scope|2.5 - 局部作用域]]中，我们介绍了[[scope|作用域]]的概念。一个[[identifier|标识符]]的作用域指的是它可以在源代码中被访问的范围。当一个标识符可以被访问时，我们称其为**在作用域中**。而当一个标识符不可以被访问时，我们称其[[out-of-scope|超出作用域]]。作用域是一个[[compile-time|编译时]]属性，当标识符超出作用域时会导致编译错误。

## 局部变量的块作用域

局部变量具有**块作用域**，也就是说，它们的作用域被限定在定义它们的代码块中。

!!! info "相关内容"

	如果你忘记了什么是代码块，请参考[[6-2-User-defined-namespaces-and-the-scope-resolution-operator|6.2 - 用户定义命名空间和作用域解析运算符]]。

```cpp
int main()
{
    int i { 5 }; // i enters scope here
    double d { 4.0 }; // d enters scope here

    return 0;
} // i and d go out of scope here
```


尽管函数的[[parameters|形参]]并没有被定义在函数体内，通常函数仍将其看做是函数体代码块的一部分。

```cpp
int max(int x, int y) // x and y enter scope here
{
    // assign the greater of x or y to max
    int max{ (x > y) ? x : y }; // max enters scope here

    return max;
} // x, y, and max leave scope here
```


## 作用域中的所有变量必须具备不同的变量名

在给定作用域中，变量的名字必须是唯一的，否则在引用变量的时候就会出现歧义，考虑下面这个程序：

```cpp
void someFunction(int x)
{
    int x{}; // compilation failure due to name collision with function parameter
}

int main()
{
    return 0;
}
```

由于`x`被定义在函数体内，且同时函数的形参也是 `x`，这就造成了块作用域中出现了同名的变量，因此程序是无法编译的。

## 局部变量的存储持续时间是自动的

一个变量的[[storage-duration|存储持续时间]]（也称为持续时间）决定了该变量被创建和销毁应该遵循的规则。在大多数情况下，变量的存储持续时间有它的生命周期直接决定。

!!! info "相关内容"

	我们在 [[2-5-Introduction-to-local-scope|2.5 - 局部作用域]] 中探讨了生命周期。

局部变量具有自动的存储持续时间，意味着它会在定义时被创建并且在语句块结束时销毁。例如：

```cpp
int main()
{
    int i { 5 }; // i created and initialized here
    double d { 4.0 }; // d created and initialized here

    return 0;
} // i and d are destroyed here
```


正因为此，局部变量有时候也称为自动变量。

## 嵌套语句块中的局部变量

局部变量可以位于嵌套的块中。这种场景和函数体内的局部变量没有任何区别：

```cpp
int main() // outer block
{
    int x { 5 }; // x enters scope and is created here

    { // nested block
        int y { 7 }; // y enters scope and is created here
    } // y goes out of scope and is destroyed here

    // y can not be used here because it is out of scope in this block

    return 0;
} // x goes out of scope and is destroyed here
```


在上面的例子中，变量 `y` 被定义在一个嵌套的块中，它的作用域范围从定义开始到嵌套块结束时结束，它的生命周期也是一样的。因此变量 `y` 的作用域被限制在了块的内部，所以在对应代码块的外部是不能够访问该变量。

需要注意的，嵌套块被看做是它外层块的一部分，因此定义在外层块中的变量可以在嵌套块中访问：

```cpp
#include <iostream>

int main()
{ // outer block

    int x { 5 }; // x enters scope and is created here

    { // nested block
        int y { 7 }; // y enters scope and is created here

        // x and y are both in scope here
        std::cout << x << " + " << y << " = " << x + y << '\n';
    } // y goes out of scope and is destroyed here

    // y can not be used here because it is out of scope in this block

    return 0;
} // x goes out of scope and is destroyed here
```


## 局部变量的链接性

标识符还有另外的一个属性——[[linkage|链接性(linkage)]]。标识符的链接性决定了相同名字的声明是否指代的是同一个对象。

局部变量没有链接（`no linkage`），也就是说，每个声明都指代的是一个唯一的对象，例如：

```cpp
int main()
{
    int x { 2 }; // 局部变量，没有链接性

    {
        int x { 3 }; // 这里的 x 表示的是另外一个对象
    }

    return 0;
}
```


作用域和链接性看上去有点类似。其实不然，作用域定义了一个单独的声明在哪里可以被访问，而链接性定义了多个声明是否指代同一个对象。

!!! info "相关内容"

	我们会在[[6-5-Variable-shadowing-name-hiding|6.5 - 变量遮蔽]]中讨论具一个变量与其嵌套语句块中的同名变量之间有什么影响。
	

局部变量的链接性没什么好讲的，我们会在后面的课程中对链接性进行详细介绍。

## 变量应该被定义在尽可能小的作用域中

如果变量只在某个嵌套块中使用，那么它就应该被定义在嵌套块中：

```cpp
#include <iostream>

int main()
{
    // do not define y here

    {
        // y is only used inside this block, so define it here
        int y { 5 };
        std::cout << y << '\n';
    }

    // otherwise y could still be used here, where it's not needed

    return 0;
}
```


通过限制变量的作用域，你可以减小程序的复杂度，因为这样可以减少活动变量的数量。不仅如此，这样还能更好的看出变量在哪里被使用了（或没被使用）。定义在一个块中的变量只能够在这个块（及其嵌套块）中被使用。这使得程序也更容易理解。

如果外层块需要使用变量，那么它需要在外层块中声明：

```cpp
#include <iostream>

int main()
{
    int y { 5 }; // 因为外层块需要使用 y，则 y 要被定义在外层

    {
        int x{};
        std::cin >> x;

        // if we declared y here, immediately before its actual first use...
        if (x == 4)
            y = 4;
    } // ... it would be destroyed here

    std::cout << y; // and we need y to exist here

    return 0;
}
```

上面这个例子还展示了一个例外情况，就是变量在它被使用前，早早地就声明了（参见：[[2-5-Introduction-to-local-scope#在何处定义局部变量]]）

新手程序员经常会考虑是否有必要故意创建一个嵌套块来限制变量的作用域（强制将其及早地[[out-of-scope|超出作用域]]或销毁）。这么做的确可以使变量更简单，但是函数总体上来讲变得更长、复杂度也变高了。这么做通常来说是不划算的。如果的确需要故意创建一个语句块来限制变量的作用域，通常最好的办法还是把它放到一个单独的函数中。

> [!success] "最佳实践"
> 变量应该被定义在尽可能小的作用域中。使用一个专门的语句块来限制一个变量的作用域是没必要的，不要这样做。
	