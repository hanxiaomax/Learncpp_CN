---
title: 9.8 - 指针和const
alias: 9.8 - 指针和const
origin: /pointers-and-const/
origin_title: "9.8 — Pointers and const"
time: 2022-9-22
type: translation
tags:
- pointer
- const
---

??? note "关键点速记"

	- 类型前const表示类型是const，指针前（星号后）const表示指针是const
	- 就像对const变量的引用一样，指向const的指针也可以指向非const变量。指向const的指针将被指向的值视为常量，而不管该地址的对象最初是否定义为const
	- 总而言之，你只需要记住4条规则，而且它们非常符合逻辑:
		- 非const指针可以被赋予另一个地址来改变它所指向的对象；
		- const指针总是指向相同的地址，且该地址不能更改；
		- 指向非const值的指针可以改变它所指向的值，但该指针不能指向const类型变量；
		- 指向const值的指针在通过该指针访问时将该值视为const，因此不能更改它所指向的值。它们可以指向const或非const的[[lvalue|左值]](但不能指向没有地址的[[rvalue|右值]])



请考虑下面的代码：

```cpp
int main()
{
    int x { 5 };
    int* ptr { &x }; // ptr is a normal (non-const) pointer

    int y { 6 };
    ptr = &y; // we can point at another value

    *ptr = 7; // we can change the value at the address being held

    return 0;
}
```

使用普通(非`const`)指针，既可以更改指针所指向的对象(通过为指针分配一个新地址来保存)，也可以更改被保存地址处的值(通过为解引用指针分配一个新值)。

但是，如果我们要指向的值是`const`，会发生什么呢?


```cpp
int main()
{
    const int x { 5 }; // x 是 const
    int* ptr { &x };   // 编译错误：不能把const int* 转换为 int*

    return 0;
}
```

上面的代码片段无法编译——普通指针不能指向const变量。这样的限制是有必要的，因为const变量的值是不能更改的。允许程序员将非const指针设置为const值将允许程序员解引用该指针并更改该值。这将违反变量的常量性。


## 指向常量的指针

指针指向一个const的值（一般简称为[[pointer-to-const|指向常量的指针]]），也就是说一个非常量的指针指向了一个常量值。

声明一个可以指向常量的指针，需要在指针的数据类型前添加关键字 `const`：

```cpp
int main()
{
    const int x{ 5 };
    const int* ptr { &x }; // okay: ptr is pointing to a "const int"

    *ptr = 6; // not allowed: we can't change a const value

    return 0;
}
```

在上面的例子中 `ptr` 指向了一个 `const int`。因为指针所指的数据类型是const，所以不能通过指针修改它指的这个值。

但是，因为指针本身不是const的（只是指向一个const类型的值变量），所以我们可以修改指针本身所持有的地址使其指向其他变量：


```cpp
int main()
{
    const int x{ 5 };
    const int* ptr { &x }; // ptr 指向 const int x

    const int y{ 6 };
    ptr = &y; // okay: 重新指向 const int y

    return 0;
}
```

==就像对const变量的引用一样，指向const的指针也可以指向非const变量。指向const的指针将被指向的值视为常量，而不管该地址的对象最初是否定义为const:==

```cpp
int main()
{
    int x{ 5 }; // non-const
    const int* ptr { &x }; // ptr points to a "const int"

    *ptr = 6;  // not allowed: ptr points to a "const int" so we can't change the value through ptr
    x = 6; // allowed: the value is still non-const when accessed through non-const identifier x

    return 0;
}
```


## 常量指针


指针自身也可以是常量。一个常量指针的地址，在初始化之后是不能够被修改的。

声明一个常量指针，只需要在指针声明的星号后添加`const` 关键字：

```cpp
int main()
{
    int x{ 5 };
    int* const ptr { &x }; // const after the asterisk means this is a const pointer

    return 0;
}
```

在上面的例子中，`ptr` 是一个指向(非 `const`) `int` 值的 `const` 指针。

就像普通的`const`变量一样，`const`指针必须在定义时初始化，并且这个值不能通过赋值来改变:


```cpp
int main()
{
    int x{ 5 };
    int y{ 6 };

    int* const ptr { &x }; // okay: the const pointer is initialized to the address of x
    ptr = &y; // error: once initialized, a const pointer can not be changed.

    return 0;
}
```

不过，该指针所指的对象并不是一个常量，所以仍旧可以通过对指针解引用然后修改该变量的值：

```cpp
int main()
{
    int x{ 5 };
    int* const ptr { &x }; // ptr will always point to x

    *ptr = 6; // okay: the value being pointed to is non-const

    return 0;
}
```



## 指向常量的常量指针

最后一种组合，即指针可以被声明为常量指针同时它所指的值也是常量，在类型前和星号后分别添加const关键字即可：

```cpp
int main()
{
    int value { 5 };
    const int* const ptr { &value }; // a const pointer to a const value

    return 0;
}
```

指向const值的[[const-pointer|常量指针]]不能改变其地址，也不能通过该指针改变它所指向的值。它只能通过解引用以获得它所指向的值。


## 复习

==总而言之，你只需要记住4条规则，而且它们非常符合逻辑:==

- 非const指针可以被赋予另一个地址来改变它所指向的对象；
- const指针总是指向相同的地址，且该地址不能更改；
- 指向非const值的指针可以改变它所指向的值，但该指针不能指向const类型变量；
- 指向const值的指针在通过该指针访问时将该值视为const，因此不能更改它所指向的值。它们可以指向const或非const的[[lvalue|左值]](但不能指向没有地址的[[rvalue|右值]])


在配合const关键字使用指针时，声明的语法还是有点复杂的：

- 指针的类型决定了它能指向对象的类型。所以const对指针类型的修饰决定了指针所指变量是否为const；
-  星号后面的`const` 关键字表示指针本身是常量，不能被赋予新的地址。

```cpp
int main()
{
    int value { 5 };

    int* ptr0 { &value };             // ptr0 指向 "int" ，指针本身不是常量，是一个普通指针
    const int* ptr1 { &value };       // ptr1 指向 "const int", 指针本身不是常量, 是一个指向常量的指针
    int* const ptr2 { &value };       // ptr2 指向 "int",指针本身是常量, 是一个指向非常量的常量指针
    const int* const ptr3 { &value }; // ptr3 指向 "const int", 指针本身是常量, 是一个指向常量的常量指针

    return 0;
}
```