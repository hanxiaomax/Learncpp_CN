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

??? note "关键点速记"
	

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

在上面 `Something` 的定义中， `x` 并没有默认初始化值、`y` 进行默认的值初始化而 `z` 则被初始化为2。如果在初始化`Something`类型的对象时，没有提供显式初始化值，则会使用成员的这些默认成员初始化值。

`s1` 对象没有初始化值，所以 `s1` 的成员们会被初始化为它们的默认值。`s1.x` 则因为没有默认初始化值而保持未初始化状态。`s1.y` 进行默认值初始化，得到初值0，而 `s1.z` 则被初始化为 2 。

注意，即便我们并没有为 `s1.z` 提供显式地初始化值，它仍然 it is initialized to a non-zero value because of the default member initializer provided.

!!! tldr "关键信息"

	Using default member initializers (or other mechanisms that we’ll cover later), structs and classes can self-initialize even when no explicit initializers are provided!

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


In the above case, `s2` has explicit initialization values for every member, so the default member initialization values are not used at all. This means `s2.x`, `s2.y` and `s2.z` are initialized to the values `5`, `6`, and `7` respectively.

## 存在默认初始化值且初始化列表没有提供初始化值的情况

In the previous lesson （[[10-6-struct-aggregate-initialization|10.6 - 结构体的聚合初始化]]） we noted that if an aggregate is initialized but the number of initialization values is fewer than the number of members, then all remaining members will be value-initialized. However, if a default member initializer is provided for a given member, that default member initializer will be used instead.

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

COPY

In the above case, `s3` is list initialized with an empty list, so all initializers are missing. This means that a default member initializer will be used if it exists, and value initialization will occur otherwise. Thus, `s3.x` (which has no default member initializer) is value initialized to `0`, `s3.y` is value initialized by default to `0`, and `s3.z` is defaulted to value `2`.

## Recapping the initialization possibilities

If an aggregate is defined with an initialization list:

-   If an explicit initialization value exists, that explicit value is used.
-   If an initializer is missing and a default member initializer exists, the default is used.
-   If an initializer is missing and no default member initializer exists, value initialization occurs.

If an aggregate is defined with no initialization list:

-   If a default member initializer exists, the default is used.
-   If no default member initializer exists, the member remains uninitialized.

Members are always initialized in the order of declaration.

The following example recaps all possibilities:

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

COPY

The case we want to watch out for is `s1.x`. Because `s1` has no initializer list and `x` has no default member initializer, `s1.x` remains uninitialized (which is bad, since we should always initialize our variables).

## 应当始终为成员提供默认初始化值

To avoid the possibility of uninitialized members, simply ensure that each member has a default value (either an explicit default value, or an empty pair of braces). That way, our members will be initialized with some value regardless of whether we provide an initializer list or not.

Consider the following struct, which has all members defaulted:

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

COPY

In all cases, our members are initialized with values.

!!! success "最佳实践"

	Provide a default value for all members. This ensure that your members will be initialized even if the variable definition doesn’t include an initializer list.

## 默认初始化 vs 聚合类型的值初始化

回顾一下上面例子中的两个初始化方式：

```cpp
Fraction f1;          // f1.numerator value initialized to 0, f1.denominator defaulted to 1
Fraction f2 {};       // f2.numerator value initialized to 0, f2.denominator defaulted to 1
```


You’ll note that `f1` is default initialized and `f2` is value initialized, yet the results are the same (`numerator` is initialized to `0` and `denominator` is initialized to `1`). So which should we prefer?

The value initialization case (`f2`) is safer, because it will ensure any members with no default values are value initialized (and although we should always provide default values for members, this protects against the case where one is missed).

Preferring value initialization has one more benefit -- it’s consistent with how we initialize objects of other types. Consistency helps prevent errors.

!!! success "最佳实践"

	If no explicit initializer values will be provided for an aggregate, prefer value initialization (with an empty braces initializer) to default initialization (with no braces).

That said, it’s not uncommon for programmers to use default initialization instead of value initialization for class types. This is partly for historic reasons (as value initialization wasn’t introduced until C++11), and partly because there is a similar case (for non-aggregates) where default initialization can be more efficient (we cover this case in [[13-5-constructors|13.5 - 构造函数]]).

Therefore, we won’t be militant about enforcing use of value initialization for structs and classes in these tutorials, but we do strongly recommend it.
