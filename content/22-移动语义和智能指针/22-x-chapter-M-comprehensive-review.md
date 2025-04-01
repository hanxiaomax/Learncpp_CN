---
title: M.x - 小结与测试 - 移动和智能指针
alias: M.x - 小结与测试 - 移动和智能指针
origin: /chapter-m-comprehensive-review/
origin_title: "M.x — Chapter M comprehensive review"
time: 2022-7-23
type: translation
tags:
- summary
---

## 复习

[[22-1-introduction-to-smart-pointers-and-move-semantics|M.1 - 智能指针和移动语义简介]]

- [[smart pointer class|智能指针类]]是一种组合类，用于对动态分配的内存进行管理并确保该内存在智能指针指向的对象[[going-out-of-scope|离开作用域]]后被释放。
- [[copy-semantics|拷贝语义]]允许类被复制，该过程主要通过[[copy-constructor|拷贝构造函数]]和[[copy-assignment-operator|拷贝赋值运算符]]来完成。
- [[move-semantics|移动语义]]指的是类将对象的所有权转译给另外一个对象，而不是创建一个拷贝，该过程主要通过[[move-constructor|移动构造函数]]和 [[move-assignment-operator|移动赋值运算符]]来完成。
- `std::auto_ptr` 已经被弃用，应该避免使用。

[[22-2-R-value-references|M.2 - 右值引用]]

- 一个[[rvalue-reference|右值引用]]引用应该使用一个右值来初始化。 右值引用使用双`&&`号创建。编写将右值引用作为[[parameters|形参]]的函数是可以的，但是绝对不要将右值引用作为返回值。


[[22-3-move-constructors-and-move-assignment|M.3 - 移动构造函数和移动赋值]]

- 当我们构建对象或对对象赋值时，如果参数是[[lvalue|左值]]，则唯一能做的合理操作是拷贝该左值。我们不能假定改变该左值是安全的，因为它可能会在后面的程序中再次被使用。对于表达式 “a = b”，我们没有理由期望b以任何方式被改变。
- 但是，当构建对象或者赋值对象时，如果参数是[[rvalue|右值]]，那么我们可以确定该右值肯定是一个临时对象。与其拷贝（开销大）它，不如直接将它的资源转移（开销小）给被构建或被赋值的对象。这么做是安全的，因为临时对象总是在表达式结束时就被销毁，所以肯定不会再次被使用了。
- 你可以使用 `delete` 关键字禁用拷贝语义（通过删除拷贝构造函数和拷贝赋值运算符）

[[22-4-std-move|M.4 - std::move]]

- `std::move` 允许我们将左值当做右值处理。当需要基于组织调用或激活移动语义而不是拷贝语义时这很有用。

[[27-10-std-move-if-noexcept|M.5 - std::move_if_noexcept]]

- 当对象有一个`noexcept`移动构造函数时，`std::move_if_noexcept` 会返回一个可移动的右值。否则，它会返回一个可以拷贝的左值。我们可以使用 `noexcept` 修饰符和 `std::move_if_noexcept` 确保只在具有[[strong-except|强异常保证]]时使用移动语义，其他情况下使用拷贝语义。

[[22-5-std-unique-ptr|M.6 — std::unique_ptr]]

- 智能指针`std::unique_ptr` 很常用。它用于管理一个不可共享的资源。应该使用 `std::make_unique()` (C++14) 来创建 `std::unique_ptr`。`std::unique_ptr` 禁用了拷贝语义

[[22-6-std-shared-ptr|M.7 — std::shared_ptr]]

- 当多个对象需要访问同一个资源时，可以使用 `std::shared_ptr`。在最后一个`std::shared_ptr`被销毁前，资源不会被销毁。应该使用`std::make_shared()` 来创建 `std::shared_ptr`。
- 如果需要创建`std::shared_ptr`指向一个相同的资源，则需要使用拷贝语义从 `std::shared_ptr` 创建。

[[22-7-circular-dependency-issues-with-std-shared-ptr-and-std-weak-ptr|M.8 — 智能指针带来的循环依赖问题]]

- 当你需要一个或多个对象来观察或获取由`std::shared_pr`管理的资源时，可以使用智能指针 `std::weak_ptr`。但是，和`std::shared_ptr`不同的是，在判断资源是否需要被销毁时，指向它的 `std::weak_ptr` 的个数不会被考虑在内。
