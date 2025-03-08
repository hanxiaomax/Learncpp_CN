---
title: 10.7 - 默认成员初始化
alias: 10.7 - 默认成员初始化
origin: /default-member-initialization/
origin_title: "10.7 — Default member initialization"
time: 2022-9-14
type: translation
tags:
- struct
- initialization
---

??? note "Key Takeaway"

	- 实例化聚合类型对象时如果没有提供初始化值，则表示没有初始化该聚合类型。此时它的成员会进行默认初始化。没有默认初始化值的成员则为未初始化状态。
	- 初始化聚合类型对象时，如果初始化值少于成员，则剩余的成员使用默认初始化，如果没有提供默认初始化值，则值初始化为0.

在定义结构体（或类）类型时，我们可以为每个成员都提供默认初始化值作为其定义的一部分。 这个过程称为[[non-static-member-initialization|非静态成员初始化]]，而这个初始化值称为[[default-member-initializer|默认成员初始值]]。

举个例子：

```cpp
struct Something
{
    int x;       // no initialization value (bad)
    int y {};    // value-initialized by default
    int z { 2 }; // explicit default value
};

int main()
{
    Something s1; // s1.x is uninitialized, s1.y is 0, and s1.z is 2

    return 0;
}
```

在上面 `Something` 的定义中， `x` 并没有默认初始化值、`y` 进行默认的值初始化而 `z` 则被初始化为2。==如果在[[instantiated|实例化]]`Something`类型的对象时没有提供显式初始化值，则会使用成员的这些默认成员初始化值。==

`s1` 对象没有初始化值，所以 `s1` 的成员们会被初始化为它们的默认值。`s1.x` 则因为没有默认初始化值而保持未初始化状态。`s1.y` 进行默认值初始化，得到初值0，而 `s1.z` 则被初始化为 2 。

注意，即便我们并没有为 `s1.z` 提供显式地初始化值，它仍然被初始化为一个非零值，因为我们为其提供了默认成员初始化值。

> [!tldr] "关键信息"
> 使用默认成员初始化式(或我们将在后面介绍的其他机制)，即使没有提供显式初始化式，结构和类也可以自我初始化！

## 显式初始化值优先级高于默认初始化值

列表初始化式中的显式值总是优先于默认成员初始化值。

```cpp
struct Something
{
    int x;       // no default initialization value (bad)
    int y {};    // value-initialized by default
    int z { 2 }; // explicit default value
};

int main()
{
    Something s2 { 5, 6, 7 }; // use explicit initializers for s2.x, s2.y, and s2.z (no default values are used)

    return 0;
}
```


在上面的例子中，s2 的每个成员都具有显式地初始化值，所以默认成员初始化在这个例子中并不生效。`s2.x`、`s2.y` 和 `s2.z` 分别被初始化为`5`、 `6` 和 `7` 。

## 存在默认初始化值且初始化列表没有提供初始化值的情况

在上一节课中（[[10-6-struct-aggregate-initialization|10.6 - 结构体的聚合初始化]]）我们提到，==如果聚合数据结构被初始化了，但初始化值的个数比实际成员要少，则剩下的成员变量则会进行值初始化。但是，如果该成员具有默认初始化值，则会使用默认初始化值。==

```cpp
struct Something
{
    int x;       // no default initialization value (bad)
    int y {};    // value-initialized by default
    int z { 2 }; // explicit default value
};

int main()
{
    Something s3 {}; // value initialize s3.x, use default values for s3.y and s3.z

    return 0;
}
```

在上面的例子中，`s3` 的初始化值列表是一个空列表，即没有提供任何的显式初始化值。这意味着，如果提供了默认成员初始化值，则使用该值，否则则使用[[value-initialization|值初始化]]。因此 `s3.x` (没有默认初始化值) 会被值初始化为0。`s3.y` 的值被默认初始化为0，而 `s3.z` 默认初始化为 2。

## 复习：初始化的可能性

如果聚合对象定义时有[[initializer-list|初始化值列表]]（实例化的同时初始化）：

-  如果具有显式的初始化值，则使用该值；
-  如果有缺失的初始化值，但存在默认初始化值，则使用默认值进行[[default-initialization|默认初始化]]；
-  如果有缺失的初始化值，但是没有默认初始化值，则使用[[value-initialization|值初始化]]。

如果聚合对象定义时没有初始化值列表（实例化时未进行初始化）：

- 如果有默认初始化值，则使用默认值进行默认初始化；
- 如果不存在默认初始化值，则对应成员保持未初始化状态。

成员总是按照声明的顺序初始化。

下面的例子对上述各种可能性进行了总结：

```cpp
struct Something
{
    int x;       // no default initialization value (bad)
    int y {};    // value-initialized by default
    int z { 2 }; // explicit default value
};

int main()
{
    Something s1;             // No initializer list: s1.x is uninitialized, s1.y and s1.z use defaults
    Something s2 { 5, 6, 7 }; // Explicit initializers: s2.x, s2.y, and s2.z use explicit values (no default values are used)
    Something s3 {};          // Missing initializers: s3.x is value initialized, s3.y and s3.z use defaults

    return 0;
}
```

这个例子中，尤其要注意的是 `s1.x`。因为 `s1` 没有初始化值列表，而且`x`也没有默认的成员初始化值，所以它处于未初始化状态（这是不对的，因为变量一定要初始化才好）。

## 应当始终为成员提供默认初始化值

为了避免出现未初始化的成员，需确保每个成员都有一个默认值(要么是显式默认值，要么是空的花括号对)。这样，无论是否提供初始化列表，成员都将被初始化为某个值。

考虑下面例子中中的结构体，它的所有成员都有默认值：

```cpp
struct Fraction
{
	int numerator { }; // we should use { 0 } here, but for the sake of example we'll use value initialization instead
	int denominator { 1 };
};

int main()
{
	Fraction f1;          // f1.numerator value initialized to 0, f1.denominator defaulted to 1
	Fraction f2 {};       // f2.numerator value initialized to 0, f2.denominator defaulted to 1
	Fraction f3 { 6 };    // f3.numerator initialized to 6, f3.denominator defaulted to 1
	Fraction f4 { 5, 8 }; // f4.numerator initialized to 5, f4.denominator initialized to 8

	return 0;
}
```

在这个例子中，所有的成员都会被初始化。

> [!success] "最佳实践"
> 为所有成员提供默认值。这确保了即使变量定义不包含初始化列表，成员也会被初始化。

## 默认初始化 vs 聚合类型的值初始化

回顾一下上面例子中的两个初始化方式：

```cpp
Fraction f1;  // f1.numerator value initialized to 0, f1.denominator defaulted to 1
Fraction f2 {}; // f2.numerator value initialized to 0, f2.denominator defaulted to 1
```


在上面的例子中，`f1` 是默认初始化，而  `f2` 是值初始化。尽管结果是一样的 (`numerator` 初始化为0而 `denominator` 初始化为1)。所以，应该使用哪种方式呢？

值初始化(`f2`)是更安全的方式，因为它可以确保即使成员没有初始化值也能通过值初始化被初始化(尽管我们应该为每个成员都提供默认值，该方法可以防止我们遗漏)。

值初始化还有一个好处——它与初始化其他类型的对象的方式一致。一致性有助于防止错误。


> [!success] "最佳实践"
> 如果没有为聚合提供显式初始化值，则首选值初始化(带空大括号初始化器)而不是默认初始化(不带大括号)。

也就是说，程序员对类类型使用默认初始化而不是值初始化是很常见的。这部分是由于历史原因(因为值初始化直到C++ 11才引入)，部分是因为在类似的情况下(对于非聚合)，默认初始化更高效(我们在[[13-5-constructors|13.5 -构造函数]]中讨论了这种情况)。

因此，我们不会在这些教程中强制使用结构和类的值初始化，但我们强烈建议这样做。

