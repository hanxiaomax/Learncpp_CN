---
title: 9.12 - 指针、引用和const的类型推断
alias: 9.12 - 指针、引用和const的类型推断
origin: /none/
origin_title: "9.12 -- Type deduction with pointers, references, and const"
time: 2022-6-2
type: translation
tags:
- const
- type deduction
---

> [!note] "Key Takeaway"

在 [[10-8-Type-deduction-for-objects-using-the auto-keyword|8.7 - 使用 auto 关键字进行类型推断]] 中我们介绍了 `auto` 关键字，它告诉编译器根据初始化值对变量的类型进行推断：

```cpp
int getVal(); // some function that returns an int by value

int main()
{
    auto val { getVal() }; // val deduced as type int

    return 0;
}
```

默认情况下，类型推断会丢弃 `const` 限定符：

```cpp
const double foo()
{
    return 5.6;
}

int main()
{
    const double cd{ 7.8 };

    auto x{ cd };    // double (const dropped)
    auto y{ foo() }; // double (const dropped)

    return 0;
}
```

如果需要，我们需要手动将 `const` 限定符重新添加到定义中：

```cpp
const double foo()
{
    return 5.6;
}

int main()
{
    const double cd{ 7.8 };

    const auto x{ cd };    // const double (const reapplied)
    const auto y{ foo() }; // const double (const reapplied)

    return 0;
}
```

## 类型推断会丢弃引用修饰符

除了删除const限定符外，类型推断也将删除引用：

```cpp
#include <string>

std::string& getRef(); // some function that returns a reference

int main()
{
    auto ref { getRef() }; // type deduced as std::string (not std::string&)

    return 0;
}
```


在上面的例子中，变量 `ref` 使用了类型推断。尽管函数 `getRef()` 返回的是 `std::string&`，但引用限定符被丢弃了，所以 `ref` 的类型为 `std::string`。

类似于 `const` 限定符，如果引用限定符被丢弃了，也可以显式地被再次加到定义上：

```cpp
#include <string>

std::string& getRef(); // some function that returns a reference to const

int main()
{
    auto ref1 { getRef() };  // std::string (reference dropped)
    auto& ref2 { getRef() }; // std::string& (reference reapplied)

    return 0;
}
```

## 顶层 const 和底层 const

==顶层 `const` 是应用于对象本身的 `const` 限定符==。例如：

```cpp
const int x;    // this const applies to x, so it is top-level
int* const ptr; // this const applies to ptr, so it is top-level
```

相比之下，==底层 `const` 是一个应用于被引用或指向的对象的`const`限定符==：

```cpp
const int& ref; // this const applies to the object being referenced, so it is low-level
const int* ptr; // this const applies to the object being pointed to, so it is low-level
```

const 值的引用总是一个底层const。指针可以是顶层 const、底层const或两者都是：

```cpp
const int* const ptr; // the left const is low-level, the right const is top-level
```

类型推断在丢弃 const 限定符时，只会丢弃顶层 const。底层 const 不受影响，我们会在后面的例子中说明这一点。

## 类型推断和const引用

如果初始化值是对const的引用，则首先删除引用(如果适用，然后重新应用)，然后从结果中删除任何顶级const。

```cpp
#include <string>

const std::string& getRef(); // some function that returns a reference to const

int main()
{
    auto ref1{ getRef() }; // std::string (reference dropped, then top-level const dropped from result)

    return 0;
}
```

在上面的例子中， `getRef()` 返回 `const std::string&`，该引用会被首先丢弃，返回值类型变为 `const std::string`。此时，该 const 是一个顶层 const，所以也会被丢弃，返回值类型进一步变为`std::string`。

两种标识符都可以被手动填回去：

```cpp
#include <string>

const std::string& getRef(); // some function that returns a const reference

int main()
{
    auto ref1{ getRef() };        // std::string (top-level const and reference dropped)
    const auto ref2{ getRef() };  // const std::string (const reapplied, reference dropped)

    auto& ref3{ getRef() };       // const std::string& (reference reapplied, low-level const not dropped)
    const auto& ref4{ getRef() }; // const std::string& (reference and const reapplied)

    return 0;
}
```

`ref1` 已经在上一个例子中介绍过了，对于 `ref2`，它和 `ref1` 类似，只不过重新添加了 `const` 限定符，所以最终类型为 `const std::string`。

`ref3` 则需要特别注意，通常情况下，引用会被删除，但由于我们已经重新应用了引用，所以它不会被删除。这意味着类型仍然是`const std::string&` 。因为这个const是一个底层的const，所以它不会被丢弃。因此，推导出的类型是`const std::string&` 。

`ref4` 的情况类似于 `ref3`，只不过重新添加大量 `const` 限定符。由于类型已经推断为指向常量的引用，所以添加 `const` 其实是多余的。也就是说，这里我们明确地指出结果应该是 `const` 的，含义非常清楚（`ref3`的例子中，常量性是隐式的，并没有那么明显）。

> [!success] "最佳实践"
> 如果你想要一个const引用，即使不是严格必要的，也要重新应用`const`限定符，因为它使你的意图更明确，并有助于防止错误。

## 类型推断和指针

与引用不同，类型演绎不会丢弃指针：

```cpp
#include <string>

std::string* getPtr(); // some function that returns a pointer

int main()
{
    auto ptr1{ getPtr() }; // std::string*

    return 0;
}
```


我们也可以在指针类型演绎的同时使用星号：

```cpp
#include <string>

std::string* getPtr(); // some function that returns a pointer

int main()
{
    auto ptr1{ getPtr() };  // std::string*
    auto* ptr2{ getPtr() }; // std::string*

    return 0;
}
```

## `auto` 和 `auto*` 的区别(选读)

在使用 `auto` 和指针类型的初始化值时，类型推断会包括指针，所以上面例子中的 `ptr1` 类型会被替换：`std::string*`。

如果将 `auto*` 和指针类型初始化值一起使用，则`auto` 的类型推断不会包含指针——指针是在类型推断完成后被加上的。所以对于上面例子中的 `ptr2` ，`auto` 替换为 `std::string`，而指针的星号是后加上去的。

多数情况下，上面两个例子的实际效果是一样的(`ptr1` 和 `ptr2` 都最终推断为`std::string*` )。

但是，在实际使用中 `auto` 和 `auto*` 还是存在不少区别的。首先 `auto*` 必须解析为一个指针初始化值，否则编译会报错：

```cpp
#include <string>

std::string* getPtr(); // some function that returns a pointer

int main()
{
    auto ptr3{ *getPtr() };      // std::string (对 getPtr() 解引用了)
    auto* ptr4{ *getPtr() };     // 不能编译 (初始化值不是指针)

    return 0;
}
```


这么做是有意义的，在 `ptr4` 的例子中，`auto` 得到了 `std::string`，然后指针被重新加上。因此 `ptr4` 的类型是 `std::string*`，我们不能使用一个非指针初始化值来初始化 `std::string*` 类型的变量。

其次，当表达式中出现`const`时，`auto` 和 `auto*` 的行为是不一样的，接下来我们就会详细介绍这一点。

## 类型推断和const指针(选读)

因为指针不会被丢弃，所以我们不必担心这个问题。但是对于指针，我们既要考虑指针常量也要考虑常量指针，以及`auto` 和 `auto*` 。就像引用一样，在指针类型推断期间，只有顶层const会被丢弃。

先看一个简单的例子：

```cpp
#include <string>

std::string* getPtr(); // some function that returns a pointer

int main()
{
    const auto ptr1{ getPtr() };  // std::string* const
    auto const ptr2 { getPtr() }; // std::string* const

    const auto* ptr3{ getPtr() }; // const std::string*
    auto* const ptr4{ getPtr() }; // std::string* const

    return 0;
}
```

不论是 `auto const` 还是 `const auto`，都表示 “将类型推断结果变为const”。所以 `ptr1` 和 `ptr2` 的例子中，推断的结果为 `std::string*`，随即又被添加了`const`，最终得到 `std::string* const`。这就和 `const int` 与 `int const` 是一回事一样。

但是对于 `auto*`，`const` 限定符的位置会带来影响。`const` 在左面表示“推断得到的指针类型指向常量”，而`const`在右时表示 “推断得到的指针作为const指针”。因此 `ptr3` 最终是以一个指向常量的指针，而  `ptr4` 则是一个常量指针。

再看一个例子，其中初始化值是指向常量的常量指针：

```cpp
#include <string>

const std::string* const getConstPtr(); // some function that returns a const pointer to a const value

int main()
{
    auto ptr1{ getConstPtr() };  // const std::string*
    auto* ptr2{ getConstPtr() }; // const std::string*

    auto const ptr3{ getConstPtr() };  // const std::string* const
    const auto ptr4{ getConstPtr() };  // const std::string* const

    auto* const ptr5{ getConstPtr() }; // const std::string* const
    const auto* ptr6{ getConstPtr() }; // const std::string*

    const auto const ptr7{ getConstPtr() };  // error: const qualifer can not be applied twice
    const auto* const ptr8{ getConstPtr() }; // const std::string* const

    return 0;
}
```


`ptr1` 和 `ptr2` 很简单。顶层 `const` (修饰指针的 const ) 被丢弃。修饰被指对象的底层 const 则被保持下来。所以在这两个例子中，最终的类型都是 `const std::string*`。

`ptr3` 和 `ptr4` 的例子也很简单。顶层 `const` 被丢弃，但是又被重新添加了。修饰被指对象的底层 `const`被保留。所以最终类型为 `const std::string* const`。

`ptr5` 和 `ptr6` 与之前例子中的情况类似。它们的顶层`const`都被丢弃了。对于 `ptr5`，`auto* const` 被重新添加，最终类型为  `const std::string* const`。对于 `ptr6`，`const auto*` 应用于被指对象（此时已经是 const ），因此最终类型为`const std::string*`。

对于 `ptr7` ，我们应用了两次 const 限定符，这是不允许的，会导致编译报错。

对于 `ptr8` ，我们在指针的两侧添加了 `const`（可以这么做因为`auto*`一定是指针类型），所以最终结果为 `const std::string* const`。

> [!success] "最佳实践"
> 如果你需要一个`const`指针，即使不是严格必要的，也要重新应用`const`限定符，因为它使你的意图更明确，并有助于防止错误。
