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

??? note "关键点速记"
	


In lesson[[8-7-Type-deduction-for-objects-using-the auto-keyword|8.7 - 使用 auto 关键字进行类型推断]]we discussed how the `auto` keyword can be used to have the compiler deduce the type of a variable from the initializer:

```cpp
int getVal(); // some function that returns an int by value

int main()
{
    auto val { getVal() }; // val deduced as type int

    return 0;
}
```

COPY

We also noted that by default, type deduction will drop `const` qualifiers:

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

COPY

Const can be reapplied by adding the `const` qualifier in the definition:

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

COPY

## Type deduction drops references

In addition to dropping const qualifiers, type deduction will also drop references:

```cpp
#include <string>

std::string& getRef(); // some function that returns a reference

int main()
{
    auto ref { getRef() }; // type deduced as std::string (not std::string&)

    return 0;
}
```

COPY

In the above example, variable `ref` is using type deduction. Although function `getRef()` returns a `std::string&`, the reference qualifier is dropped, so the type of `ref`is deduced as `std::string`.

Just like with the dropped `const` qualifier, if you want the deduced type to be a reference, you can reapply the reference at the point of definition:

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

COPY

## Top-level const and low-level const

A top-level const is a const qualifier that applies to an object itself. For example:

```cpp
const int x;    // this const applies to x, so it is top-level
int* const ptr; // this const applies to ptr, so it is top-level
```

COPY

In contrast, a low-level const is a const qualifier that applies to the object being referenced or pointed to:

```cpp
const int& ref; // this const applies to the object being referenced, so it is low-level
const int* ptr; // this const applies to the object being pointed to, so it is low-level
```

COPY

A reference to a const value is always a low-level const. A pointer can have a top-level, low-level, or both kinds of const:

```cpp
const int* const ptr; // the left const is low-level, the right const is top-level
```

COPY

When we say that type deduction drops const qualifiers, it only drops top-level consts. Low-level consts are not dropped. We’ll see examples of this in just a moment.

## 类型推断和const引用

If the initializer is a reference to const, the reference is dropped first (and then reapplied if applicable), and then any top-level const is dropped from the result.

```cpp
#include <string>

const std::string& getRef(); // some function that returns a reference to const

int main()
{
    auto ref1{ getRef() }; // std::string (reference dropped, then top-level const dropped from result)

    return 0;
}
```

COPY

In the above example, since `getRef()` returns a `const std::string&`, the reference is dropped first, leaving us with a `const std::string`. This const is now a top-level const, so it is also dropped, leaving the deduced type as `std::string`.

We can reapply either or both of these:

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

COPY

We covered the case for `ref1` in the prior example. For `ref2`, this is similar to the `ref1` case, except we’re reapplying the `const` qualifier, so the deduced type is `const std::string`.

Things get more interesting with `ref3`. Normally the reference would be dropped, but since we’ve reapplied the reference, it is not dropped. That means the type is still `const std::string&`. And since this const is a low-level const, it is not dropped. Thus the deduced type is `const std::string&`.

The `ref4` case works similarly to `ref3`, except we’ve reapplied the `const` qualifier as well. Since the type is already deduced as a reference to const, us reapplying `const`here is redundant. That said, using `const` here makes it explicitly clear that our result will be const (whereas in the `ref3` case, the constness of the result is implicit and not obvious).

!!! success "最佳实践"

	If you want a const reference, reapply the `const` qualifier even when it’s not strictly necessary, as it makes your intent clear and helps prevent mistakes.

## 类型推断和指针

Unlike references, type deduction does not drop pointers:

```cpp
#include <string>

std::string* getPtr(); // some function that returns a pointer

int main()
{
    auto ptr1{ getPtr() }; // std::string*

    return 0;
}
```

COPY

We can also use an asterisk in conjunction with pointer type deduction:

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

COPY

## The difference between `auto` and `auto*` (optional reading)

When we use `auto` with a pointer type initializer, the type deduced for `auto` includes the pointer. So for `ptr1` above, the type substituted for `auto` is `std::string*`.

When we use `auto*` with a pointer type initializer, the type deduced for auto does _not_ include the pointer -- the pointer is reapplied afterward after the type is deduced. So for `ptr2` above, the type substituted for `auto` is `std::string`, and then the pointer is reapplied.

In most cases, the practical effect is the same (`ptr1` and `ptr2` both deduce to `std::string*` in the above example).

However, there are a couple of difference between `auto` and `auto*` in practice. First, `auto*` must resolve to a pointer initializer, otherwise a compile error will result:

```cpp
#include <string>

std::string* getPtr(); // some function that returns a pointer

int main()
{
    auto ptr3{ *getPtr() };      // std::string (because we dereferenced getPtr())
    auto* ptr4{ *getPtr() };     // does not compile (initializer not a pointer)

    return 0;
}
```

COPY

This makes sense: in the `ptr4` case, `auto` deduces to `std::string`, then the pointer is reapplied. Thus `ptr4` has type `std::string*`, and we can’t initialize a `std::string*` with an initializer that is not a pointer.

Second, there are differences in how `auto` and `auto*` behave when we introduce `const` into the equation. We’ll cover this below.

## Type deduction and const pointers (optional reading)

Since pointers aren’t dropped, we don’t have to worry about that. But with pointers, we have both the const pointer and the pointer to const cases to think about, and we also have `auto` vs `auto*`. Just like with references, only top-level const is dropped during pointer type deduction.

Let’s start with a simple case:

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

COPY

When we use either `auto const` or `const auto`, we’re saying, “make whatever the deduced type is const”. So in the case of `ptr1` and `ptr2`, the deduced type is `std::string*`, and then const is applied, making the final type `std::string* const`. This is similar to how `const int` and `int const` mean the same thing.

However, when we use `auto*`, the order of the const qualifier matters. A `const` on the left means “make the deduced pointer type a pointer to const”, whereas a `const`on the right means “make the deduced pointer type a const pointer”. Thus `ptr3` ends up as a pointer to const, and `ptr4` ends up as a const pointer.

Now let’s look at an example where the initializer is a const pointer to const.

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

COPY

The `ptr1` and `ptr2` cases are straightforward. The top-level const (the const on the pointer itself) is dropped. The low-level const on the object being pointed to is not dropped. So in both cases, the final type is `const std::string*`.

The `ptr3` and `ptr4` cases are also straightforward. The top-level const is dropped, but we’re reapplying it. The low-level const on the object being pointed to is not dropped. So in both cases, the final type is `const std::string* const`.

The `ptr5` and `ptr6` cases are analogous to the cases we showed in the prior example. In both cases, the top-level const is dropped. For `ptr5`, the `auto* const`reapplies the top-level const, so the final type is `const std::string* const`. For `ptr6`, the `const auto*` applies const to the type being pointed to (which in this case was already const), so the final type is `const std::string*`.

In the `ptr7` case, we’re applying the const qualifier twice, which is disallowed, and will cause a compile error.

And finally, in the `ptr8` case, we’re applying const on both sides of the pointer (which is allowed since `auto*` must be a pointer type), so the resulting types is `const std::string* const`.

!!! success "最佳实践"

	If you want a const pointer, reapply the `const` qualifier even when it’s not strictly necessary, as it makes your intent clear and helps prevent mistakes.
