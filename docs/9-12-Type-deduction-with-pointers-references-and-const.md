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

??? note "Key Takeaway"
	


在 [[8-7-Type-deduction-for-objects-using-the auto-keyword|8.7 - 使用 auto 关键字进行类型推断]] 中我们介绍了 `auto` 关键字，它告诉编译器根据初始化值对变量的类型进行推断：

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

顶层 `const` 是应用于对象本身的 `const` 限定符。例如：

```cpp
const int x;    // this const applies to x, so it is top-level
int* const ptr; // this const applies to ptr, so it is top-level
```

相比之下，底层 `const` 是一个应用于被引用或指向的对象的`const`限定符：

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

## `auto` 和 `auto*` 的区别(选读)

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

## 类型推断和const指针(选读)

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
