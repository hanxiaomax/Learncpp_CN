---
title: 11.14 — void 指针
alias: 11.14 - void 指针
origin: /void-pointers/
origin_title: ""
time: 2022-1-2
type: translation
tags:
- void
---

[[void pointer|void 指针]]，也被称之为泛型指针，是一种可以指向任意类型对象的指针！void指针的声明类似于普通指针，使用`void`关键字标识指针类型：

```cpp
void* ptr; // ptr is a void pointer
```

void 指针可以指向任何数据类型的对象：

```cpp
int nValue;
float fValue;

struct Something
{
    int n;
    float f;
};

Something sValue;

void* ptr;
ptr = &nValue; // valid
ptr = &fValue; // valid
ptr = &sValue; // valid
```

不过，由于void指针并不知道它所指对象的类型，所以堆void指针进行[[dereference-operator|解引用]]是非法操作。void 指针必须首先被转换为其他特定类型的指针，然后才能进行解引用。

```cpp
int value{ 5 };
void* voidPtr{ &value };

// std::cout << *voidPtr << '\n'; // illegal: dereference of void pointer

int* intPtr{ static_cast<int*>(voidPtr) }; // 首先将void指针转换为int指针

std::cout << *intPtr << '\n'; // 然后解引用得到结果
```

运行结果：

```
5
```

接下来的问题是：如果 void 指针不知道它所指的对象是什么类型的话，我们又是如何得应该将它转换成什么类型呢？实际上，你必须自己去跟踪这个类型。

下面是一个使用 void 指针的类型：

```cpp
#include <iostream>
#include <cassert>

enum class Type
{
    tInt, // note: we can't use "int" here because it's a keyword, so we'll use "tInt" instead
    tFloat,
    tCString
};

void printValue(void* ptr, Type type)
{
    switch (type)
    {
    case Type::tInt:
        std::cout << *static_cast<int*>(ptr) << '\n'; // cast to int pointer and perform indirection
        break;
    case Type::tFloat:
        std::cout << *static_cast<float*>(ptr) << '\n'; // cast to float pointer and perform indirection
        break;
    case Type::tCString:
        std::cout << static_cast<char*>(ptr) << '\n'; // cast to char pointer (no indirection)
        // std::cout will treat char* as a C-style string
        // if we were to perform indirection through the result, then we'd just print the single char that ptr is pointing to
        break;
    default:
        assert(false && "type not found");
        break;
    }
}

int main()
{
    int nValue{ 5 };
    float fValue{ 7.5f };
    char szValue[]{ "Mollie" };

    printValue(&nValue, Type::tInt);
    printValue(&fValue, Type::tFloat);
    printValue(szValue, Type::tCString);

    return 0;
}
```

输出结果：

```
5
7.5
Mollie
```

## void 指针其他细节

void 指针可以被设置为 null 值：

```cpp
void* ptr{ nullptr }; // ptr is a void pointer that is currently a null pointer
```

尽管一些编译器允许删除指向动态分配内存的空指针，但应该避免这样做，因为它可能[[导致

在空指针上做指针算术是不可能的。这是因为指针算术要求指针知道它所指向的对象的大小，因此它可以适当地增加或减少指针。

注意，没有空引用这种东西。这是因为void引用的类型是void &，并且不知道它引用的是什么类型的值。

Although some compilers allow deleting a void pointer that points to dynamically allocated memory, doing so should be avoided, as it can result in undefined behavior.

It is not possible to do pointer arithmetic on a void pointer. This is because pointer arithmetic requires the pointer to know what size object it is pointing to, so it can increment or decrement the pointer appropriately.

Note that there is no such thing as a void reference. This is because a void reference would be of type void &, and would not know what type of value it referenced.

## 小结

In general, it is a good idea to avoid using void pointers unless absolutely necessary, as they effectively allow you to avoid type checking. This allows you to inadvertently do things that make no sense, and the compiler won’t complain about it. For example, the following would be valid:

```cpp
int nValue{ 5 };
printValue(&nValue, Type::tCString);
```

COPY

But who knows what the result would actually be!

Although the above function seems like a neat way to make a single function handle multiple data types, C++ actually offers a much better way to do the same thing (via function overloading) that retains type checking to help prevent misuse. Many other places where void pointers would once be used to handle multiple data types are now better done using templates, which also offer strong type checking.

However, very occasionally, you may still find a reasonable use for the void pointer. Just make sure there isn’t a better (safer) way to do the same thing using other language mechanisms first!